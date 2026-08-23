# Cómo pegar la landing en GoHighLevel

Cada archivo de esta carpeta es **un solo bloque listo para pegar**. Trae dentro el
CSS, el JavaScript, las fuentes y el logo. No hay que subir nada más.

| Archivo | Anuncio |
|---|---|
| `kine-deportista.html` | 1 · Volver a la cancha (deportista lesionado) |
| `kine-dolor.html` | 2 · Dolor de espalda / hombro |
| `kine-postoperado.html` | 3 · Post-operado o lesión antigua |

## Pasos

1. En GHL: **Sites → Funnels → New Funnel** (o Websites → New Page). Crea **una página
   por anuncio**, no las tres en la misma.
2. Entra al editor y **borra todo** lo que traiga la plantilla: la página va vacía.
3. Añade **una sección** con **una fila** y **una columna**.
4. Dentro de la columna, arrastra el elemento **Custom Code / HTML**  (según la versión
   de GHL aparece como *Custom JS/HTML* o *Code*).
5. Abre el archivo `.html` de esta carpeta, **copia todo** (Ctrl+A → Ctrl+C) y pégalo
   dentro del elemento. Guarda.
6. **Importante — quita los márgenes de GHL**, si no te queda una franja blanca arriba
   y abajo:
   - Selecciona la **sección** → *Styles* → **Padding: 0** (arriba, abajo, izquierda, derecha).
   - Lo mismo en la **fila** y en la **columna**.
   - En *Section → Background* déjalo en negro `#08080A` por si acaso.
7. En **Settings de la página**: fondo negro `#08080A` y, en *Tracking Code / Header*,
   nada más — todo va en el bloque.
8. Publica y **prueba en el celular**: ahí se ve el 75% del tráfico de anuncios.

## Antes de publicar: cambia los enlaces

Dentro del bloque pegado, casi al final, está esto. Es lo único que hay que tocar:

```js
var FIXUS = {
  PAGO_URL:  '…',   // link de pago/agenda de la evaluación
  WA_NUMERO: '56…', // WhatsApp, formato 56912345678
  VSL_EMBED: '…',   // URL EMBED del VSL: https://www.youtube.com/embed/ID
  MAPA_URL:  '…',   // Google Maps del centro
  META_PIXEL_ID: '', // opcional
  GA4_ID: ''         // opcional
};
```

- Si `VSL_EMBED` queda vacío, el botón de play lleva al CTA en vez de romperse.
- El link de pago sale con UTM automática (`utm_content=deportista`, `dolor-cronico` o
  `postoperado`) para saber qué anuncio vende.
- Si ya tienes el píxel de Meta puesto en GHL a nivel de página, **deja `META_PIXEL_ID`
  vacío** para no cargarlo dos veces.

## Notas

- El bloque está aislado bajo `#fixus-lp`: los estilos de GHL no lo tocan y los de la
  landing no afectan al resto de la página.
- Se estira a ancho completo aunque GHL lo meta en su contenedor de 960px.
- Si editas el copy, hazlo en `build.py` y corre `python3 build.py`: se regeneran los
  bloques de esta carpeta. **No edites estos archivos a mano**, se sobreescriben.
