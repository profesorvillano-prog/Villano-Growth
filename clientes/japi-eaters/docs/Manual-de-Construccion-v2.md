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

## La regla de origen (decisión del 14-09)

**El origen es la encuesta que llenó.** Punto. Las tres encuestas ya
corresponden una a una con los tres canales, así que la señal es limpia y no
hay nada que deducir:

| Encuesta | `Origen` | Conversión a Meta |
|---|---|---|
| `[SURVEY - ADS]` `fB7k42z4Jr8ZRNmG3WX1` | `ads` | **Sí** |
| `[SURVEY - ORG]` `99dHSXOPhwj6kFpE7TOy` | `org-bio` | No |
| `[SURVEY - ORG SETTER]` `kwuMWA1b5FXattZtwLu0` | `org-setter` | No |

Bio y setter son orgánicas de Instagram: no se le atribuyen a la campaña aunque
la persona haya tocado un anuncio antes.

**El UTM no enruta, avisa.** Si una postulación de bio o setter llega con
`attributionSource.utmSource` = Facebook, significa que hay un anuncio apuntando
a una página orgánica. Eso se arregla **en Meta**, repunteando el anuncio, no en
el workflow. El workflow solo pone el tag `revisar-origen` y avisa por Slack
para que se detecte el mismo día.

> Esto simplifica mucho la entrada: ya no hay if/else de UTM ni hace falta
> copiar la atribución a los campos para decidir. (Copiarla igual sigue siendo
> útil, pero para **reportar por campaña**, no para enrutar — ver `01a` paso 1.)

## Lo que realmente cambia según el origen

De todo el recorrido, **solo tres cosas dependen del canal**. El resto es
idéntico para las tres, y hoy está mantenido por triplicado:

| | ADS | ORG BIO | ORG SETTER |
|---|---|---|---|
| Evento a Meta | **sí** | no | no |
| Ghost automático si no agenda | sí | sí | **no** (Valen lo hace por DM) |
| Responsable y canal de Slack | Anaís | Anaís | Valen |
| Tier, oportunidad, bienvenida de Josefina, confirmación, recordatorios, handoff, post-llamada | ← **idéntico** → | | |

Ese cuadro es el argumento entero del rediseño: tres diferencias no justifican
tres cadenas completas.

### Dato que lo confirma

Los workflows de ghost disparan con los tags de tier, que se los pone cualquier
origen. Por eso `[ORG] 2 · Agenda + Ghost` lleva **430 inscripciones** cuando
como mucho hubo ~117 postulaciones orgánicas: entran todas las de ads también y
el primer nodo (`¿Es ORG?`) las expulsa. Lo mismo al revés en `[ADS] 2` (505).
En la cadena única eso desaparece: se entra una vez y se ramifica por `Origen`.

## Los dos calendarios se quedan

No hay que unificarlos. Con el origen en el contacto, el calendario deja de ser
la señal de enrutamiento y pasa a ser solo dónde se agenda:

- Los workflows de confirmación y recordatorios disparan con **cualquiera de los
  dos calendarios**, y ramifican por `Origen` si hace falta.
- Desaparece el modo de falla actual, en el que una lead que recibe el link del
  calendario "equivocado" ejecuta el flujo del otro origen.

---

## El link de agenda: una plantilla, el link correcto

El seguimiento de ghost manda un link de calendario, y no es el mismo para
todas: las de anuncios van al calendario `[A]` y las orgánicas al `[ORG]`.
Duplicar las plantillas por origen sería volver al problema de siempre.

**La solución es que el link viaje en el contacto, no en el workflow.**

### Las tres piezas

**1. Dos Custom Values** en `Settings → Custom Values` — ahí viven las URLs, y
si mañana cambia un calendario se edita en un solo lugar:

| Custom Value | Valor |
|---|---|
| `link_agenda_ads` | la URL del calendario `[A]` (`NwjgigzvJK9qcrjizbFn`) |
| `link_agenda_org` | la URL del calendario `[ORG]` (`MiDJPvkZrUk3nhVrrYvw`) |

**2. Un campo de contacto** — creado el 14-09: **`Link Agenda`**
(`contact.link_agenda`, ID `3QLBrZLptlGstgyTUfxM`). Guarda cuál de las dos le
toca a esta persona.

**3. Un nodo en cada entrada** que lo rellena:

| Entrada | `Link Agenda` = |
|---|---|
| `01a` ADS | `{{custom_values.link_agenda_ads}}` |
| `01b` ORG Bio | `{{custom_values.link_agenda_org}}` |
| `01c` ORG Setter | `{{custom_values.link_agenda_org}}` |

Después, en el nodo de envío de WhatsApp, la variable `{{2}}` de las tres
plantillas de ghost se mapea a **`{{contact.link_agenda}}`**. Una sola
plantilla, el link siempre correcto.

### Por qué así y no con un if/else en el ghost

Ramificar dentro de `02` por origen significa duplicar los tres nodos de envío
—seis— y volver a duplicarlos si mañana aparece un cuarto origen. Con el campo,
`02` no sabe ni le importa de dónde vino la lead: manda `{{contact.link_agenda}}`
y listo.

Y el campo sirve para más de una plantilla: `v3_cancelo_reagenda` también manda
el link, y usa exactamente el mismo.

### El cuidado obligatorio

**Si `Link Agenda` está vacío, el envío falla en silencio.** Por eso el nodo va
en las tres entradas, antes de cualquier envío, y conviene que la rama `None`
de cualquier if/else también lo escriba con el link orgánico como respaldo.

Para comprobarlo: postular de prueba por cada encuesta y mirar el contacto
**antes** de que salga el primer mensaje — el campo tiene que estar lleno.

---

## `01a · Entrada ADS`

**Disparador:** *Survey Submitted* → `[SURVEY - ADS] Postulación ÉxiTO en Alimentación` (`fB7k42z4Jr8ZRNmG3WX1`)

| # | Acción | Configuración |
|---|---|---|
| 1 | Update Contact Field | `UTM Source` ← `{{contact.attributionSource.utmSource}}` · `UTM Campaign` ← `{{contact.attributionSource.campaign}}` *(para reportar por campaña: hoy esos campos están vacíos)* |
| 2 | Update Contact Field | **`Origen` = `ads`** |
| 3 | Update Contact Field | **`Link Agenda` = `{{custom_values.link_agenda_ads}}`** |
| 4 | Add Contact Tag | `survey-ads`, `lead-ads` |
| 5 | Add to Workflow | `01 · Motor de Calificación` |

## `01b · Entrada ORG Bio`

**Disparador:** *Survey Submitted* → `[SURVEY - ORG]` (`99dHSXOPhwj6kFpE7TOy`)

| # | Acción | Configuración |
|---|---|---|
| 1 | Update Contact Field | igual que en `01a` |
| 2 | Update Contact Field | **`Origen` = `org-bio`** |
| 3 | Update Contact Field | **`Link Agenda` = `{{custom_values.link_agenda_org}}`** |
| 4 | Add Contact Tag | `survey-org`, `lead-org` |
| 5 | **If/Else — `¿Vino de un anuncio?`** | `UTM Source` *contains* `Facebook` **OR** *contains* `Instagram` |
| 6 | [SÍ] Add Contact Tag + Slack | Tag `revisar-origen` · aviso a `#leads-conflictos`: *"Postulación orgánica con UTM de anuncio — revisar a qué página apunta la campaña {{contact.utm_campaign}}"* |
| 7 | Add to Workflow *(las dos ramas)* | `01 · Motor de Calificación` |

**El origen no cambia en la rama SÍ.** Sigue siendo `org-bio`. El aviso existe
para arreglar el anuncio, no para reclasificar la lead.

## `01c · Entrada ORG Setter`

**Disparador:** *Survey Submitted* → `[SURVEY - ORG SETTER]` (`kwuMWA1b5FXattZtwLu0`)

Idéntico a `01b` con `Origen` = **`org-setter`**, `Link Agenda` =
`{{custom_values.link_agenda_org}}` y tags `survey-org`, `lead-setter-org`.

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
| `Envío [Lead]…` (`c3e365ba…`) | Añadir condición **`Origen is ads`**. Hoy no filtra origen — dispara con cualquier agenda del calendario `[A]`, así que una lead orgánica que agende ahí emite conversión sin deberla |
| `Envío [Schedule]…` (`9f8d6a2c…`) | Cambiar `Tags includes lead-ads` por **`Origen is ads`** · **borrar los dos `Wait 9999 days`** y poner *Remove from Workflow* |
| `Envío [Purchase]…` (`b32d69b5…`) | Cambiar `Tag equals lead-ads` por **`Origen is ads`** · **valor dinámico** `{{contact.monto_propuesto}}` en vez de `1.500` fijo · borrar el `Wait 9999 days` |

> Los `Wait 9999 days` retienen hoy 215 contactos dentro de esos workflows. Si
> el workflow no permite re-entrada, una lead que re-agenda **no vuelve a emitir
> el evento**.

---

## Prueba de aceptación de la Ola 1

Tres postulaciones de prueba con contacto propio:

1. **Encuesta de ADS**, respuestas Gold → esperar `Origen = ads`, tags
   `lead-ads` + `tier-gold`, oportunidad en `Calificada (Formulario)`, Slack en
   `#leads-gold`, y **el evento `InitiateCheckout` visible en el Events Manager
   de Meta**.
2. **Encuesta de BIO sin UTMs**, respuestas Silver → esperar `Origen = org-bio`,
   `lead-org`, **sin** evento en Meta, sin tag `revisar-origen`.
3. **Encuesta de BIO con UTMs de Facebook pegados a mano en la URL** → esperar
   `Origen = org-bio` *(no cambia)*, **sin** evento en Meta, **con** tag
   `revisar-origen` y el aviso en `#leads-conflictos`.

La 3 es la que prueba las dos decisiones a la vez: que el orgánico no manda
conversión aunque traiga UTM, y que el anuncio mal apuntado se detecta solo.

Si las tres pasan, se pausan los tres workflows viejos de calificación
(`834de977…`, `c98e6ba6…`, `8439135d…`).

---

# OLA 2 · Verde  ·  `02` y `03`

**Bloqueada hasta que Meta apruebe las 9 plantillas de**
[`Plantillas-WhatsApp-v3.md`](./Plantillas-WhatsApp-v3.md). Mandarlas **antes**
de empezar la Ola 1, para que la aprobación corra en paralelo.

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
- [x] Crear el tag `revisar-origen` — hecho vía API el 14-09 (`ULClzegm6PU1f6yMAriA`)
- [x] Crear el campo `Link Agenda` — hecho vía API el 14-09 (`3QLBrZLptlGstgyTUfxM`)
- [ ] Crear los Custom Values `link_agenda_ads` y `link_agenda_org`
- [ ] `01a · Entrada ADS`
- [ ] `01b · Entrada ORG Bio`
- [ ] `01c · Entrada ORG Setter`
- [ ] `01 · Motor de Calificación`
- [ ] Editar los 4 de CAPI (origen, waits, valor real)
- [ ] Las 3 pruebas de aceptación
- [ ] Pausar los 3 workflows viejos de calificación
- [ ] **En paralelo:** mandar las **9 plantillas** a aprobación
      ([`Plantillas-WhatsApp-v3.md`](./Plantillas-WhatsApp-v3.md)) y repuntear
      en Meta los anuncios que apuntan a las dos páginas orgánicas

**Después**
- [ ] Ola 2 · `02`, `03`
- [ ] Ola 3 · `04`, `05`, `06`
- [ ] Ola 4 · pipeline nuevo, `07`, `08`
- [ ] Limpieza: apagar `[SETTER - ORG] Formación`, normalizar probabilidades,
      borrar el draft huérfano y el tag `bronce+ revisar`
