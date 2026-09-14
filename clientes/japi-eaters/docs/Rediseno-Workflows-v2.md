# Rediseño de automatización v2 — dos números, un solo camino

> Arquitectura objetivo para la subcuenta **Japi Eaters** (`kdmmFxEbJjSpgMtbaZ6F`).
> Consolida los **26 workflows actuales en 14** (11 piezas, de las cuales `01` son 3 entradas mínimas + 1 motor), resuelve las 17 fallas de la
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

**Campo creado** (13-09-2026): `contact.origen` — *Single Options*, ID
`6BPeLlDeqrGMVxki3Q3c`, opciones `ads` · `org-bio` · `org-setter`.

### La regla: el origen es la encuesta que llenó

| Valor | Encuesta | Canal real |
|---|---|---|
| `ads` | `[SURVEY - ADS]` (`fB7k42z4Jr8ZRNmG3WX1`) | Anuncios de Meta |
| `org-bio` | `[SURVEY - ORG]` (`99dHSXOPhwj6kFpE7TOy`) | Link de la biografía de Instagram |
| `org-setter` | `[SURVEY - ORG SETTER]` (`kwuMWA1b5FXattZtwLu0`) | DM de Instagram, seteado por Valen |

**Decisión del cliente (14-09):** *bio y setter son orgánicas de Instagram, por
lo tanto no se envía conversión a Meta por ellas.* Aunque la persona haya
tocado un anuncio en algún momento, si llegó por el link de la bio o por DM, la
venta no se le atribuye a la campaña. Es una política de atribución de primer
toque orgánico, y es la que manda sobre cualquier señal de UTM.

En consecuencia: **solo `origen = ads` dispara eventos a Meta** (workflow `09`).

### El UTM no enruta: avisa

Los UTM de Facebook que aparecen en postulaciones de bio y setter **no cambian
el origen**. Son el síntoma de un problema de plumbing —un anuncio apuntando a
una página orgánica— y se arreglan en Meta, no en el workflow. Distorsionar la
atribución para compensar un anuncio mal apuntado sería tapar el problema.

Lo que sí hace el workflow es **avisar**: si una postulación de bio o setter
llega con `attributionSource.utmSource` = Facebook, se le pone el tag
`revisar-origen` y se manda un aviso a `#leads-conflictos`. Así el anuncio mal
apuntado se detecta el mismo día, en vez de descubrirse en una auditoría.

*(Contexto de por qué importa: al 13-09, dos páginas orgánicas estaban
recibiendo tráfico pagado — ver F-18 en la auditoría. El arreglo es repuntear
esos anuncios; el tag es el detector para que no vuelva a pasar sin que nadie
se entere.)*

Reglas de uso:
- Se escribe **una sola vez**, en el workflow de entrada. Ningún otro lo toca.
- Es el campo que responde "¿quién agenda desde bio, desde seteo y desde
  anuncios?" en cualquier reporte, filtro o smart list.
- Los tags `lead-ads` / `lead-org` / `lead-setter-org` se mantienen como espejo
  para segmentos, y **ya nadie los quita**.

**Campo descartado** (14-09-2026): `contact.canal_whatsapp` y los tags
`wa-verde` / `wa-morado`. Se crearon el 13-09 para marcar qué número tiene la
conversación, pero **era información duplicada**: todo lo anterior a la
confirmación es verde y todo lo posterior es morado, así que el tag
`confirmada` y la etapa del pipeline ya lo dicen. Un dato duplicado es un dato
que algún día se contradice — el mismo error que `lead-ads` duplicando a
`origen`.

Quedan creados en la subcuenta pero **ningún workflow los escribe ni los lee**.
Si en la Ola 3 aparece un workflow que de verdad necesite ramificar por canal,
se retoman ahí con un motivo concreto.

### IDs de las tres encuestas

| Encuesta | ID |
|---|---|
| `[SURVEY - ADS] Postulación ÉxiTO en Alimentación` | `fB7k42z4Jr8ZRNmG3WX1` |
| `[SURVEY - ORG] Postulación ÉxiTO en Alimentación` | `99dHSXOPhwj6kFpE7TOy` |
| `[SURVEY - ORG SETTER] Postulación ÉxiTO en Alimentación` | `kwuMWA1b5FXattZtwLu0` |

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
| ~~**Canal**~~ | ~~`wa-verde`, `wa-morado`~~ — **descartados el 14-09**, ver §2.1 | — |

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

### `01 · Calificación (Survey → Tier + Origen)` — 3 entradas + 1 motor
**Reemplaza:** `[ADS] 1`, `[ORG] 1`, `[SETTER-ORG] 1` *(v53 / v26 / v17)*

⚠️ **Son 4 workflows, no 1.** Un workflow con los tres disparadores de encuesta
no puede saber **cuál** se disparó (GHL no ofrece esa condición en un if/else).
Por eso: **`01a/01b/01c`** — tres entradas mínimas de 4 nodos que solo resuelven
el origen — y **`01`**, el motor compartido con toda la lógica de tier,
oportunidad, asignación y Slack. La lógica de calificación vive **una sola vez**,
que es el objetivo. Nodo por nodo en
[`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md).

**Disparadores:** una encuesta por entrada; el motor no tiene disparador (se
entra por *Add to Workflow*).
**Pasos:**
1. **Escribe `origen` según la encuesta que disparó** (§2.1) + el tag espejo +
   `survey-*`. Si es bio o setter y trae UTM de Facebook, además tag
   `revisar-origen` y aviso a Slack — pero el origen **no cambia**.
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
**Tres correcciones obligatorias:**
- **Filtrar por `origen = ads`**, no por el tag `lead-ads`. Un solo campo
  decide qué va a Meta y qué no, en vez de un tag que hoy se agrega y se quita
  en cuatro workflows distintos. Bio y setter **nunca** emiten eventos, por
  decisión de atribución (§2.1).
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

> **El orden bueno es por dependencia, no por embudo.** Está desarrollado en
> [`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md): 4 olas, donde
> la Ola 1 (medición) no depende de nada externo y se puede construir hoy. Los
> tramos de abajo quedan como vista de conjunto.

Se construye en paralelo a lo que está vivo y se corta por tramos. Nada se
borra hasta que su reemplazo corre.

**Tramo 0 · Preparar (no rompe nada)**
- [x] **Crear campos `origen` y `canal_whatsapp`** — hechos vía API el 13-09
      (IDs en el apéndice).
- [x] **Crear los tags `wa-verde` y `wa-morado`** — hechos vía API el 13-09.
- [ ] Crear el pipeline `③ Llamadas · Closer` nuevo con sus 7 etapas.
      *(La API de GHL es de solo lectura para pipelines: va a mano o con Cowork.)*
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
| Workflows | 26 (25 publicados + 1 draft) | 14 (11 + las 3 entradas de `01`) |
| Cadenas paralelas | 3 (ADS / ORG / SETTER) | 1, con ramas por `origen` |
| Pipelines | 5 (uno obsoleto y vivo) | 4 |
| Calendarios | 2 idénticos con destinos distintos | 1 |
| Canales de Slack | 9, con duplicados y DMs | 7, por función, sin DMs |
| Números de WhatsApp | 1 (plantillas para todo) | 2 (verde automático / morado libre) |
| Origen de la lead | implícito en el workflow y el calendario | **campo del contacto** |
| Fallas abiertas | 17 | 0 (las 17 tienen su arreglo asignado arriba) |

---

## Apéndice · Referencia de IDs (para construir sin buscar nada)

Extraído de la API el 13-09-2026. Subcuenta `kdmmFxEbJjSpgMtbaZ6F`.

### Campos de contacto

| Campo | `fieldKey` | ID |
|---|---|---|
| **Origen** *(nuevo)* | `contact.origen` | `6BPeLlDeqrGMVxki3Q3c` |
| **Canal WhatsApp** *(nuevo)* | `contact.canal_whatsapp` | `2m5LCiZU1GdyVH8eHrFz` |
| Tier Score | `contact.tier_score` | `ZpyBSzUwLysbwhKkF6ww` |
| Producto Recomendado | `contact.producto_recomendado` | `JnAAbkVyXU4frtCtbAWR` |
| Monto Propuesto | `contact.monto_propuesto` | `Fb2CCt2anNsBx2ESfAEb` |
| Resumen Lead | `contact.resumen_lead` | `KEKLIuzK50uXmwTmPen2` |
| UTM Source | `contact.utm_source` | `4WclkU2LKhl1XocdWvET` |
| UTM Campaign | `contact.utm_campaign` | `82tBJ6RMlUerPKSPh52K` |
| Usuario Instagram | `contact.usuario_instagram` | `39e2cfOnKICfdNm5zWYR` |

### Preguntas del survey (para los if/else)

| Pregunta | ID |
|---|---|
| ¿Cuál es tu profesión? | `GnqxLlgs46jSBMT0rQsJ` |
| ¿Cuánto tienes pensado invertir? | `KhN6Lbj24y9ru2GGtkFd` |
| ¿Quién debe estar contigo en la reunión? | `TjRDcKidBqPeykkkWhPo` |
| ¿Con qué situación te identificas más hoy? *(define la pregunta M4)* | `oSC7ggX3Sr9iQ6dQzKGT` |
| ¿Qué es lo que más buscas lograr? | `XwPIBvpxo5qZImKTsnce` |
| ¿Estás lista para invertir? | `eofAKe7GCo8o0UW1iXTV` |
| ¿Puedes confirmar lo anterior? | `nbNt7jUS21t8xqDIJSCs` |
| Cuéntanos más de tu caso *(texto libre)* | `4nUxQ3qviHjMFinq3Dfq` |

### Pipeline `② Agenda · WhatsApp` — `puyQKiA3cuYzADHpbgcr`

| Etapa | ID |
|---|---|
| Calificada (Formulario) | `00332a6b-f818-4b9f-8bab-259e627e9f98` |
| Sin Agendar (Ghost) | `69e32901-a38d-4591-a3f6-0b0c3cdab940` |
| Follow Up 1 | `a08578c7-9aa5-4c87-9ca6-aa259135f421` |
| Follow Up 2 | `5f928413-b941-45aa-aa3a-3ec5b31f13d8` |
| Follow Up 3 | `26d49032-199d-4fd2-9fcd-1b5e572faad5` |
| Nueva Agenda | `f0a84d2b-8df8-4c34-b91d-e3a104d89b32` |
| Sin Confirmar (Agenda) | `73ddbd14-0743-4740-8d01-3aaa4723193c` |
| Confirmada (Agenda) | `65cf36f2-b55f-40e6-81c1-ac653dfa94a2` |
| Diagnóstico | `c7a609f0-4169-439a-a016-addba89e519a` |
| Pre-Llamada (Preparación) | `5a9b20ca-6ddb-4ac6-9591-f33801908379` |
| Llamada Confirmada | `6414b758-a8fd-4795-91f1-de4f0a147bcb` |
| Re-Agendar (Cancelada) | `e9f50af0-17e8-475d-8c76-32289aaba4c3` |
| Re-Contacto (Interesada) | `2828cf59-fe10-463f-972a-1159afcd89de` |

### Otros pipelines

| Pipeline | ID |
|---|---|
| ① Instagram · Setter | `ZJbdlB7FnM3V5YY5BiDG` |
| ③ Llamadas · Closer *(el viejo, se reemplaza)* | `J61MmwBX4mGAl7W1jCpz` |
| ④ [VENTAS] Cobros | `vpq6pgz5Ht93tdBMImOC` |
| [SETTER - ORG] Formación *(a apagar)* | `XoejslKD0GHwUWSxujbs` |

### Calendarios y páginas

| Recurso | ID / URL |
|---|---|
| Calendario `[A]` (ads) | `NwjgigzvJK9qcrjizbFn` |
| Calendario `[ORG]` | `MiDJPvkZrUk3nhVrrYvw` |
| Calendario `Curso Avanzado` | `f6zX7ITk863lH93BqBJ9` |
| Landing de postulación ADS | `japieaters.app/postulacionexito-884187` |
| Landing de postulación ORG | `japieaters.app/postulacionexitoenalimentacion` ⚠️ recibe pagado (F-18) |

### Meta

| Recurso | Valor |
|---|---|
| Dataset / Pixel ID | `1372444847951383` |
| Campañas activas vistas en atribución | `[CBO] Escalado ÉxiTO`, `[ABO] Testeo ADS Éxito`, `[CBO] RMKT Pixel Web - IG - FB` |

### Plantillas de WhatsApp en uso (número verde)

`ghost_agenda_ads` · `v2_confirmar_jose` · `wa_confirmacion_agenda_organica` ·
`wa_recordatorio_24h` · `wa_recordatorio_8h` · `wa_recordatorio_1h`

**A crear:** `v3_equipo_ghost_1`, `v3_equipo_ghost_2`, `v3_equipo_ghost_3`
