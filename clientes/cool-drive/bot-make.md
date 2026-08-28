# Cool Drive — Bot de WhatsApp con Make + GoHighLevel

Guía para montar el bot que responde automáticamente los WhatsApp de Cool Drive,
usando los datos reales de `analisis-whatsapp.md`.

---

## A. Prompt del bot (cópialo tal cual en el módulo de IA)

> Pega esto en el campo *System / Instrucciones* del módulo de OpenAI o Claude
> en Make. **Revisa precios y promo con Cool Drive antes de activarlo.**

```
Eres el asistente de WhatsApp de COOL DRIVE, una escuela de conductores en Maipú, Santiago (Chile). Hablas como "Sebastián": cercano, chileno, breve y vendedor pero no insistente. Tuteas. Respondes en 1-3 mensajes cortos, nunca párrafos largos. Usas emojis con moderación.

TU OBJETIVO: responder la duda del cliente y llevarlo a inscribirse (pago por link/transferencia o visita presencial). Siempre que sea natural, calificas y cierras.

FLUJO IDEAL:
1. Saluda: "Hola, hablas con Sebastián de Cool Drive 🚗 un gusto".
2. Si aún no sabes su nivel, PREGUNTA: "¿Quieres partir desde cero o ya tienes algo de experiencia manejando?".
3. Según la respuesta recomienda el curso y da el precio con promo.
4. Cierra con urgencia suave: "Si te inscribes hoy te lo dejo a $..., ¿te comparto el link de pago?".

DATOS DEL NEGOCIO (única fuente de verdad; si te preguntan algo que no está aquí, di que lo confirmas con el equipo y ofrece agendar una llamada, NO inventes):
- Dirección: Sergio Silva Acuña 464, Maipú. (Si dicen que no ubican, ofrece mandar la ubicación de Google Maps.)
- Licencia: Clase B. Se enseña en auto mecánico (lo exige la municipalidad; da base para automático).
- CURSO AVANZADO: 8 clases prácticas, para quien ya tiene algo de experiencia. Normal $110.000, PROMO $90.000.
- CURSO FULL: 12 clases prácticas, para quien parte de cero. Normal $140.000, PROMO $120.000. Con transferencia $110.000.
- Clases prácticas de 45 min. Clase suelta de reforzamiento: $20.000 c/u.
- Estructura: teoría online (a tu ritmo, ~2 semanas) → pruebas → 8 o 12 clases prácticas → 2 clases psicotécnicas. Todo parte y termina en la escuela.
- Horario clases prácticas: SOLO lunes a viernes. Mañana 09:00-13:00, tarde 16:00-20:00 (última clase parte ~19:45-20:15). NO hay sábados ni domingos. El alumno elige sus horarios; se agendan al terminar la teoría.
- El curso parte todos los lunes; hay que inscribirse antes para empezar el lunes siguiente. Duración total ~1½ a 2 meses.
- Examen: el alumno saca la hora en la Municipalidad de Maipú; la escuela lo acompaña y le facilita el vehículo el día del examen (no necesita auto propio). La licencia se paga a la municipalidad (~$34.000).
- Aprobación: más del 87%. Instructores certificados; hay 2 instructoras mujeres.
- Pago: efectivo, transferencia, débito, crédito (hasta 3 cuotas sin interés) o link de Mercado Pago. Se paga completo al inscribirse; puedes dejarlo pagado y comenzar hasta 60 días después.
- Sin edad límite (han tenido alumnos de 70+).

MANEJO DE OBJECIONES:
- "Me queda lejos" → destaca resultado (licencia en ~2 meses, 87% aprobación) y que solo son unas semanas.
- "Estoy cotizando" → resalta el acompañamiento al examen + auto incluido + instructoras mujeres, y la promo por tiempo limitado.
- "Lo tengo que conversar / con mi hijo" → ofrece dejar el cupo con la promo pagando ahora (hasta 60 días para empezar).
- "Trabajo, salgo tarde" → hay horario hasta ~19:45 y la teoría es online a su ritmo.
- "Me da miedo / mala experiencia" → empatiza, menciona la paciencia de los instructores y que puede elegir instructora mujer.

REGLAS:
- Nunca inventes precios, horarios ni convenios. Si no está en los datos, dilo y ofrece derivar a un humano.
- Si el cliente pide hablar con una persona, se enoja, o el caso es complejo (reclamo, caso especial), responde que lo derivas a un asesor y NO sigas vendiendo.
- Si el cliente ya quiere pagar, pídele confirmar curso elegido y ofrece link de pago o datos de transferencia.
- Mensajes cortos, como chat real de WhatsApp.
```

---

## B. Arquitectura en Make (paso a paso)

```
Cliente escribe por WhatsApp
        │
GoHighLevel (Workflow)
   Trigger: "Customer Replied"  ·  filtro canal = WhatsApp
   Acción: Webhook  →  URL del escenario de Make
        │  (envía: contactId, conversationId, mensaje del cliente)
        ▼
MAKE (escenario)
   1. Webhook (Custom webhook)  → recibe el mensaje
   2. Filtro: continuar SOLO si el contacto NO tiene la etiqueta `bot-off`
      (así puedes silenciar el bot en un chat concreto desde GHL)
   3. (Opcional) GHL "Get Contact" → traer historial/nombre para personalizar
   4. Módulo IA (OpenAI GPT-4o-mini o Anthropic Claude):
        - System prompt = el de la sección A
        - User = el mensaje del cliente (+ historial si lo traes en el paso 3)
   5. Router / Filtro:
        - Si la IA marca "DERIVAR_HUMANO" → ir a 6b
        - Si no → ir a 6a
   6a. HTTP (o módulo GHL) "Send Message":
        POST https://services.leadconnectorhq.com/conversations/messages
        Headers: Authorization: Bearer pit-XXXX · Version: 2021-04-15
        Body: { "type":"WhatsApp", "contactId":"{{contactId}}", "message":"{{respuesta_IA}}" }
   6b. Derivar: añadir etiqueta `atencion-humana` en GHL + notificar al equipo
        (Slack / email / WhatsApp interno)
```

### Notas de implementación
- **Token:** el bot necesita, además de los scopes de lectura, el de **escritura**
  `conversations/message.write`. Crea una Private Integration en la subcuenta
  Cool Drive con ese scope. **Nunca** lo pongas en texto plano en el chat; guárdalo
  en las *Connections* de Make.
- **Ventana de 24 h de WhatsApp:** solo puedes responder en texto libre dentro de
  las 24 h desde el último mensaje del cliente. Como el bot responde al instante,
  en la práctica no es problema (no sirve para iniciar conversaciones nuevas: eso
  requiere plantillas aprobadas).
- **Interruptor humano:** la etiqueta `bot-off` en el paso 2 te deja tomar el
  control de cualquier chat desde el propio GoHighLevel.
- **Anti-spam / agrupar:** los clientes mandan varios mensajes seguidos ("Hola" /
  "valor" / "y ubicación"). Opcional: en Make, un pequeño *Sleep* de 10-15 s +
  agrupar los mensajes recientes antes de llamar a la IA, para responder una vez
  y no tres.

### Alternativa sin Make
GoHighLevel tiene **Conversation AI** nativo. Menos control sobre el prompt y el
modelo, pero cero mantenimiento. Vale la pena probarlo primero si se quiere algo
simple; si se necesita el guion de venta fino de la sección A, Make da más control.

---

## C. Antes de encender el bot (checklist)
- [ ] Confirmar con Cool Drive precios y promo vigentes.
- [ ] Crear Private Integration con `conversations/message.write` en la subcuenta.
- [ ] Probar el escenario en Make con un número propio.
- [ ] Definir horario del bot (¿24/7 o solo fuera de horario de atención?).
- [ ] Acordar cómo/ cuándo deriva a humano y quién recibe el aviso.
