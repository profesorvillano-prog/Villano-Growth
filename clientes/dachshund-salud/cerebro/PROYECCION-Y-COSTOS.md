# Proyección de volumen y coste · bot de Marcelo

> Flujo: Instagram → Paula califica → **llamada de diagnóstico** o **formulario
> calificador que deriva a WhatsApp** para un segundo setteo.
> Arquitectura de referencia: `[BOT] Cool Drive - WhatsApp + Instagram` (Make).
> Números de volumen medidos en la cuenta real. Septiembre 2026.

---

## 1. Lo que aprendí mirando Cool Drive

El bot de Cool Drive lleva 72 ejecuciones y **372 operaciones**, o sea **5,2
operaciones por mensaje de promedio** (7 en un turno completo sano; el promedio
baja porque 28 de las 72 ejecuciones fallaron). Ese es el dato duro que sirve
para presupuestar, y confirma la estimación que veníamos usando.

Su estructura tiene **una idea que hay que copiar sí o sí** y varias mejoras
menores.

### 1.1 La memoria es un resumen, no un historial

Nuestro diseño guarda la transcripción y la reenvía completa en cada mensaje,
recortada a 6.000 caracteres. **Cool Drive no guarda transcripción.** El modelo
escribe en cada turno un campo `resumen` de máximo 400 caracteres que es su única
memoria, y lo reescribe incorporando lo nuevo.

Del propio prompt de Cool Drive:

> "No recuerdas nada por tu cuenta. En cada mensaje te llega un RESUMEN que
> escribiste tú mismo en el turno anterior. Eso es todo lo que sabes de esta
> persona."

Y obliga a que el resumen contenga siempre **cuál fue la última pregunta que
hizo el bot**, que es lo que resuelve el problema clásico de que el lead conteste
"sí" o "esta semana" y el bot no sepa a qué.

**Por qué importa:** el prompt deja de crecer con la conversación. En Sonnet 5,
arrastrar historial completo cuesta **unos $19 al mes más** al volumen de
Marcelo, y encima empeora las respuestas porque el modelo se pierde en el ruido.

### 1.2 Otras cosas que vale la pena copiar

| Detalle | Qué hace |
|---|---|
| `thinking: {"type": "disabled"}` | Baja coste y latencia. Para un setter no hace falta razonamiento extendido |
| `FunctionSleep` proporcional | `max(5; min(22; round(length/11)))` segundos antes de enviar. Simula tipeo, se siente humano |
| Router con rutas **paralelas** | Guardar memoria, enviar, mover pipeline y avisar corren todas en el mismo run. El nuestro usa rutas excluyentes |
| `opportunities/upsert` con `switch()` | Mapea estado del bot a etapa del pipeline en una sola llamada |
| `onerror` en cada módulo | `Resume` o `Ignore` en los 6 módulos. Una caída no mata la conversación |
| `dlq: true` | Cola de fallidos, para reprocesar |
| Filtro "cambio de etapa real" | Solo llama a GHL si el estado cambió. Ahorra una operación por mensaje |

### 1.3 Dónde el nuestro es mejor

- **Salida estructurada con `riesgo`**: Cool Drive vende cursos de manejo, donde
  equivocarse cuesta una venta. Acá el mensaje lo firma un veterinario y una
  indicación médica mal dada es otra cosa. El campo `riesgo` y el freno de mano
  no se sacan.
- **Cool Drive usa `claude-sonnet-5`**, que es un punto de partida razonable
  también para Marcelo.

---

## 2. El volumen

Medido día por día en la cuenta de Marcelo, 18-ago a 1-sep:

| | 15 días | Al mes |
|---|---|---|
| Conversaciones nuevas de Instagram | 356 | **~712** |
| Con actividad | 490 | ~980 |
| WhatsApp | 39 | ~78 |

WhatsApp queda fuera: es el teléfono personal de Marcelo (ver `HALLAZGOS-DRIVE.md` §8).

### Cuántas llegan lejos

No las 712 completan el flujo. Con el embudo del doc `01-Embudo-y-Modelo.md`:

| Etapa | % | Al mes |
|---|---|---|
| Entran al bot | 100% | 712 |
| Responden el primer mensaje | 60% | 427 |
| Llegan a dar los datos y las fotos | 40% | 285 |
| Reciben la oferta | 30% | 214 |
| Agendan o completan el formulario | 8% | **57** |

El coste de IA se paga por conversación **atendida**, no por conversación
cerrada. Por eso el cálculo se hace sobre las 712, no sobre las 57.

---

## 3. El coste mensual

`python3 costos.py` lo recalcula con otros supuestos.

### Escenario base: 712 conversaciones, 6 mensajes cada una

| Concepto | Coste |
|---|---|
| Make (30.444 ops → plan **Pro**) | **~$19** |
| IA en **Sonnet 5** | **~$33** |
| IA en Haiku 4.5 | ~$11 |
| IA en Opus 5 | ~$55 |
| **Total con Sonnet 5** | **~$52/mes** |
| **Total con Haiku 4.5** | **~$30/mes** |

### Si se filtra y solo entran los leads de los CTA (285 conv, 8 mensajes)

| Concepto | Coste |
|---|---|
| Make (16.500 ops → Pro) | ~$19 |
| IA en Sonnet 5 | ~$16 |
| **Total** | **~$35/mes** |

> **El plan Core de Make no alcanza en ningún escenario.** Hay que ir a **Pro**.
> Es la única partida que no baja filtrando volumen, porque el escenario corre
> igual para descartar.

### Si además se abre WhatsApp con número nuevo

WhatsApp Business API se cobra por conversación iniciada, con precio distinto por
país y por categoría (servicio, marketing, utilidad). Hay que cotizarlo con el
proveedor, pero **no es despreciable**: a este volumen puede superar a Make y a
la IA juntos. Por eso conviene arrancar solo por Instagram.

---

## 4. Coste de implementación

Lo que falta hacer, con el escenario de Marcelo ya creado y el cerebro escrito.

| Tarea | Esfuerzo |
|---|---|
| Rehacer el escenario con la arquitectura de Cool Drive (memoria por resumen, rutas paralelas, sleep, onerror) | 3-4 h |
| Reescribir el cerebro de Paula al formato de resumen y al flujo de dos salidas | 2-3 h |
| Crear el formulario calificador y conectarlo | 2 h |
| Etapas nuevas en el pipeline VENTAS para el lead pre-pago | 1 h |
| Remapear a los custom fields que ya existen | 1 h |
| Workflows de GHL (disparo, freno de mano, post-pago) | 2 h |
| Pruebas de los 18 casos del doc 06 | 3 h |
| Semana de modo sombra, revisión diaria | 5-6 h repartidas |
| **Total** | **~20 horas** |

A eso se suma la iteración de las primeras semanas, que no es opcional: leer 10
conversaciones por semana y ajustar. Cuenta unas 2 h semanales el primer mes.

---

## 5. Recomendación

1. **Solo Instagram**, con el número personal de Marcelo fuera. Es el 93% del volumen.
2. **Sonnet 5** para arrancar, igual que Cool Drive. Haiku 4.5 después de comparar
   sobre 20 conversaciones reales, si aguanta la voz y las reglas.
3. **Memoria por resumen**, no historial. Es el cambio de mayor impacto.
4. **Make Pro** desde el día uno.
5. Presupuesto operativo realista: **$50-55 al mes** con Sonnet 5, **$30** con Haiku.
6. Implementación: **~20 horas** más 2 h semanales de ajuste el primer mes.

---

## 6. ⚠️ Las credenciales del escenario de Cool Drive están en texto plano

El blueprint de `[BOT] Cool Drive` contiene, escritas directamente en los módulos:

- La **API key de Anthropic** (`sk-ant-api03-HFaR…`), que es una credencial de
  facturación: quien la tenga puede gastar contra esa cuenta.
- El **token de integración de GHL de Cool Drive** (`pit-77e0e024-…`).

Es normal que vivan dentro de Make. El problema es lo que pasa después:

- **Nunca exportar ese blueprint a este repositorio**, que es público. Se irían las
  dos claves. Por eso el blueprint de Marcelo usa `PEGAR_ANTHROPIC_API_KEY` y
  `PEGAR_GHL_TOKEN` en vez de valores reales.
- Cualquiera con acceso al equipo de Make puede leerlas.
- Conviene **rotar la key de Anthropic** y ponerle un límite de gasto mensual.
  Con una sola key compartida entre clientes, además, no se puede saber cuánto
  gasta cada uno.

**Sugerencia:** una API key de Anthropic por cliente, con límite de gasto propio.
Así el coste por cliente es medible y una filtración se contiene sola.
