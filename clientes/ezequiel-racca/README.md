# Cliente: Ezequiel Racca

Carpeta del cliente **Ezequiel Racca**. Perfil nuevo **100% enfocado en
enfermedades autoinmunes** (dermatitis/eczema, psoriasis, vitíligo, lupus, Crohn,
colitis ulcerosa), separado de su otro proyecto "Una vida sin medicamentos"
(diabetes e hipertensión).

La marca se trabaja como **dúo**: **Ezequiel Racca** (odontólogo, nutrición y
medicina funcional) + **Dra. Catalina Klimboski** (médica, medicina funcional).
Nombre de marca: **Sana tu Autoinmune**.

Producto principal: **Método Piel en Calma** (nombre provisional) — acompañamiento
1-a-1 de 3 meses en nutrición y medicina funcional, llevado adelante junto a un
médico, para abordar la causa de la enfermedad autoinmune de la piel desde el
intestino y la alimentación.

## Contenido

- **`index.html`** — landing / VSL del programa high ticket (3 meses).
- **`landing-consulta.html`** — **Landing 1 del embudo de consulta**: bloque
  autocontenido para pegar en GoHighLevel (elemento *Custom Code / HTML*).
  Vende la **Consulta de Evaluación Autoinmune (USD $60)** con **un solo botón
  de pago**, apuntando al checkout de Hotmart
  (`https://pay.hotmart.com/P107408158S`).

  **Estética clínica.** Azul profundo `#0E2E3E` + verde-azulado `#0E7C8B` sobre
  blancos fríos; tipografías Instrument Sans (titulares) e IBM Plex Sans
  (cuerpo); hairlines de 1px, esquinas de 10-14px y una retícula de puntos muy
  tenue en las secciones alternas. Animaciones mínimas y sobrias: revelado por
  sección, entrada escalonada, dibujado de los checks, las reglas del eyebrow
  que se abren, y micro-interacciones en el botón (elevación, brillo y avance
  de la flecha). Todo se desactiva con `prefers-reduced-motion`.

  **Ángulo del copy: situación actual → situación deseada.** El foco está en
  el punto de partida de la persona y en adónde puede llegar; la consulta se
  posiciona como **el primer gran paso: entender tu caso completo y saber qué
  hacer**. Decisiones deliberadas:

  - **No se habla del vehículo.** La palabra "programa" no aparece en el copy
    visible. El acompañamiento se menciona una sola vez, en la FAQ *"¿Esto es
    una llamada de ventas?"*, y solo para responder que no lo es.
  - **No se nombra quién atiende en el hero ni en los pasos.** La consulta la
    lleva Ezequiel; eso se dice una vez en la nota bajo el dúo y una vez en la
    FAQ *"¿Quién me atiende?"* (donde además se aclara que no es médico, por
    compliance). Catalina aparece como parte del proyecto, no de la consulta.
  - **Sección Punto A / Punto B**: "Hoy" contra "Adónde puedes llegar", en
    lenguaje concreto y sensorial, con una nota de honestidad inmediata sobre
    que los tiempos varían.
  - **El primer gran paso** en 3 tarjetas: dónde estás · por qué llegaste ahí ·
    qué hacer mañana. Son las tres respuestas de la consulta, no las fases del
    programa.
  - Se eliminó el "se descuenta del programa" de la sección de beneficios: es
    argumento de venta del vehículo y empujaba a leer la página como una
    llamada de ventas.

- **`docs/`** — base de conocimiento (fuente de verdad). Ver
  [`docs/README.md`](./docs/README.md) para el índice completo.

## Embudo de consulta (GoHighLevel)

```
Landing Consulta  ← landing-consulta.html
  → Calendario Consulta
  → Calendario Asesoría
  → Redirección Mercado Pago
  → Thank You CONSULTA
  → Thank You ASESORÍA
```

### Pendientes de `landing-consulta.html`

Todo se edita en el bloque `var STA = { ... }` al final del archivo:

- `PAGO_URL` — checkout de Hotmart. **Ya configurado.**
- `PRECIO` — texto del precio en los 4 botones (hoy `USD $60`). Vacío lo oculta.
- `VSL_EMBED` + `VSL_POSTER` — video y portada del VSL de la consulta.
- `TESTIMONIOS_IMG` / `TESTIMONIO_VIDEO_EMBED` — la sección de testimonios
  aparece sola cuando se carga al menos uno.
- `META_PIXEL_ID` / `GA4_ID` — píxeles (opcionales). El clic en cualquier botón
  dispara el evento `ClicPago` con su ubicación (`hero`, `consulta`, `cierre`,
  `barra`).
- Confirmar la **grafía exacta** del apellido de Catalina (viene de
  transcripción: "Klimboski").

## Estado y pendientes (de la reunión de onboarding 08/06/2026)

Antes de publicar la landing del programa (`index.html`), reemplazar los
marcadores `TODO` / `[...]`:

- `[URL-FORMULARIO]` — link real del formulario de evaluación / WhatsApp.
- VSL — portada real (`vid-poster`) y `media-id` del video (Wistia/YouTube/Vimeo).
- Testimonios — imágenes antes/después y frases reales (con consentimiento).
- Foto de Ezequiel en la sección de autoridad.
- `@[usuario-instagram]` y links de footer (privacidad, términos).
- **Nombre de marca/cuenta** con "autoinmune" (sin "doctor"): pendiente de definir.
- Paleta: la landing usa púrpura/ciruela (color de la concienciación autoinmune y
  del lupus) + dorado. Ezequiel está abierto a opciones.

> ⚠️ **Compliance:** Ezequiel es odontólogo, no médico — se declara de forma
> explícita en la landing. La parte clínica la cubre la **Dra. Catalina
> Klimboski**. El enfoque complementa (no reemplaza) al médico tratante. Nunca
> sugerir abandonar medicación sin supervisión, ni prometer cura. Mantener estos
> límites en todo el copy.

## Skills

Conectada a la biblioteca **Villano Growth**
(`profesorvillano-prog/Villano-Growth`) mediante `.claude/settings.json`. Al
trabajar aquí en Claude Code, las skills (como `impeccable`) se cargan solas.

Para mejorar el diseño de la landing, por ejemplo:

```
/impeccable polish
/impeccable audit
```

> Esta carpeta es auto-contenida: puede moverse a su propio repositorio cuando
> quieras sin cambiar nada.
