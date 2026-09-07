# Pipeline CRM — Teraxcel

> **Qué resuelve este documento:** cómo se arma el pipeline en GoHighLevel para
> que la doble calificación funcione, la agenda de Medilink reciba solo gente
> filtrada, y las dos métricas que mandan (asistencia y conversión a
> tratamiento) se lean directo de las columnas.
>
> El contrato técnico con Nexor y Medilink está en
> [`Integracion-Nexor-Medilink.md`](./Integracion-Nexor-Medilink.md).

---

## 0. El principio de diseño

La agencia anterior fracasó llenando la agenda. Este pipeline está diseñado para
que **llenar la agenda sea imposible sin calificar antes**, y para que el éxito
se mida donde ocurre: en la silla de la clínica.

```
 ── NEXOR · "gestión de Teraxcel" (automatizado) ──────────────────────┃─ CLÍNICA ─

  1 · Nuevo        2 · En calificación      3 · Calificado             ┃
  (4 canales)  →   (bot: intención,     →   por agendar                ┃
                    precio, agenda)              │                     ┃
                        │                        ↓                     ┃
                        ↓                   4 · Agendado → 5 · Confirmó┃
                   No calificado                 │              │      ┃
                   (Perdido + motivo)            ↓              ↓      ┃
                                            6 · No asistió → 7 · Asistió → 8 · Pasó a
                                            · recuperar                ┃   tratamiento
                                                                       ┃      │
                                                        línea de traspaso     ↓
                                                                       ┃  bots internos
                                                                       ┃  Medilink
                                                                       ┃  ("recepción")
```

Tres consecuencias de diseño:

1. **La agenda es un premio, no una puerta.** Ninguna automatización crea cita en
   Medilink desde las etapas 1 ni 2. Solo desde la 3, y solo la mueve Nexor.
2. **El pipeline termina donde termina Nexor.** El paciente en tratamiento vive
   en Medilink con sus bots internos. El CRM registra que pasó (etapa 8, Ganado,
   con monto) y suelta la conversación.
3. **Cada caída deja motivo.** `no calificado` no es un fracaso del embudo — es
   el embudo funcionando. Pero solo sirve si queda registrado *por qué* no
   calificó.

---

## 1. Estructura: un pipeline, cuatro puertas de entrada

Un solo pipeline en GHL:

| Pipeline | Nombre exacto en GHL | Qué contiene |
|---|---|---|
| Principal | `Teraxcel · Evaluación → Tratamiento` | Todo lead de cualquier canal, desde que entra hasta que pasa a tratamiento o se pierde |

Los cuatro canales entran al **mismo pipeline**, distinguidos por el campo
`canal_origen`:

| Canal | Cómo entra | Primer filtro |
|---|---|---|
| `meta-form` | Campaña de Meta → **formulario calificador** (con valores aproximados del tratamiento a la vista) | El formulario |
| `whatsapp-web` | Botón de WhatsApp de la página web | No hay formulario: el bot hace la calificación completa |
| `instagram` | DM de Instagram | Ídem: el bot hace todo |
| `derivacion-medica` | Plataforma interna de derivación de médicos y otros profesionales de salud | El médico que deriva **es** el filtro (ver §2, regla especial) |

**Por qué un solo pipeline y no uno por canal** (la decisión inversa a FIXUS,
donde son dos):

- En FIXUS hay dos *servicios* con tickets, avatares y geos distintos. Aquí hay
  **un servicio con cuatro puertas**: el viaje después de la puerta es idéntico
  (calificar → agendar → confirmar → asistir → tratar).
- Las dos métricas que mandan (asistencia, conversión a tratamiento) deben poder
  compararse **entre canales** en la misma vista. Cuatro pipelines obligarían a
  sumar a mano.
- La comparación por canal —"seguir invirtiendo en el mejor calificado", como
  pide Sebastián— se hace filtrando por `canal_origen`, que es exactamente para
  lo que existen los campos.

> Si más adelante Teraxcel pauta un segundo servicio con otro ticket, ahí sí se
> abre otro pipeline. Canal nuevo = campo; servicio nuevo = pipeline.

---

## 2. Las 8 etapas

La columna **Quién mueve** es lo importante: todo lo mueve Nexor (vía sus
estados, ver `Integracion-Nexor-Medilink.md` §2) salvo la etapa 8, que la
dispara el dato de la clínica.

| # | Etapa | Quién mueve | Disparador de entrada | Salidas |
|---|---|---|---|---|
| 1 | **Nuevo · sin calificar** | 🤖 | Lead creado: formulario enviado, mensaje entrante de WA/IG, o derivación | → 2 cuando el bot abre conversación · → Perdido a las 72 h sin respuesta |
| 2 | **En calificación (Nexor)** | 🤖 | El bot está conversando: intención real, expectativa de precio, disponibilidad | → 3 si `calificado` · → Perdido si `no calificado` (con motivo) |
| 3 | **Calificado · por agendar** | 🤖 | Nexor marcó `calificado`; ofrece horas de Medilink | → 4 al crearse la cita · nudges 1 h / 24 h / 48 h |
| 4 | **Agendado en Medilink** | 🤖 | Cita creada en Medilink | → 5 al confirmar · → 6 si avisa que no puede |
| 5 | **Confirmó asistencia** | 🤖 | Respondió la confirmación previa (24–48 h antes) | → 7 si asiste · → 6 si no llega |
| 6 | **No asistió · recuperar** | 🤖 | No-show, o avisó que no podía llegar | → 4 si reagenda · → Perdido a los 10 días / 3 intentos |
| 7 | **Asistió a evaluación** | 🤖 | Nexor marcó `asistió` (dato desde Medilink o la clínica) | → 8 si toma tratamiento · → Perdido con motivo |
| 8 | **Pasó a tratamiento** | 🏥 clínica / 🤖 | Pago o inicio de tratamiento registrado | Estado **Ganado** + traspaso a bots internos de Medilink |

**Estados de la oportunidad (`status` de GHL, no etapas):**

- `Open` — etapas 1 a 7.
- `Won` — al llegar a la etapa 8. Se registra `monto_tratamiento`.
- `Lost` — desde **cualquier** etapa, siempre con `motivo_perdida` obligatorio.
- `Abandoned` — no se usa. Todo lo que muere es `Lost` con motivo.

### Regla especial: la derivación médica salta un filtro, no dos

Un paciente derivado por un médico ya viene calificado en intención — hacerle el
interrogatorio de precio del bot sería maltratar al canal más valioso. Entra
directo a la **etapa 3** con etiqueta `derivacion-medica` y `medico_derivador`
lleno, y el bot solo agenda, confirma y recuerda. **Pero no salta la capa de
asistencia:** derivado que no confirma se trata igual que cualquiera.

### Por qué "Confirmó asistencia" es etapa aparte de "Agendado"

El criterio de siempre: dos grupos que reciben mensajes distintos son etapas
distintas. Al agendado hay que pedirle confirmación; al confirmado solo
recordarle. Y además la etapa 5 es la **métrica de alerta temprana**: si la
columna 4 engorda y la 5 no, el no-show de la semana ya se ve el martes, no el
viernes.

### Por qué "No asistió" es etapa y no motivo de pérdida

Porque un no-show de alguien **doblemente calificado** no es una pérdida — es un
reagendamiento pendiente. La persona ya demostró intención y expectativa de
precio compatible. Y porque *tasa de asistencia* es la métrica #1 del mandato:
tiene que ser una columna visible, no un filtro que hay que buscar. Recién a los
10 días y 3 intentos pasa a `Lost` con motivo `No asistió (3 intentos)`.

### Por qué el `no calificado` se pierde desde la etapa 2 y no tiene etapa propia

Una etapa "No calificados" se convierte en un cementerio que nadie mira y que
ensucia el conteo de leads activos. `Lost` con motivo dice lo mismo, no ocupa
columna, y el desglose de motivos (§4) es el informe que de verdad se usa: si el
60 % cae por `Expectativa de precio`, el problema está en el anuncio, no en el
bot.

---

## 3. Métricas: las que mandan y las que solo acompañan

| Métrica | Cálculo con las etapas | Es… |
|---|---|---|
| **Tasa de asistencia** | etapa 7 ÷ etapa 4 (acumulado del período) | ⭐ la que manda |
| **Conversión evaluación → tratamiento** | etapa 8 ÷ etapa 7 | ⭐ la que manda |
| Tasa de calificación | etapa 3 ÷ etapa 1, por canal | Diagnóstico de pauta y filtros |
| Costo por evaluación asistida | inversión ÷ etapa 7 | La métrica de pauta operativa |
| Costo por tratamiento iniciado | inversión ÷ etapa 8 | El CAC real |
| Volumen de agendas | etapa 4 | ⚠️ **No es un KPI.** Solo denominador |

**El volumen de agendas no se celebra ni se reporta como logro.** Es el error de
la agencia anterior institucionalizado como métrica. Se registra porque es el
denominador de la tasa de asistencia, nada más.

**Todo se lee por canal** (`canal_origen`): la decisión de inversión que pide
Sebastián — seguir invirtiendo en el lead mejor calificado — es literalmente
esta tabla filtrada cuatro veces y comparada.

---

## 4. Campos personalizados

### Contacto

| Campo | Tipo | Para qué |
|---|---|---|
| `canal_origen` | Desplegable: `meta-form` / `whatsapp-web` / `instagram` / `derivacion-medica` | La dimensión de comparación de todo el sistema |
| `tratamiento_interes` | Desplegable (lista de tratamientos de Teraxcel — pendiente §8) | Contexto del bot y desglose de métricas |
| `medico_derivador` | Texto / desplegable | Devolverle el dato al médico que deriva (y medir qué médicos derivan bien) |
| `acepta_whatsapp` | Sí/No | Consentimiento para la capa de recordatorios |
| `utm_source`, `utm_campaign`, `utm_content`, `utm_term`, `click_id` | Texto | Atribución al anuncio concreto. Sin `utm_content` solo se optimiza campaña, no creatividad |

### Oportunidad

| Campo | Tipo | Quién lo llena |
|---|---|---|
| `resultado_formulario` | Desplegable: `aprobado` / `rechazado` / `no aplica` (canales sin formulario) | 🤖 |
| `estado_nexor` | Desplegable: `calificado` / `no calificado` / `agendado` / `asistio` / `tratamiento` | 🤖 Nexor — el espejo del contrato de estados |
| `expectativa_precio` | Desplegable: `compatible` / `ajustada` / `incompatible` | 🤖 Nexor, en la calificación |
| `disponibilidad_declarada` | Texto corto | 🤖 Nexor — franjas que dijo poder |
| `fecha_cita` | Fecha y hora | 🤖 desde Medilink |
| `id_cita_medilink` | Texto | 🤖 — clave anti-duplicados y de conciliación |
| `intentos_reagenda` | Número | 🤖 |
| `monto_tratamiento` | Número | 🏥 clínica (o 🤖 si el pago se registra en un sistema conectado) |
| `motivo_perdida` | Desplegable (lista cerrada, abajo) | 🤖 / 🏥 |

### Motivos de pérdida (lista cerrada, obligatoria)

`Expectativa de precio` · `Sin intención real` · `Sin disponibilidad horaria` ·
`No responde` · `No asistió (3 intentos)` · `No tomó tratamiento — precio` ·
`No tomó tratamiento — lo va a pensar` · `Se fue a otra clínica` ·
`Motivo médico` · `Otro`

Los dos motivos de "no tomó tratamiento" van separados a propósito: `precio`
después de haber pasado **dos** filtros de precio significa que los valores
advertidos no coinciden con los reales — y eso se arregla en el formulario, no
en la clínica. `Lo va a pensar` alimenta una secuencia de seguimiento; `precio`
no.

### Etiquetas

`teraxcel` · `meta-form` · `whatsapp-web` · `instagram` · `derivacion-medica` ·
`calificado` · `no-calificado` · `agendado` · `confirmado` · `no-show` ·
`asistio` · `tratamiento` · `reactivacion`

---

## 5. La capa de asistencia (lo que Nexor trabaja entre agendar y asistir)

Es la segunda mitad del mandato y donde se juega la métrica #1. Secuencia tipo
por cita:

| Momento | Mensaje | Si responde… |
|---|---|---|
| Al agendar | Confirmación de la cita creada + qué llevar / dónde es | — |
| 48 h antes | **Pedido de confirmación** ("¿confirmamos tu hora del jueves 16:00?") | Sí → etapa 5 · No puede → reagenda en el momento (→ 6 → 4) |
| 24 h antes | Recordatorio (solo a confirmados) o segundo pedido (a no confirmados) | — |
| 3 h antes | Recordatorio corto con dirección/indicaciones | — |
| Post no-show | "Te esperamos y no pudiste llegar — ¿reagendamos?" ×3 intentos en 10 días | Reagenda → 4 · Silencio → Perdido |

**Regla de oro del reagendamiento:** quien avisa que no puede llegar **nunca**
se suelta con un "avísanos cuando puedas". El bot reagenda **en esa misma
conversación**, con horas concretas de Medilink sobre la mesa.

---

## 6. Qué **no** entra al pipeline

- ❌ **Pacientes en tratamiento.** Cruzan la línea de traspaso y los toman los
  bots internos de Medilink ("equipo de recepción"). Nexor no les escribe más;
  la oportunidad quedó `Won` y cerrada.
- ❌ **Gestión clínica**: fichas, presupuestos odontológicos, controles,
  recitaciones. El CRM lee de Medilink lo mínimo: cita creada, asistió o no,
  pagó o no.
- ❌ **Agendas creadas a mano saltándose los filtros.** Si alguien de la clínica
  agenda directo en Medilink a un conocido, esa cita no entra al pipeline ni a
  las métricas de pauta (se detecta porque no tiene oportunidad con
  `id_cita_medilink`). No es prohibido — es que no contamina el dato.
- ❌ **Leads de otros proyectos del holding.** Un pipeline por negocio.

---

## 7. Orden de implementación

| Fase | Qué se hace | Bloqueado por |
|---|---|---|
| **0 · Esqueleto CRM** | Subcuenta GHL + pipeline con las 8 etapas + campos + etiquetas + motivos | Crear la subcuenta — nada externo |
| **1 · Canales a Nexor** | WhatsApp, IG y widget web conectados a Nexor (Guía 1) | Número de WhatsApp definido · accesos de Meta/IG |
| **2 · Contexto del bot** | Guion de calificación (intención, precio, disponibilidad) + valores aproximados aprobados + reglas de traspaso a humano (Guía 2) | Lista de tratamientos y valores **por escrito** de Teraxcel |
| **3 · Cableado de estados** | Webhooks GHL ↔ Nexor: lead/formulario hacia Nexor, los 5 estados de vuelta (Guía 3) | Fases 0–1 |
| **4 · Agenda Medilink** | Nexor agenda/lee citas en Medilink; `id_cita_medilink` al CRM | Averiguar la API de Medilink (§8) — si no hay API, definir el procedimiento manual mínimo |
| **5 · Formulario + pauta** | Formulario calificador con valores a la vista + campaña de Meta apuntando ahí (no a agenda directa) | Fases 2–3 · valores aprobados |
| **6 · Eventos a Meta** | Conversions API desde GHL sobre `agendado` confirmado y pago de tratamiento | Fases 3–5 · ver `Integracion-Nexor-Medilink.md` §4 |
| **7 · Canales restantes** | Derivación médica interna conectada · secuencias de reactivación | Definición de la plataforma de derivación (§8) |

**La fase 0 no depende de nadie** — se puede montar esta semana. **La fase 2 es
la crítica de calidad:** un bot calificando sin valores reales aprobados es la
agencia anterior con más pasos.

---

## 8. Lo que necesitamos de Teraxcel / Joaquín para armarlo

**Bloquean el armado:**

- [ ] Luz verde para crear la **subcuenta de GoHighLevel** de Teraxcel.
- [ ] **Número de WhatsApp** que operará Nexor (¿el actual de la clínica o uno
      nuevo de captación?) + accesos a la página de Facebook/Instagram.
- [ ] **Lista de tratamientos con sus valores aproximados, por escrito y
      aprobados** para: (a) publicarlos en el formulario, (b) dárselos al bot
      como contexto. Sin esto no hay filtro de precio honesto.
- [ ] **Definición de "calificado"**: qué combinación de intención + expectativa
      de precio + disponibilidad aprueba. Propuesta inicial: intención explícita
      de tratarse **y** `expectativa_precio` ≠ `incompatible` **y** al menos una
      franja horaria real.
- [ ] **Acceso / averiguación de la API de Medilink** (nunca se ha usado): ¿se
      puede crear cita, leer asistencia y leer pago? De la respuesta depende la
      fase 4 y desde dónde salen los eventos a Meta.
- [ ] Cómo llega hoy una **derivación médica interna** (plataforma, planilla,
      correo) para definir su conector.

**Bloquean que el dato sirva, no el armado:**

- [ ] Quién y cómo marca **"pasó a tratamiento" con monto**: ideal, el pago en
      Medilink vía API; plan B, un formulario de cierre de 20 segundos para
      recepción (mismo mecanismo que la Vía A de FIXUS).
- [ ] **Tasa de asistencia y conversión a tratamiento actuales** (de la era de
      la agencia anterior, aunque sea aproximada). Es la línea base: sin ella,
      en dos meses no podremos demostrar que la doble calificación funcionó.
- [ ] Costo máximo aceptable por tratamiento iniciado y presupuesto de pauta.
