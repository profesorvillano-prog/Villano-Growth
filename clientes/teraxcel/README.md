# Cliente: Teraxcel

Carpeta del cliente **Teraxcel** (clínica, Chile). Servicio con dos escalones:
**evaluación** de bajo costo y sin pago previo, y **tratamiento**, que es donde
está el ticket real. La gestión conversacional la hace **Nexor AI**; la agenda
vive en **Medilink**; el CRM de marketing es **GoHighLevel**.

## La estrategia en una línea

El problema de la agencia anterior fue **volumen de agendas sin intención**: como
la evaluación se agenda gratis y cuesta poco, llegaba gente que nunca iba a pasar
a tratamiento. La respuesta es **doble calificación antes de tocar la agenda**:
formulario que advierte los valores aproximados del tratamiento, y segunda
calificación del bot de Nexor (intención, expectativa de precio, disponibilidad
real). Solo con ambos filtros aprobados se agenda en Medilink.

```
Meta → Formulario calificador ─┐
WhatsApp web ──────────────────┤
Instagram ─────────────────────┼→ Nexor califica → Agenda Medilink → Confirma /
Derivación médica interna ─────┘   (2º filtro)        (solo si pasa)   recuerda /
                                                                       reagenda
                                        → Asiste → Pasa a tratamiento ┃ bots
                                                                      ┃ internos
└──────────────── Nexor · "gestión de Teraxcel" ─────────────────────┘┃ Medilink
                                                                       "recepción"
```

**Las métricas que mandan:** tasa de asistencia a la evaluación y conversión de
evaluación a tratamiento. **El volumen de agendas no es indicador de éxito.**

## Contenido

- **`docs/`** — diseño del sistema. Índice en [`docs/README.md`](./docs/README.md).

El punto de entrada práctico es [`docs/Pipeline-CRM.md`](./docs/Pipeline-CRM.md):
el pipeline completo en GHL, las etapas, quién mueve cada una y los campos. El
contrato con Nexor (estados, webhooks, eventos a Meta) está en
[`docs/Integracion-Nexor-Medilink.md`](./docs/Integracion-Nexor-Medilink.md).

## Estado

**Fase de diseño.** Todavía no existe la subcuenta de GoHighLevel de Teraxcel ni
la conexión con Nexor. Fuentes: resumen de estrategia conversado con Joaquín y
las tres guías de conexión de Nexor (canales · contexto del agente · API/CRM).

Pendientes abiertos, con detalle en `docs/Pipeline-CRM.md` §8:

- Crear la subcuenta de GoHighLevel de Teraxcel.
- Valores aproximados de tratamiento **aprobados por escrito** para publicarlos
  en el formulario y dárselos al bot.
- Confirmar si la API de Medilink permite leer agenda y disparar eventos (nunca
  se ha usado); si no, los eventos a Meta salen desde GHL.
- Número de WhatsApp que operará Nexor y accesos de canales (Guía 1).
