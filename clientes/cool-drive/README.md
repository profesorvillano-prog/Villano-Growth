# Cliente: Cool Drive Maipú

Carpeta del cliente **Escuela de Conductores Cool Drive Maipú** (Sergio Silva
Acuña 464, Maipú, Santiago de Chile). Escuela de conducción **Licencia Clase B**,
fundada en 2021. Dueño: **Sebastián Berríos**.

## La estrategia en una línea

Cool Drive compite en Maipú **por volumen y precio** ("por cantidad, por masa"),
con los autos siempre llenos. La captación es por anuncios de Meta + Instagram y
**la inscripción se cierra por WhatsApp** (transferencia o link de pago). El bot
de WhatsApp responde las preguntas repetitivas (ubicación, precios, horarios,
cómo funciona el curso), califica y deriva el cierre.

```
Anuncio / Instagram / Google Maps → WhatsApp (bot) → responde dudas →
link de pago o transferencia → inscrito → parte el lunes siguiente (teoría)
```

## Contenido

- **`docs/`** — base de conocimiento para el bot y para todo el copy.
  Índice en [`docs/README.md`](./docs/README.md).

El punto de entrada práctico es [`docs/FAQ.md`](./docs/FAQ.md) (respuestas
listas para el bot) junto a [`docs/Bot-WhatsApp.md`](./docs/Bot-WhatsApp.md)
(comportamiento, tono y reglas del bot).

## Estado

**Fase de armado.** Fuentes consolidadas: reuniones del 24/jul y 30/jul,
documento de avatares, landing horizontal (GHL) y flyer de planes 2026.

Pendientes abiertos (detalle en `docs/Escuela-y-Servicio.md` §9):

- Confirmar el nombre público del curso de 8 clases: el flyer 2026 dice
  **"Básico"**, la landing y Sebastián dicen **"Avanzado"**.
- Promociones vigentes del mes (cupos, 2x) — cambian según necesidad del mes.
- Digitalizar la teoría en comunidad/membresía de GHL (hoy es un Drive por
  correo; es el reclamo #1 en Maps).
- Separar WhatsApp de ventas vs WhatsApp de alumnos.
- Acceso a Business Manager de Meta y creación del negocio/fanpage.
