# Construcción nodo por nodo — workflows `02` a `08`

> Especificación completa de los workflows que faltan después de la Ola 1, lista
> para transcribir en GoHighLevel **en modo borrador, sin publicar**.
> Escrito el 14-09-2026.
>
> Página operativa con checklist: https://claude.ai/code/artifact/56a5c1ee-e067-4327-9565-44f7a23312e8
>
> Arquitectura: [`Rediseno-Workflows-v2.md`](./Rediseno-Workflows-v2.md) ·
> orden de olas y Ola 1: [`Manual-de-Construccion-v2.md`](./Manual-de-Construccion-v2.md) ·
> copy: [`Guion-WhatsApp-Dos-Numeros.md`](./Guion-WhatsApp-Dos-Numeros.md) ·
> plantillas: [`Plantillas-WhatsApp-v3.md`](./Plantillas-WhatsApp-v3.md)

## Por qué esto es un documento y no un workflow ya creado

La API pública de GoHighLevel expone **una sola operación** en el dominio
`workflows`: `GET /workflows/`, de solo lectura. No hay endpoint de creación ni
de edición. Los workflows solo se construyen en el builder, a mano. Todo lo
demás de esta subcuenta —campos, tags, contactos, oportunidades— sí se puede
tocar por API, y por eso los campos `Origen`, `Link Agenda` y el tag
`revisar-origen` sí quedaron creados sin intervención.

---

## Los dos números y cómo se eligen en el builder

| | 🟩 **VERDE** | 🟪 **MORADO** |
|---|---|---|
| Dónde está | Acción nativa **WhatsApp** → remitente `+52 1 984 404 6192 - default` | **Apps → `Whatsapp, iMessage and SMS` → `Send Whatsapp Message`** |
| Qué manda | Solo plantillas aprobadas | Texto libre |
| Ventana 24 h | Aplica | No aplica |

El morado queda automatizado en **tres momentos y ninguno más**: el rescate de
confirmación de `03c`, la apertura del levantamiento en `04` y la recuperación
de no-show en `08`. Los recordatorios del día se los queda el verde, según la
repartición de `Plantillas-WhatsApp-v3.md` — si los dos números recuerdan lo
mismo, la lead recibe cinco o seis avisos en un día.

> ⚠️ **Verificar al construir:** la app del morado trae su propio `Wait Step`.
> Usa el **Wait nativo de GHL** para las esperas del flujo; el de la app solo si
> necesitas una espera de segundos (el nativo tiene piso de 1 minuto).

## Sobre "separados por ORG y ADS"

Los flujos **no se duplican por origen** — esa duplicación es exactamente la
falla F-1 que dispara todo el rediseño (v53 / v26 / v17 desfasados). La
separación existe en dos lugares y es visible en el canvas:

1. **Las tres entradas** (`01a` ADS, `01b` ORG Bio, `01c` ORG Setter), que son
   lo único que de verdad cambia por canal.
2. **Ramas con nombre `ADS` / `ORG BIO` / `ORG SETTER`** dentro de `02` y `03b`,
   que son los dos únicos puntos del recorrido donde el comportamiento cambia
   (qué plantilla lleva el link de qué calendario).

En todo lo demás, ADS y ORG hacen literalmente lo mismo.

## Piezas sin disparador

`03b`, `03c` y `05b` **no tienen trigger**: se entra por `Add to Workflow`,
igual que el motor `01`. No son cadenas paralelas, son subrutinas: cada una
existe una sola vez y la llaman varios puntos. Sin eso, el bloque
"sin confirmar" habría que copiarlo cinco veces en el canvas, y la próxima vez
que cambie el texto habría que acordarse de las cinco.

---

## Canales de Slack: nombre objetivo y canal a usar hoy

La consolidación de Slack es de la Ola 3. Mientras tanto se apunta a los
canales que ya existen:

| Nombre objetivo | Canal a elegir hoy en el dropdown |
|---|---|
| `#leads-gold` | `3-leads-gold` |
| `#leads-silver` | `2-leads-silver` |
| `#leads-bronce` | `1-leads-bronce` |
| `#nuevas-agendas` | `4-nuevas-agendas` |
| `#llamadas-preparacion` | `5-llamadas-preparacion` |
| `#confirmaciones-llamadas` | `6-confirmaciones-llamadas` |
| `#leads-conflictos` | `leads-conflictos` *(el público, no `1-leads-conflicto`)* |
| `#cierres` | ⚠️ **hay que crearlo en Slack** |

**Ningún nodo manda DM.** Todos los avisos van a canal; si hay que sumar a
alguien, se lo suma al canal y no se toca un solo workflow.

---

## Un cambio de plantilla que conviene hacer antes de mandarla

`v3_bienvenida_nudge` **necesita su propio botón `Ver vídeo`** (quick reply),
igual que `v3_bienvenida_jose`.

**Por qué.** El nodo de WhatsApp con *branches* activados abre una rama por
botón y una de `Time Out`. En cuanto salta el `Time Out` de A1 a los 2 minutos,
un clic posterior en el botón de A1 ya no engancha con nada: la lead toca "Ver
vídeo", no pasa nada, y el vídeo de Josefina —que es el centro del flujo— nunca
sale. Con el botón en el nudge, el clic tardío cae en la rama del nudge y sigue
el camino normal.

**Si esa plantilla ya se mandó a aprobación sin botón:** se puede construir
igual, pero el clic tardío queda sin automatizar y lo cubre el rescate del
morado de `03c` a los 45 minutos. Funciona; es peor.

---

# `02 · Ghost de agenda` 🟩

**Disparadores (3, Contact Tag → Tag added):** `tier-gold` · `tier-silver` · `tier-bronce`
*(los tres, incluido bronce: hoy el orgánico no dispara con bronce y esos leads no reciben nada — F-12)*
**Allow re-entry:** OFF

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Espera 10 min` | Wait | 10 minutos |
| 2 | `¿Ya agendó?` | If/Else | Rama `Ya agendó`: *Tags includes* `agendada` → **FIN** · Rama `None` → sigue |
| 3 | `Marca ghost` | Add Contact Tag | `ghost-agenda` |
| 4 | `Mover a Sin Agendar` | Create/Update Opportunity | ② `puyQKiA3cuYzADHpbgcr` · etapa `Sin Agendar (Ghost)` `69e32901-a38d-4591-a3f6-0b0c3cdab940` · status `open` |
| 5 | `Origen` | If/Else, 3 ramas | `ADS`: *Origen is* `ads` · `ORG BIO`: *Origen is* `org-bio` · `ORG SETTER`: *Origen is* `org-setter` · `None` → nodo 6n |

### Rama `ORG SETTER`

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 6s | `Tarea a Valen · ghost por DM` | Add Task | Asignada a **Valen** · vence en 1 h · *"Ghost por DM — {{contact.first_name}} no agendó · tier {{contact.tier_score}} · IG {{contact.usuario_instagram}}"* → **FIN** |

*Valen hace el ghosting a mano por DM. El verde no le escribe.*

### Rama `None`

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 6n | `Origen vacío` | Slack | `#leads-conflictos` — *"Lead con tier pero sin Origen: {{contact.first_name}} {{contact.last_name}}"* → **FIN** |

### Ramas `ADS` y `ORG BIO` — idénticas salvo la plantilla del primer mensaje

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 6 | `V1 · Primer toque` | WhatsApp 🟩 | `v3_ghost_1_ads` *(rama ADS)* / `v3_ghost_1_org` *(rama ORG BIO)* · `{{1}}` = `{{contact.first_name}}` · **branches OFF** |
| 7 | `Espera 4 h` | Wait | 4 horas · **ventana 09:00–21:00** |
| 8 | `¿Agendó tras V1?` | If/Else | *Tags includes* `agendada` → **FIN** · `None` → sigue |
| 9 | `V2 · Segundo toque` | WhatsApp 🟩 | `v3_ghost_2` · `{{1}}` = `{{contact.first_name}}` |
| 10 | `Espera al día siguiente` | Wait | Hasta el día siguiente a las **10:00** |
| 11 | `¿Agendó tras V2?` | If/Else | igual que el 8 |
| 12 | `V3 · Último toque` | WhatsApp 🟩 | `v3_ghost_3` · `{{1}}` = `{{contact.first_name}}` |
| 13 | `Espera 24 h` | Wait | 24 horas |
| 14 | `¿Agendó tras V3?` | If/Else | igual que el 8 |
| 15 | `Cerrar como perdida` | Create/Update Opportunity | ② · etapa `Sin Agendar (Ghost)` · status **`lost`** · lost reason `Ghosting` → **FIN** |

> **La ventana horaria del nodo 7 no es decorativa.** Sin ella, una postulación
> de las 23:40 recibe V1 a las 23:50 y V2 a las 3:50 de la madrugada.

**Salida única del flujo:** `03` quita del `02` en su primer nodo. El nodo 2 y
los `¿Agendó?` son la red de seguridad por si eso falla.

---

# `03 · Bienvenida Josefina` 🟩

**Disparadores (2, Customer Booked Appointment, *Contact only*):**
`In calendar` = `[A]` `NwjgigzvJK9qcrjizbFn` · `In calendar` = `[ORG]` `MiDJPvkZrUk3nhVrrYvw`
**Sin filtro de tag** — era la asimetría F-17.
**Allow re-entry:** ON *(las re-agendas vuelven a entrar)*

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Sale del ghost` | Remove from Workflow | `02 · Ghost de agenda` |
| 2 | `Marca agendada` | Add Contact Tag | `agendada` |
| 3 | `Limpia estados viejos` | Remove Contact Tag | `confirmada`, `confirmada-24h`, `sin-confirmar`, `ghost-agenda`, `re-agendada` |
| 4 | `Mover a Nueva Agenda` | Create/Update Opportunity | ② · `Nueva Agenda` `f0a84d2b-8df8-4c34-b91d-e3a104d89b32` · status `open` · **`Allow opportunity to move to any previous stage` ENCENDIDO** — ver abajo |
| 5 | `Aviso nueva agenda` | Slack | `#nuevas-agendas` — ver texto abajo |
| 6 | `¿Primera vez o re-agenda?` | If/Else | Rama `RE-AGENDA`: *Tags includes* `video-enviado` → nodo 10 · Rama `None` (primera vez) → nodo 7 |
| 7 | `A1 · Bienvenida Josefina` | WhatsApp 🟩 | `v3_bienvenida_jose` · `{{1}}` = `{{contact.first_name}}` · **branches ON** · **Time Out 2 min** |
| 7a | ↳ rama `Ver vídeo` → `Pasa a confirmación` | Add to Workflow | `03b · Confirmación de hora` → **FIN** |
| 7b | ↳ rama `Time Out` | → nodo 8 | |
| 7c | ↳ rama `Undelivered` → `Sin confirmar` | Add to Workflow | `03c · Rescate sin confirmar` → **FIN** |
| 8 | `A2 · Nudge` | WhatsApp 🟩 | `v3_bienvenida_nudge` · `{{1}}` = `{{contact.first_name}}` · **branches ON** · **Time Out 45 min** |
| 8a | ↳ rama `Ver vídeo` → `Pasa a confirmación` | Add to Workflow | `03b` → **FIN** |
| 8b | ↳ ramas `Time Out` y `Undelivered` → `Sin confirmar` | Add to Workflow | `03c` → **FIN** |
| 10 | `Re-agenda · a confirmación` | Add to Workflow | `03b` → **FIN** |

**Texto del nodo 5:**
```
📅 Nueva agenda · {{contact.origen}} · {{contact.tier_score}}

👤 [Contact Full Name]
📱 [Contact Phone]
🕒 {{appointment.start_time}}

Ya le salió la bienvenida de Josefina. Falta que confirme.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

**Se elimina el if/else `No toma decisión`** cuyas dos ramas ejecutaban
secuencias idénticas (F-14). Lo que esa pregunta aporta lo escribe el motor `01`
como tag `decisor-tercero`.

**Ya no se quitan los tags del otro origen.** `[ADS] 3` borraba `lead-org` y
`lead-setter-org`; eso destruía el rastro del origen para simular exclusión
mutua que hoy ya garantiza el campo `Origen`.

---

# `03b · Confirmación de hora` 🟩 — sin disparador

Se entra con `Add to Workflow` desde `03` (tres puntos) y desde `08` si vuelve.

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Marca vídeo enviado` | Add Contact Tag | `video-enviado` |
| 2 | `A3 · Vídeo y confirmar` | WhatsApp 🟩 | `v3_confirma_hora` · `{{1}}` = `{{contact.first_name}}` · `{{2}}` = `{{appointment.start_time}}` · **branches ON** · **Time Out 45 min** |
| | ↳ rama `Sí, confirmo` | → nodo 3 | |
| | ↳ rama `Cancelar` | → nodo 7 | |
| | ↳ ramas `Time Out` y `Undelivered` | → nodo 11 | |
| 3 | `Limpia sin-confirmar` | Remove Contact Tag | `sin-confirmar`, `ghost-agenda` |
| 4 | `A5 · Traspaso al equipo` | WhatsApp 🟩 | `v3_traspaso_equipo` · `{{1}}` = `{{contact.first_name}}` |
| 5 | `Marca confirmada` | Add Contact Tag | **`confirmada`** ← dispara `04` y `05` |
| 6 | `Mover a Confirmada` | Create/Update Opportunity | ② · `Confirmada (Agenda)` `65cf36f2-b55f-40e6-81c1-ac653dfa94a2` → **FIN** |
| 7 | `Origen para el link` | If/Else | Rama `ADS`: *Origen is* `ads` · Rama `None` (orgánico) |
| 8a | [ADS] `A4 · Reagenda ADS` | WhatsApp 🟩 | `v3_cancelo_reagenda_ads` |
| 8b | [None] `A4 · Reagenda ORG` | WhatsApp 🟩 | `v3_cancelo_reagenda_org` |
| 9 | `Mover a Re-Agendar` *(en las dos ramas)* | Create/Update Opportunity | ② · `Re-Agendar (Cancelada)` `e9f50af0-17e8-475d-8c76-32289aaba4c3` |
| 10 | `Aviso cancelación` *(en las dos ramas)* | Slack | `#leads-conflictos` — *"Canceló desde el botón: {{contact.first_name}} {{contact.last_name}} · {{appointment.start_time}}"* → **FIN** |
| 11 | `Sin confirmar` | Add to Workflow | `03c · Rescate sin confirmar` → **FIN** |

> El nodo 5 es el punto de encendido del morado. Todo lo que pasa después de
> `confirmada` vive en `04` y `05`, no acá.

---

# `03c · Rescate sin confirmar` 🟪 — sin disparador

Este workflow **es el arreglo de F-2**: hoy un clic tardío en "Sí, confirmo" no
dispara nada porque la ventana de 24 h de la plantilla expiró, y el rescate lo
hace Anaís a pulso. El morado no tiene ventana de 24 h, así que puede escribir
cuando sea.

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Marca sin confirmar` | Add Contact Tag | `sin-confirmar` |
| 2 | `Mover a Sin Confirmar` | Create/Update Opportunity | ② · `Sin Confirmar (Agenda)` `73ddbd14-0743-4740-8d01-3aaa4723193c` |
| 3 | `Aviso sin confirmar` | Slack | `#leads-conflictos` — *"Agendó y no confirmó: {{contact.first_name}} {{contact.last_name}} · {{appointment.start_time}}"* |
| 4 | `Espera 45 min` | Wait | 45 minutos · **ventana 09:00–21:00** |
| 5 | `¿Confirmó mientras?` | If/Else | *Tags includes* `confirmada` → **FIN** · `None` → sigue |
| 6 | `Rescate desde el morado` | 🟪 Apps → `Whatsapp, iMessage and SMS` → **Send Whatsapp Message** | texto abajo |
| 7 | `Tarea a Anaís` | Add Task | Asignada a **Anaís** · vence hoy · *"Seguir el rescate de confirmación si no responde — {{contact.first_name}}"* |

**Texto del nodo 6:**
```
Hola {{contact.first_name}}! Te quedó pendiente confirmar tu hora del {{appointment.start_time}}.
¿La dejamos tomada? Con un "sí" me basta 🙌
```

---

# `04 · Handoff a morado` 🟪

**Disparador:** Contact Tag → Tag added → **`confirmada`**
**Allow re-entry:** ON

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Espera 5 min` | Wait | 5 minutos |
| 2 | `M1 · Saludo` | 🟪 Send Whatsapp Message | *"Holaa {{contact.first_name}}, soy Anaís del equipo Japi Eaters. ¿Cómo estás? 😊"* |
| 3 | `Espera corta` | Wait | 1 minuto *(el guion pide 5 segundos; el Wait nativo tiene piso de 1 min — si la app del morado permite segundos con su propio `Wait Step`, usar ese)* |
| 4 | `M2 · Confirma la hora` | 🟪 Send Whatsapp Message | *"Agendaste una reunión para {{appointment.start_time}}, ¿es correcto?"* |
| 5 | `Aviso al equipo` | Slack | `#confirmaciones-llamadas` — texto abajo |
| 6 | `Tarea · Levantamiento M3-M6` | Add Task | Asignada a **Anaís** · vence en 2 h · descripción abajo |

**Texto del nodo 5:**
```
✅ Confirmada · {{contact.origen}} · {{contact.tier_score}}

👤 [Contact Full Name]
📱 [Contact Phone]
🕒 {{appointment.start_time}}

Chat del morado abierto. Toca el levantamiento M3-M6 y pegar el Resumen Lead.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

*(La situación que define la pregunta M4 va en la descripción de la tarea de
abajo, no en Slack: es una frase larga y convierte el canal en un muro.)*

**Descripción del nodo 6:**
```
Levantamiento M3-M6 por el morado y pegar el resumen en el campo Resumen Lead.
La pregunta M4 se elige según lo que marcó en "¿Con qué situación te identificas más hoy?":
· Deriva casos       → ¿Cuántos has tenido que derivar este año?
· Tiene casos sin resultado → ¿Cuál es tu desafío hoy con estos peques?
· No tiene casos aún → ¿Qué crees que te falta para sentirte 100% lista?
```

> ⚠️ **Una línea a confirmar:** el nodo 2 dice "soy Anaís". El guion original
> decía "soy [Closer]", pero el morado lo opera Anaís para la nutrición y el
> closer está cambiando. Si prefieres que abra el closer, es cambiar esa línea.

> ⚠️ **El `Resumen Lead` es el único puente** entre la conversación de WhatsApp
> y la llamada. Si nadie lo pega, `05b` y `07` mandan un Slack vacío al closer.

---

# `05 · Recordatorios` 🟩

**Disparador:** Contact Tag → Tag added → **`confirmada`**
*(no la agenda cruda: hoy los recordatorios salen aunque la lead nunca confirmara)*
**Allow re-entry:** ON

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `24 h antes` | Wait | **Before appointment** · 24 horas |
| 2 | `Mover a Pre-Llamada` | Create/Update Opportunity | ② · `Pre-Llamada (Preparación)` `5a9b20ca-6ddb-4ac6-9591-f33801908379` |
| 3 | `Aviso grabar vídeo` | Slack | `#llamadas-preparacion` — texto abajo |
| 4 | `M8 · Recordatorio 24 h` | WhatsApp 🟩 | `v3_recordatorio_24h` · `{{1}}` = `{{contact.first_name}}` · `{{2}}` = `{{appointment.start_time}}` · **branches ON** · **Time Out 3 h** |
| 5 | ↳ rama `Confirmo mi asistencia` → `Marca confirmada 24h` | Add Contact Tag | `confirmada-24h` |
| 6 | `Mover a Llamada Confirmada` | Create/Update Opportunity | ② · `Llamada Confirmada` `6414b758-a8fd-4795-91f1-de4f0a147bcb` ← **dispara `07`** |
| 7 | `Tramo del día` | Add to Workflow | `05b · Día de la llamada` → **FIN** |
| 8 | ↳ ramas `Time Out` y `Undelivered` → `Aviso sin confirmar 24h` | Slack | `#leads-conflictos` — *"No confirmó el recordatorio de 24 h: {{contact.first_name}} · {{appointment.start_time}}"* |
| 9 | `Tarea confirmar a mano` | Add Task | Asignada a **Anaís** · vence en 3 h · *"Confirmar por el morado — {{contact.first_name}}"* |
| 10 | `Tramo del día` | Add to Workflow | `05b` → **FIN** |

**Texto del nodo 3:**
```
🎥 Grabar vídeo personalizado · {{contact.tier_score}}

👤 [Contact Full Name]
🕒 Llamada mañana {{appointment.start_time}}

El resumen de la lead está en la ficha, en Resumen Lead.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

> ⚠️ **Lo único de todo este documento que hay que verificar en el builder:**
> que un Wait de tipo *"before appointment"* resuelva la cita del contacto
> cuando el disparador es **un tag** y no la reserva. Si no la resuelve, la
> alternativa es disparar `05` con *Customer Booked Appointment* y poner en el
> primer nodo un If/Else que espere a que exista el tag `confirmada`.

### Las tres salidas del recordatorio de 24 h

| Qué hace la lead | Qué hace `05` |
|---|---|
| **Toca `Confirmo mi asistencia`** | Tag `confirmada-24h`, pasa a `Llamada Confirmada`, los recordatorios siguen |
| **Responde con texto** | GHL corta la rama de espera y la conversación queda abierta para Anaís. **Activar `Stop on response` en el nodo 4** |
| **No hace nada en 3 h** | Aviso a `#leads-conflictos` + tarea para Anaís |

**La pausa del segundo caso no es opcional.** Si alguien escribe "no voy a
poder" y a la mañana siguiente igual le llega *"hoy es nuestra llamada"*, el
sistema queda peor que sin automatización.

---

# `05b · Día de la llamada` 🟩 — sin disparador

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `4 h antes` | Wait | **Before appointment** · 4 horas · **ventana 08:00–22:00** |
| 2 | `Recordatorio 4 h` | WhatsApp 🟩 | `v3_recordatorio_8h` · `{{1}}` = `{{contact.first_name}}` · `{{2}}` = `{{appointment.only_start_time}}` |
| 3 | `1 h antes` | Wait | **Before appointment** · 1 hora |
| 4 | `Recordatorio 1 h` | WhatsApp 🟩 | `v3_recordatorio_1h` · `{{1}}` = `{{contact.first_name}}` · `{{2}}` = `{{appointment.meeting_location}}` |
| 5 | `35 min antes` | Wait | **Before appointment** · 35 minutos |
| 6 | `Aviso al closer` | Slack | `#confirmaciones-llamadas` — texto abajo, **mencionando al closer en el canal, no por DM** |

**Texto del nodo 6:**
```
⏰ En 35 min · {{contact.tier_score}} · {{contact.origen}}

👤 [Contact Full Name]
📱 [Contact Phone]
🔴 {{appointment.meeting_location}}

@closer el Resumen Lead está en la ficha.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

> **El nombre de la plantilla `v3_recordatorio_8h` está mal y se queda así:**
> el flujo la manda **4 horas antes**. Renombrarla obligaría a crear otra y
> volver a esperar aprobación.

> **La ventana del nodo 1 tampoco es decorativa.** 4 horas antes de una reunión
> de las 9:00 son las 5:00 de la mañana.

**El morado no manda nada acá.** El toque humano del morado es M11, a la hora,
manual: *"Ya estoy por aquí, te espero adentro"*. Es el que más sube el show y
es el único que no conviene automatizar.

---

# `06 · Cancelación y re-agenda`

**Disparador:** Appointment Status · *Contact only* · `Appointment status is` = **`cancelled`** · `Event type` = **`Any`**
*(el orgánico hoy filtra `Normal` y se le escapan casos — F-3)*
Sin filtro de calendario, o los dos.

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Frenar recordatorios` | Remove from Workflow | `05 · Recordatorios` |
| 2 | `Frenar tramo del día` | Remove from Workflow | `05b · Día de la llamada` |
| 3 | `Frenar bienvenida` | Remove from Workflow | `03 · Bienvenida Josefina` |
| 4 | `Frenar confirmación` | Remove from Workflow | `03b · Confirmación de hora` |
| 5 | `Frenar rescate` | Remove from Workflow | `03c · Rescate sin confirmar` |
| 6 | `Quitar confirmada` | Remove Contact Tag | `confirmada`, `confirmada-24h`, `agendada` |
| 7 | `Marca re-agendada` | Add Contact Tag | `re-agendada` |
| 8 | `Mover a Re-Agendar` | Create/Update Opportunity | ② · `Re-Agendar (Cancelada)` `e9f50af0-17e8-475d-8c76-32289aaba4c3` |
| 9 | `Aviso cancelación` | Slack | `#leads-conflictos` — *"Canceló la cita: {{contact.first_name}} {{contact.last_name}} · era {{appointment.start_time}} · Origen {{contact.origen}}"* |

> Si el nodo *Remove from Workflow* acepta varios workflows a la vez, los 1-5
> son **un solo nodo**. Si acepta uno, son cinco.

**Los dos `4.1` de hoy solo frenan los recordatorios** y dejan la oportunidad en
su etapa activa hasta que alguien la mueve a mano, con la cadena de confirmación
todavía viva. Por eso llevan congelados desde el 26-06.

---

# `07 · Handoff a Closer`

**Disparador:** Opportunity Stage Changed → pipeline `②` `puyQKiA3cuYzADHpbgcr` → etapa `Llamada Confirmada` `6414b758-a8fd-4795-91f1-de4f0a147bcb`
**Bloqueado** hasta crear el pipeline `③ Llamadas · Closer` (7 etapas, §4 del rediseño).

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `Crear en pipeline del closer` | Create Opportunity | pipeline `③ Llamadas · Closer` *(ID pendiente)* · etapa `Llamada Confirmada` · status `open` · **monto `{{contact.monto_propuesto}}`** · source `{{contact.origen}}` |
| 2 | `Cerrar la de Anaís como ganada` | Update Opportunity | ② · status **`won`** — **y se queda ahí** |
| 3 | `Marca en closer` | Add Contact Tag | `en-closer` |
| 4 | `Aviso al closer` | Slack | `#confirmaciones-llamadas` — texto abajo |

**Texto del nodo 4:**
```
🎯 Lista para el closer · {{contact.tier_score}} · {{contact.origen}}

👤 [Contact Full Name]
📱 [Contact Phone]
🕒 {{appointment.start_time}}
💵 {{contact.monto_propuesto}}

Ya está creada en el pipeline del closer.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

> ⚠️ **El nodo 2 es la corrección de F-15.** Hoy `[Handoff] 5` **borra todas**
> las oportunidades del contacto en el pipeline de origen. Eso destruye el
> histórico de conversión por etapa, que es exactamente la base de las métricas
> que se quieren montar. La oportunidad de Anaís se marca ganada y se queda:
> ese `won` es el KPI de Anaís.

---

# `08 · Post-llamada`

**Disparador:** Opportunity Stage Changed → pipeline `③ Llamadas · Closer`
**Reemplaza** los cuatro workflows del 25-08 (`1 · Asistió`, `2 · No-Show`, `3 · Re-agendada`, `4 · Reserva pagada`).

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 1 | `¿Qué pasó en la llamada?` | If/Else, 4 ramas | `Asistió` · `No-Show` · `Re-Agendada` · `Reserva` (etapa del pipeline ③) · `None` → **FIN** |

### Rama `Asistió`

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 2 | `Marca asistió` | Add Contact Tag | `asistio` |
| 3 | `Aviso asistió` | Slack | `#confirmaciones-llamadas` — *"Asistió: {{contact.first_name}} {{contact.last_name}} · {{contact.tier_score}} · {{contact.origen}}"* → **FIN** |

### Rama `No-Show` 🟪

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 4 | `Marca no-show` | Add Contact Tag | `no-show` |
| 5 | `Aviso no-show` | Slack | `#leads-conflictos` — *"No-show: {{contact.first_name}} · era {{appointment.start_time}} · {{contact.origen}}"* |
| 6 | `Espera 30 min` | Wait | 30 minutos |
| 7 | `Recuperación 1` | 🟪 Send Whatsapp Message | *"Hola {{contact.first_name}}! Te esperamos en la reunión y no pudimos conectar 🙌 ¿Quieres que busquemos otro horario?"* |
| 8 | `Espera 1 día` | Wait | 1 día · **ventana 09:00–21:00** |
| 9 | `¿Respondió?` | If/Else | *Tags includes* `re-agendada` → **FIN** · `None` → sigue |
| 10 | `Recuperación 2` | 🟪 Send Whatsapp Message | *"{{contact.first_name}}, ¿te dejamos un nuevo horario o prefieres que cerremos tu postulación por ahora?"* |
| 11 | `Tarea a Anaís` | Add Task | vence en 1 día · *"Cerrar o recuperar el no-show — {{contact.first_name}}"* → **FIN** |

### Rama `Re-Agendada`

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 12 | `Limpia estados` | Remove Contact Tag | `confirmada`, `confirmada-24h`, `video-enviado`, `no-show` |
| 13 | `Marca re-agendada` | Add Contact Tag | `re-agendada` |
| 14 | `Aviso re-agenda` | Slack | `#leads-conflictos` → **FIN** |

*Al quitar `video-enviado`, cuando tome la nueva hora el disparador de `03` la
trata como primera vez y vuelve a recibir el vídeo de Josefina. Si prefieres que
no lo reciba dos veces, deja `video-enviado` puesto.*

### Rama `Reserva`

| # | Nombre del nodo | Acción | Configuración |
|---|---|---|---|
| 15 | `Marca reserva pagada` | Add Contact Tag | `reserva-pagada` |
| 16 | `Dispara onboarding` | Add to Workflow | `11 · Onboarding Venta High Ticket` |
| 17 | `Aviso cierre` | Slack | `#cierres` — *"💸 Reserva pagada: {{contact.first_name}} {{contact.last_name}} · {{contact.monto_propuesto}} · Origen {{contact.origen}}"* → **FIN** |

---

## Orden de construcción y qué bloquea a qué

| Orden | Workflow | Bloqueado por |
|---|---|---|
| 1 | `01a` · `01b` · `01c` · `01` | **nada** |
| 2 | Editar los 4 de Meta CAPI | nada |
| 3 | `06 · Cancelación` | nada *(no manda mensajes)* |
| 4 | `03c` · `04` · el nodo morado de `08` | número morado conectado en GHL |
| 5 | `02` · `03` · `03b` | las 13 plantillas aprobadas por Meta |
| 6 | `05` · `05b` | plantillas + morado |
| 7 | `07` · `08` | pipeline `③ Llamadas · Closer` creado |

**`06` se puede construir y publicar hoy**, y arregla solo la falla F-3 sin
depender de nada. Es la única de la lista que da una ganancia inmediata sin
esperar a nadie.

## Dependencias externas que siguen abiertas

- **Las 13 plantillas**, con el botón `Ver vídeo` agregado a `v3_bienvenida_nudge`.
- **El vídeo de Josefina** para `v3_confirma_hora`.
- **El número morado conectado** — confirmar si es el `+56 9 6242 7929` del tag
  `wa: +56962427929`.
- **El pipeline `③ Llamadas · Closer`** con sus 7 etapas y las probabilidades
  reales.
- **El canal `#cierres` en Slack.**
- **`Monto Propuesto` no lo llena nadie.** Mientras siga vacío, el nodo 1 de
  `07` crea la oportunidad del closer sin monto y el `Purchase` de Meta no tiene
  valor real que mandar. Hay que decidir quién lo escribe: el motor `01` según
  el tier, o Anaís a mano en el levantamiento.

## Cuando se publiquen: qué pausar y en qué orden

Nada se borra. Se pausa, y si algo sale mal se vuelve a publicar en un clic.

| Al publicar | Pausar |
|---|---|
| `01a/b/c` + `01` | `[ADS] 1` `834de977…` · `[ORG] 1` `c98e6ba6…` · `[SETTER-ORG] 1` `8439135d…` |
| `02` | `[ADS] 2` `62c857b2…` · `[ORG] 2` |
| `03` + `03b` + `03c` | `[ADS] 3` `4e3de298…` · `[ORG] 3` |
| `05` + `05b` | `[ADS] 4` · `[ORG] 4` `5296147d…` |
| `06` | `[ADS] 4.1` · `[ORG] 4.1` `12157a7b…` |
| `07` | `[Handoff] 5` |
| `08` | `1 · Asistió` · `2 · No-Show` · `3 · Re-agendada` · `4 · Reserva pagada` |
| — | `Asignación Anaís` · `Asignación Rafa` *(los absorbe el motor `01`)* |


### El toggle de "mover a una etapa anterior"

En el panel de oportunidad hay un `Allow opportunity to move to any previous
stage in pipeline`, **apagado por defecto**. En los nodos que *crean* da igual;
en los que *mueven* una oportunidad existente, decide si el movimiento ocurre.

**Donde muerde es en `03`.** Una lead que canceló está en `Re-Agendar
(Cancelada)`, la etapa 12 del pipeline ②. `Nueva Agenda` es la 6. Ese movimiento
es hacia atrás, así que con el toggle apagado **no pasa nada**: la lead vuelve a
agendar, recibe la bienvenida y los recordatorios, y la oportunidad se queda en
"Cancelada" para siempre. El workflow sigue corriendo normal y el pipeline
miente.

Regla: **encendido en todo nodo que mueva una oportunidad existente**, apagado
en los que crean.

### `Opportunity Source` va con el origen

GHL avisa bajo el campo que, si queda vacío, la oportunidad hereda el *contact
source* — el nombre del formulario, no el canal. Ponerlo en `{{contact.origen}}`
en **todos** los nodos de oportunidad, incluidas las descalificadas: la primera
tasa del embudo es *postulaciones con tier ≠ out sobre postulaciones*, y sin
origen en las perdidas esa tasa no se puede cortar por canal.

---

## El formato de los avisos de Slack

Tomado del mensaje que ya usaban los workflows viejos, que funciona:

```
🥉 Nuevo lead BRONCE · {{contact.origen}}

👤 [Contact Full Name]
📱 [Contact Phone]
📧 [Contact Email]

Esperar respuesta del WhatsApp automático y ver si agenda.
🔗 https://app.gohighlevel.com/v2/location/kdmmFxEbJjSpgMtbaZ6F/contacts/detail/{{contact.id}}
```

**Cuatro partes.** Encabezado con emoji, qué pasó y de dónde viene. Campos uno
por línea con su emoji. **Una línea de qué hacer** — es la que hace la
diferencia: sin ella, quien lee el canal sabe que pasó algo pero no si le toca
a él. Y el link a la ficha, que es lo que permite que el mensaje sea corto.

**Lo que no va nunca:** las respuestas completas del survey. Son frases largas
y con veinte postulaciones al día convierten el canal en un muro. El detalle
está en la ficha, a un clic.

**El tier va escrito a mano donde es fijo.** En el motor, dentro de la rama
Bronce, se escribe `BRONCE` con 🥉 — no hay riesgo de que salga mal. Del `03` en
adelante el workflow ya no sabe en qué rama estuvo, así que ahí sale el token
`{{contact.tier_score}}`, que se imprime como `tier-3-bronce`. Se lee a máquina,
pero un campo nuevo con el tier en limpio sería un dato duplicado más que
mantener y por una palabra no lo vale.

**Los campos se insertan con el selector de tokens**, no escritos: quedan como
los chips azules de los mensajes actuales. Y hay que verificar que exista
`{{contact.id}}` para armar el link — si no está, dejar teléfono y email, que es
lo que permite encontrar a la persona a mano.

### Los otros seis avisos

| Workflow → canal | Encabezado y línea de acción |
|---|---|
| `01 · Motor`, ramas `None` → `#leads-conflictos` | `⚠️ Postulación fuera de flujo · {{contact.origen}}` · *"No calificó por ningún camino: revisar qué respondió en el formulario."* |
| `03c` → `#leads-conflictos` | `🟠 Agendó y no confirmó · {{contact.origen}}` · *"A los 45 min le escribe el morado solo. Si tampoco responde, va a mano."* |
| `05`, sin confirmar en 3 h → `#leads-conflictos` | `🟠 No confirmó el recordatorio de 24 h · {{contact.origen}}` · *"Confirmar a mano por el morado antes de que se pierda el cupo."* |
| `06` → `#leads-conflictos` | `❌ Canceló la cita · {{contact.origen}}` · *"Recordatorios frenados y oportunidad movida a Re-Agendar."* |
| `08` Asistió → `#confirmaciones-llamadas` | `🟢 Asistió · {{contact.tier_score}} · {{contact.origen}}` · sin línea de acción |
| `08` No-Show → `#leads-conflictos` | `🔴 No-show · {{contact.tier_score}} · {{contact.origen}}` · *"El morado le escribe en 30 min. Si no responde en 24 h, va a mano."* |
| `08` Reserva → `#cierres` | `💸 Reserva pagada · {{contact.tier_score}} · {{contact.origen}}` + `💵 {{contact.monto_propuesto}}` · *"Onboarding disparado."* |

---

## Los tres ajustes de Settings

No se ven en el canvas y son los que rompen flujos enteros sin dejar rastro.
Van en **Settings**, arriba a la derecha del builder, y **aplican a todo el
workflow** — no son por nodo.

### El que rompe todo: `Stop on Response` mata los botones

Un clic en un botón de plantilla —`Ver vídeo`, `Sí, confirmo`, `Confirmo mi
asistencia`— **le llega a GHL como un mensaje entrante**, igual que si la lead
escribiera. Con `Stop on Response` activado, ese clic **detiene el workflow
antes de que la rama del botón se resuelva**: la lead toca el botón, el flujo se
muere ahí, y el vídeo de Josefina no sale nunca. Sin error y sin aviso.

Por eso en `03`, `03b` y `05` va **apagado**.

| Workflow | Re-Entry | Multiple Opp. | Stop on Response |
|---|---|---|---|
| `01a` `01b` `01c` | **OFF** — es lo que hace cumplir "el origen se escribe una sola vez" | OFF | OFF |
| `01 · Motor` | **ON** — se entra por *Add to Workflow* desde tres lados | **OFF** — acá se crea la oportunidad | OFF |
| `02 · Ghost` | OFF | OFF | **ON** — si responde V1 preguntando el precio, V2 y V3 no pueden salir encima de Anaís |
| `03 · Bienvenida` | **ON** — las re-agendas vuelven a entrar | OFF | **OFF** — tiene botones |
| `03b · Confirmación` | ON | OFF | **OFF** — tiene botones |
| `03c · Rescate` | ON | OFF | **ON** — si ya contestó algo, el "te quedó pendiente confirmar" sobra |
| `04 · Handoff morado` | ON | OFF | **OFF** — si contesta M1, M2 igual tiene que salir |
| `05 · Recordatorios` | ON | OFF | **OFF** — tiene botón |
| `05b · Día de la llamada` | ON | OFF | **ON** — si escribió "no voy a poder", se cortan los recordatorios del día |
| `06 · Cancelación` | ON | OFF | **OFF** — es limpieza, no puede frenarse |
| `07 · Handoff Closer` | ON | **OFF** — re-entra sin duplicar la oportunidad | OFF |
| `08 · Post-llamada` | **ON** — obligatorio: la etapa cambia varias veces y con OFF solo dispara la primera | OFF | **ON** — si responde la recuperación de no-show, el segundo mensaje no sale |
| Los 4 de Meta CAPI | **ON** — una lead que re-agenda tiene que volver a emitir `Schedule` | OFF | OFF |

### `Allow Multiple Opportunities` va en OFF en todos, sin excepción

Es el ajuste que evita que la misma lead termine con dos oportunidades abiertas.
Ya pasó: en el pipeline obsoleto `[SETTER - ORG] Formación` quedaron cuatro
huérfanas duplicadas (F-5), y mientras existan, cualquier tasa de conversión
cuenta doble.

Con OFF, si un workflow re-entra y vuelve a pasar por un *Create Opportunity*,
actualiza la que ya existe en vez de crear otra. Por eso `01 · Motor` puede
tener Re-Entry en ON sin riesgo.

### La ventana horaria también va acá

En las tablas de arriba aparece "ventana 09:00–21:00" dentro de varios nodos
*Wait*. Se puede, pero el **`Time Window` de Settings es mejor**: aplica a todos
los envíos del workflow de una vez, en vez de acordarse nodo por nodo.

Ponlo en `02` —una postulación de las 23:40 recibiría V1 a las 23:50 y V2 a las
3:50—, en `05b` —4 h antes de una reunión de las 9:00 son las 5:00 de la
mañana— y en `08`. Y revisa la zona horaria de la cuenta: hay leads en Chile,
Argentina y Uruguay.

---

## Prompt para construirlos con Cowork

Cowork sí puede manejar el navegador y hacer los clics. Este prompt le da las
reglas y lo manda a leer la página operativa como especificación.

```
Eres un operador de GoHighLevel. Vas a construir workflows en el navegador, en la subcuenta Japi Eaters (kdmmFxEbJjSpgMtbaZ6F), dentro de la carpeta "Workflows ÉxiTO".

La especificación completa está en esta página y es la única fuente de verdad:
https://claude.ai/code/artifact/56a5c1ee-e067-4327-9565-44f7a23312e8

Ábrela primero y léela entera antes de tocar nada. Si algo de este prompt y algo de esa página se contradicen, manda la página.

═══ REGLAS QUE NO SE ROMPEN ═══

1. Todo queda en Draft. No publiques ningún workflow. No toques "Publish" ni el switch de estado.

2. No edites, no pauses y no borres ningún workflow existente. Los viejos siguen corriendo y se cortan después, a mano.

3. Cada nodo lleva el nombre que dice la especificación, escrito en el campo de nombre del nodo — ese que GHL rellena por defecto con "Add Contact Tag" o "Wait". Si un nodo queda con el nombre por defecto, está mal: el canvas tiene que leerse sin abrir los nodos.

4. Los textos de las opciones en los If/Else se copian letra por letra, con tildes, puntos y barras, tal como aparecen en el dropdown de GHL. Una tilde de menos y esa rama no matchea nunca: todas las leads caen en None.

5. Los operadores OR hay que ponerlos a mano. GHL pone AND por defecto, y con AND una condición de varias opciones no se cumple jamás.

6. Si una opción, un canal de Slack, una plantilla o una etapa no existe en el dropdown: para y anótalo. No elijas "el más parecido" y no inventes nombres. Al final entregas la lista de lo que faltó.

═══ ORDEN DE CONSTRUCCIÓN ═══

1. 06 · Cancelación y re-agenda — el único que no depende de nada.
2. 03c y 04 — solo si el número morado ya aparece como app conectada.
3. 02, 03 y 03b — solo si las plantillas v3_* ya aparecen en el selector de WhatsApp.
4. 05 y 05b.
5. 07 y 08 — solo si ya existe el pipeline "③ Llamadas · Closer".

Si un workflow depende de algo que todavía no existe, créalo igual con los nodos que sí se puedan configurar y deja anotado cuáles quedaron incompletos.

═══ CÓMO SE CONSTRUYE EN GHL ═══

· No se construye en orden lógico, se construye hacia adentro: colocas la condición y después entras rama por rama a llenarla.

· Las ramas de un If/Else nunca se vuelven a juntar. Todo lo que va después de una bifurcación hay que repetirlo dentro de cada rama. La especificación ya está escrita rama por rama; síguela tal cual.

· La rama None de cada If/Else no se deja vacía. Es la red de seguridad: sin ella, una lead con un campo raro desaparece sin dejar rastro.

· WhatsApp verde = la acción nativa "WhatsApp", remitente "+52 1 984 404 6192 - default". Solo plantillas aprobadas.

· WhatsApp morado = Apps → "Whatsapp, iMessage and SMS" → "Send Whatsapp Message". Texto libre.

· Los nodos de WhatsApp con botón llevan branches activados: cada botón abre su propia rama, más Time Out y Undelivered. El Time Out de cada uno está en la especificación y no es el que trae por defecto.

· Usa el Wait nativo de GHL para las esperas. La app del morado trae su propio Wait Step; ese solo si hace falta una espera de segundos.

· Donde la especificación dice "ventana 09:00–21:00", es la opción de la ventana horaria dentro del nodo Wait. No es opcional: sin ella salen mensajes de madrugada.

═══ AL TERMINAR ═══

Entrega:
· Qué workflows quedaron creados y con cuántos nodos cada uno.
· Qué nodos quedaron incompletos y por qué — plantilla no aprobada, canal que no existe, etapa que falta.
· Cualquier opción de survey cuyo texto en GHL no coincida exactamente con el de la especificación.
· Captura del canvas de cada workflow.

No publiques nada. No borres nada.
```

**Revisa el `06` antes de dejarlo seguir.** Es el primero de la lista y el más
simple. Si ese quedó con los nodos nombrados, las ramas `None` llenas y nada
publicado, el resto va a salir bien. Si salió mal, sale mal nueve veces.
