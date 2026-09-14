# Manual de construcción — automatización v2

> Cómo construir la arquitectura de [`Rediseno-Workflows-v2.md`](./Rediseno-Workflows-v2.md)
> en GoHighLevel, en el orden correcto. Escrito el 14-09-2026.
>
> **El orden no es el del embudo, es el de las dependencias.** Construir en
> orden de embudo (postulación → agenda → llamada) obliga a esperar la
> aprobación de plantillas de WhatsApp antes de tocar nada. Construir por
> dependencia deja lista la medición el primer día.

## Regla de oro

**Nada se borra y nada se edita en vivo.** Todo se construye nuevo, en su propia
carpeta, y se corta el viejo recién cuando el nuevo funciona. Un workflow viejo
que estorba se **pausa**, no se elimina: si algo sale mal, se vuelve a publicar
en un clic.

Carpeta nueva en `Automation → Workflows`: **`ÉxiTO v2`**, con dos subcarpetas
`01 Entrada` y `02 Agenda y Llamada`. Los workflows viejos se quedan donde están
hasta el final.

---

## Las 4 olas, por dependencia

| Ola | Qué se construye | De qué depende | Qué desbloquea |
|---|---|---|---|
| **1 · Medición** | `01a/b/c` entradas + `01` motor + ajuste de los 4 de CAPI | **De nada externo.** Campos, tags, encuestas y pipeline ② ya existen | Cierra la fuga de conversiones a Meta y habilita medir por origen |
| **2 · Verde** | `02` ghost + `03` bienvenida y confirmación | 3 plantillas aprobadas por Meta | Los follow-ups automáticos y el botón de confirmar |
| **3 · Morado** | `04` handoff + `05` recordatorios + `06` cancelación | Número morado conectado en GHL | El segundo número y el rescate del botón |
| **4 · Closer** | `07` handoff a closer + `08` post-llamada | Pipeline `③ Llamadas · Closer` creado | El cambio de closer y las métricas de cierre |

**Empezás por la Ola 1.** Es la única que no espera a nadie, y es la que está
costando plata hoy.

---

# OLA 1 · Medición

## Antes de construir: corrección al diseño

Verificado el 14-09 en un contacto real: **los campos `UTM Source` y
`UTM Campaign` del contacto están vacíos.** Nadie los rellena. La atribución
real vive en el objeto **nativo** de GHL `attributionSource`, que sí trae todo:

```
attributionSource.utmSource     → "Facebook"
attributionSource.campaign      → "[cbo] Escalado Éxito"
attributionSource.utmContent    → "ADS 1 - TO hace 5 años [G]"
attributionSource.sessionSource → "Paid Social"
attributionSource.fbclid / fbc / fbp → presentes
```

Así que la regla de origen **no puede leer los campos personalizados
directamente**: primero hay que copiar la atribución nativa a los campos, y
después ramificar. Eso además rellena los dos campos que hoy están vacíos, con
lo cual los reportes por campaña empiezan a existir.

### El caso que lo demuestra

`Jimena G. Fernández` (13-09): `source` = `[SURVEY - ORG SETTER]`,
`attributionSource.utmSource` = **Facebook**, campaña **`[CBO] Escalado ÉxiTO`**,
anuncio **`ADS 1 - TO hace 5 años [G]`**, aterrizó en
`japieaters.app/exitoenalimentacion`. Tags: `lead-setter-org`, `confirmada`.
Es una lead **de anuncios, que confirmó llamada, y Meta nunca recibió su
`Schedule`**.

> ⚠️ **Y son dos páginas, no una.** `/exitoenalimentacion` lleva la encuesta
> **ORG SETTER**, y `/postulacionexitoenalimentacion` lleva la encuesta **ORG**.
> Las dos reciben tráfico pagado. Al repuntear anuncios hay que mirar ambas.

## Por qué son tres entradas y un motor

Un solo workflow con los tres disparadores de encuesta no puede saber **cuál**
de los tres se disparó: GHL no ofrece esa condición en un if/else. Por eso la
estructura es:

- **3 entradas mínimas** (una por encuesta), que solo resuelven el origen.
- **1 motor compartido**, que tiene toda la lógica de tiers, oportunidad y Slack.

Son 4 workflows en vez de 3 cadenas completas duplicadas: la lógica de
calificación vive **una sola vez**, que es lo que importa.

---

## `01a · Entrada ADS`

**Disparador:** *Survey Submitted* → Survey is `[SURVEY - ADS] Postulación ÉxiTO en Alimentación` (`fB7k42z4Jr8ZRNmG3WX1`)

| # | Acción | Configuración |
|---|---|---|
| 1 | Update Contact Field | `UTM Source` ← `{{contact.attributionSource.utmSource}}` · `UTM Campaign` ← `{{contact.attributionSource.campaign}}` |
| 2 | Update Contact Field | **`Origen` = `ads`** |
| 3 | Add Contact Tag | `survey-ads`, `lead-ads` |
| 4 | Add to Workflow | `01 · Motor de Calificación` |

## `01b · Entrada ORG Bio`

**Disparador:** *Survey Submitted* → `[SURVEY - ORG] Postulación ÉxiTO en Alimentación` (`99dHSXOPhwj6kFpE7TOy`)

| # | Acción | Configuración |
|---|---|---|
| 1 | Update Contact Field | igual que en `01a` (copia la atribución) |
| 2 | **If/Else — `¿Vino de pago?`** | Rama `SÍ`: `UTM Source` *contains* `Facebook` **OR** *contains* `Instagram` **OR** `UTM Campaign` *is not empty* |
| 3 | [SÍ] Update Contact Field | **`Origen` = `ads`** |
| 4 | [SÍ] Add Contact Tag | `survey-org`, **`lead-ads`** ← el espejo correcto |
| 5 | [NO] Update Contact Field | **`Origen` = `org-bio`** |
| 6 | [NO] Add Contact Tag | `survey-org`, `lead-org` |
| 7 | Add to Workflow *(las dos ramas)* | `01 · Motor de Calificación` |

## `01c · Entrada ORG Setter`

**Disparador:** *Survey Submitted* → `[SURVEY - ORG SETTER] Postulación ÉxiTO en Alimentación` (`kwuMWA1b5FXattZtwLu0`)

Idéntico a `01b`, cambiando la rama `NO`: `Origen` = **`org-setter`** y tags
`survey-org`, `lead-setter-org`.

> **La prioridad es la atribución, no la encuesta.** Si la lead trae UTM de
> Facebook, es `ads` aunque haya llenado la encuesta orgánica. Ese único cambio
> es el que cierra la fuga.

---

## `01 · Motor de Calificación`

**Disparador:** ninguno. Se entra solo por *Add to Workflow* desde `01a/b/c`.
*(En GHL: dejarlo sin trigger y con "Allow Re-entry" desactivado.)*

| # | Acción | Configuración |
|---|---|---|
| 1 | **If/Else — `¿Profesional de salud?`** | `¿Cuál es tu profesión?` (`GnqxLlgs46jSBMT0rQsJ`) → rama `NO SALUD` si *is* `No soy profesional de la salud` |
| 2 | [NO SALUD] Update Contact Field | `Tier Score` = `tier-4-out` |
| 3 | [NO SALUD] Add Contact Tag | `tier-out`, `no-profesional-salud` |
| 4 | [NO SALUD] Create Opportunity | Pipeline `②` (`puyQKiA3cuYzADHpbgcr`) · etapa **`Calificada (Formulario)`** (`00332a6b…`) · status `lost` · lost reason `No es profesional de salud` → **FIN** |
| 5 | **If/Else — `Nivel de inversión`** | `¿Cuánto tienes pensado invertir?` (`KhN6Lbj24y9ru2GGtkFd`), 4 ramas |
| 6 | [No puede invertir] | `Tier Score` = `tier-4-out` · tags `tier-out`, `sin-presupuesto` · Create Opportunity en `②` etapa `Calificada (Formulario)`, status `lost`, motivo `Inversión` → **FIN** |
| 7 | [Bronce · $200-500] | `Tier Score` = `tier-3-bronce` · `Producto Recomendado` = `exito-alimentacion` · tags `tier-bronce`, `prospecto-exito` |
| 8 | [Silver · $500-1.000] | `tier-2-silver` · mismo producto · tags `tier-silver`, `prospecto-exito` |
| 9 | [Gold · $1.000-2.000] | `tier-1-gold` · mismo producto · tags `tier-gold`, `prospecto-exito`, `presupuesto-alto` |
| 10 | *(las 3 ramas que califican)* Create Opportunity | Pipeline `②` · etapa `Calificada (Formulario)` · status `open` · **source = `{{contact.source}}`** · `Monto Propuesto` según tier |
| 11 | **If/Else — `¿Decide sola?`** | `¿Quién debe estar contigo…?` (`TjRDcKidBqPeykkkWhPo`) → si **no** es `Solo yo, tomo la decisión por mi cuenta.` → Add Tag **`decisor-tercero`** |
| 12 | **Assign User** | Si `Origen` = `org-setter` → Valen. Si no → Anaís. *(Reemplaza los workflows `Asignación Anaís/Rafa`, de mayo.)* |
| 13 | Add Contact Tag | `wa-verde` + Update Field `Canal WhatsApp` = `verde` |
| 14 | Slack | Un mensaje al canal del tier, **con el origen en el texto** |
| 15 | *(rama None de cualquier if/else)* | Tag `lead-revisar` + Slack a `#leads-conflictos` → FIN |

### El mensaje de Slack (mismo formato para los tres tiers)

```
🥕 Nueva postulación {{contact.tier_score}}
{{contact.first_name}} {{contact.last_name}} · {{contact.phone}}
Origen: {{contact.origen}}  ·  Campaña: {{contact.utm_campaign}}
Profesión: {{contact.solo_acompaamos_a_profesionales_de_la_salud...}}
Situación: {{contact.cules_son_tus_principales_desafos...}}
Invierte: {{contact.para_recomendarte_la_mejor_opcin...}}
Decide: {{contact.si_al_finalizar_la_llamada...}}
```

**Diferencias con `[ADS] 1` actual, a propósito:**
- La oportunidad de descalificadas **sí lleva etapa** (hoy el nodo está en error, F-10).
- Se escribe `decisor-tercero`, que hoy existe como tag y nadie usa (F-14).
- Se asigna responsable acá, en vez de en dos workflows aparte de mayo (F-4).
- Todo esto existe **una sola vez**, no tres (F-1).

---

## Ajuste de los 4 workflows de Meta CAPI

No se reconstruyen: se **editan**, y es la edición con más impacto económico de
toda la lista. En cada uno:

| Workflow | Cambio |
|---|---|
| `Envío [Initiate Checkout]…` (`b24e3f47…`) | El if/else pasa de `Tags includes survey-ads + tier-gold/silver` a **`Origen is ads`** + tier gold/silver |
| `Envío [Lead]…` (`c3e365ba…`) | Añadir condición **`Origen is ads`** (hoy no filtra origen: dispara con cualquier agenda del calendario `[A]`) |
| `Envío [Schedule]…` (`9f8d6a2c…`) | Cambiar `Tags includes lead-ads` por **`Origen is ads`** · **borrar los dos `Wait 9999 days`** y poner *Remove from Workflow* |
| `Envío [Purchase]…` (`b32d69b5…`) | Cambiar `Tag equals lead-ads` por **`Origen is ads`** · **valor dinámico** `{{contact.monto_propuesto}}` en vez de `1.500` fijo · borrar el `Wait 9999 days` |

> Los `Wait 9999 days` retienen hoy 215 contactos dentro de esos workflows. Si
> el workflow no permite re-entrada, una lead que re-agenda **no vuelve a emitir
> el evento**.

---

## Prueba de aceptación de la Ola 1

Antes de dar por buena la ola, tres postulaciones de prueba (contacto propio,
teléfono propio):

1. **Entrar a `japieaters.app/postulacionexito-884187` con UTMs de ads pegados a
   mano** y postular con respuestas Gold → esperar: `Origen = ads`, tags
   `lead-ads` + `tier-gold`, oportunidad en `Calificada (Formulario)`, Slack en
   `#leads-gold`, y **el evento `InitiateCheckout` visible en el Events Manager
   de Meta**.
2. **Entrar a `japieaters.app/postulacionexitoenalimentacion` sin UTMs** y
   postular Silver → esperar: `Origen = org-bio`, `lead-org`, **sin** evento en
   Meta.
3. **Entrar a esa misma página CON UTMs de Facebook** → esperar:
   `Origen = ads`, `lead-ads`, **y evento en Meta**. Esta es la prueba que
   demuestra que la fuga quedó tapada.

Si la 3 pasa, la Ola 1 está lista y se pueden pausar los tres workflows viejos
de calificación (`834de977…`, `c98e6ba6…`, `8439135d…`).

---

# OLA 2 · Verde  ·  `02` y `03`

**Bloqueada hasta que Meta apruebe** `v3_equipo_ghost_1/2/3`. Mandarlas a
aprobación **antes** de empezar la Ola 1, para que corran en paralelo.

Estructura y copy: `02` y `03` en `Rediseno-Workflows-v2.md` §3, textos en
[`Guion-WhatsApp-Dos-Numeros.md`](./Guion-WhatsApp-Dos-Numeros.md) fases 0 y 1.
Se detallan nodo por nodo cuando lleguemos a la ola.

Dos cosas que ya se pueden dejar decididas:
- `02` dispara con `tier-gold`, `tier-silver` **y `tier-bronce`** (hoy el
  orgánico no dispara con bronce: esos leads no reciben nada — F-12).
- `02` se salta a los `org-setter` (Valen los trabaja a mano por DM).

# OLA 3 · Morado  ·  `04`, `05`, `06`

**Bloqueada hasta que el número morado esté conectado en GHL.** Confirmar
primero si es el `+56 9 6242 7929` del tag `wa: +56962427929`.

# OLA 4 · Closer  ·  `07`, `08`

**Bloqueada hasta crear el pipeline `③ Llamadas · Closer`** (7 etapas, §4 del
rediseño). La API de GHL no crea pipelines: va a mano.
`07` se construye **sin el borrado de oportunidades** (F-15).

---

## Checklist general

**Ola 1 — hoy**
- [ ] Crear carpeta `ÉxiTO v2`
- [ ] `01a · Entrada ADS`
- [ ] `01b · Entrada ORG Bio`
- [ ] `01c · Entrada ORG Setter`
- [ ] `01 · Motor de Calificación`
- [ ] Editar los 4 de CAPI (origen, waits, valor real)
- [ ] Las 3 pruebas de aceptación
- [ ] Pausar los 3 workflows viejos de calificación
- [ ] **En paralelo:** repuntear en Meta los anuncios que apuntan a las dos
      páginas orgánicas, y mandar las 3 plantillas a aprobación

**Después**
- [ ] Ola 2 · `02`, `03`
- [ ] Ola 3 · `04`, `05`, `06`
- [ ] Ola 4 · pipeline nuevo, `07`, `08`
- [ ] Limpieza: apagar `[SETTER - ORG] Formación`, normalizar probabilidades,
      borrar el draft huérfano y el tag `bronce+ revisar`
