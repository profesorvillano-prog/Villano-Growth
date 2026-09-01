#!/usr/bin/env python3
"""
Arma el cuerpo de la peticion a Anthropic que va pegado en el modulo 3
del escenario [SETTER] Marcelo de Make.

Uso:
    python3 build.py                          -> Paula + Opus 5 (recomendado)
    python3 build.py paula claude-haiku-4-5   -> Paula + Haiku (5x mas barato)
    python3 build.py marcelo                  -> el bot habla como Marcelo
    python3 build.py completo                 -> Marcelo + fuentes crudas

Personas:
    paula    CEREBRO-PAULA.md    asistente que califica y agenda. No responde
                                 preguntas tecnicas: las usa de puente a la consulta.
    marcelo  CEREBRO-MARCELO.md  el bot es Marcelo en primera persona.
    completo Marcelo + todo el texto de fuentes/ (libros y transcripciones).

Genera:
    salida/cuerpo-modulo3.json  -> se copia entero al campo "Request content"
    salida/system.txt           -> el prompt final en texto plano, para revisarlo
"""
import json, os, sys, glob

BASE = os.path.dirname(os.path.abspath(__file__))
MODO = (sys.argv[1] if len(sys.argv) > 1 else "paula").lower()
MODELO = sys.argv[2] if len(sys.argv) > 2 else "claude-opus-5"

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

ARCHIVO = "CEREBRO-PAULA.md" if MODO == "paula" else "CEREBRO-MARCELO.md"
system = leer(os.path.join(BASE, ARCHIVO))

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

# effort da error en Haiku 4.5: solo se manda en los modelos que lo aceptan.
output_config = {"format": {"type": "json_schema", "schema": schema}}
if not MODELO.startswith("claude-haiku"):
    output_config["effort"] = "low"

cuerpo = {
    "model": MODELO,
    "max_tokens": 900,
    "output_config": output_config,
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

# Precios Anthropic por millón de tokens (verificar los vigentes antes de presupuestar)
MODELOS = {"claude-opus-5": (5.0, 25.0), "claude-sonnet-5": (3.0, 15.0),
           "claude-haiku-4-5": (1.0, 5.0)}

# Modelo de coste por CONVERSACION, que es como se factura de verdad:
# el prompt entero se reenvia en cada mensaje, pero el cache lo cobra al 10%.
MSG_POR_CONV = 8      # mensajes del bot en una conversacion tipica
SALIDA_TOK = 200      # tokens que escribe el bot por mensaje

print(f"persona:      {MODO}  ({ARCHIVO})")
print(f"modelo:       {MODELO}")
print(f"palabras:     {palabras:,}")
print(f"tokens:       {tokens:,}\n")
print(f"{'modelo':18} {'x conversación':>15} {'x 200 conv/mes':>16}")
print("-" * 52)
for m, (pin, pout) in MODELOS.items():
    escritura = tokens / 1e6 * pin * 2                       # 1 escritura de cache (TTL 1h)
    lecturas  = (MSG_POR_CONV - 1) * tokens / 1e6 * pin * 0.1  # el resto lee del cache
    salida    = MSG_POR_CONV * SALIDA_TOK / 1e6 * pout
    conv = escritura + lecturas + salida
    print(f"{m:18} {'$' + format(conv, '.3f'):>15} {'$' + format(conv * 200, '.0f'):>16}")

print("""
Supuestos: 8 mensajes por conversacion, una escritura de cache por conversacion
(el peor caso realista) y el resto leyendo del cache. Si dos conversaciones caen
dentro de la misma hora, comparten la escritura y sale mas barato.

salida/cuerpo-modulo3.json listo para pegar en Make (modulo 3, Request content)""")
