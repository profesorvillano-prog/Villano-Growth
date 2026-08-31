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
  Vende la **Consulta de Evaluación Autoinmune (USD $60)**, descontable del
  programa, con doble pasarela (PayPal/tarjeta internacional y Mercado Pago
  Argentina).

  **Ángulo del copy: camino natural de sanación.** No agita el costo de seguir
  enfermo (ese enfoque se descartó): vende el camino. Ejes, todos tomados de
  `docs/Mensajes-Angulos-y-Copy.md`:

  - *"Si el alimento te enfermó, el alimento también te puede sanar."*
  - **Camino A / Camino B**: uno maneja la enfermedad, el otro la revierte.
  - **Las 3 fases** (apagar el incendio → sellar la frontera → reconstruir la
    inmunidad) como sección propia, en lugar del recibo de costos.
  - *"Tratar la piel sin cambiar el plato es secar el piso con la llave abierta."*
  - Se habla de **revertir** y **remisión funcional**, nunca de cura, y hay una
    nota explícita de que los tiempos varían y no se prometen plazos.
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

- `PAGO_URL_PAYPAL` — link de pago PayPal/tarjeta (USD $60).
- `PAGO_URL_MPAGO` — link de Mercado Pago (Argentina).
- `PRECIO_ARS` — monto en pesos (hoy dice "en pesos"); cambia en toda la página.
- `VSL_EMBED` + `VSL_POSTER` — video y portada del VSL de la consulta.
- `TESTIMONIO_VIDEO_EMBED` / `TESTIMONIOS_IMG` — la sección de testimonios
  aparece sola cuando se carga al menos uno.
- `META_PIXEL_ID` / `GA4_ID` — píxeles (opcionales).
- Fotos reales de **Ezequiel** y **Catalina** en la sección del dúo (marcadas
  con `TODO` en el HTML).
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
