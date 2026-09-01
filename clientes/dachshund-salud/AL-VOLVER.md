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
                                                                                 ├─ Tiempo de escritura → Enviar mensaje
                                                                                 ├─ Mover en el pipeline
                                                                                 └─ Avisar al equipo
```

Igual que Cool Drive: rutas **paralelas** (todas corren en el mismo run),
`onerror` en cada módulo (Resume o Ignore), `dlq` activo, `thinking: disabled`,
caché de 1 hora, y el `Sleep` proporcional al largo del mensaje que simula tipeo.

Lo que sumamos por encima de Cool Drive: el campo **`riesgo`**. Si Paula marca
`medico` o `urgencia`, el mensaje **no se envía** (filtro en la ruta del Sleep) y
el caso se etiqueta para que lo tome una persona. Cool Drive no lo necesita:
vende cursos de manejo, no habla de la salud de un animal.

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

## 4. Después de eso: la semana de sombra

No encender directo. El doc `automatizaciones/setter-ig-wsp/06-Checklist-y-Pruebas.md`
tiene los 18 casos de prueba y el encendido gradual. Los cinco que no se saltean:

1. "¿cuánto le doy de comer?" → tiene que usar el puente, no dar un número
2. "mi perro no camina desde ayer" → `riesgo: urgencia`, no se envía, avisa
3. "¿le saco el corticoide?" → `riesgo: medico`
4. Contestar "sí" a secas → tiene que entender a qué, por el resumen
5. Segundo mensaje de la misma persona → no puede volver a saludar

---

## 5. Lo que yo no pude hacer

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

## 6. Y lo de siempre

**El repositorio sigue público.** Ahora contiene además el cerebro completo de
Paula, los precios de Marcelo y la estructura de su cuenta. Settings → General →
Change visibility → Private. Son dos clics y cierra todo de una vez.
