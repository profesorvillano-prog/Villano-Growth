# Incidencias de automatización de agenda — Japi Eaters

> Bitácora de fallos detectados en la automatización de agendamiento (GHL,
> subcuenta `kdmmFxEbJjSpgMtbaZ6F`). Se añade una entrada por incidencia.

---

## 2026-09-05 · "No llegan los mensajes de agendas nuevas" (Javiera González / Benjamín Miller)

**Reporta:** Anita (Japi Eaters) por WhatsApp, 15:45.
**Síntoma reportado:** *"no están llegando los msjes de agendas nuevas; sólo
aparece la agenda en el calendario pero no se activa la automatización"*.
Nombra dos entradas: **Javiera González** y **Benjamín Miller**.

### Qué se revisó

- Contactos, citas, tags y conversaciones de ambos leads en GHL.
- Calendarios `[A]` (`NwjgigzvJK9qcrjizbFn`) y `[ORG]` (`MiDJPvkZrUk3nhVrrYvw`):
  configuración y notificaciones de evento.
- Workflows publicados de la subcuenta.
- Últimos 100 mensajes de WhatsApp de la subcuenta (03–06 sep) buscando fallos.
- Escenarios de Make del equipo (no hay ninguno de Japi Eaters: toda la
  automatización de agenda vive dentro de GHL).

### Hallazgo 1 — Javiera González: el workflow SÍ se disparó, WhatsApp rechazó el envío

| Dato | Valor |
|---|---|
| Contacto | `TNi57HAdNEzFvfBQLtlv` |
| Cita | `JEFiZy3XYmvASSSIjN3Y` · calendario `[A]` · 07-09-2026 15:00 · confirmed |
| Mensaje | `1WuagRTysar9VnxjW53g` · `source: workflow` · 2026-09-05 18:22:01 UTC |
| Estado | **failed** |
| Error | *Message Undeliverable — the recipient phone number is not a WhatsApp phone number* |

**Causa raíz: número de teléfono equivocado en el formulario de agendamiento.**

- El mensaje falló al enviarse a **+56 9 6509 5517**.
- Toda su conversación real (entrante y saliente, entregada y leída) ocurre en
  **+56 9 6509 5545**.
- Los dígitos finales están cambiados: **5517** vs **5545**. El número 5517 no
  tiene WhatsApp, por eso Meta rechaza la entrega.
- El calendario `[A]` tiene `stickyContact: true`, así que los datos del
  formulario de reserva **sobrescribieron el teléfono bueno del contacto**.
  Antes de la reserva sí le llegaban los mensajes (el de Rafa de las 04:14 se
  entregó al 5545); después de reservar, todo sale al 5517 y falla.

**Efecto en cadena:** como nunca recibió el mensaje *"Dale a Confirmar"*, no
respondió, y el contacto quedó parado en `sin-confirmar` + `ghost-agenda`. No
avanza al video de preparación ni a los recordatorios.

**Acción correctiva (manual, en GHL):**
1. Corregir el teléfono del contacto a **+56965095545**.
2. Reenviar manualmente el mensaje de confirmación / el video de preparación.
3. Quitar `sin-confirmar` y `ghost-agenda`, y aplicar `confirmada` cuando responda.

### Hallazgo 2 — Benjamín Miller: la automatización funcionó correctamente

| Dato | Valor |
|---|---|
| Contacto | `rf2REHPbk6WmPGR8P63t` |
| Cita | `L1283rWFk7klZrbXPBwU` · calendario `[A]` · 07-09-2026 19:00 · confirmed |
| Mensaje | `1oDPvtgZXin3BfSCOOKs` · `source: workflow` · 2026-09-05 17:20:52 UTC |
| Estado | **read** (leído por el lead) |

Reservó a las 13:20 (hora local) y ~15 segundos después el workflow le envió
*"Tu llamada quedó confirmada para el 7 de septiembre de 2026 a las 19:00 (-03)"*,
que él leyó. Sus tags son `agenda-ads`, `video-enviado`, `confirmada`.

No recibió otra vez la secuencia de bienvenida + video de Josefina porque ya la
había recibido el 31-08 en su reserva anterior (el tag `video-enviado` la bloquea).
Esto es comportamiento esperado, no un fallo.

### Hallazgo 3 — No existe aviso interno de "agenda nueva" para el equipo

Lo único configurado a nivel de calendario para avisar de una reserva es una
notificación **`inApp` al usuario asignado** (`oLXVLdDh5Vy9WEPligs2`), en ambos
calendarios. Las demás notificaciones nativas están marcadas como borradas y son
de tipo *followup*.

Es decir: **no hay email, SMS, WhatsApp ni Slack que avise al equipo cuando entra
una agenda nueva.** Quien no sea el usuario asignado no se entera salvo que mire
el calendario — que es exactamente lo que describe Anita.

**Pendiente de confirmar con el cliente:** por qué canal quieren el aviso de
agenda nueva (notificación GHL, correo, grupo de WhatsApp o Slack). Con eso
definido se añade la notificación en ambos calendarios o un paso al workflow
`[ADS] 3 · Confirmación de cita` / `[ORG] 3 · Confirmación de cita`.

### El fallo no es sistémico

De los últimos 100 mensajes de WhatsApp de la subcuenta (03–06 sep):
54 entregados, 31 enviados, 14 leídos y **1 solo fallido** — el de Javiera.
Los workflows de agenda están publicados y disparando con normalidad.

### Recomendaciones para que no se repita

1. **Validar el teléfono en el formulario de reserva.** Es el punto de fallo real:
   el lead escribe un número distinto al que usa en WhatsApp y `stickyContact`
   pisa el bueno. Opciones: no permitir que la reserva sobrescriba el teléfono
   existente, o prerrellenar el formulario con el teléfono ya conocido del contacto.
2. **Workflow de rescate por mensaje fallido.** Si un WhatsApp de la secuencia de
   agenda sale `failed`, etiquetar el contacto (p. ej. `wa-fallido`) y avisar al
   setter para contacto manual. Hoy un fallo así es completamente silencioso.
3. **Aviso interno de agenda nueva** (ver Hallazgo 3).
