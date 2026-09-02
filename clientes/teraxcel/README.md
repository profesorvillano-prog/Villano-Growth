# teraXcel — Landing "Dolor lumbar · Evaluación prioritaria"

Landing médica de una sola página para el **Método teraXcel** (terapia celular avanzada
para dolor lumbar persistente, Región de Los Lagos). Profesionalización del HTML enviado
por el cliente: se preservó estructura, copy, paleta y tipografías, y se cablearon los
recursos reales (video + 2 fotos) que antes eran placeholders.

## Archivo

- `index.html` — landing completa, autocontenida (CSS y JS inline, sin dependencias de build).

## Recursos (CDN GoHighLevel)

Las imágenes y el video se sirven directo desde el CDN del cliente (`assets.cdn.filesafe.space`),
igual que en el resto de clientes del repo. No hay carpeta local de assets.

| Recurso | Ubicación en la página | URL |
|---|---|---|
| Video | Sección "Fase 01 — Conoce el método" (`<video>`) | `.../6a983889da522bf1739f0c78.mov` |
| Foto clínica (.jpg) | Sección "Clínica" + `poster` del video + imagen OG (compartir) | `.../6a983889efeed0ae2596989c.jpg` |
| Foto paciente (.png) | Sección "El problema" | `.../6a983889fac7854efe29bd88.png` |

> **Intercambiar fotos:** si la `.png` y la `.jpg` quedaron en secciones cambiadas,
> basta con intercambiar las dos URLs en `index.html` (sección `#problema` y sección
> `#clinica`). Son una línea cada una.

## Notas de la profesionalización (sin cambiar el carácter del diseño)

- **Media real** en lugar de bloques de color y notas `// Foto:...`.
- **Casos**: las iniciales (M./R./C.) se mantienen a propósito para proteger la
  privacidad del paciente; la nota al pie lo explica.
- **Logo**: wordmark tipográfico `teraXcel` (siempre visible), en vez de un
  `assets/logo.png` que estaría roto. Si el cliente tiene su logo en el CDN, se
  reemplaza el `<span class="logo-word">` por un `<img>`.
- **Robustez**: el contenido nunca queda oculto si el JS no corre (las animaciones de
  aparición solo se activan con JS); anclas con `scroll-margin-top` para el header fijo;
  meta Open Graph/Twitter + `theme-color` para previsualización al compartir por WhatsApp.
- El formulario es una **demo** (no envía al servidor). Para producción, conectar el
  `submit` al CRM/GHL del cliente.
