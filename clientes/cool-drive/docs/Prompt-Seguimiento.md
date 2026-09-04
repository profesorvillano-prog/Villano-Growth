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

