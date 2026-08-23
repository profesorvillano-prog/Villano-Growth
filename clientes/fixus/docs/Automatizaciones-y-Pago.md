# Pago, webhooks y automatizaciones — FIXUS

> Cómo entra el pago al CRM y qué pasa después. Complementa
> [`Pipeline-CRM.md`](./Pipeline-CRM.md).

---

## Parte 1 · Cómo entra el pago

### El problema real

El flujo correcto es **pagar primero, entregar datos después**. Hoy Xflow obliga a
crear usuario antes de pagar — demasiados datos para alguien que aún no compró.
Y la decisión de ruta de pago está listada como **bloqueador #1 del encendido de
pauta**, dependiendo de una conversación con el equipo técnico de Xflow que no
controlamos.

Hay tres rutas. **La tercera existe para que la pauta no quede esperando a nadie.**

---

### Ruta A · Xflow con webhook *(preferida si es viable)*

Todo queda en el sistema que Fixus ya usa. Lo que hay que pedirle al equipo técnico
de Xflow, en orden de utilidad:

1. **Link de pago directo por servicio** — una URL que abra el pago de la clase de
   prueba y otra la de la evaluación, **sin login previo**.
2. **Webhook saliente en "pago aprobado"**, con al menos:
   `id de transacción`, `monto`, `producto/servicio`, `nombre`, `email`, `teléfono`,
   `RUT` (si lo tienen), `fecha y hora`, `medio de pago`.
3. **Un parámetro libre que viaje con el pago** (`external_reference`, `metadata` o
   similar) donde podamos pasar `utm_campaign` + `utm_content` + `click_id`. Sin
   esto, el pago llega al CRM pero **huérfano de atribución**: se sabe cuántos
   pagaron, no qué anuncio los trajo.
4. **URL de retorno configurable** (a dónde vuelve la persona tras pagar) — necesaria
   en cualquier escenario, incluso si no hay webhook.
5. *Alternativa aceptable si no hay webhook:* endpoint de consulta de pagos para
   hacer **poll cada 5 minutos** desde Make. Funciona igual, con 5 min de retraso.

**Si Xflow entrega 1 + 4 pero no 2 ni 5 → se va a Ruta C, no se espera.**

---

### Ruta B · Mercado Pago → Make → GHL

Control total del flujo y de las automatizaciones. Requiere que Natalia cree la
cuenta con la SPA de Fixus y comparta acceso.

**Montaje:**

1. **Dos links de pago / preferencias:**
   - `Clase de prueba 3 a 1 — $8.990`
   - `Evaluación kinesiológica — $24.990`
2. En cada preferencia:
   - `external_reference` = `servicio|utm_campaign|utm_content|click_id`
     *(así la atribución viaja con el pago y vuelve en el webhook)*
   - `notification_url` = webhook de Make
   - `back_urls.success` = página de gracias del CRM
   - `auto_return = approved` *(vuelve solo tras aprobar)*
3. **Make — escenario "Pago FIXUS":**
   - Módulo *Webhooks → Custom webhook*.
   - Mercado Pago avisa con el **id del pago**, no con el pago completo →
     `GET https://api.mercadopago.com/v1/payments/{id}` con
     `Authorization: Bearer <ACCESS_TOKEN>`.
   - **Router por `status`** — no filtrar y descartar: `approved` sigue el flujo
     normal (W1), y `rejected` / `pending` / `in_process` van a **W10**. Ese
     segundo grupo es el de mayor intención del embudo y hoy se pierde entero
     (ver [`Captacion-Previa.md`](./Captacion-Previa.md) §4).
   - Mapear: `id` → `id_transaccion` · `transaction_amount` → `monto_entrada` ·
     `payer.email` / `payer.first_name` / `payer.phone` → contacto ·
     `payer.identification.number` → `rut` *(si el medio de pago lo entrega)* ·
     `external_reference` → servicio + UTMs · `date_approved` → `fecha_pago`.
   - **Router por servicio** → GHL: *upsert contacto* + *crear oportunidad* en el
     pipeline correcto, etapa **3 · Entrada pagada · por agendar**.
   - Rama paralela → Supabase `ventas` (`fuente = "mercadopago"`,
     `transaction_id = id`, `estado = "approved"`), con el upsert
     `on_conflict=fuente,transaction_id` que ya está documentado en
     `cerebro/docs/make-automations.md`.

**Dos detalles que rompen esto si se pasan por alto:**

- **Mercado Pago reintenta y manda notificaciones duplicadas** del mismo pago
  (`payment.created` y luego `payment.updated`). Sin deduplicación se crean
  oportunidades repetidas y la métrica de entradas vendidas queda inflada. Por eso
  `id_transaccion` es clave única: antes de crear, buscar oportunidad con ese id;
  si existe, actualizar en vez de crear.
- **Validar la firma del webhook** (cabeceras `x-signature` / `x-request-id`) antes
  de procesar. La URL de Make es pública; sin validación cualquiera puede inyectar
  pagos falsos al CRM.

---

### Ruta C · Página de gracias *(plan B — y desbloquea la pauta hoy)*

**No requiere cooperación técnica de nadie.** Funciona con Xflow tal como está hoy
y con Mercado Pago sin webhook.

```
Paga (Xflow o MP) → redirección → PÁGINA DE GRACIAS DEL CRM
                                   ├─ formulario: nombre · email · teléfono · RUT · comuna
                                   └─ calendario con horarios reales, ahí mismo
                                        ↓
                     el envío crea la oportunidad en la etapa 3 y agenda en la 4
```

Esta página hace **tres cosas a la vez**: captura los datos post-pago (que es el
orden correcto), obtiene el RUT para la boleta de Simple Factura, y agenda sin un
paso intermedio donde perder gente.

**La grieta, y cómo se tapa:** quien paga y cierra el navegador antes de completar
el formulario **no queda registrado**. Se tapa con conciliación:

- Natalia exporta los pagos del día desde Xflow (o MP) una vez al día.
- Se cruzan contra las oportunidades creadas.
- Las que faltan se cargan a mano — son pocas y son gente que ya pagó, así que vale
  la pena perseguirlas.
- **Métrica de control:** `pagos en la pasarela ÷ oportunidades creadas`. Si baja
  del 90%, la página de gracias tiene un problema (carga lenta, formulario largo,
  redirección que falla en móvil).

> **Recomendación:** montar la Ruta C **igual**, incluso si Xflow o MP entregan
> webhook. Es la página que captura el RUT y agenda; el webhook solo la vuelve
> a prueba de balas. Montarla primero permite encender pauta sin esperar a nadie.

---

## Parte 2 · Los workflows

Nueve workflows, duplicados por pipeline. Todo en **America/Santiago**, con ventana
de envío **08:00–21:00** (salvo el recordatorio de −1 h, que va siempre).

### W1 · Entrada pagada

**Disparador:** webhook de pago o envío del formulario de la página de gracias.

1. Upsert de contacto (clave: email o teléfono).
2. Crear oportunidad en el pipeline correcto, **etapa 3**, valor = precio de entrada.
3. Rellenar campos: producto, monto, medio de pago, id de transacción, UTMs.
4. Etiquetas `fixus` + `3a1`/`kine` + `pago-entrada`.
5. **Email de confirmación inmediato** — qué compró, cuánto pagó, y el link para
   agendar si aún no agendó.
6. **WhatsApp de confirmación.**
7. Si no agendó en el mismo flujo → sigue a W2.

### W2 · Pagó y no agendó

**Disparador:** 1 h en etapa 3 sin cita.

- **+1 h** — WhatsApp: *"Ya está tu clase pagada, solo falta elegir el horario"* + link.
- **+24 h** — Email con los horarios de la semana.
- **+48 h** — WhatsApp desde el número de Natalia, en tono persona.
- **+72 h** — Tarea a Natalia: llamar. Ya pagó; recuperarlo cuesta cero en pauta.

### W3 · Cita creada

**Disparador:** cita creada en el calendario.

1. Mover a **etapa 4 · Agendado**, guardar `fecha_cita` y `profesor_asignado`.
2. Confirmación (email + WhatsApp) con: fecha y hora · **dirección y referencia de
   Metro Colón** · cuánto dura · qué llevar (ropa deportiva, toalla, botella) ·
   a nombre de quién preguntar.
3. **Un párrafo rompiendo la confusión de formato.** Si el "3 a 1 no es clase
   grupal" no queda claro antes de llegar, se rompe en el mostrador y se pierde la
   venta. Va en la landing *y* acá.
4. Añadir al calendario con el color que corresponde (evaluación kine vs clase de
   prueba 3 a 1) para leer de un vistazo qué está trayendo la pauta.

### W4 · Recordatorios de asistencia

> Esta es la capa que existe porque **el punto más frágil del embudo es entre el
> pago y la asistencia**.

| Momento | Canal | Contenido |
|---|---|---|
| Día −1, 18:00 | WhatsApp | Confirmación con botones **CONFIRMO** / **CAMBIAR** |
| Día, 08:00 | WhatsApp | Hora + dirección + qué llevar |
| −1 h | WhatsApp | Recordatorio corto con el mapa |

- **CONFIRMO** → etiqueta `confirmado`, se cortan los recordatorios siguientes.
- **CAMBIAR** → link de reagenda, vuelve a W3 sin pasar por no-show.
- Sin respuesta → siguen los recordatorios. No se penaliza el silencio.

> ⚠️ **Restricción técnica de WhatsApp:** los mensajes que **inicia el negocio**
> fuera de la ventana de 24 h desde el último mensaje del usuario necesitan
> **plantillas aprobadas por Meta**. Los tres recordatorios son iniciados por el
> negocio → hay que dar de alta las plantillas *antes* de encender pauta, y su
> aprobación tarda. Es un pendiente con fecha, no un detalle de implementación.

### W5 · Después de la cita

**Rama *Showed***: mover a **etapa 6** · etiqueta `asistio` · disparar W6.

**Rama *No-Show*** (marcada, o 2 h después de la hora sin marca):

- Mover a **etapa 5 · No asistió · recuperar**, `intentos_reagenda + 1`.
- **Mismo día** — WhatsApp: *"Tu clase pagada sigue disponible, ¿la movemos?"*
- **+1 día** — Email con horarios.
- **+3 días** — Último WhatsApp.
- **Día 10** — `Lost`, motivo `No asistió (3 intentos)`.
- Si reagenda en cualquier punto → vuelve a **etapa 4** y se reinicia W4.

### W6 · Resultado presencial *(la línea de traspaso)*

**Disparador:** 1 h después del fin de la cita.

1. Enviar al **profesor asignado** el link del formulario de cierre, ya vinculado a
   esa oportunidad (4 preguntas, ver `Pipeline-CRM.md` §5).
2. Al recibir la respuesta:
   - **Compró** → etapa 7, `Won`, valor = entrada + plan, etiqueta `plan-vendido`.
   - **Lo está pensando** → se queda en etapa 6, se reintenta a las 48 h.
   - **No compró** → `Lost` con motivo obligatorio.
   - Si marca 1 a 1 o nutrición → etiqueta `puente-1a1` / `puente-kine-entreno`.
3. **Sin respuesta a las 24 h** → recordatorio al profesor.
   **A las 72 h** → tarea a Natalia + aviso a la agencia.

### W7 · Ganado

- Mensaje de bienvenida y próximos pasos.
- **Día 21** — si el `avatar_origen` calza con uno de los 5 testimonios buscados,
  etiqueta `testimonio-candidato` y aviso a Natalia para pedirlo.
- La oportunidad **sale del CRM**: de acá en adelante la relación vive en Xflow.

### W8 · Perdido

Reactivación a **15 / 45 / 90 días**, con mensaje distinto según `motivo_perdida`:

| Motivo | Ángulo de reactivación |
|---|---|
| `Precio` | Trimestral con descuento · valle vs punta |
| `Horarios no le calzan` | Avisar cuando se abran bloques nuevos |
| `Esperaba clase grupal` | No reactivar. **Revisar landing y anuncio** — el problema es de mensaje |
| `No asistió (3 intentos)` | Un intento a los 45 días, después baja |
| `Distancia` | No reactivar. **Revisar geo de la pauta** |

Dos de esos motivos no generan mensaje, generan **una revisión de pauta**. Es la
manera de que el motivo de pérdida no sea decoración.

### W10 · Recuperación de pago fallido o pendiente

**Disparador:** webhook con `status` distinto de `approved`.

1. Upsert de contacto y oportunidad en **etapa 2**, guardando `estado_intento_pago`
   con el motivo del rechazo.
2. **Mensaje a los 15 min**, redactado según el motivo — la tabla de mensajes por
   motivo está en [`Captacion-Previa.md`](./Captacion-Previa.md) §4. Un rechazo por
   fondos y uno por datos de tarjeta no se responden igual.
3. Recordatorios a **2 h** y **24 h** con el link de pago.
4. **Día 5** → `Lost`, motivo `Pago no completado`.
5. Si el pago se completa en cualquier momento → **etapa 3** y entra a W1.

> Ojo con el orden: Mercado Pago manda `rejected` y después `approved` cuando la
> persona reintenta con otro medio. La deduplicación por `id_transaccion` **no**
> alcanza acá, porque son transacciones distintas del mismo comprador. La clave de
> deduplicación efectiva es el **email o teléfono**: si ya existe oportunidad
> abierta para esa persona en el pipeline, se mueve de etapa en vez de crear otra.

### W11 · Conversación entrante *(pipeline `FIXUS · Conversaciones`)*

**Disparador:** primer mensaje entrante por WhatsApp, IG DM o Facebook.

1. Crear contacto y oportunidad en **Conversaciones · etapa 1**.
2. Guardar el origen: texto pre-llenado del `wa.me`, o bloque `referral` del anuncio
   si vino de Click-to-WhatsApp.
3. **Respuesta automática en menos de 1 minuto**, con las dos preguntas de
   calificación: *¿entrenamiento o lesión?* y *¿en qué comuna estás?*
4. Al responder ambas → **Conversaciones · etapa 2 · Calificado**, rellenando
   `servicio` y `comuna`.
5. Comuna fuera de zona → `Lost`, motivo `Fuera de zona`. Ese conteo es dato de
   calidad para la geo de la pauta, no un descarte silencioso.

### W12 · Link enviado y seguimiento

**Disparador:** entrada a Conversaciones · etapa 3.

- **Inmediato** — link de pago del servicio correcto + el argumento de una línea.
- **+24 h** — *"¿Alguna duda antes de reservar?"*
- **+72 h** — Prueba social: un testimonio del avatar que corresponda.
- **+7 días** — Último mensaje, luego `Lost` con motivo.
- **Si paga** → `Won` en Conversaciones (etapa 4) y **oportunidad nueva** en el
  pipeline del servicio, etapa 3, con `origen_entrada = conversacion`.

> **Regla dura: este workflow enruta, no vende.** Si una conversación necesita más
> que estos cuatro mensajes, la landing no está explicando bien — y el arreglo va en
> la landing, no en el chat. Ver [`Captacion-Previa.md`](./Captacion-Previa.md) §5.

### W13 · Eventos de conversión hacia Meta

- **Clic en el botón de pago** → `InitiateCheckout` por píxel + API de Conversiones.
- **Pago aprobado** → `Purchase` con el valor real, vía API de Conversiones desde
  Make (no solo píxel: así la conversión llega aunque el navegador la bloquee).
- **Plan vendido** → evento personalizado `PlanVendido` con `monto_plan`.

El tercero es el que más rinde a mediano plazo: le enseña a Meta a buscar gente que
**compra el plan**, no gente que compra una clase de $8.990. Requiere volumen para
funcionar, así que se activa cuando haya historia suficiente.

### W9 · Sincronización con Cerebro

- **Tiempo real:** cada pago aprobado y cada `Won` → upsert a Supabase `ventas`.
- **3×/semana (lun · mié · vie):** conteos por etapa → `ht_pipeline`.
  Detalle del mapeo en [`Medicion.md`](./Medicion.md).

---

## Parte 3 · Antes de encender

- [ ] Ruta de pago decidida y probada con un pago real de $1.000 de prueba.
- [ ] Deduplicación por `id_transaccion` verificada: pagar dos veces la misma
      notificación **no** debe crear dos oportunidades.
- [ ] Plantillas de WhatsApp enviadas a aprobación de Meta.
- [ ] Calendarios de los 4 profesionales conectados y con disponibilidad real.
- [ ] Formulario de cierre probado por cada profesor desde su propio teléfono.
- [ ] Colores del calendario diferenciados (kine vs 3 a 1).
- [ ] Recorrido completo end-to-end hecho por alguien del equipo, de anuncio a
      formulario de cierre, antes del primer peso de pauta.
- [ ] Pago rechazado a propósito (tarjeta de prueba) → verificar que cae en la
      etapa 2 y que llega el mensaje correcto según el motivo.
- [ ] Mensaje pre-llenado de `wa.me` distinto por landing y por anuncio, y probado
      en un teléfono real.
- [ ] Confirmado si la integración de WhatsApp de GHL expone el bloque `referral`
      de los anuncios Click-to-WhatsApp. Si no, el webhook entra primero a Make.
