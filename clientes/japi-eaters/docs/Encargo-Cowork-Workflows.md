# Encargo para Cowork — inventario de workflows

Pegar tal cual en Cowork. Es de **solo lectura**: no toca nada en GHL.

---

## El encargo

> Necesito que documentes los workflows de GoHighLevel de la subcuenta **Japi
> Eaters** (`kdmmFxEbJjSpgMtbaZ6F`). Es una tarea de **solo lectura**.
>
> **REGLA DURA: no edites, no pauses, no publiques, no borres y no muevas nada.**
> Solo abrir, leer y documentar. Si algo pide confirmar cambios, cancelá.
>
> ### Dónde
>
> `Automation → Workflows → HIGH TICKET FUNNEL → Marketing`, y dentro las dos
> carpetas:
>
> 1. `[ADS] Anuncios Facebook`
> 2. `[ORG] Instagram Orgánico`
>
> Abrí **todos** los workflows de esas dos carpetas, uno por uno.
>
> ### Qué capturar de cada uno
>
> ```
> ### <nombre exacto del workflow>
> - Carpeta: [ADS] | [ORG]
> - Estado: Publicado | Borrador
> - Enrollments totales / activos:
> - Disparador(es): tipo exacto y su configuración
> - Acciones, en orden:
>   1. <tipo de acción> — <configuración: a qué etapa, qué etiqueta, qué mensaje, cuánta espera>
>   2. ...
> - Ramas / condiciones: qué evalúan y a dónde van
> - TOCA ETAPAS DE PIPELINE: SÍ / NO
>   - Si SÍ: pipeline y nombre exacto de cada etapa que crea, mueve o consulta
> - Etiquetas que añade o quita:
> - Mensajes que envía: canal (WhatsApp / SMS / Email) y, si se ve, desde qué número
> ```
>
> **Copiá los nombres exactos, no los parafrasees.** Los nombres de etapa son la
> clave para cruzar esto con la reestructuración.
>
> ### Prioridad
>
> Si tenés que recortar por tiempo, lo importante es **el disparador y las
> acciones que escriben en etapas de pipeline o en etiquetas**. El copy exacto de
> cada mensaje es secundario: con saber que manda un mensaje y por qué canal
> alcanza.
>
> ### Al final, una tabla resumen
>
> | Workflow | Carpeta | Estado | Disparador | ¿Toca etapas? | Etapas que toca |
> |---|---|---|---|---|---|
>
> ### Dónde dejarlo
>
> Escribí todo en `clientes/japi-eaters/docs/Workflows-Actuales.md` del repo
> `profesorvillano-prog/Villano-Growth`, en la rama
> `claude/setter-organic-pipeline-hvlf16`, y hacé commit y push.
>
> Si algo no se puede leer o una pantalla no carga, anotalo como
> `⚠ NO SE PUDO LEER: <qué>` en vez de inventarlo o dejarlo en blanco.

---

## Contexto útil (pegar también si Cowork lo pide)

> Los pipelines se están reestructurando. Renombrar una etapa en GHL **conserva
> su ID**, así que los workflows existentes van a seguir disparando sobre etapas
> que pasaron a significar otra cosa. Por eso hace falta saber cuáles escriben en
> etapas antes de renombrar nada.
>
> Pipelines de la cuenta al 23/ago/2026 — **verificá el estado actual, esta lista
> puede haber cambiado**:
>
> | Pipeline | ID |
> |---|---|
> | `[VALEN] Instagram` | `ZJbdlB7FnM3V5YY5BiDG` |
> | `① [SETTER - ORG] Formación` | `XoejslKD0GHwUWSxujbs` |
> | `② [SETTER - ADS]` → renombrado a `Agenda · WhatsApp [Anaís]` | `puyQKiA3cuYzADHpbgcr` |
> | `③ [CLOSER] Agenda` | `J61MmwBX4mGAl7W1jCpz` |
> | `④ [VENTAS] Cobros` | `vpq6pgz5Ht93tdBMImOC` |
>
> Etapas de `②` con su ID (nombres previos al renombrado en curso):
>
> | Etapa | ID |
> |---|---|
> | Formulario [ADS] | `00332a6b-f818-4b9f-8bab-259e627e9f98` |
> | Ghost - Nueva Agenda | `69e32901-a38d-4591-a3f6-0b0c3cdab940` |
> | Follow Up | `2828cf59-fe10-463f-972a-1159afcd89de` |
> | Nuevas Agendas | `f0a84d2b-8df8-4c34-b91d-e3a104d89b32` |
> | Llamada Preparación | `5a9b20ca-6ddb-4ac6-9591-f33801908379` |
> | Llamada Confirmada | `6414b758-a8fd-4795-91f1-de4f0a147bcb` |
> | Cancelada (Re-Agendar) | `e9f50af0-17e8-475d-8c76-32289aaba4c3` |
> | Descalificada | `6270dc70-ba75-4aa0-b5cc-f467f3414bac` |
>
> Etiquetas que ya usa la cuenta y que conviene reconocer: `lead-org`,
> `lead-ads`, `survey-org`, `survey-ads`, `agenda-org`, `agenda-ads`,
> `ghost-agenda`, `confirmada`, `sin-confirmar`, `video-enviado`,
> `tier-gold/silver/bronce/out`, `sin-presupuesto`, `presupuesto-alto`,
> `prospecto-exito`, `lead-setter-org`.

---

## Qué hago yo cuando esté

1. Cruzo cada workflow con la estructura nueva (`Sistema-Pipelines-v2.md`).
2. Marco cuáles **hay que pausar antes** de renombrar etapas.
3. Digo cuáles se adaptan, cuáles se reemplazan por los W1–W18 del diseño y
   cuáles se apagan porque ya no aplican.
4. Dejo el plan de corte: qué se pausa, en qué orden y cuándo se reactiva.
