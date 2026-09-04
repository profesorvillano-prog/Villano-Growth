# Base de conocimiento — Cool Drive Maipú

Fuente de verdad del cliente **Escuela de Conductores Cool Drive Maipú**.
Todo lo que responda el **bot de WhatsApp/Instagram**, y todo el copy, anuncios
y landing, debe apoyarse en estos documentos.

| Documento | Qué contiene |
|---|---|
| [`Escuela-y-Servicio.md`](./Escuela-y-Servicio.md) | **Datos duros.** Dirección, contacto, horarios, cursos y precios, estructura completa del curso paso a paso, políticas (cambios, multa, certificado), capacidad, temporadas y datos por confirmar. |
| [`FAQ.md`](./FAQ.md) | Preguntas reales que llegan por WhatsApp/Instagram, con respuestas listas en la voz de la escuela. Es el corazón del bot. |
| [`Bot-WhatsApp.md`](./Bot-WhatsApp.md) | Comportamiento del bot: tono, flujos de conversación, la escalera de ofertas, qué escala a humano y qué tiene prohibido hacer. |
| [`Avatares.md`](./Avatares.md) | Los 3 perfiles de cliente (joven 18–21, adulto 30–40+, papá/mamá que decide), sus objeciones y ángulos de mensaje. Base para anuncios y para adaptar el tono del bot. |
| [`Prompt-Bot-WhatsApp.md`](./Prompt-Bot-WhatsApp.md) | **El prompt exacto** que corre en el módulo Cerebro de Make. Fuente de verdad: si se edita en Make, se actualiza acá. |
| [`Credenciales.md`](./Credenciales.md) | **Dónde vive cada credencial** (PIT de GHL, conexiones de Make, webhooks) y cómo reponerla. No contiene valores: el repo es público. |

**Fuentes:** reuniones con Sebastián Berríos del **24/jul** y **30/jul**,
documento *Avatares Cool Drive*, landing horizontal (GHL), flyer *Planes
Disponibles 2026* y letrero de horario de la sede.

## Reglas clave (no negociables)

- **La hora de auto no baja de $10.000.** Base: 8 clases $110.000 · 12 clases
  $140.000. Ninguna oferta puede romper ese piso.
- **El bot nunca inventa promociones.** Solo comunica las ofertas vigentes que
  estén escritas en `Escuela-y-Servicio.md` §4 o que Sebastián haya activado.
- **La única diferencia entre los cursos es la cantidad de clases prácticas.**
  Teoría, pruebas y psicotécnico son idénticos.
- **Honestidad con los plazos.** El curso dura 1½–2 meses reales (incluye el
  desfase de agenda de prácticas). Se comunica como señal de seriedad, nunca
  se oculta ni se promete "en dos semanas".
- **Lenguaje cercano, honesto y directo** (chileno, tuteo). Reemplazos
  obligatorios: "autoestudio en un Drive" → *plataforma de estudio con módulos
  y seguimiento*; "desfase de agenda" → *te agendamos todas tus clases desde el
  día uno*; "curso" → *te acompañamos hasta que apruebas en la municipalidad*.
- **El cierre es humano.** El bot informa, califica y entusiasma; la
  transferencia/link de pago y el agendamiento los confirma una persona.
