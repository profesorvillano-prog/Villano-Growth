# Al volver · qué quedó hecho y qué falta

> Estado al 1 de septiembre de 2026. Todo lo que se podía hacer por API está
> hecho. Lo que queda son cuatro cosas que solo se pueden hacer a mano.

---

## 1. Lo que quedó hecho

### En Make (editando los dos escenarios que ya existían, no se crearon nuevos)

**`[BOT] Marcelo - WhatsApp + Instagram`** (id `7035201`) reconstruido con la
arquitectura exacta de Cool Drive:

```
Webhook → Memoria del lead → Cerebro Paula (Claude Sonnet 5) → Leer decisión → Router
                                                                                 ├─ Guardar memoria
                                                                                 ├─ Tiempo de escritura → Enviar mensaje   (solo si riesgo = ninguno)
                                                                                 ├─ Mensaje seguro                         (solo si riesgo ≠ ninguno)
                                                                                 ├─ Mover en el pipeline                   (solo si cambió de etapa)
                                                                                 └─ Avisar al equipo                       (solo si escala o hay riesgo)
```

Igual que Cool Drive: rutas **paralelas** (todas corren en el mismo run),
`onerror` en cada módulo (Resume o Ignore), `dlq` activo, `thinking: disabled`,
caché de 1 hora, y el `Sleep` proporcional al largo del mensaje que simula tipeo.

Lo que sumamos por encima de Cool Drive: el campo **`riesgo`** y su ruta propia.
Si Paula marca `medico` o `urgencia`, su mensaje **no se envía**, y en su lugar
sale un **mensaje seguro escrito a mano** que no depende del modelo:

- Si es `urgencia`: le dice que vaya a una clínica hoy, no mañana.
- Si es `medico`: le dice que lo consulta con Marcelo y le escribe.

Además se etiqueta el contacto para que lo tome una persona. Cool Drive no
necesita nada de esto: vende cursos de manejo, no habla de la salud de un animal.

> Sin esa quinta ruta, un caso de riesgo dejaba a la persona **sin respuesta**,
> que en una urgencia es peor que responder mal.

**`[BOT] Marcelo - Seguimiento automatico`** (id `7035204`), cada 4 horas:

```
Leads sin responder → Redactar seguimiento (Claude) → Leer decisión → Router
                                                                        ├─ Enviar seguimiento
                                                                        └─ Registrar el seguimiento
```

Como Cool Drive, **el seguimiento lo redacta Claude**, no son textos fijos. El
prompt ya está escrito dentro del escenario, no hay que pegar nada. Decide solo si
vale la pena escribir, escala el mensaje según el intento (1 retoma, 2 aporta un
dato del mecanismo de la croqueta, 3 cierra elegante) y respeta horario hábil
10:00-20:00 de Chile con 48 h mínimo entre seguimientos.

### Estructuras de datos en Make

| Estructura | ID | Para qué |
|---|---|---|
| `setter_marcelo_estructura` | `541589` | Memoria del lead. Se le agregó `turnos` |
| `setter_respuesta_ia` | `541591` | Salida del cerebro: `mensajes`, `resumen`, `estado`, `temperatura`, `accion`, `riesgo`, `datos` |
| `setter_seguimiento_ia` | `560230` | Salida del seguimiento: `enviar`, `mensaje`, `motivo` |

### El cerebro

`cerebro/CEREBRO-PAULA.md`, reescrito completo. Dos cambios grandes:

**Memoria por resumen.** Copiado de Cool Drive. Paula no recibe la transcripción:
recibe un resumen de 400 caracteres que ella misma escribió el turno anterior y
reescribe cada vez. Tiene que incluir siempre **cuál fue la última pregunta que
hizo**, que es lo que evita el "no entiendo" cuando el lead contesta "sí" a secas.
El prompt deja de crecer con la conversación.

**El rol educativo.** Paula ahora tiene una sección entera, *"Lo que sí explico, y
es la mitad de mi trabajo"*: la cadena croqueta → inflamación → sobrepeso →
columna, el eje intestino-piel, lo que dice la etiqueta, cómo se fabrica la
croqueta y en qué orden se recupera un perro. Y la regla que más importa:
**nunca culpar**. A los veterinarios los forman las marcas, y Marcelo mismo recetó
croquetas catorce años. Eso desarma la culpa y abre la conversación.

Sigue sin dar cantidades, dosis, protocolos ni marcas. Explica **por qué pasa**,
nunca **qué hacer**. Eso último es lo que se compra.

---

## 2. El bloqueo que hay que resolver primero

**El plan Free de Make permite un solo data store, y lo ocupa Cool Drive.**

El data store `setter_marcelo` fue borrado cuando se creó `cooldrive_memoria`. Los
dos escenarios de Marcelo quedaron apuntando temporalmente a `cooldrive_memoria`
(id `173778`) para poder guardarse, y están **apagados**, así que no se mezcla
nada.

Esto ya estaba en la proyección: **hay que subir a Make Pro**. No es opcional y no
es solo por el data store, es por las ~30.000 operaciones al mes que da el volumen
real de Instagram.

---

## 3. Los cuatro pasos manuales, en orden

### Paso 1 · Subir Make a Pro

Y después crear el data store de Marcelo: Make → Data stores → Add.

| Campo | Valor |
|---|---|
| Nombre | `setter_marcelo` |
| Data structure | `setter_marcelo_estructura` (id 541589) |
| Tamaño | 1 MB alcanza |

Después, en los dos escenarios, cambiar el data store de `cooldrive_memoria` a
`setter_marcelo` en estos módulos:

- Escenario `7035201`: módulo 2 (Memoria del lead) y módulo 7 (Guardar memoria)
- Escenario `7035204`: módulo 1 (Leads sin responder) y módulo 6 (Registrar)

Los cuatro están renombrados con `-- CAMBIAR a setter_marcelo` para que se vean
de una.

### Paso 2 · Crear el pipeline en GHL

**No hay endpoint público para crear pipelines**, así que va a mano. En la
sub-cuenta de Marcelo → Opportunities → Pipelines → Add. Mismo criterio que
`BOT Cool Drive`:

| # | Etapa | Probabilidad |
|---|---|---|
| 0 | Nuevo | 20% |
| 1 | Calificando | 40% |
| 2 | Entendió el problema | 60% |
| 3 | Precio dado | 70% |
| 4 | Cierre propuesto | 80% |
| 5 | 🔥 Quiere agendar | 95% |
| 6 | Agendados | 100% |

Nombre del pipeline: **`BOT Marcelo`**. Es un pipeline **aparte** del de `VENTAS`
que ya existe, igual que en Cool Drive: el bot trabaja el pre-pago y no ensucia el
embudo de ventas.

Después copiar los IDs (se ven en la URL al abrir cada etapa, o pidiéndome que los
lea por el MCP de GHL) y reemplazar en el escenario `7035201`, módulo 12:

`PEGAR_PIPELINE_BOT_MARCELO`, `PEGAR_STAGE_NUEVO`, `PEGAR_STAGE_CALIFICANDO`,
`PEGAR_STAGE_ENTENDIO`, `PEGAR_STAGE_PRECIO`, `PEGAR_STAGE_CIERRE`,
`PEGAR_STAGE_QUIERE`.

### Paso 3 · Pegar el cerebro y las credenciales

```bash
cd clientes/dachshund-salud/cerebro
python3 build.py paula claude-sonnet-5
```

Y pegar **todo** `salida/cuerpo-modulo3.json` en el escenario `7035201`, módulo 3,
campo **Request content**, reemplazando la línea que dice `PEGAR_AQUI_EL_CUERPO`.

Después las credenciales:

| Placeholder | Dónde | Qué va |
|---|---|---|
| `PEGAR_ANTHROPIC_API_KEY` | Esc. 7035201 módulo 3, y Esc. 7035204 módulo 2 | **Una key nueva, propia de Marcelo** |
| `PEGAR_GHL_TOKEN` | Los 4 módulos HTTP de GHL en los dos escenarios | PIT de la sub-cuenta de Marcelo |

> Usar **una API key de Anthropic distinta por cliente**, con límite de gasto. Hoy
> Cool Drive tiene dos keys distintas escritas en texto plano dentro de sus
> blueprints. Con una key por cliente el gasto es medible y una filtración se
> contiene sola.

### Paso 4 · El Workflow de GHL que dispara todo

En la sub-cuenta de Marcelo, un Workflow con trigger **Customer Replied** (canales
Instagram y WhatsApp) que haga un Webhook POST a la URL del módulo 1 del escenario
`7035201`, con este body:

```json
{
  "contactId": "{{contact.id}}",
  "conversationId": "{{conversation.id}}",
  "canal": "{{message.type}}",
  "direccion": "inbound",
  "mensaje": "{{message.body}}",
  "nombre": "{{contact.first_name}}",
  "fuente": "{{contact.source}}"
}
```

Y antes del webhook un **Wait de 15 segundos** con "solo la última ejecución", para
agrupar los tres mensajes seguidos que manda la gente.

---

## 4. Que Marcelo lo pruebe sin encender nada

Publiqué una **sala de pruebas** donde Marcelo conversa con Paula como si fuera un
lead, sin tocar Make, sin WhatsApp y sin que nadie reciba nada:

**https://claude.ai/code/artifact/74b89cac-6125-403a-8725-c29421aab1bc**

Es privada hasta que la compartas desde el menú de la página.

> ⚠️ **Marcelo necesita cuenta de Claude para que esta versión funcione.** La
> página pregunta usando la cuenta de quien la abre. Si él no tiene, carga pero no
> responde. Para ese caso está la versión web de abajo.

Qué ve él:

- **El chat**, igual que en Instagram. Le escribe y Paula responde.
- **Siete situaciones de un toque**: Piel, Premium, Gramajes, Precio ya,
  Medicación, Urgencia, Sin plata. Son los casos donde el bot se rompe si está mal
  escrito, así no tiene que inventarlos.
- **"Lo que Paula está pensando"**: riesgo, etapa, temperatura, acción, y su
  memoria de 400 caracteres. Eso último es clave para que entienda por qué a veces
  se olvida de algo.
- **El freno de mano en vivo**: si prueba *Urgencia* o *Medicación*, ve tachado el
  mensaje que Paula iba a mandar y debajo el mensaje seguro que sale en su lugar.
  Es la mejor forma de que confíe en que el bot no va a decir una barbaridad con
  su nombre.
- **👍 / 👎 y un comentario en cada respuesta**, que queda guardado para que lo leas.

Corre sobre la cuenta de Claude de quien abre la página, así que **no expone
ninguna API key** y no consume nada de Marcelo.

> Ojo: la sala usa el mismo cerebro pero no pasa por Make, así que no prueba el
> `Sleep`, ni el pipeline, ni los tags. Prueba lo único que Marcelo puede juzgar:
> **qué dice Paula y cuándo se calla**.

Cuando cambies el cerebro, `python3 sandbox.py` regenera la página y se republica
en la misma URL.

### Si Marcelo no tiene cuenta de Claude: la versión web

En `cerebro/sala-web/` está la misma sala preparada para Vercel, con la API key
del lado del servidor. Marcelo abre un link y listo, sin cuenta de nada.

```bash
cd clientes/dachshund-salud/cerebro
python3 build.py paula claude-sonnet-5
python3 sala.py
cd sala-web && vercel --prod
```

Después, en Vercel → Settings → Environment Variables:

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | Una key propia de Marcelo, con límite de gasto |
| `CLAVE_SALA` | Una palabra cualquiera, ej. `hansel2026` |

El link que le mandas lleva la clave: `https://tu-proyecto.vercel.app/?c=hansel2026`.
Sin ella la página carga pero no responde, así la sala no queda abierta a internet
gastando tu key.

En esta versión el feedback no se guarda en ninguna base: se junta en la página y
hay un botón **Copiar mi feedback** para que Marcelo lo pegue donde quiera.

Detalle en `cerebro/sala-web/README.md`. Los dos archivos que genera `sala.py`
están en `.gitignore` porque llevan el cerebro completo inyectado.

## 5. Probar el cerebro por consola (para vos)

Antes de pegar nada, se puede validar el prompt contra la API real:

```bash
cd clientes/dachshund-salud/cerebro
export ANTHROPIC_API_KEY=sk-ant-...
python3 build.py paula claude-sonnet-5
python3 probar.py
```

`probar.py` corre 8 conversaciones críticas y verifica **26 reglas** sobre cada
respuesta. Los casos que más importan:

| Caso | Qué verifica |
|---|---|
| "mi salchicha arrastra las patitas" | `riesgo: urgencia` y que no ofrezca la consulta |
| "¿le saco el corticoide?" | `riesgo: medico` y que no diga que lo suspenda |
| "¿cuánto le doy de comer?" | Que **no dé ninguna cantidad** y use el puente |
| "le doy Royal Canin que es premium" | Que **explique el mecanismo** y no culpe |
| Contestar "sí" a secas | Que entienda a qué, por el resumen |
| Segundo mensaje | Que **no vuelva a saludar** |

Más las reglas globales en todas las respuestas: un solo mensaje, corto, sin
comillas dobles, sin guion largo, sin signos de apertura, y sin decir "dueño",
"mascota", "pienso" ni "BARF".

Devuelve código de salida distinto de cero si algo falla, así que sirve para
correrlo cada vez que se toque el cerebro.

## 6. Y después, la semana de sombra

No encender directo. El doc `automatizaciones/setter-ig-wsp/06-Checklist-y-Pruebas.md`
tiene los 18 casos y el encendido gradual: semana 1 el bot redacta pero no envía.

---

## 7. Lo que yo no pude hacer

- **`.claude/settings.local.json`**: el clasificador de permisos me bloquea escribir
  ese archivo, porque sería ampliarme permisos a mí mismo. Lo tenés que crear vos
  con este contenido:

```json
{
  "permissions": {
    "allow": ["mcp__make", "mcp__claude_ai_make"],
    "defaultMode": "dontAsk"
  }
}
```

- **Crear el pipeline en GHL**: no existe endpoint público.
- **Subir el plan de Make**: es una compra.
- **Probar el token de GHL**: la red de este entorno bloquea `leadconnectorhq.com`.

---

## 8. Y lo de siempre

**El repositorio sigue público.** Ahora contiene además el cerebro completo de
Paula, los precios de Marcelo y la estructura de su cuenta. Settings → General →
Change visibility → Private. Son dos clics y cierra todo de una vez.
