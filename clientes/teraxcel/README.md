# teraXcel — Landing "Dolor lumbar · Evaluación prioritaria"

Landing médica de una sola página para el **Método teraXcel** (terapia celular avanzada
para dolor lumbar persistente, Región de Los Lagos). Profesionalización del HTML enviado
por el cliente: se preservó estructura, copy, paleta y tipografías, y se cablearon los
recursos reales (video + 2 fotos) que antes eran placeholders.

## Archivos

- `index.html` — **Variante A (institucional/método):** profesionalización de la landing enviada
  por el cliente. Estructura, copy y método tal como los entregaron, con media real cableada.
- `index-pacientes.html` — **Variante B (paciente/marketing):** misma marca, copy 100% emocional
  y local para tráfico frío de Meta. Hero inmediato (Puerto Varas / Región de Los Lagos), VSL
  arriba, empatía con el recorrido del paciente (kine, pastillas, infiltraciones, cirugía), los
  5 ángulos del avatar, y menos jerga técnica. Basada en las transcripciones con Joaquín (kick-off
  y discovery): avatar que ya tomó acción, posicionamiento "entre lo tradicional y la cirugía",
  fisioterapia (no kinesiología), 90% de resultados, único en Latinoamérica.

Ambas son autocontenidas (CSS y JS inline, sin build) y llevan el mismo VSL de Wistia,
logo, full-bleed para GHL y robustez.

## Recursos (CDN GoHighLevel)

Las imágenes y el video se sirven directo desde el CDN del cliente (`assets.cdn.filesafe.space`),
igual que en el resto de clientes del repo. No hay carpeta local de assets.

| Recurso | Ubicación en la página | URL / ID |
|---|---|---|
| VSL (Wistia) | Sección "Fase 01 — Conoce el método" (`<wistia-player>`, nativo) | media-id `5h3gbry4gy` |
| Logo | Header + footer (chip blanco en footer) | `.../6a98462ea1de6b8a2271ac4c.jpg` |
| Foto clínica (.jpg) | Sección "Clínica" + imagen OG (compartir) | `.../6a983889efeed0ae2596989c.jpg` |
| Foto paciente (.png) | Sección "El problema" | `.../6a983889fac7854efe29bd88.png` |

> **Intercambiar fotos:** si la `.png` y la `.jpg` quedaron en secciones cambiadas,
> basta con intercambiar las dos URLs en `index.html` (sección `#problema` y sección
> `#clinica`). Son una línea cada una.

## Notas de la profesionalización (sin cambiar el carácter del diseño)

- **Media real** en lugar de bloques de color y notas `// Foto:...`.
- **Casos**: las iniciales (M./R./C.) se mantienen a propósito para proteger la
  privacidad del paciente; la nota al pie lo explica.
- **Logo**: imagen del cliente desde el CDN. En el footer (fondo oscuro) va dentro
  de un chip blanco (`.logo-chip`) para que el logo en `.jpg` se lea limpio.
- **VSL**: reproductor **nativo de Wistia** (web component `<wistia-player>`), sin
  overlay ni marco por encima; solo esquinas redondeadas y sombra en el contenedor.
- **Robustez**: el contenido nunca queda oculto si el JS no corre (las animaciones de
  aparición solo se activan con JS); anclas con `scroll-margin-top` para el header fijo;
  meta Open Graph/Twitter + `theme-color` para previsualización al compartir por WhatsApp.
- El formulario es una **demo** (no envía al servidor). Para producción, conectar el
  `submit` al CRM/GHL del cliente.
