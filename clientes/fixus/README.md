# Cliente: FIXUS

Carpeta del cliente **FIXUS — Kinesiología y Rendimiento** (Providencia, Santiago
de Chile). Centro con dos servicios que se pautan por separado: **entrenamiento
3 a 1** y **kinesiología**.

## La estrategia en una línea

No se vende el plan en línea. Se vende una **entrada barata y pagada** —clase de
prueba $8.990 o evaluación kinesiológica $24.990— que lleva a la persona al centro,
y **la venta grande (plan mensual $98–115k o plan de 10 sesiones $300k) ocurre
presencialmente**, que es donde Fixus ya es fuerte.

```
Anuncio → Landing con video → Pago de entrada → Agenda → Asiste → Venta presencial
              ╷                    ╷
              │                    └── rechazado o pendiente ──┐
              └── WhatsApp ──→ califica ──→ link de pago ──────┘
└──────────────────── agencia (automatizado) ─────────────────────┘└─ FIXUS ─┘
```

## Contenido

- **`docs/`** — base de conocimiento y diseño del sistema. Índice en
  [`docs/README.md`](./docs/README.md).

El punto de entrada práctico es [`docs/Pipeline-CRM.md`](./docs/Pipeline-CRM.md):
ahí está el pipeline completo, quién mueve cada etapa y qué necesitamos de FIXUS
para armarlo.

## Estado

**Fase de armado.** Todavía no hay pauta encendida. El bloqueador principal es la
**ruta de pago** (Xflow vs Mercado Pago) — con una salida propuesta en
`docs/Automatizaciones-y-Pago.md` (*Ruta C · página de gracias*) que permite
encender sin depender del equipo técnico de Xflow.

Pendientes abiertos, con detalle en `docs/Pipeline-CRM.md` §8:

- Acceso a la subcuenta de GoHighLevel.
- Decisión de ruta de pago — y si el webhook de Xflow informa también los pagos
  **fallidos**, no solo los aprobados.
- Confirmar si la integración de WhatsApp de GHL expone la atribución de anuncios
  Click-to-WhatsApp.
- Calendarios de los 3 profesores del 3 a 1 + kinesiología.
- Plantillas de WhatsApp enviadas a aprobación de Meta.
- Precio final de la clase de prueba ($8.990 o $10.000) y política de descuento
  de la entrada sobre el plan.
- Tasa de cierre actual sobre consultas de WhatsApp (línea base) y permanencia
  media del plan mensual.

## Stack

GoHighLevel (CRM y calendarios) · Make (integraciones) · Supabase + panel
**Cerebro** (`cerebro/`, slug de cliente `fixus`) · Meta Ads · Xflow y/o Mercado
Pago (pagos) · Simple Factura (boletas).

## Skills

Conectada a la biblioteca **Villano Growth** vía `.claude/settings.json`.
