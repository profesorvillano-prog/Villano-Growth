# Base de conocimiento — Teraxcel

Fuente de verdad del cliente **Teraxcel**. Todo el armado del CRM, el contexto
del bot de Nexor y la pauta deben apoyarse en estos documentos.

| Documento | Qué contiene |
|---|---|
| [`Pipeline-CRM.md`](./Pipeline-CRM.md) | **El pipeline.** Un pipeline en GHL con 8 etapas, la doble calificación, los cuatro canales de entrada, campos personalizados, etiquetas, motivos de pérdida, métricas y el orden de implementación. |
| [`Integracion-Nexor-Medilink.md`](./Integracion-Nexor-Medilink.md) | El stack GHL ↔ Nexor ↔ Medilink: el contrato de estados que Nexor devuelve, los webhooks, los eventos a Meta y el checklist de las tres guías de Nexor. |

**Fuentes:** resumen de estrategia conversado con Joaquín (sep/2026) y las tres
guías de Nexor — *Guía 1: conexión de canales (WhatsApp, correo, teléfono)*,
*Guía 2: contexto de los agentes, objetivos y configuración*, *Guía 3: cómo
compartir tus leads (API y CRMs)*.

## Reglas clave (no negociables)

- **Nadie toca la agenda de Medilink sin pasar los dos filtros.** Formulario
  calificador primero, bot de Nexor después. El formulario filtra, pero hay
  quien marca que sí sin leer — por eso la calificación es doble.
- **El volumen de agendas no es un KPI.** Las métricas que mandan son asistencia
  a la evaluación y conversión evaluación → tratamiento. Ese fue exactamente el
  error de la agencia anterior.
- **Los valores aproximados del tratamiento se advierten antes de agendar** — en
  el anuncio/formulario y de nuevo en la conversación con el bot. Quien se cae
  por precio ahí, se iba a caer igual en la clínica, pero gratis para todos.
- **Un solo dueño por conversación en cada fase.** Nexor gestiona al lead hasta
  que llega presencial a la clínica; cuando toma tratamiento, lo toman los bots
  internos de Medilink (el "equipo de recepción"). Nexor no le escribe a
  pacientes en tratamiento, y recepción no le escribe a leads.
- **Meta solo aprende de personas calificadas.** Los eventos de conversión salen
  cuando Nexor marca la agenda calificada y confirmada, y cuando hay pago de
  tratamiento — nunca por el envío bruto del formulario.
- **Motivo de pérdida obligatorio y de lista cerrada.** Es lo que permite saber
  si el filtro bota gente por precio, por disponibilidad o por falta de
  intención — y ajustar la pauta con eso.
