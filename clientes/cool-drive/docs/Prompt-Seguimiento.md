# Prompt de seguimiento automático — Cool Drive

> Texto exacto del campo `system` del módulo **Redactar seguimiento (Claude)**
> en el escenario `[BOT] Cool Drive - Seguimiento automatico` de Make.
>
> Corre cada 4 horas, solo entre las 10:00 y las 20:00 de Santiago, sobre leads
> tibios o calientes que llevan más de 20 horas sin responder. Máximo 3 intentos
> por persona.
>
> Fuente de verdad. Si se edita en Make, se actualiza acá.
>
> **Desplegado en Make el 2026-09-04.**
> El prompt del bot conversacional es [`Prompt-Bot-WhatsApp.md`](./Prompt-Bot-WhatsApp.md).

## Promo vigente

La misma del bot principal: septiembre 2026 pagando hasta el **17 inclusive**.
Full $119.990 (normal $140.000) · Avanzado $90.000 (normal $110.000).
**Al vencer hay que editarla en los dos prompts**, no solo en este.

---

## Cómo se reparte con GHL

| Momento desde el último mensaje del lead | Quién actúa | Qué manda |
|---|---|---|
| 14 a 23 horas | **Make** (este escenario) | Un mensaje escrito a medida. Los tres canales. |
| 48 horas | GHL `[SEGUIMIENTO] Fuera de ventana` | Plantilla `follow_up`. Solo WhatsApp. |
| +72 horas | GHL, mismo workflow | Plantilla de cierre. Solo WhatsApp. |

Make trabaja **dentro** de la ventana de 24 h de WhatsApp, donde se puede
escribir libremente. GHL toma **fuera**, donde Meta solo admite plantillas.
No se superponen.

**Por qué el corte inferior es 14 h y no 20 h:** el escenario corre cada 4
horas y solo entre las 10:00 y las 20:00. Con un piso de 20 h y un techo de
23 h la ventana útil era de 3 horas, más angosta que el intervalo entre
corridas — había leads que no entraban nunca. Con 14 h la ventana es de 9
horas y ninguna corrida se la salta.

## Compuertas antes de escribir

1. `pausado = false` en el datastore.
2. `fu_count < 1` — un solo seguimiento por persona.
3. `temperatura ≠ frio`.
4. El contacto **no tiene los tags `alumno` ni `bot-off`** en GHL. El
   escenario los consulta en vivo antes de redactar, igual que el
   conversacional.
5. Su último mensaje tiene menos de 23 horas, o sea sigue dentro de la
   ventana de Meta.


## Seguimientos enganchados a la conversación real (2026-09-06)

**El problema.** El seguimiento a Felipe decía:

> *Felipe, te dejo el dato para que lo tengas claro, si pagas ahora el Avanzado queda en 90.000 en vez de 110.000 por la promo hasta el 17 de septiembre, y tienes hasta 60 días para partir así que no hay drama si al final no es la otra semana. Los bloques tarde-noche son los que primero se llenan, cualquier cosa me dices y te reservo el cupo.*

Tres cosas mal:

1. **No engancha con nada concreto.** Felipe había dicho *"me gustaría partir la próxima semana, te confirmaré hoy en la tarde"*. El seguimiento natural abre por ahí y no lo hace.
2. **Es largo.** Junta promo, plazo, horarios y cierre en un solo bloque. Se lee como publicidad.
3. **Promete algo que no existe:** *"te reservo el cupo"*. El prompt del bot principal prohíbe inventar cupos; este prompt nunca heredó esa regla.

**Causa de fondo, la misma del punto 10 de `Averias-y-causas.md`:** el escenario solo veía el `historial` autoescrito, nunca la conversación real. Sin el texto, no puede encontrar el cabo suelto.

**Corrección — mismo tratamiento que el bot principal:**

Dos módulos nuevos antes de Claude, ambos detrás del filtro de horario para no gastar operaciones en leads que no califican:

- **Buscar la conversación** → obtiene el `conversationId` desde GHL.
- **Traer la conversación real** → baja los últimos 12 mensajes.

Al modelo le llegan ahora separados: lo que escribió el lead, y lo que escribió el bot.

**Cuatro reglas nuevas, en orden de prioridad:**

1. **Máximo 200 caracteres**, reforzado con `maxLength` en el JSON schema. Una idea por mensaje. Si no cabe todo, se sacan datos, nunca el enganche.
2. **Engancha con el cabo suelto.** Si dijo que iba a confirmar, se abre por ahí. Si nombró una fecha, se nombra. Si dejó una pregunta a medias, se retoma. Prohibidas las fórmulas de call center (*"te escribo para hacer seguimiento"*, *"sigues interesado"*, *"te dejo el dato para que lo tengas claro"*).
3. **No repetir lo ya dicho**, verificado contra sus propios mensajes.
4. **Nunca prometer lo que no existe:** ni cupos guardados, ni horarios apartados, ni extensiones de la promo.

**Cómo debería quedar el de Felipe:**

> *Felipe, quedaste en confirmarme ayer en la tarde, cómo va eso? si partes la próxima semana alcanzas con el precio de septiembre.*

126 caracteres, abre por lo que él mismo dijo, y da una razón para responder hoy.
