#!/usr/bin/env node
/**
 * Exporta TODOS los mensajes de WhatsApp de una subcuenta (location) de
 * GoHighLevel usando la API v2 con un token de Private Integration.
 *
 * Uso:
 *   GHL_TOKEN=pit-xxxx GHL_LOCATION_ID=xxxx node exportar.mjs [opciones]
 *
 * Opciones:
 *   --desde 2026-01-01   Solo conversaciones con actividad desde esa fecha
 *   --max 50             Limita el nº de conversaciones (para probar)
 *   --salida ./out       Carpeta de salida (por defecto ./out)
 *
 * Genera en la carpeta de salida:
 *   conversaciones.jsonl   una línea JSON por conversación (contacto + mensajes)
 *   mensajes.csv           todos los mensajes en plano (para Excel/Sheets)
 *   corpus-entrantes.txt   solo lo que escriben los clientes (para analizar FAQs)
 *   resumen.json           totales de la exportación
 */

import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const WHATSAPP_TYPE_NUM = 19; // código numérico de TYPE_WHATSAPP en messageTypes

if (!TOKEN || !LOCATION_ID) {
  console.error("Faltan variables de entorno GHL_TOKEN y/o GHL_LOCATION_ID.");
  console.error("Ejemplo: GHL_TOKEN=pit-xxxx GHL_LOCATION_ID=xxxx node exportar.mjs");
  process.exit(1);
}

const args = process.argv.slice(2);
function argValue(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
const desde = argValue("--desde") ? new Date(argValue("--desde")).getTime() : 0;
const maxConversaciones = argValue("--max") ? Number(argValue("--max")) : Infinity;
const outDir = argValue("--salida") || join(process.cwd(), "out");

mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ghl(path, params = {}) {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  for (let intento = 1; intento <= 5; intento++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Version: "2021-04-15",
        Accept: "application/json",
      },
    });
    if (res.status === 429) {
      // Límite de la API (100 peticiones / 10 s por location): esperar y reintentar
      const espera = 2000 * intento;
      console.warn(`  429 rate limit, esperando ${espera / 1000}s...`);
      await sleep(espera);
      continue;
    }
    if (!res.ok) {
      throw new Error(`GHL ${res.status} en ${path}: ${await res.text()}`);
    }
    return res.json();
  }
  throw new Error(`Demasiados reintentos por rate limit en ${path}`);
}

async function listarConversaciones() {
  const conversaciones = [];
  let startAfterDate;
  while (conversaciones.length < maxConversaciones) {
    const data = await ghl("/conversations/search", {
      locationId: LOCATION_ID,
      limit: 100,
      sortBy: "last_message_date",
      sort: "desc",
      startAfterDate,
    });
    const lote = data.conversations || [];
    if (lote.length === 0) break;
    for (const c of lote) conversaciones.push(c);
    const ultima = lote[lote.length - 1];
    startAfterDate = Array.isArray(ultima.sort) ? ultima.sort[0] : ultima.lastMessageDate;
    process.stdout.write(`\rConversaciones encontradas: ${conversaciones.length} de ${data.total ?? "?"}`);
    if (ultima.lastMessageDate && ultima.lastMessageDate < desde) break;
    await sleep(120);
  }
  console.log("");
  return conversaciones.slice(0, maxConversaciones);
}

async function mensajesWhatsApp(conversationId) {
  const mensajes = [];
  let lastMessageId;
  while (true) {
    const data = await ghl(`/conversations/${conversationId}/messages`, {
      type: "TYPE_WHATSAPP",
      limit: 100,
      lastMessageId,
    });
    const bloque = data.messages || {};
    const lote = bloque.messages || [];
    mensajes.push(...lote);
    if (!bloque.nextPage || lote.length === 0) break;
    lastMessageId = bloque.lastMessageId;
    await sleep(120);
  }
  // La API devuelve del más reciente al más antiguo; los ordenamos cronológicamente
  mensajes.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
  return mensajes;
}

function csvCampo(v) {
  const s = String(v ?? "").replace(/\r?\n/g, " ");
  return `"${s.replace(/"/g, '""')}"`;
}

async function main() {
  console.log(`Exportando WhatsApp de la location ${LOCATION_ID}...`);
  const todas = await listarConversaciones();

  // Solo conversaciones que contienen mensajes de WhatsApp (messageTypes incluye 19)
  const conWhatsApp = todas.filter(
    (c) =>
      (Array.isArray(c.messageTypes) && c.messageTypes.includes(WHATSAPP_TYPE_NUM)) ||
      c.lastMessageType === "TYPE_WHATSAPP"
  );
  console.log(`Con mensajes de WhatsApp: ${conWhatsApp.length} de ${todas.length}`);

  const rutaJsonl = join(outDir, "conversaciones.jsonl");
  const rutaCsv = join(outDir, "mensajes.csv");
  const rutaCorpus = join(outDir, "corpus-entrantes.txt");
  writeFileSync(rutaJsonl, "");
  writeFileSync(rutaCsv, "fecha,contacto,telefono,direccion,mensaje,conversacion_id\n");
  writeFileSync(rutaCorpus, "");

  let totalMensajes = 0;
  let totalEntrantes = 0;

  for (let i = 0; i < conWhatsApp.length; i++) {
    const c = conWhatsApp[i];
    if (desde && c.lastMessageDate && c.lastMessageDate < desde) continue;
    process.stdout.write(`\rDescargando mensajes ${i + 1}/${conWhatsApp.length} (${c.contactName || c.phone || c.id})            `);
    let mensajes;
    try {
      mensajes = await mensajesWhatsApp(c.id);
    } catch (e) {
      console.warn(`\nError en conversación ${c.id}: ${e.message} — se omite`);
      continue;
    }
    if (mensajes.length === 0) continue;

    appendFileSync(
      rutaJsonl,
      JSON.stringify({
        conversationId: c.id,
        contactId: c.contactId,
        contacto: c.contactName || c.fullName || "",
        telefono: c.phone || "",
        email: c.email || "",
        tags: c.tags || [],
        mensajes: mensajes.map((m) => ({
          fecha: m.dateAdded,
          direccion: m.direction,
          texto: m.body || "",
          estado: m.status,
        })),
      }) + "\n"
    );

    for (const m of mensajes) {
      totalMensajes++;
      appendFileSync(
        rutaCsv,
        [
          csvCampo(m.dateAdded),
          csvCampo(c.contactName || c.fullName || ""),
          csvCampo(c.phone || ""),
          csvCampo(m.direction),
          csvCampo(m.body || ""),
          csvCampo(c.id),
        ].join(",") + "\n"
      );
      if (m.direction === "inbound" && m.body) {
        totalEntrantes++;
        appendFileSync(rutaCorpus, m.body.replace(/\r?\n/g, " ").trim() + "\n");
      }
    }
    await sleep(120);
  }
  console.log("");

  const resumen = {
    locationId: LOCATION_ID,
    fechaExportacion: new Date().toISOString(),
    conversacionesTotales: todas.length,
    conversacionesConWhatsApp: conWhatsApp.length,
    mensajesExportados: totalMensajes,
    mensajesEntrantesDeClientes: totalEntrantes,
  };
  writeFileSync(join(outDir, "resumen.json"), JSON.stringify(resumen, null, 2));

  console.log("\nListo. Archivos generados en", outDir);
  console.log(JSON.stringify(resumen, null, 2));
}

main().catch((e) => {
  console.error("\nError fatal:", e.message);
  process.exit(1);
});
