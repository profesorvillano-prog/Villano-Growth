# Flujo "Tomador de Decisión / Invitado" — ÉxiTO

> Diseño para capturar, antes de la llamada de cierre, **quién toma la decisión de
> ingreso** y, cuando no es la lead sola, **sumar a esa persona a la reunión** y
> **avisar al equipo**. Nace de la reunión del 05-ago (idea original de Rafa;
> aportes de Josefina, Anaís y Seba). Insumo para configurar en Go High Level.

## El problema que resuelve

Muchas leads no deciden solas: les paga el papá, la pareja, el centro/empresa
donde trabajan, o necesitan decidirlo con el esposo(a). Si eso aparece **recién en
la llamada**, el cierre se cae o se posterga ("lo tengo que hablar con…"). La idea
es **mitigar esa objeción antes de la reunión**: que la lead lo declare, que traiga
a esa persona, y que Rafa/Anaís lleguen a la llamada sabiéndolo.

Los dos objetivos que pidió Seba:
1. **Avisar al equipo** — que Rafa/Anaís sepan, antes de la llamada, que esta lead
   necesita a un tercero y quién es.
2. **"Advertir"/empujar a la lead a marcarlo** — que declare al decisor y, si no es
   ella, que sume su contacto para que asista.

## Decisión de diseño clave: una sola fuente de verdad

Seba preguntó "¿en el survey o en el calendario?". **Recomendación: el formulario
(SOI) es la única fuente de verdad; el calendario solo la refuerza.**

Motivo: si se pregunta en los dos lados, se obtienen respuestas contradictorias y
no queda un campo limpio sobre el cual automatizar. El formulario corre **antes** de
agendar, llena el campo, y todo lo de abajo (alerta a Slack, tarjeta de la
oportunidad, recordatorios, invitación al tercero) se dispara desde ese único campo.

## Cómo evitar la objeción de Anaís ("¿ayuda a cerrar o da excusa para postergar?")

Es tema de **copy**, no de mecánica. No preguntar "¿necesitas permiso de alguien?"
(eso invita al "déjame pensarlo"). Enmarcarlo como **logística del beneficio**:
"¿quién debe estar en la llamada para poder aprovechar el beneficio de ese día?".
Así se presupone la asistencia y se ata al tercero con el **premio**, no con la duda.

---

## Arquitectura en 5 capas

### Capa 1 — La pregunta en el formulario (fuente de verdad)

Se agrega a la carpeta de preguntas de calificación del SOI (donde ya viven los RADIO
de calificación, parentId `6db73LJCE89EOmrXdipg`).

**Campo nuevo — RADIO** — nombre sugerido `tomador_decision`:

> **"Al finalizar esta llamada, si confirmas que la formación es lo que buscas y
> quieres aprovechar los beneficios exclusivos disponibles en la reunión, ¿quién
> debe estar presente para tomar la decisión de ingreso?"**
>
> - Solo yo — tomo la decisión por mi cuenta.
> - Mi pareja / esposo(a).
> - Mis padres o un familiar.
> - El centro / empresa donde trabajo.
> - Otra persona.

**Campo condicional — TEXT/EMAIL** — `email_decisor` (+ opcional `nombre_decisor`),
visible solo cuando la respuesta ≠ "Solo yo":

> **"Para reservar tu cupo y aprovechar el beneficio ese día, agrega el correo de
> esa persona y la sumamos a la llamada."**

Esto cubre el "advertir a la lead de marcarlo": se auto-declara y, cuando no es ella,
se la empuja a entregar el contacto del co-decisor — lo que además la predispone
mentalmente a llevarlo.

### Capa 2 — Campos y scoring

- Contacto: `tomador_decision` (SINGLE_OPTIONS) y `email_decisor` (TEXT).
- Alimentar el `Score Calificación` / `Tier Score` que ya existen: "Solo yo" suma
  (cierre más limpio); "necesita tercero" **no baja tier**, solo marca un flag de
  manejo especial (hay que sumar a alguien más, no es peor lead).

### Capa 3 — Avisar al equipo (el objetivo #1 de Seba)

Dos canales, ordenados por esfuerzo:

- **Ahora / más barato — Alerta a Slack** vía Workflow de GHL.
  - Disparador: formulario enviado (o la oportunidad entra a "Llamada Preparación" /
    "Llamada Confirmada" del pipeline ③ CLOSER).
  - Condición: `tomador_decision ≠ Solo yo`.
  - Acción: mensaje al canal de ventas →
    `⚠️ {nombre} necesita a {tomador_decision} para decidir. Correo del decisor:
    {email_decisor}. Tel: {telefono}.`
  - **Clave:** dispara **solo** para las leads que lo necesitan. Así se resuelve el
    reparo de Anaís ("Rafa tiene que comprometerse a ver el Slack"): en vez de un
    tablero pasivo que hay que revisar, es un **push dirigido** que le llega solo
    cuando es relevante.
- **En la tarjeta del CRM** — escribir también al campo `Resumen Lead` (LARGE_TEXT,
  ya existe en la oportunidad) algo como
  `TOMADOR DE DECISIÓN: pareja — correo: x@x.com`, para que Rafa lo vea en la tarjeta
  del pipeline ③ sin salir del CRM.

### Capa 4 — Sumar al tercero a la llamada (el "invitado")

Cuando `email_decisor` viene con dato:

- Workflow de GHL agrega ese correo como **invitado/asistente adicional** al evento
  de Calendly/GHL, para que el co-decisor reciba el link de la reunión. Este es el
  mecanismo "invitado" que nombraba Seba.
- **Fallback** (si el calendario no deja auto-agregar invitado): mensaje a la lead
  ("Vi que {tomador} te ayuda a decidir — confírmame su correo y lo sumo a la
  reunión para que puedas aprovechar el beneficio del día"). Es la alternativa #2 de
  Rafa. Por correo funciona ya; por WhatsApp requiere **plantilla aprobada por Meta**
  (por eso esta parte espera a la migración a GHL LC — coincide con lo hablado).

### Capa 5 — Recordatorio en el calendario (refuerzo del "advertir")

En la confirmación de reserva y en los recordatorios, cuando decisor ≠ "Solo yo",
inyectar: **"IMPORTANTE: asiste junto a {tomador} — es quien necesitas para decidir
y aprovechar el beneficio del día."** (idea de Josefina).

Como el texto condicional por-invitado de Calendly es limitado, lo más limpio es
disparar los recordatorios **desde GHL** (que ya tiene el campo) y no desde Calendly.

---

## Rollout por fases (respeta lo que acordó el equipo)

| Fase | Qué | Estado / dependencia |
|---|---|---|
| **1 — Ahora** | Pregunta + campo condicional de correo en el formulario | Solo "agregar", sin dependencias (Josefina: "eso es agregar nomás") |
| **2** | Workflow → alerta a Slack + escribir en `Resumen Lead`, solo si necesita tercero | Dirigido, para que Rafa no tenga que escanear Slack |
| **3** | Auto-invitar el correo del decisor al evento + texto condicional en recordatorios | Requiere probar el auto-guest en Calendly/GHL |
| **4** | Follow-up por plantilla de WhatsApp si falta el correo del decisor | Tras migrar a GHL LC (plantillas Meta) |

## Métrica para validar la objeción de Anaís

Comparar, sobre ~3-4 semanas, **tasa de cierre** de:
- leads "Solo yo" vs. "necesita tercero **con** correo entregado" vs. "necesita
  tercero **sin** correo".

Si "con correo entregado" cierra mejor que "sin correo", la mecánica del invitado
está funcionando y conviene reforzar la captura del correo, no quitar la pregunta.

## Resumen de una línea

Una sola pregunta en el formulario define al decisor → si no es la lead, se le pide
el correo del tercero → GHL avisa al equipo (Slack + tarjeta) **solo** en esos casos,
suma al tercero como invitado a la reunión y refuerza en los recordatorios que asista.
