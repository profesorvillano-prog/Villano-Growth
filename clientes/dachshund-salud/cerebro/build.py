#!/usr/bin/env python3
"""
Arma el cuerpo de la peticion a Anthropic que va pegado en el modulo 3
del escenario [SETTER] Marcelo de Make.

Uso:
    python3 build.py            -> modo nucleo (solo CEREBRO-MARCELO.md)
    python3 build.py completo   -> nucleo + todas las fuentes de fuentes/

Genera:
    salida/cuerpo-modulo3.json  -> se copia entero al campo "Request content"
    salida/system.txt           -> el prompt final en texto plano, para revisarlo
"""
import json, os, sys, glob

BASE = os.path.dirname(os.path.abspath(__file__))
MODO = (sys.argv[1] if len(sys.argv) > 1 else "nucleo").lower()

ESTADOS = ["nuevo", "saludado", "calificando", "espejo", "oferta", "objecion",
           "link_enviado", "nurture_libro", "derivado_clinico", "handoff_humano"]
ACCIONES = ["responder", "ofrecer_producto", "pedir_fotos", "derivar_clinico", "handoff_humano"]
PRODUCTOS = ["ninguno", "libro1_nutricion", "libro2_recomposicion", "consulta_97",
             "asesoria_197", "metodo_497"]
CAMPOS = ["nombre_persona", "nombre_perro", "edad_perro", "sintoma", "hace_cuanto",
          "come_hoy", "ya_intento", "pais", "origen_cta"]

def leer(p):
    with open(p, encoding="utf-8") as f:
        return f.read().strip()

system = leer(os.path.join(BASE, "CEREBRO-MARCELO.md"))

if MODO == "completo":
    partes = [system, "\n\n---\n\n# MIS FUENTES COMPLETAS\n",
              "Lo que sigue es el texto integro de mi material. Lo uso para responder "
              "con precision, nunca para copiar parrafos enteros en un chat de WhatsApp.\n"]
    for ruta in sorted(glob.glob(os.path.join(BASE, "fuentes", "*.txt"))):
        nombre = os.path.basename(ruta).replace(".txt", "").replace("-", " ").upper()
        partes.append(f"\n## FUENTE: {nombre}\n\n{leer(ruta)}\n")
    system = "\n".join(partes)

schema = {
    "type": "object",
    "additionalProperties": False,
    "required": ["respuesta", "estado", "accion", "producto", "temperatura",
                 "riesgo", "datos", "nota_interna"],
    "properties": {
        "respuesta": {"type": "string"},
        "estado": {"type": "string", "enum": ESTADOS},
        "accion": {"type": "string", "enum": ACCIONES},
        "producto": {"type": "string", "enum": PRODUCTOS},
        "temperatura": {"type": "string", "enum": ["gold", "silver", "bronze", "out"]},
        "riesgo": {"type": "string", "enum": ["ninguno", "medico", "urgencia", "fuera_de_alcance"]},
        "datos": {"type": "object", "additionalProperties": False,
                  "required": CAMPOS,
                  "properties": {c: {"type": "string"} for c in CAMPOS}},
        "nota_interna": {"type": "string"},
    },
}

contexto = (
    "ESTADO ACTUAL: {{2.estado}}\n"
    "DATOS YA CAPTURADOS: {{2.datos}}\n"
    "ORIGEN (CTA): {{1.fuente}}\n"
    "CANAL: {{1.canal}}\n"
    "NOMBRE EN EL PERFIL: {{1.nombre}}\n"
    "SEGUIMIENTOS ENVIADOS: {{2.fu_count}}\n\n"
    "HISTORIAL:\n{{2.historial}}\n\n"
    "MENSAJE NUEVO:\n{{1.mensaje}}"
)

cuerpo = {
    "model": "claude-opus-5",
    "max_tokens": 900,
    "output_config": {"effort": "low",
                      "format": {"type": "json_schema", "schema": schema}},
    "system": [{"type": "text", "text": system,
                "cache_control": {"type": "ephemeral", "ttl": "1h"}}],
    "messages": [{"role": "user", "content": contexto}],
}

os.makedirs(os.path.join(BASE, "salida"), exist_ok=True)
with open(os.path.join(BASE, "salida", "cuerpo-modulo3.json"), "w", encoding="utf-8") as f:
    json.dump(cuerpo, f, ensure_ascii=False)
with open(os.path.join(BASE, "salida", "system.txt"), "w", encoding="utf-8") as f:
    f.write(system)

palabras = len(system.split())
tokens = int(palabras * 1.5)          # español: ~1,5 tokens por palabra
lectura_cache = tokens / 1_000_000 * 5 * 0.1   # Opus 5: $5/MTok de entrada, lectura de cache 0,1x
escritura_cache = tokens / 1_000_000 * 5 * 2   # TTL de 1 hora: 2x

print(f"modo:            {MODO}")
print(f"palabras:        {palabras:,}")
print(f"tokens aprox:    {tokens:,}")
print(f"por mensaje con cache leido:   ${lectura_cache:.4f}")
print(f"por escritura de cache (1h):   ${escritura_cache:.4f}")
print(f"1.600 mensajes/mes (aprox):    ${lectura_cache*1600 + escritura_cache*720:.2f}")
print("\nsalida/cuerpo-modulo3.json listo para pegar en Make (modulo 3, Request content)")
