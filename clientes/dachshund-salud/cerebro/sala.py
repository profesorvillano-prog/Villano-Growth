#!/usr/bin/env python3
"""
Genera la version web de la sala de pruebas, para desplegar en Vercel.

A diferencia del artifact, esta version NO necesita que quien la abre tenga
cuenta de Claude: la API key vive en el servidor. Marcelo solo abre un link.

    python3 build.py paula claude-sonnet-5    # arma el cuerpo con el cerebro actual
    python3 sala.py                           # arma la web
    cd sala-web && vercel --prod
"""
import json, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(BASE, "sala-web")
cuerpo = json.load(open(os.path.join(BASE, "salida", "cuerpo-modulo3.json"), encoding="utf-8"))

# --- 1. la funcion serverless, con el cuerpo inyectado ---
ruta_fn = os.path.join(WEB, "api", "paula.js")
fn = open(ruta_fn, encoding="utf-8").read()
nuevo_cuerpo = "const CUERPO = " + json.dumps(cuerpo, ensure_ascii=False) + ";\n"
fn = re.sub(r"const CUERPO = .*?;\s*$", lambda m: nuevo_cuerpo, fn, flags=re.S)
open(ruta_fn, "w", encoding="utf-8").write(fn)

# --- 2. el index, a partir del mismo HTML del artifact ---
s = open(os.path.join(BASE, "salida", "sandbox.html"), encoding="utf-8").read()

# la llamada a Claude pasa por el backend
s = re.sub(r"    if\(!sample\)\{.*?\n    \}\n", "", s, flags=re.S)
LLAMADA = ('const resp = await fetch("/api/paula", {\n'
           '      method: "POST",\n'
           '      headers: {"content-type": "application/json", "x-clave": CLAVE},\n'
           '      body: JSON.stringify({contexto: entrada})\n'
           '    });\n'
           '    if(!resp.ok){ const e = await resp.json().catch(function(){return {};}); '
           'throw {code: e.error || "fallo"}; }\n'
           '    const r = await resp.json();')
s = re.sub(r"const r = await sample\.json\(entrada, \{[^}]*\}\);", lambda m: LLAMADA, s)

s = s.replace('let resumen = "", turnos = 0, sample = null, ocupado = false;',
              'let resumen = "", turnos = 0, ocupado = false;\n'
              'const FEEDBACK = {};\n'
              'const CLAVE = new URLSearchParams(location.search).get("c") || "";')

# el feedback no va a la base del artifact: se junta y se copia
REGISTRAR = ('function registrar(indice, textoPaula, voto, comentario){\n'
             '  FEEDBACK[indice] = {respuesta: textoPaula, voto: voto || "", '
             'comentario: comentario || ""};\n'
             '  $("guardado").textContent = "Anotado \\u2713";\n'
             '  setTimeout(function(){ $("guardado").textContent = ""; }, 2000);\n'
             '}\n')
s = re.sub(r"async function registrar\(.*?\n\}\n", lambda m: REGISTRAR, s, flags=re.S)

s = s.replace('<button id="reset">Empezar de nuevo</button>',
              '<button id="reset">Empezar de nuevo</button>\n'
              '    <button id="copiar">Copiar mi feedback</button>')

COPIAR = ('$("copiar").onclick = async function(){\n'
          '  const items = Object.values(FEEDBACK);\n'
          '  if(!items.length){ $("guardado").textContent = "Todavia no marcas nada"; return; }\n'
          '  const txt = items.map(function(f){\n'
          '    return "[" + (f.voto || "sin marca") + "] " + f.respuesta +\n'
          '      (f.comentario ? "\\n   -> " + f.comentario : "");\n'
          '  }).join("\\n\\n");\n'
          '  try{ await navigator.clipboard.writeText(txt);\n'
          '    $("guardado").textContent = "Copiado, ya lo puedes pegar"; }\n'
          '  catch(e){ $("guardado").textContent = "No se pudo copiar"; }\n'
          '  setTimeout(function(){ $("guardado").textContent = ""; }, 3000);\n'
          '};\n\n'
          '$("reset").onclick = () => {')
s = s.replace('$("reset").onclick = () => {', COPIAR, 1)

s = s.replace('"Para probar a Paula hay que permitir que esta p\\u00e1gina le pregunte a Claude. Recarga y acepta el permiso."',
              '"El link no trae la clave correcta. Pide el link completo."')
s = s.replace('cod === "not_granted"', 'cod === "clave_incorrecta"')

# esqueleto completo: aca no lo pone el visor de artifacts
estilos, resto = s.split("</style>", 1)
doc = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
       + estilos + '</style>\n</head>\n<body>\n' + resto + '\n</body>\n</html>')
open(os.path.join(WEB, "index.html"), "w", encoding="utf-8").write(doc)

print("sala-web/index.html   ", len(doc), "chars")
print("sala-web/api/paula.js ", len(fn), "chars  (con el cuerpo inyectado)")
print("\nDesplegar:  cd sala-web && vercel --prod")
