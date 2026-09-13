# Rediseño de automatización v2 — dos números, un solo camino

> Arquitectura objetivo para la subcuenta **Japi Eaters** (`kdmmFxEbJjSpgMtbaZ6F`).
> Consolida los **26 workflows actuales en 11**, resuelve las 17 fallas de la
> auditoría e incorpora los tres cambios pedidos: **segundo número de WhatsApp**,
> **Slack con varios participantes** y **métricas por origen y por rol**.
>
> Contexto y estado actual: [`Auditoria-GHL-Workflows.md`](./Auditoria-GHL-Workflows.md)
> · pasos internos: [`Workflows-Pasos-Internos.md`](./Workflows-Pasos-Internos.md)
> · copy de cada mensaje: [`Guion-WhatsApp-Dos-Numeros.md`](./Guion-WhatsApp-Dos-Numeros.md)
>
> Fecha de diseño: 13-09-2026.

---

## 1. El problema estructural que resuelve

Hoy existen **tres cadenas paralelas** que hacen lo mismo (`[ADS] 1-5`,
`[ORG] 1-5`, `[SETTER-ORG] 1`), porque el **origen de la lead está codificado en
el workflow** en vez de en el contacto. Consecuencias medidas:

- Cada mejora hay que replicarla 3 veces → desfase real (Calificación ADS
  **v53** vs ORG **v26** vs SETTER **v17**).
- Los flujos se quitan etiquetas entre sí (`[ADS] 3` borra `lead-org`,
  `[ORG] 3` borra `lead-ads`) para simular exclusión mutua. Frágil y destruye
  el rastro del origen.
- El origen real se decide por **cuál de los dos calendarios** usó la lead, no
  por quién la trajo. De ahí la confusión del caso "Andrés": llegó por el
  formulario de la biografía y se marcó como lead de la setter.
- Con dos números, esto se multiplica: cada cambio de proveedor de envío habría
  que hacerlo en 3+ workflows.

**El giro:** el origen pasa a ser **un dato del contacto**, escrito una sola vez
al postular y nunca sobrescrito. Entonces una sola cadena sirve para los tres
orígenes, y las ramas por origen quedan solo donde el comportamiento realmente
cambia (canal de Slack y responsable).

---

## 2. Taxonomía: cómo queda "bien marcado" el proceso

### 2.1 El campo que define quién es quién

**Campo nuevo:** `contact.origen` — tipo *Single Options*.

| Valor | Significa | Se escribe cuando |
|---|---|---|
| `ads` | Vino de anuncios de Meta | Envía `[SURVEY - ADS] Postulación ÉxiTO` |
| `org-bio` | Orgánico del link de la biografía (sin intervención humana) | Envía `[SURVEY - ORG] Postulación ÉxiTO` |
| `org-setter` | Orgánico seteado por DM (Valen) | Envía `[SURVEY - ORG SETTER] Postulación ÉxiTO` |

Las tres encuestas **ya existen y ya están separadas** — la señal del origen ya
es limpia en la entrada; lo que faltaba era guardarla en el contacto. Reglas:

- Se escribe **una sola vez**, en el workflow `01`. Ningún otro workflow lo toca.
- Es el campo que responde "¿quién agenda desde bio, desde seteo y desde
  anuncios?" en cualquier reporte, filtro o smart list.
- Los tags `lead-ads` / `lead-org` / `lead-setter-org` se mantienen **solo como
  espejo para segmentos y para la API de Meta**, nunca como fuente de verdad, y
  **ya nadie los quita**.

**Campo nuevo:** `contact.canal_wa` — *Single Options*: `verde` | `morado`.
Marca qué número tiene la conversación en cada momento. Lo escribe el
workflow `04` al hacer el handoff. Sirve para que ningún workflow mande por el
número equivocado y para que Anaís sepa de un vistazo dónde contestar.

### 2.2 Etiquetas, ordenadas por prefijo

Se mantienen los nombres actuales donde ya funcionan (renombrar un tag en GHL
obliga a repuntear cada workflow que lo usa). El orden es por prefijo:

| Grupo | Tags | Quién escribe |
|---|---|---|
| **Origen** (espejo) | `lead-ads`, `lead-org`, `lead-setter-org` | `01` |
| **Survey** | `survey-ads`, `survey-org`, `survey-postulacion` | `01` |
| **Tier** | `tier-gold`, `tier-silver`, `tier-bronce`, `tier-out` | `01` |
| **Descarte** | `no-profesional-salud`, `sin-presupuesto`, `lead-revisar` | `01` |
| **Perfil** | `presupuesto-alto`, `decisor-tercero`, `prospecto-exito`, `curso-avanzado` | `01` |
| **Agenda** | `agenda-ads`, `agenda-org`, `ghost-agenda`, `sin-confirmar`, `confirmada`, `re-agendada` | `02`, `03`, `06` |
| **Llamada** | `video-enviado`, `en-closer`, `asistio`, `no-show` | `04`, `08` |
| **Venta** | `reserva-pagada` | `08` |
| **Canal** | `wa-verde`, `wa-morado` | `04` |

Cambios concretos:
- `bronce+ revisar` **se elimina** (nadie lo escribe, nombre con espacio).
- `decisor-tercero` **empieza a escribirse** en `01` cuando la respuesta de
  "¿quién debe estar contigo en la reunión?" no es "solo yo" — hoy el tag
  existe pero ningún workflow lo usa (era el propósito de la rama duplicada
  F-14).
- El tag suelto `wa: +56962427929` se reemplaza por `wa-morado`.

### 2.3 Un solo calendario

Hoy hay dos calendarios idénticos (`[A]` para ads y `[ORG]` para orgánico) con
**páginas de destino distintas**, y las cadenas de confirmación se disparan por
`In calendar`. Con el origen en el contacto, eso deja de ser necesario:

- **Un calendario:** `Entrevista de Admisión · ÉxiTO` (45 min, sin
  reprogramación ni cancelación propia, igual que hoy).
- **Una página de destino** post-agenda.
- El origen ya no depende del link que recibió la lead.

Esto elimina la asimetría de filtros (F-17) y la posibilidad de que una lead
ejecute el flujo del origen equivocado.

---

## 3. Los 11 workflows

De 26 a 11. Nomenclatura: `NN · Nombre [canal]`, numerada por orden del
recorrido, sin prefijo de origen.

### `01 · Calificación (Survey → Tier + Origen)`
**Reemplaza:** `[ADS] 1`, `[ORG] 1`, `[SETTER-ORG] 1` *(v53 / v26 / v17)*
**Disparadores:** los 3 *Survey submitted*, uno por encuesta.
**Pasos:**
1. Según la encuesta: escribe `origen` (`ads` / `org-bio` / `org-setter`) + el
   tag espejo + `survey-*`.
2. **Asigna responsable:** `org-setter` → Valen; los otros dos → Anaís.
   *(Absorbe los workflows `Asignación Anaís/Rafa`, que apuntan a la estructura
   vieja de mayo — F-4.)*
3. If/else **¿profesional de salud?** → si no: `tier-out` +
   `no-profesional-salud` → fin.
4. If/else **nivel de inversión** → 4 ramas de tier. Cada rama: crea la
   oportunidad en `② Agenda · WhatsApp`, etapa `Calificada (Formulario)`
   (la de `tier-out` en `Descalificada`, **con etapa explícita** — F-10),
   escribe `Tier Score` + `Producto Recomendado`, tags del tier.
5. Marca `decisor-tercero` si la decisión no es solo de ella.
6. Slack: un solo mensaje al canal del tier (ver §5), con el origen en el texto.

**Ganancia:** una sola versión que mantener. El if/else del tier deja de estar
triplicado.

### `02 · Ghost de agenda [verde]`
**Reemplaza:** `[ADS] 2`, `[ORG] 2`
**Disparadores:** tag añadido `tier-gold`, `tier-silver` **y `tier-bronce`**
(hoy el orgánico no dispara con bronce: esos leads no reciben nada — F-12).
**Pasos:**
1. Si `origen = org-setter` → fin *(Valen hace el ghosting a mano por DM; era
   la decisión del 25-08)*.
2. Espera 10 min → si no agendó: tag `ghost-agenda`, mueve a
   `Sin Agendar (Ghost)`, envía **V1** (plantilla `v3_equipo_ghost_1`).
3. Espera 4 h → si no agendó: **V2** (`v3_equipo_ghost_2`).
4. Espera hasta el día siguiente → si no agendó: **V3** (`v3_equipo_ghost_3`),
   y al cerrar el día marca la oportunidad `lost` con motivo *ghosting*.
5. **Meta de salida (goal):** cita agendada → sale del flujo en cualquier punto.

**Ganancia:** plantillas propias con voz de equipo (hoy el orgánico manda
`ghost_agenda_ads`, la del flujo de pago — F-13), tres toques en 36 h en vez de
seguimiento indefinido, y los bronce orgánicos por fin entran.

### `03 · Bienvenida Josefina + Confirmación [verde]`
**Reemplaza:** `[ADS] 3`, `[ORG] 3` *(v37 cada uno)*
**Disparador:** *Customer booked appointment* en el calendario único.
**Pasos:**
1. Mueve a `Nueva Agenda`, tag `agenda-*` según origen. **Ya no quita tags del
   otro origen.**
2. If/else **¿primera vez o re-agenda?** (por `video-enviado`).
3. Primera vez → **A1** (plantilla con botón "Ver vídeo"), **A2** a los 2 min
   sin clic, **A3** al clic (vídeo + botones Confirmo/Cancelar).
4. Rama `Cancelar` → **A4**, mueve a `Re-Agendar (Cancelada)`.
5. Rama `Confirmo` → **A5**, tag `confirmada`, mueve a `Confirmada (Agenda)`.
6. Rama `Time Out` / `Undelivered` → tag `sin-confirmar` + **tarea al morado**
   para el rescate manual a los 45 min (F-2), y aviso a Slack.

**Se elimina** el if/else `No toma decisión`, cuyas dos ramas ejecutaban
secuencias idénticas (F-14). Lo que sí aporta esa pregunta pasa a `01` como tag
`decisor-tercero`.

### `04 · Handoff a morado + Levantamiento [morado]`
**Nuevo** (separa lo que hoy hace la cola de `[ADS] 3`).
**Disparador:** tag `confirmada` añadido.
**Pasos:**
1. Escribe `canal_wa = morado`, tag `wa-morado`, quita `wa-verde`.
2. Espera 5 min → **M1** desde el morado (texto libre, sin plantilla).
3. Espera 5 seg → **M2**.
4. Slack al canal de agendas con: nombre, **origen**, tier, hora de la llamada y
   la respuesta del survey que define la pregunta M4.
5. Crea **tarea** para Anaís: "Levantamiento M3-M6 + pegar Resumen Lead".

**Por qué separado:** el morado es una app externa, no plantillas. Tener su
primer contacto en su propio workflow permite cambiar el proveedor del morado
sin abrir el flujo de confirmación del verde.

### `05 · Recordatorios [verde + morado]`
**Reemplaza:** `[ADS] 4`, `[ORG] 4`
**Disparador:** tag `confirmada` (no la agenda cruda: hoy los recordatorios
salen aunque la lead nunca confirmara).
**Pasos:** 24 h antes → mueve a `Pre-Llamada (Preparación)` + Slack
(recordatorio de grabar el vídeo personalizado) + **M8** desde el verde
(plantilla con un único botón de confirmar) · mañana del día → **M9** desde el
morado · 15 min antes → **M10** desde el morado · 35 min antes → Slack al canal
del closer, **mencionando al closer, no por DM**.

### `06 · Cancelación / Re-agenda → frenar y reordenar`
**Reemplaza:** `[ADS] 4.1`, `[ORG] 4.1` *(los dos congelados desde el 26-06)*
**Disparador:** *Appointment status* = `cancelled`, `Event type = Any`
(hoy el orgánico filtra `Normal` y se le escapan casos).
**Pasos:**
1. Saca del workflow `05` **y del `03`** (hoy solo frena los recordatorios).
2. Mueve la oportunidad a `Re-Agendar (Cancelada)`, tag `re-agendada`, quita
   `confirmada`.
3. Slack al canal de conflictos.

**Ganancia:** hoy una cita cancelada se queda en su etapa activa hasta que
alguien la mueve a mano, y la cadena de confirmación sigue viva (F-3).

### `07 · Handoff a Closer`
**Reemplaza:** `[Handoff] 5` *(v31)*
**Disparador:** etapa `Llamada Confirmada` en `② Agenda · WhatsApp`.
**Pasos:**
1. Crea la oportunidad en el **pipeline nuevo del closer** (§4), etapa
   `Llamada Confirmada`, arrastrando `Monto Propuesto`.
2. **Marca la oportunidad del pipeline de Anaís como `won`** y la deja ahí.
   *(Hoy se borran **todas** las oportunidades del contacto en el pipeline de
   origen — F-15. Eso destruye el histórico de conversión por etapa, que es
   justamente la base de las métricas que se quieren montar.)*
3. Tag `en-closer`, Slack al canal de confirmaciones.

### `08 · Post-llamada`
**Reemplaza:** `1 · Asistió`, `2 · No-Show + recuperación`, `3 · Re-agendada`,
`4 · Reserva pagada` *(los 4 del 25-08)*
**Disparador:** cambio de etapa en el pipeline del closer.
**Ramas:** `Asistió` → tag + seguimiento · `No-Show` → tag + secuencia de
recuperación desde el morado · `Re-Agendada` → vuelve a `03` · `Reserva (Por
Pagar)` → tag `reserva-pagada` + dispara onboarding + Slack de cierres.

*Un workflow con un switch por etapa en vez de cuatro que comparten la mitad de
los pasos.*

### `09 · Meta CAPI (4 eventos)`
**Reemplaza:** los 4 workflows `Envío [...]`
**Pasos:** un workflow, cuatro disparadores, un if/else por evento —
`InitiateCheckout` (survey calificado), `Lead` (agenda), `Schedule`
(confirmación), `Purchase` (venta).
**Dos correcciones obligatorias:**
- **Fuera los `Wait 9999 days`** (hoy retienen 215 contactos dentro de los
  workflows; si no permiten re-entrada, una lead que re-agenda ya no vuelve a
  emitir `Schedule` y la campaña optimiza con datos incompletos — F-11).
  Se reemplazan por *Remove from workflow*.
- **`Purchase` con valor real** leído de `Monto Propuesto`, no los `1.500 USD`
  fijos de hoy (F-16).

### `10 · IG Nuevo Seguidor (ManyChat)` — se mantiene como está.
### `11 · Onboarding Venta High Ticket` — se mantiene; lo dispara `08`.

**Se apagan y archivan:** los dos `4.1`, `Asignación Anaís`, `Asignación Rafa`,
el draft `New Workflow : 1788364837592` y `[General] WF-01 Entrega de Regalo`
(o se integra a `08` si el regalo sigue vigente).

---

## 4. Pipelines

### El nuevo pipeline del closer

Se crea uno nuevo por el cambio de closer. **Sin nombre propio en el título** —
el actual se llama `③ Llamadas · Closer [Rafa]` y cada cambio de persona obliga
a renombrar el pipeline y repuntear los workflows que lo referencian.

**`③ Llamadas · Closer`** — etapas y probabilidad de cierre:

| # | Etapa | Prob. | Rol |
|---|---|---|---|
| 1 | Llamada Confirmada | 20 % | entrada (la escribe `07`) |
| 2 | Asistió | 40 % | camino lineal |
| 3 | Reserva (Por Pagar) | 75 % | camino lineal |
| 4 | **Cerrada (Venta)** | 100 % | won |
| 5 | No-Show | 5 % | estado lateral |
| 6 | Re-Agendada | 15 % | estado lateral |
| 7 | Seguimiento (Asistentes) | 25 % | estado lateral |

**Regla de las probabilidades:** las etapas 1-4 son el camino y suben de forma
monótona; las 5-7 son estados laterales con la probabilidad real de recuperar.
Hoy muchas etapas tienen `33.33 %` (el reparto por defecto) y en el pipeline
`[SETTER - ORG]` "Descalificada" figura con **90,91 %** — con eso cualquier
forecast o gráfico de GHL miente (F-7).

### Los otros pipelines

| Pipeline | Qué se hace |
|---|---|
| `① Instagram · Setter` | Se mantiene. Quitar `[Valen]` del nombre por la misma razón. |
| `② Agenda · WhatsApp` | Se mantiene (es el unificado). Quitar `[Anaís]`. Normalizar probabilidades. |
| `④ [VENTAS] Cobros` | Se mantiene. |
| `[SETTER - ORG] Formación` | **Se apaga.** Declarado obsoleto el 25-08 y sigue recibiendo escrituras de 5 etapas distintas; mientras exista, la misma lead puede vivir en dos pipelines (F-5). Migrar las oportunidades abiertas a `②` antes de apagarlo. |

---

## 5. Slack para varios participantes

Hoy hay **9 canales** con duplicados y los avisos críticos van por **DM**, que
no escala a un equipo con director comercial: nadie más los ve.

| Problema actual | Arreglo |
|---|---|
| `1-leads-conflicto` (privado) **y** `leads-conflictos` (público) | Un solo `#leads-conflictos` |
| `6-confirmaciones-llamadas` (público) **y** `5-confirmaciones-llamadas` (privado, del difunto `[ORG] 5`) | Un solo `#confirmaciones-llamadas` |
| Mezcla de canales públicos y privados para lo mismo (`5-llamadas-preparacion` es público en ADS y privado en ORG) | Todos públicos dentro del workspace |
| Aviso de 35 min antes de la llamada **por DM al closer** | Mensaje al canal **mencionando** al closer |
| Aviso de lead fuera de flujo **por DM a la setter** | Mensaje a `#leads-conflictos` con mención |

**Set final de canales:**

| Canal | Qué llega | Quién lo lee |
|---|---|---|
| `#leads-gold` / `#leads-silver` / `#leads-bronce` | Cada postulación calificada, **con el origen en el texto** | Anaís, Seba, dirección |
| `#nuevas-agendas` | Agenda tomada + origen + tier + hora | Anaís, closer, Seba |
| `#llamadas-preparacion` | 24 h antes: hay que grabar el vídeo | Josefina, Anaís |
| `#confirmaciones-llamadas` | Lead lista y pasada al closer + Resumen Lead | Closer, Seba |
| `#cierres` | Reserva pagada / venta cerrada | Todos |
| `#alertas-pagos` | Pago fallido, cuota vencida | Seba, Anaís |
| `#leads-conflictos` | Fuera de flujo, no entregado, cancelaciones | Anaís, Seba |

**La regla que hace esto escalable:** los workflows notifican **a canales por
función, nunca a personas**. Sumar a Seba, a un closer nuevo o a quien venga no
requiere tocar un solo workflow — se lo agrega al canal.

---

## 6. Métricas

### Los "won" por rol (ya definidos el 25-08, ahora medibles)

| Rol | Su "won" | Dónde se lee |
|---|---|---|
| Setter IG | `Agendada` | pipeline `①` |
| Anaís (verde + nutrición morado) | `Llamada Confirmada` | pipeline `②` |
| Closer | `Cerrada (Venta)` | pipeline `③` |

### Las tasas del embudo, cortables por origen

Con `contact.origen` en el contacto, **cada una de estas tasas se puede abrir por
`ads` / `org-bio` / `org-setter`** — que es exactamente lo que hoy no se puede
saber:

| Tasa | Numerador / denominador |
|---|---|
| Calificación | postulaciones con tier ≠ out / postulaciones |
| Agenda | agendas / postulaciones calificadas |
| Confirmación | `confirmada` / agendas |
| Show | `asistio` / llamadas confirmadas |
| Cierre | `Cerrada (Venta)` / `asistio` |
| Cobro | `Venta Total` / reservas pagadas |

### Lo que hay que arreglar **antes** de montar el dashboard

1. **No borrar oportunidades en el handoff** (`07`) — sin eso no hay histórico
   por etapa que medir.
2. **Normalizar las probabilidades** de todas las etapas (§4).
3. **Apagar `[SETTER - ORG] Formación`** — mientras dos pipelines reciban la
   misma lead, cualquier agregado cuenta doble.
4. **Quitar los `Wait 9999 days`** — además de retener contactos, falsean el
   conteo de "activos" en cada workflow.

Hecho eso, las cifras internas y los eventos de Meta (`09`) leen los mismos
movimientos de etapa, y CRM y campañas cuentan lo mismo.

---

## 7. Orden de implementación

Se construye en paralelo a lo que está vivo y se corta por tramos. Nada se
borra hasta que su reemplazo corre.

**Tramo 0 · Preparar (no rompe nada)**
- [ ] Crear campos `origen` y `canal_wa`.
- [ ] Crear el pipeline `③ Llamadas · Closer` nuevo con sus 7 etapas.
- [ ] Crear las 3 plantillas `v3_equipo_ghost_*` y enviarlas a aprobación
      (WhatsApp tarda; es el camino crítico).
- [ ] Conectar el número morado en GHL y verificar que envía texto libre.
- [ ] Consolidar los canales de Slack y sumar a Seba.

**Tramo 1 · Entrada**
- [ ] Construir `01` con los 3 disparadores. Publicar y **pausar** los tres
      workflows de calificación viejos (no borrarlos).
- [ ] Verificar en 3 postulaciones de prueba (una por origen) que `origen`
      queda escrito y el Slack correcto llega.

**Tramo 2 · Ghost**
- [ ] Construir `02` cuando las plantillas estén aprobadas. Pausar `[ADS] 2` y
      `[ORG] 2`.

**Tramo 3 · Agenda y confirmación** *(el tramo delicado)*
- [ ] Crear el calendario único y repuntear la landing.
- [ ] Construir `03`, `04`, `05`, `06`. Publicarlos juntos el mismo día.
- [ ] Pausar `[ADS] 3/4/4.1` y `[ORG] 3/4/4.1`.
- [ ] Probar el camino completo con un contacto propio, incluido el rescate del
      botón a los 45 min.

**Tramo 4 · Closer**
- [ ] Construir `07` apuntando al pipeline nuevo, **sin el borrado**.
- [ ] Construir `08`. Pausar los 4 workflows del 25-08.
- [ ] Migrar las oportunidades vivas del pipeline viejo del closer al nuevo.

**Tramo 5 · Limpieza**
- [ ] Construir `09` sin los `Wait 9999 days` y con valor real.
- [ ] Migrar oportunidades abiertas de `[SETTER - ORG] Formación` a `②` y
      apagar ese pipeline.
- [ ] Normalizar probabilidades de etapa.
- [ ] Borrar el draft huérfano y el tag `bronce+ revisar`.
- [ ] Archivar los workflows pausados.

### Verificaciones pendientes que conviene hacer en el Tramo 0

Del cruce entre el relevamiento del 24-08 y la API del 13-09 quedaron cuatro
cosas por confirmar en la interfaz (detalle en la auditoría, §9):

1. ¿`[ADS] 1` sigue creando la oportunidad **sin etapa**? (el edit del 25-08
   pudo corregirlo)
2. `[ORG] 5` ya no existe: ¿`[Handoff] 5` cubre hoy el caso orgánico, o las
   leads orgánicas confirmadas **no están llegando al closer**?
3. ¿Los flujos `[ORG]` siguen escribiendo en `[SETTER - ORG] Formación` o ya se
   repuntearon al pipeline `②`?
4. Qué es el draft del 02-09.

La 2 es la más urgente: si nadie cubrió el hueco, hay leads orgánicas
confirmadas que no aparecen en el pipeline del closer.

---

## 8. Resumen del rediseño

| | Antes | Después |
|---|---|---|
| Workflows | 26 (25 publicados + 1 draft) | 11 |
| Cadenas paralelas | 3 (ADS / ORG / SETTER) | 1, con ramas por `origen` |
| Pipelines | 5 (uno obsoleto y vivo) | 4 |
| Calendarios | 2 idénticos con destinos distintos | 1 |
| Canales de Slack | 9, con duplicados y DMs | 7, por función, sin DMs |
| Números de WhatsApp | 1 (plantillas para todo) | 2 (verde automático / morado libre) |
| Origen de la lead | implícito en el workflow y el calendario | **campo del contacto** |
| Fallas abiertas | 17 | 0 (las 17 tienen su arreglo asignado arriba) |
