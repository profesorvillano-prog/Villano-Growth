# Pipeline Setter Orgánico — Valen · Instagram

> **Qué resuelve este documento:** completar el pipeline
> `[VALEN - Setter] Instagram` para que la setter pueda trabajar el canal
> orgánico de principio a fin (bienvenidas → DM → link → formulario → agenda →
> seguimiento) y **darle acceso al CRM hoy** sin que rompa nada de lo que ya
> existe.
>
> Contexto de negocio: [`Operaciones-y-Embudo.md`](./Operaciones-y-Embudo.md) ·
> Guiones y copy: [`Mensajes-Angulos-y-Copy.md`](./Mensajes-Angulos-y-Copy.md) ·
> Objeciones: [`FAQ.md`](./FAQ.md)

---

## 0. El principio de diseño

El pipeline de Valen es **la capa de conversación**: todo lo que pasa en el DM
de Instagram **antes** de que la lead entre al circuito formal
(formulario → agenda → closer).

```
   INSTAGRAM (Valen)                                    │  CRM FORMAL (ya existe)
                                                        │
   Bienvenidas ─┐                                       │
   CTA lead magnet ─┼→ Respuesta → CTA Formación →      │
   CTA formación ─┘        Link Enviado → Formulario ───┼→ ① [SETTER-ORG] Formación
                                             ↓          │
                                          Agendada ─────┼→ ③ [CLOSER] Agenda → ④ Cobros
                                             │          │
                                        Seguimiento     │
                                             │          │
                                       Ghost / Perdida  │
```

Tres consecuencias que hay que respetar:

1. **Una tarjeta = una persona = una etapa.** Nunca la misma lead viva en dos
   columnas del board de Valen.
2. **El board de Valen no vende, agenda.** Cuando la llamada está confirmada, la
   tarjeta se marca **Won** y el trabajo sigue en `③ [CLOSER] Agenda`. Si el
   board se convierte en el lugar donde se cierra, duplicamos el trabajo del
   closer y rompemos las métricas de ambos.
3. **Solo entra tráfico orgánico de Instagram.** Lo que llega por anuncios sigue
   viviendo en `② [SETTER - ADS]`. Mezclar fuentes en un mismo board destruye la
   comparación org vs. ads (que es la decisión de inversión más importante del
   negocio).

---

## 1. Dónde encaja: mapa de los cinco pipelines

| Pipeline | ID | Qué contiene | Dueño |
|---|---|---|---|
| `[VALEN - Setter] Instagram` | `ZJbdlB7FnM3V5YY5BiDG` | **Conversaciones de DM orgánico.** Desde la bienvenida hasta la agenda. | **Valen** |
| `① [SETTER - ORG] Formación` | `XoejslKD0GHwUWSxujbs` | Postulaciones orgánicas ya formalizadas (formulario entrado). | Setter/closer |
| `② [SETTER - ADS] Formación` | `puyQKiA3cuYzADHpbgcr` | Lo mismo, pero de pauta. | Setter/closer |
| `③ [CLOSER] Agenda` | `J61MmwBX4mGAl7W1jCpz` | Llamadas confirmadas en adelante. | Rafa |
| `④ [VENTAS] Cobros` | `vpq6pgz5Ht93tdBMImOC` | Cuotas y venta total. | Admin |

> La misma persona **sí** puede tener una tarjeta en el board de Valen y otra en
> `①`: son dos momentos distintos del embudo (conversación vs. postulación).
> Lo que no puede pasar es que esté en `①` **y** en `②`.

---

## 2. Las 9 etapas

Hoy hay 5. Se **renombra 1**, se **añaden 4** y se ordenan así. La columna
*Quién mueve* es lo importante: Valen solo mueve 3 columnas a mano, el resto lo
hace el sistema.

| # | Etapa | Qué significa | Quién mueve | Disparador de entrada | Salida |
|---|---|---|---|---|---|
| 0 | **Bienvenidas** | Le mandamos el primer mensaje y todavía no contesta | 🤖 | Seguidora nueva / DM nuevo sin historial → ManyChat pone `bienvenida-enviada` | → 1 si responde · → 8 a las 72 h |
| 1 | **Respuesta Bienvenida** | Contestó el saludo. Conversación viva, sin intención declarada | 🤖 | Mensaje entrante de alguien en etapa 0 | → 2 o 3 según lo que pida · → 8 si se corta |
| 2 | **CTA Lead Magnet** | Pidió/recibió un recurso gratuito (comentario o palabra clave) | 🤖 | Tag `cta-leadmagnet` desde ManyChat | → 3 cuando pregunta por la formación · → 7 si hay que nutrir · → 8 |
| 3 | **CTA Formación** | Interés directo: pregunta precio, contenidos, cómo entrar | 👤 **Valen** | Ella lo mueve al detectar intención de compra | → 4 al mandar el link |
| 4 | **Link Enviado** | **Ella ya mandó el link del formulario** y espera que lo llene | 👤 **Valen** | Al pegar el link en el DM | → 5 cuando llega el formulario · → 7 a las 48 h sin llenar |
| 5 | **Formulario Completado** | Llegó la postulación. Aquí ve **quién llenó** | 🤖 | Envío del formulario *Postulación ÉxiTO* | → 6 si agenda · → 7 a las 24 h sin agendar |
| 6 | **Agendada** | Tiene llamada tomada en el calendario | 🤖 | Cita creada en *Agenda tu llamada* | → **Won** al confirmar (pasa a `③`) · → 7 si cancela |
| 7 | **Seguimiento** | Trabajo activo de recuperación: enfrió pero se sigue tocando | 👤 **Valen** | Manual o automático desde 2, 4, 5, 6 | → vuelve a la etapa que corresponda · → 8 tras 3 toques sin respuesta |
| 8 | **Ghost (Sin Respuesta)** | Dejó de contestar. Estacionamiento, no basurero | 🤖 | 72 h sin respuesta en 0/1 · 3 toques sin respuesta en 7 | → vuelve a 1 si reaparece · → **Lost** a los 21 días |

### Colores (paleta de la casa)

Respetan el código que ya usan `①`, `②` y `③`: gris = ghost, fucsia = follow up,
celeste = agendas, azul = formulario, rojo reservado a descalificación.

| # | Etapa | Color |
|---|---|---|
| 0 | Bienvenidas | `#6366F1` |
| 1 | Respuesta Bienvenida | `#0D9488` |
| 2 | CTA Lead Magnet | `#F97316` |
| 3 | CTA Formación | `#7C3AED` |
| 4 | Link Enviado | `#CA8A04` |
| 5 | Formulario Completado | `#3B82F6` |
| 6 | Agendada | `#0EA5E9` |
| 7 | Seguimiento | `#C026D3` |
| 8 | Ghost (Sin Respuesta) | `#64748B` |

> **Ojo con la etapa 4.** Hoy se llama `Formulario Enviado`, que se lee de dos
> maneras opuestas: "yo envié el link" o "ella envió el formulario". Renombrarla
> a **Link Enviado** y crear **Formulario Completado** aparte es lo que permite
> medir la conversión link → postulación, que es el número que dice si el guión
> del DM funciona. Renombrar en GHL conserva el ID y las tarjetas.

---

## 3. Las cuatro puertas de entrada

Valen atiende cuatro orígenes distintos y cada uno entra por una columna
distinta. Esto es lo que evita que el board sea una bandeja de entrada indistinta.

| Puerta | De dónde viene | Entra en | Fuente (`source`) de la oportunidad |
|---|---|---|---|
| **A · Bienvenida** | Seguidora nueva o DM frío | 0 · Bienvenidas | `[DM - ORG] Bienvenida IG` |
| **B · Lead magnet** | Comentario con palabra clave / DM automático | 2 · CTA Lead Magnet | `[DM - ORG] Lead Magnet` |
| **C · CTA directo** | Pregunta por la formación en DM, historia o comentario | 3 · CTA Formación | `[DM - ORG] CTA Formación` |
| **D · Formulario sin DM** | Llenó el formulario desde el link de la bio, sin conversación previa | **No entra al board de Valen** — vive en `①` | `[SURVEY - ORG] Postulación ÉxiTO` |

La puerta D es deliberada: si el formulario crea tarjeta en los dos boards, cada
postulación orgánica se cuenta dos veces y el ratio de la setter queda inflado.
Para verlas, Valen usa la lista de la §5.

---

## 4. Etiquetas y campos

Se reutiliza el vocabulario que ya existe en la cuenta (`survey-org`,
`lead-setter-org`, `agenda-org`, `tier-*`, `prospecto-exito`). Las nuevas siguen
el mismo estilo: minúscula, guion medio, sin acentos.

| Etiqueta | Cuándo se pone | La pone |
|---|---|---|
| `bienvenida-enviada` | Se mandó el saludo inicial | ManyChat |
| `dm-respondio` | Contestó cualquier DM | Workflow |
| `cta-leadmagnet` | Pidió un recurso gratuito | ManyChat |
| `cta-formacion` | Preguntó por la formación | ManyChat / Valen |
| `link-enviado` | Se le mandó el link del formulario | Workflow al mover a etapa 4 |
| `survey-org` *(ya existe)* | Llenó la postulación | Formulario |
| `agenda-org` *(ya existe)* | Tomó hora | Calendario |
| `seguimiento-setter` | Está en recuperación activa | Workflow al mover a etapa 7 |
| `ghost-dm` | Dejó de contestar | Workflow |
| `lead-setter-org` *(ya existe)* | Lead trabajada por la setter orgánica | Workflow al entrar al board |

**Campos que Valen debe completar** (ya existen, no hay que crear nada):

- `opportunity.resumen_lead` — 2 líneas: qué hace, qué le pasa, qué quiere.
  Es lo que el closer lee antes de la llamada.
- `contact.fecha_primer_contacto` — la setea el workflow al crear la tarjeta.
- `contact.tier_score` y `contact.producto_recomendado` — **no los toca Valen**,
  salen del formulario.

**Valor monetario:** dejar en **$0** en todo el board. Las series del panel
Cerebro se agrupan por `pipeline_name`; si este board empieza a sumar $1.250 por
tarjeta, el forecast de la cuenta se duplica.

---

## 5. "Todos los formularios": la lista, no una columna

Valen quiere ver **quién llenó el formulario, venga de donde venga**. Eso no es
una etapa del pipeline (mezclaría pauta con orgánico), es una **Smart List de
contactos**:

**Contacts → filtro → Save as Smart List → `📋 Formularios — Todas`**

```
Tag  is one of  [ survey-org , survey-ads ]
Date Added      Last 90 days          (opcional, para que cargue rápido)
Sort            Date Added ↓
```

Columnas a mostrar: Nombre · Teléfono · Email · `¿Cuál es tu profesión?` ·
`Para recomendarte la mejor opción, ¿cuánto tienes pensado invertir…?` ·
`Tier Score` · Tags · Date Added.

Y una segunda, la que de verdad usa todos los días:

**`📋 Formularios — Orgánico sin agenda`** → `Tag is survey-org` **AND**
`Tag is not agenda-org`. Esa lista es su cola de trabajo: gente que postuló y
todavía no tomó hora.

> Requisito: la opción **"Allow Assigned Data Only" tiene que quedar apagada** en
> su usuario (§7). Si está encendida, solo verá los contactos asignados a ella y
> estas listas le saldrán vacías.

---

## 6. Automatizaciones (Workflows en GHL)

Ocho workflows. Los cuatro primeros son los que hacen que el board se llene
solo; sin ellos Valen termina arrastrando tarjetas a mano y deja de usarlo en
dos semanas.

| # | Workflow | Disparador | Acciones |
|---|---|---|---|
| **W1** | `[ORG] DM · Crear oportunidad` | Tag añadido `bienvenida-enviada` | Crear oportunidad → pipeline Valen, etapa **0**, source `[DM - ORG] Bienvenida IG`, asignada a Valen, valor 0 · Añadir tag `lead-setter-org` · Setear `fecha_primer_contacto` |
| **W2** | `[ORG] DM · Respondió` | Customer Replied (Instagram/DM) | Si etapa = 0 → mover a **1** · Tag `dm-respondio` |
| **W3** | `[ORG] DM · Lead magnet` | Tag añadido `cta-leadmagnet` | Si no existe oportunidad → crearla en **2** (source `[DM - ORG] Lead Magnet`) · Si existe → mover a **2** |
| **W4** | `[ORG] DM · CTA formación` | Tag añadido `cta-formacion` | Crear o mover a **3** (source `[DM - ORG] CTA Formación`) · Notificación interna a Valen |
| **W5** | `[ORG] Link enviado` | Opportunity Stage Changed → **4** | Tag `link-enviado` · Tarea a Valen a 48 h: *"¿Llenó el formulario?"* |
| **W6** | `[ORG] Formulario completado` | Form/Survey Submitted · *Postulación ÉxiTO* | **Solo si ya existe** tarjeta en el board de Valen → mover a **5** · (el alta en `①` sigue como está hoy, no se toca) |
| **W7** | `[ORG] Agenda tomada` | Appointment Booked · *Agenda tu llamada* | Mover a **6** · Tag `agenda-org` · Notificación a Valen y a Rafa |
| **W8** | `[ORG] Ghost y cierre` | Wait + condición | 72 h sin respuesta en 0/1 → **8** + tag `ghost-dm` · 21 días en **8** → status **Lost**, motivo *Ghost 21 días* |

**Traspaso al closer (W7-bis):** cuando la llamada queda **confirmada**, la
tarjeta del board de Valen pasa a **Won** y se crea/mueve la de `③ [CLOSER]
Agenda` en *Llamada Confirmada Setter*. Ese es el único punto donde termina su
responsabilidad.

### Motivos de pérdida (Lost Reasons)

Configurar en *Settings → Opportunities → Lost Reasons*:

1. No es profesional de la salud / no trabaja con niños
2. No puede invertir ahora
3. Ya es alumna
4. Solo quería el recurso gratuito
5. Ghost 21 días
6. País / idioma fuera de alcance

Sin motivos de pérdida, "no cerró" es un agujero negro: no se puede saber si el
problema es el filtro, el precio o el guión.

---

## 7. Dar de alta a Valen (paso a paso)

**Settings → My Staff → Add Employee**

1. **Datos:** nombre, email, teléfono. Contraseña que ella cambia al entrar.
2. **User Type: `User`** — nunca `Admin`.
3. **Role: `User`**.
4. **Allow Assigned Data Only: `OFF`** ← crítico. Con esto en `ON` no ve los
   formularios de la §5.
5. **Permisos encendidos:**
   `Contacts` · `Conversations` · `Opportunities` · `Calendars` · `Tasks` ·
   `Phone / LC Phone` (si atiende WhatsApp) · `Dashboard` (opcional).
6. **Permisos apagados:**
   `Settings` · `Workflows` · `Triggers` · `Campaigns` · `Marketing` ·
   `Funnels / Websites` · `Payments` · `Memberships` · `Blogs` ·
   `Bulk Requests` · `Media` · `Reporting`.
7. **Calendario:** darla de alta como usuario del calendario **solo** si va a
   agendar en nombre de Rafa; si no, no hace falta.
8. **2FA activado** y **app móvil LeadConnector** instalada (el DM se responde
   desde el teléfono).

**Vista por defecto de su board:** el board hoy tiene 2 filtros avanzados
guardados. Revisar que sean `Status = Open` + `Assigned to = Valen` y guardar
la vista como suya. Si hay un filtro de fecha viejo, quitarlo — es la razón más
común de "no me aparece nada".

---

## 8. Rutina diaria de Valen

Tres bloques. Fuera de eso, no se toca el CRM.

**Mañana (30–45 min) — vaciar la entrada**
1. Columna **Bienvenidas**: responder todo lo que contestó.
2. `Conversations` → *Unread*: cero mensajes sin leer al terminar.
3. Mover a **CTA Formación** todo el que preguntó por la formación.

**Mediodía (15 min) — cosechar**
4. **Formulario Completado**: por cada tarjeta nueva, escribir el
   `Resumen Lead` (2 líneas) y mandar el link de agenda.
5. **Agendada**: confirmar por DM que la hora quedó tomada.

**Tarde (30 min) — seguimiento**
6. **Link Enviado** con más de 48 h → mover a **Seguimiento** y tocar.
7. **Seguimiento**: regla **3 toques / días 3-7-14**. Al tercer toque sin
   respuesta → **Ghost**.
8. Lo que ya no es lead → **Lost** con motivo. Nunca borrar una tarjeta.

**Tres reglas que no se negocian**
- Una persona, una tarjeta, una columna.
- Toda tarjeta que pasa de **Formulario Completado** lleva `Resumen Lead`
  escrito. Sin resumen, el closer entra a la llamada a ciegas.
- Ella no crea pipelines, no edita etapas y no toca `③` ni `④`.

---

## 9. Qué se mide

| Métrica | Cómo se calcula | Para qué sirve |
|---|---|---|
| Bienvenidas enviadas / día | Tarjetas creadas en **0** | Volumen de prospección |
| Tasa de respuesta | **1** ÷ **0** | Calidad del mensaje de bienvenida |
| Respuesta → CTA | (**2**+**3**) ÷ **1** | ¿La conversación lleva a algo? |
| Links enviados / semana | Entradas a **4** | Actividad real de setting |
| **Link → Formulario** | **5** ÷ **4** | **El número clave del guión del DM** |
| Formulario → Agenda | **6** ÷ **5** | Calidad del filtro y del cierre de agenda |
| Agendas / semana | Won del board | El entregable de Valen |
| Tiempo a primera respuesta | Reporte de Conversations | En DM orgánico, la velocidad *es* la conversión |

Referencias de arranque (hipótesis a validar con 2-3 semanas de datos, no metas
impuestas): respuesta a bienvenida 15-25 %, link → formulario 30-40 %,
formulario → agenda 40-50 %.

---

## 10. Orden de implementación

1. **Renombrar** la etapa `Formulario Enviado` → **`Link Enviado`**
   *(Opportunities → ⚙ Manage Pipelines → `[VALEN - Setter] Instagram` → Edit)*.
2. **Crear** las 4 etapas nuevas: `CTA Lead Magnet`, `CTA Formación`,
   `Formulario Completado`, `Ghost (Sin Respuesta)`.
3. **Reordenar** a las 9 posiciones de la §2 y aplicar los colores.
   Dejar `useOpportunityProbability` en **false** — las probabilidades son
   decorativas, no tocarlas.
4. **Crear los Lost Reasons** (§6).
5. **Crear las dos Smart Lists** de la §5.
6. **Montar W1, W2, W6 y W7** (los cuatro que llenan el board solo). W3, W4, W5
   y W8 pueden esperar a la segunda semana.
7. **Dar de alta el usuario** de Valen con los permisos de la §7.
8. **Sesión de 30 min con ella**: la rutina de la §8 y las tres reglas.
9. A los 7 días: revisar el board juntos y ajustar tiempos de ghost.

> **Sobre la API:** las etapas de un pipeline en GHL no se pueden crear desde la
> API v2 (no hay endpoint público de escritura de pipelines). Los pasos 1-3 son
> obligatoriamente por interfaz. Lo demás —etiquetas, campos, oportunidades— sí
> es automatizable y ya está cubierto por los workflows.
