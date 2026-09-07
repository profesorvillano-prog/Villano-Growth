# Integración Nexor ↔ GHL ↔ Medilink — Teraxcel

> **Qué resuelve este documento:** el cableado técnico del sistema — el contrato
> de estados que Nexor devuelve, los webhooks entre las tres piezas, desde dónde
> salen los eventos a Meta y el checklist concreto de las tres guías de Nexor.
>
> El pipeline que este cableado alimenta está en
> [`Pipeline-CRM.md`](./Pipeline-CRM.md).

---

## 1. El stack y quién habla con quién

```
                 leads · formulario · estados
  GoHighLevel ◄──────────────────────────────► Nexor AI
      │                                           │
      │ Conversions API                           │ agenda (crear cita,
      │ (plan B, ver §4)                          │ leer asistencia)
      ▼                                           ▼
    Meta  ◄· · · · · · · · · · · · · · · · ·  Medilink
           eventos (plan A, si su API lo         │
           permite — nunca se ha usado)          ▼
                                          bots internos
                                          ("recepción") — pacientes
                                          ya en tratamiento
```

| Conexión | Qué viaja | Estado |
|---|---|---|
| GHL → Nexor | Lead nuevo + respuestas del formulario + `canal_origen` | A configurar (Guía 3) |
| Nexor → GHL | Los **5 estados** (§2) + `expectativa_precio`, `disponibilidad_declarada`, `id_cita_medilink` | A configurar (Guía 3) |
| Nexor ↔ Medilink | Crear cita en horas disponibles · leer asistencia | La monta Nexor; confirmar alcance con ellos |
| GHL o Medilink → Meta | Eventos de conversión calificados | **Decisión abierta** — ver §4 |

**Regla de dirección única:** el estado de cada lead lo declara **Nexor** y el
CRM lo refleja. Nadie mueve tarjetas a mano en las etapas 1–7 (la 8 puede entrar
por el dato de pago de la clínica). Si el CRM y Nexor discrepan, manda Nexor y
hay un bug que reportar — no una tarjeta que corregir.

---

## 2. El tablero de Nexor y el contrato de estados

### El tablero: de las etapas genéricas a las de Teraxcel

Nexor trae un tablero por defecto (*Nuevo · Contactado · En Conversación ·
Calificado · Reunión Agendada · Completado · No Interesado · Descartado*). Para
Teraxcel queda así — dos renombres y dos columnas nuevas, el resto no se toca:

| Etapa actual en Nexor | Queda como | Cambio |
|---|---|---|
| Nuevo | Nuevo | — |
| Contactado | Contactado | — (el bot abrió conversación, aún sin respuesta) |
| En Conversación | En Conversación | — (calificando: intención, precio, disponibilidad) |
| Calificado | Calificado | — (doble filtro aprobado, ofreciendo horas de Medilink) |
| Reunión Agendada | **Evaluación Agendada** | ✏️ renombre — cita creada en Medilink |
| Completado | **Evaluación Realizada** | ✏️ renombre — llegó presencial a la clínica |
| — | **Pasó a Tratamiento** | ➕ nueva — **la columna del objetivo.** Sin ella, el tablero mide agendas, que es el error de la agencia anterior |
| — | **No Asistió** | ➕ nueva — agendó y no llegó. **No es terminal:** el bot reagenda (3 intentos / 10 días) y la tarjeta vuelve a *Evaluación Agendada* o cae a terminal |
| No Interesado | No Interesado | — terminal: el "no" nació en la conversación con Nexor o después (descalificado por el bot, se enfrió, no-show agotado, no tomó tratamiento). Siempre con motivo |
| Descartado | Descartado | — terminal: murió antes de conversar (spam, número inválido, duplicado, jamás respondió, o **rechazado por el formulario**) |

### Configuración de columnas: probabilidad y color

La *probability* es "chance de llegar a tratamiento desde aquí" — alimenta el
forecast del pipeline, así que decrece hacia atrás del embudo. Valores
iniciales (sin línea base; **recalibrar a las 4–6 semanas** con las tasas
reales):

| Etapa | Probability | Color | Lógica |
|---|---|---|---|
| Nuevo | 5 % | Gris claro | Nada demostrado aún — neutro a propósito |
| Contactado | 10 % | Celeste / cian | El bot escribió, sin respuesta |
| En Conversación | 15 % | Azul claro | ~50 % calificará |
| Calificado | 30 % | Azul oscuro / teal | Doble filtro ok; ~85 % agenda |
| Evaluación Agendada | 35 % | Morado | Asistencia ~70 % × cierre ~50 % |
| Evaluación Realizada | 50 % | Verde claro | En la silla; ~50 % toma tratamiento |
| Pasó a Tratamiento | 100 % | Verde oscuro | Ganado |
| No Asistió | 10 % | Naranja | Recuperable vía reagenda |
| No Interesado | 0 % | Rojo | Terminal con motivo — **sí** aparece en reportes |
| Descartado | 0 % | Gris oscuro | Ruido — **apagar "show in reports"** |

Colores en lógica semáforo: azules = proceso, morado = comprometido con cita,
verdes = llegó/ganó, naranja = alerta recuperable, rojo = perdido honesto,
gris = ruido excluido.

**La distinción entre las tres columnas "negativas" importa** porque cada una
manda a un lugar distinto:

- **No Asistió** → todavía es plata invertida recuperable: el bot lo trabaja.
- **No Interesado** → un "no" honesto de una persona real: alimenta el desglose
  de motivos (¿precio? ¿intención? ¿no tomó tratamiento?) con el que se ajusta
  pauta y formulario, y la secuencia de reactivación futura.
- **Descartado** → ruido: se excluye de todas las métricas. Si "Descartado" se
  usa como cajón de sastre para los "no", el desglose de motivos muere — regla:
  ahí solo va lo que nunca fue un lead.

**El criterio en una línea:** *el límite es la conversación con Nexor.
Descartado = murió antes de conversar (ruido y filtro previo). No Interesado =
el "no" nació en la conversación o después, siempre con motivo.* La tabla de
decisión, caso a caso:

| Caso | Columna | Motivo |
|---|---|---|
| Spam / número inválido / duplicado | Descartado | — |
| **Jamás respondió ningún mensaje** (tras la secuencia de intentos) | Descartado | — |
| **Formulario lo rechaza** (los valores no le calzan) | Descartado | — no pasa por el bot |
| Nexor descalifica: precio incompatible | No Interesado | Expectativa de precio |
| Nexor descalifica: sin intención real | No Interesado | Sin intención real |
| Nexor descalifica: sin disponibilidad | No Interesado | Sin disponibilidad horaria |
| Conversó y desapareció a mitad de camino | No Interesado | No responde |
| No asistió y se agotaron los 3 intentos | No Interesado | No asistió (3 intentos) |
| Se evaluó y no tomó tratamiento | No Interesado | No tomó — precio / lo va a pensar |
| Se fue a otra clínica | No Interesado | Se fue a otra clínica |

Tres consecuencias operativas:

- **El rechazado por el formulario no pasa por el bot** — para eso existe el
  filtro — y cae a *Descartado*. Como Descartado está fuera de los reportes,
  la efectividad del filtro de precio del formulario **se mide en GHL con el
  campo `resultado_formulario`** (aprobados ÷ enviados), no con el desglose de
  motivos del tablero.
- **La línea fina del silencio:** cero respuestas en toda la vida del lead =
  *Descartado*; respondió al menos una vez y se cayó = *No Interesado* con
  motivo `No responde`. Así el "jamás contestó" (calidad del canal) no se
  mezcla con el "se enfrió" (calidad de la conversación).
- **No Interesado es la lista reactivable** (cambios de precio, campañas de
  cupos); a un *Descartado* no se le vuelve a escribir.

Con esto el tablero queda **calcado 1:1 al contrato de estados** de abajo:
`calificado` = Calificado, `agendado` = Evaluación Agendada, `asistió` =
Evaluación Realizada, `pasó a tratamiento` = Pasó a Tratamiento, y
`no calificado` = No Interesado o Descartado según el caso.

### El contrato de estados (lo que le pedimos a Nexor)

Es la petición central a Nexor: que el bot devuelva **estados claros y
discretos**, no prosa. Cinco estados, cada uno con su efecto en GHL y en Meta:

| Estado Nexor | Etapa GHL | Campos que debe traer | Evento a Meta |
|---|---|---|---|
| `calificado` | 3 · Calificado · por agendar | `expectativa_precio`, `disponibilidad_declarada`, `tratamiento_interes` | — (todavía no) |
| `no calificado` | `Lost` + `motivo_perdida` | El motivo, de la lista cerrada de `Pipeline-CRM.md` §4 | — |
| `agendado` | 4 · Evaluación Agendada | `fecha_cita`, `id_cita_medilink` | ✅ `Schedule` — **el evento de optimización** |
| `asistió` | 7 · Evaluación Realizada | fecha real de asistencia | ✅ evento custom `EvaluacionAsistida` |
| `pasó a tratamiento` | 8 · Pasó a Tratamiento (Won) | `monto_tratamiento` si lo tiene | ✅ `Purchase` con monto |

Y dos señales operativas que no son estados del contrato pero que Nexor maneja
en la capa de asistencia:

- **confirmó** → etapa 5 (respondió sí a la confirmación previa).
- **reagendando** → etapa 6, `intentos_reagenda` +1; al reagendar vuelve a
  emitir `agendado` con la cita nueva (mismo contacto, se actualiza
  `id_cita_medilink` — **no** se crea oportunidad nueva ni se re-dispara el
  evento `Schedule`: `event_id` deduplica, ver §4).

**Por qué el contrato es este y no más rico:** cinco estados es lo que una
campaña de Meta necesita para aprender y lo que las dos métricas necesitan para
calcularse. Cada estado extra es una conversación más con Nexor, un webhook más
que se rompe y cero decisiones nuevas que habilita.

---

## 3. Las tres guías de Nexor, aterrizadas a Teraxcel

### Guía 1 — Conexión de canales (WhatsApp, correo, teléfono)

Qué hay que dejar conectado en Nexor, por canal del pipeline:

- [ ] **WhatsApp** — el número que operará el bot. *Decisión previa:* ¿el número
      actual de la clínica o uno nuevo de captación? Recomendado: **uno de
      captación separado**, para que la línea de traspaso (leads = Nexor,
      pacientes = recepción/Medilink) sea también una separación de números y
      nadie le escriba al paciente equivocado.
- [ ] **Instagram** — DMs de la cuenta de Teraxcel conectados al bot (requiere
      acceso a la página de Facebook vinculada).
- [ ] **Widget/botón de WhatsApp de la web** — apunta al mismo número del bot,
      con parámetro que marque `canal_origen = whatsapp-web`.
- [ ] **Correo y teléfono** — definir si entran en fase 1 o después. Si el
      teléfono queda fuera del bot, que al menos exista un guion de recepción
      para registrar el lead en GHL a mano.

### Guía 2 — Contexto del agente, objetivos y configuración

El contexto que hay que redactar y cargarle al bot (este repo es donde se
redacta; el documento del bot será un doc aparte cuando Teraxcel entregue los
insumos):

- [ ] **Objetivo del agente**, en una frase: *"calificar doblemente y agendar en
      Medilink solo a quien tiene intención real, expectativa de precio
      compatible y disponibilidad — y luego hacer que llegue"*. No es "agendar
      lo más posible": conviene escribirlo explícito porque es lo contrario del
      default de cualquier bot de agendamiento.
- [ ] **Guion de calificación** (2º filtro), tres dimensiones:
      1. *Intención* — qué le pasa, hace cuánto, qué ha intentado, por qué ahora.
      2. *Expectativa de precio* — recordar los valores aproximados **aunque el
         formulario ya los mostró** (hay quien marca sí sin leer) y preguntar si
         le hacen sentido.
      3. *Disponibilidad real* — franjas concretas, no "cuando pueda".
- [ ] **Valores aproximados de tratamiento** aprobados por escrito (bloqueador
      compartido con el formulario — `Pipeline-CRM.md` §8).
- [ ] **Reglas de traspaso a humano**: urgencias/dolor agudo, preguntas clínicas
      que el bot no debe responder, y quién de la clínica recibe el traspaso.
- [ ] **Tono** y presentación (¿el bot se presenta como asistente de Teraxcel?
      — recomendado: sí, sin fingir ser humano).
- [ ] **Regla de término**: con el estado `pasó a tratamiento`, el bot cierra y
      no vuelve a escribir — el paciente pasa al "equipo de recepción" (bots
      internos de Medilink).

### Guía 3 — Cómo compartir los leads (API y CRMs)

- [ ] **GHL → Nexor**: webhook al crearse el contacto/oportunidad con nombre,
      teléfono, `canal_origen`, respuestas del formulario y UTMs.
- [ ] **Nexor → GHL**: webhook (o su integración nativa con GHL, si la guía la
      contempla — confirmar con Nexor) que entregue los 5 estados de §2 con sus
      campos. Cada estado dispara el workflow de GHL que mueve la etapa,
      etiqueta y, cuando toca, emite el evento a Meta.
- [ ] **Clave de conciliación**: teléfono normalizado (+56…) como identificador
      del contacto y `id_cita_medilink` como clave de la cita. Sin esto, los
      reagendamientos duplican oportunidades.
- [ ] **Prueba de punta a punta** antes de encender pauta: un lead de prueba por
      cada canal recorriendo los 5 estados, verificando etapa, campos y evento
      en el administrador de eventos de Meta.

---

## 4. Eventos a Meta: plan A (Medilink) y plan B (GHL)

**El principio:** Meta solo aprende de personas calificadas. El envío del
formulario **no** se optimiza como conversión — si se optimizara, Meta volvería
a llenar el embudo de curiosos, que es el problema original.

| Evento | Cuándo | Plan A (ideal) | Plan B (operativo) |
|---|---|---|---|
| `Schedule` | Nexor marca `agendado` (cita calificada y creada) | Desde Medilink | **Desde GHL** vía Conversions API, disparado por el workflow del estado |
| `EvaluacionAsistida` (custom) | Nexor marca `asistió` | Desde Medilink | Desde GHL |
| `Purchase` + monto | Pago de tratamiento | Desde Medilink | Desde GHL cuando la clínica registra el pago |

- **Plan A** depende de que la API de Medilink permita webhooks/eventos de cita
  y pago. **Nunca se ha usado** — hay que averiguarlo (pendiente en
  `Pipeline-CRM.md` §8). Su ventaja: el dato de asistencia y pago nace donde
  ocurre, sin intermediarios.
- **Plan B** funciona desde el día uno porque GHL ya recibe los estados de
  Nexor. Es el plan por defecto mientras la API de Medilink no esté confirmada.
- **Deduplicación:** cada evento viaja con `event_id` = `id_cita_medilink` (+
  sufijo de tipo de evento). Así un reagendamiento o un doble webhook no
  duplican conversiones, y si algún día conviven plan A y B, tampoco.
- **Optimización de campaña:** partir optimizando a `Schedule` (habrá volumen
  suficiente); cuando `EvaluacionAsistida` supere ~30–50 eventos/semana,
  migrar la optimización ahí — es el evento más cercano a la silla que Meta
  puede aprender con volumen razonable.

---

## 5. Riesgos conocidos

| Riesgo | Señal | Mitigación |
|---|---|---|
| La API de Medilink no da lo esperado | No hay webhook de cita/asistencia/pago | Plan B completo desde GHL + marca manual de asistencia (recepción responde un mensaje diario del bot o formulario de 20 s) |
| El bot califica "blando" y vuelve el problema original | Tasa de calificación > ~70 % con asistencia que no mejora | Endurecer el guion (Guía 2); revisar transcripciones de los `calificado` que no asistieron |
| El bot califica "duro" y mata el volumen | Etapa 3 casi vacía, `Expectativa de precio` domina los motivos | Revisar cómo presenta los valores; el filtro es informar, no interrogar |
| Doble mensajería Nexor + recepción | Pacientes reciben mensajes de ambos | Número de captación separado (Guía 1) + regla de término del bot (Guía 2) |
| Reagendamientos duplican datos | Dos oportunidades para la misma persona | Teléfono normalizado + `id_cita_medilink` + actualizar, nunca crear |
