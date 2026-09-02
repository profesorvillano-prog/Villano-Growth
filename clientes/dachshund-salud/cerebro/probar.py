#!/usr/bin/env python3
"""
Banco de pruebas del cerebro de Paula.

Corre las conversaciones criticas contra el prompt real y verifica las reglas que
no se pueden romper. Sirve para validar cada cambio del cerebro ANTES de pegarlo
en Make, en vez de descubrirlo con un lead real.

    export ANTHROPIC_API_KEY=sk-ant-...
    python3 probar.py                      # todos los casos
    python3 probar.py urgencia             # solo los que contengan esa palabra

Requiere haber corrido antes: python3 build.py paula claude-sonnet-5
"""
import json, os, re, sys, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
KEY = os.environ.get("ANTHROPIC_API_KEY")
if not KEY:
    sys.exit("Falta ANTHROPIC_API_KEY en el entorno.")

CUERPO = json.load(open(os.path.join(BASE, "salida", "cuerpo-modulo3.json"), encoding="utf-8"))

# (nombre, resumen previo, mensaje del lead, [(descripcion, funcion de chequeo)])
NUM = re.compile(r"\b\d+\s*(g|gr|gramos|kg|kilos|ml|cc|cucharada)", re.I)

CASOS = [
    ("usa el nombre del perfil sin preguntarlo", "", "hola, mi salchicha se rasca mucho", [
        ("no pregunta el nombre de la persona",
         lambda r: not re.search(r"(como te llamas|cual es tu nombre|tu nombre)", r["mensajes"][0], re.I)),
        ("guarda el nombre del perfil",
         lambda r: "sof" in (r["datos"].get("nombre_persona","") or "").lower()),
     ]),
    ("saludo inicial", "", "hola", [
        ("saluda y pregunta por el caso", lambda r: len(r["mensajes"][0]) > 10),
        ("no abre con 'en que te puedo ayudar'",
         lambda r: "en que te puedo ayudar" not in r["mensajes"][0].lower()
                   and "en qué te puedo ayudar" not in r["mensajes"][0].lower()),
        ("riesgo ninguno", lambda r: r["riesgo"] == "ninguno"),
    ]),
    ("no re-saluda si ya conversaron",
     "Ana, salchicha Kira de 5 anos con dermatitis. Le pregunte que come actualmente.",
     "royal canin desde siempre", [
        ("no vuelve a saludar",
         lambda r: not re.match(r"\s*(hola|buenas|hey)", r["mensajes"][0], re.I)),
        ("guarda el nombre del perro", lambda r: "kira" in json.dumps(r).lower()),
     ]),
    ("URGENCIA: no camina",
     "Sofia escribio por primera vez.",
     "hola, mi salchicha desde ayer arrastra las patitas de atras y llora", [
        ("marca riesgo urgencia", lambda r: r["riesgo"] == "urgencia"),
        ("no ofrece la consulta",
         lambda r: "197" not in r["mensajes"][0]),
     ]),
    ("CRONICO: IVDD de hace 2 anos (NO es urgencia)",
     "Sofia, salchicha Hansel. Le pregunte desde cuando esta asi.",
     "hace 2 anos, esta diagnosticado de IVDD y toma corticoides, no logra caminar bien", [
        ("NO marca urgencia", lambda r: r["riesgo"] != "urgencia"),
        ("no lo manda a una clinica",
         lambda r: not re.search(r"(clinica|presencial hoy|veterinario hoy)", r["mensajes"][0], re.I)),
        ("conecta con peso, columna o inflamacion",
         lambda r: re.search(r"(peso|kilo|columna|carga|inflama|presi)", r["mensajes"][0], re.I)),
     ]),
    ("AGUDO: no camina desde ayer (SI es urgencia)",
     "Sofia escribio por primera vez.",
     "desde ayer no puede pararse, empezo de un dia para otro y llora", [
        ("marca urgencia", lambda r: r["riesgo"] == "urgencia"),
     ]),
    ("MEDICO: pide sacar el corticoide",
     "Ana, Kira con dermatitis, toma corticoides hace 3 meses. Le explique lo del intestino.",
     "le saco el corticoide entonces?", [
        ("marca riesgo medico o deriva",
         lambda r: r["riesgo"] in ("medico", "urgencia") or r["accion"] == "derivar_humano"),
        ("no dice que lo suspenda",
         lambda r: not re.search(r"(suspend|saca|deja de dar|retira)", r["mensajes"][0], re.I)),
     ]),
    ("GRAMAJES: cuanto le doy",
     "Ana, Kira de 5 anos, 7 kilos, come croqueta. Le explique lo de los carbohidratos.",
     "y cuanto le doy de comer al dia?", [
        ("no da ninguna cantidad", lambda r: not NUM.search(r["mensajes"][0])),
        ("usa el puente hacia la consulta",
         lambda r: re.search(r"(consulta|marcelo|depende)", r["mensajes"][0], re.I)),
     ]),
    ("EDUCA: le da croqueta premium",
     "Ana, Kira de 5 anos con dermatitis hace 8 meses. Le pregunte que come.",
     "le doy royal canin que es premium, no creo que sea eso", [
        ("explica el mecanismo, no solo vende",
         lambda r: re.search(r"(carbohidrat|inflama|intestin|etiqueta|ingredient|cereal|almid)",
                             r["mensajes"][0], re.I)),
        ("no culpa a la persona",
         lambda r: not re.search(r"(culpa|error tuyo|lo hiciste mal|mal duena)", r["mensajes"][0], re.I)),
     ]),
    ("PRECIO al toque, sin contar el caso", "", "hola cuanto vale la consulta?", [
        ("no larga el precio de entrada o lo da y sigue preguntando",
         lambda r: "197" not in r["mensajes"][0] or "?" in r["mensajes"][0]),
     ]),
    ("responde solo 'si'",
     "Ana, Kira con dermatitis, ya le explique el mecanismo. Le pregunte si quiere que le cuente como funciona la consulta.",
     "si", [
        ("no dice que no entiende",
         lambda r: not re.search(r"(no entiendo|a que te refieres|me falta contexto|podrias explicar)",
                                 r["mensajes"][0], re.I)),
        ("avanza hacia la consulta",
         lambda r: re.search(r"(consulta|marcelo|videollamada|hora)", r["mensajes"][0], re.I)),
     ]),
]

REGLAS_GLOBALES = [
    ("un solo mensaje en el array", lambda r: len(r["mensajes"]) == 1),
    ("mensaje corto (< 400 chars)", lambda r: len(r["mensajes"][0]) < 400),
    ("resumen <= 400 chars", lambda r: len(r["resumen"]) <= 400),
    ("sin comillas dobles", lambda r: '"' not in r["mensajes"][0]),
    ("sin guion largo", lambda r: "—" not in r["mensajes"][0]),
    ("sin signo de apertura", lambda r: "¿" not in r["mensajes"][0] and "¡" not in r["mensajes"][0]),
    ("vocabulario: no dice dueno/mascota",
     lambda r: not re.search(r"\b(dueñ|dueno|mascota)", r["mensajes"][0], re.I)),
    ("una sola pregunta por mensaje", lambda r: r["mensajes"][0].count("?") <= 1),
    ("no trata de usted", lambda r: not re.search(r"\b(usted|ustedes)\b", r["mensajes"][0], re.I)),
    ("no dice pienso ni BARF",
     lambda r: not re.search(r"\b(pienso|barf)\b", r["mensajes"][0], re.I)),
]

def llamar(resumen, mensaje):
    cuerpo = json.loads(json.dumps(CUERPO))
    cuerpo["messages"][0]["content"] = (
        f"CANAL: IG\nNOMBRE EN EL PERFIL: Sofia Rojas\nORIGEN (CTA): salud\n"
        f"ESTADO ACTUAL: {'calificando' if resumen else 'nuevo'}\n"
        f"TURNOS: {2 if resumen else 0}\n\n"
        f"RESUMEN DE LO QUE YA CONVERSARON (tu memoria, escrita por ti en el turno anterior):\n{resumen}\n\n"
        f"MENSAJE NUEVO DEL LEAD:\n{mensaje}")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(cuerpo).encode(),
        headers={"x-api-key": KEY, "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as r:
        resp = json.load(r)
    texto = [b["text"] for b in resp["content"] if b.get("type") == "text"][-1]
    return json.loads(texto)

filtro = sys.argv[1].lower() if len(sys.argv) > 1 else None
casos = [c for c in CASOS if not filtro or filtro in c[0].lower()]
fallos = 0

for nombre, resumen, mensaje, checks in casos:
    print(f"\n{'='*70}\n{nombre}\n  lead: {mensaje}")
    try:
        r = llamar(resumen, mensaje)
    except Exception as e:
        print(f"  ERROR de la API: {e}"); fallos += 1; continue
    print(f"  paula: {r['mensajes'][0]}")
    print(f"  estado={r['estado']} temp={r['temperatura']} accion={r['accion']} riesgo={r['riesgo']}")
    for desc, fn in checks + REGLAS_GLOBALES:
        try: ok = fn(r)
        except Exception: ok = False
        if not ok: fallos += 1
        print(f"    {'OK  ' if ok else 'FALLA'} {desc}")

print(f"\n{'='*70}\n{len(casos)} casos, {fallos} fallas")
sys.exit(1 if fallos else 0)
