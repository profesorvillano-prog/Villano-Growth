# Fixus · Landings de campaña

Landings de anuncio para **Fixus** (Kinesiología y rendimiento · Providencia, Santiago).
Negro + rojo Fixus, minimalistas, mobile-first y con **una sola acción**: pagar y agendar
la **evaluación kinesiológica ($24.990)**. El WhatsApp queda como salida secundaria.

## Qué hay acá

| Archivo | Anuncio | Avatar |
|---|---|---|
| `kine-deportista.html` | 1 · "Volver a la cancha" | Deportista lesionado, 25-40 |
| `kine-dolor.html` | 2 · "El dolor de espalda que ya no te deja tranquilo" | Oficina, lumbago/hombro, 40-55+ |
| `kine-postoperado.html` | 3 · "Deja de arrastrarlo" | Post-operado o lesión de +1 año |
| `index.html` | — | Índice interno para revisar las tres (no publicar como destino de ads) |
| `build.py` | — | Generador: plantilla única + copy por campaña |
| `assets/` | — | CSS, JS y logo compartidos |
| `docs/` | — | Documentos fuente: Avatar, ADS y VSL |

Las tres páginas son **idénticas en estructura**. Solo cambia el copy.

## Antes de publicar (obligatorio)

Todo se configura en **un solo archivo**: `assets/fixus.js`, arriba del todo.

```js
var FIXUS = {
  PAGO_URL:       '…',  // link de pago/agenda de la evaluación (Flow, Mercado Pago, calendario)
  WA_NUMERO:      '56…', // WhatsApp: 56 + número, sin + ni espacios
  VSL_EMBED:      '…',  // URL EMBED del VSL (https://www.youtube.com/embed/ID)
  MAPA_URL:       '…',  // Google Maps del centro
  META_PIXEL_ID:  '',   // opcional
  GA4_ID:         ''    // opcional
};
```

Al cambiarlo, las tres landings se actualizan solas. El link de pago sale con UTM
automática (`utm_content=deportista|dolor-cronico|postoperado`) para saber qué anuncio vende.

### Pendientes de material
- [ ] **VSL grabado y subido** (guion en `docs/VSL-Kinesiologia.docx`). Mientras `VSL_EMBED`
      esté vacío, el botón de play lleva al CTA en vez de romperse.
- [ ] **Logo oficial**: `assets/logo.svg` es una reconstrucción. Reemplazar por el archivo real.
- [ ] **Testimonios**: la sección está lista y **comentada** dentro del HTML (buscar
      `TESTIMONIOS` en `build.py`). Descomentar cuando estén grabados los 2 del documento
      de avatar. No publicar testimonios inventados.
- [ ] **Dirección exacta** del centro (hoy dice "Providencia, a pasos del Metro Colón").
- [ ] Confirmar **duración real de la evaluación** (la landing dice 1 hora).

## Cómo editar el copy

1. Abre `build.py` y busca el diccionario `CAMPANAS`.
2. Edita el texto de la campaña que quieras.
3. Ejecuta:

```bash
python3 build.py
```

Eso regenera los tres HTML. **No edites los `.html` a mano**: se sobreescriben.
Si necesitas cambiar la *estructura* de las tres a la vez, edita `PLANTILLA` en el mismo archivo.

## Estructura de la página

1. **Header** minimalista con logo centrado (ref. FITPM / Social Business)
2. **Hero**: gancho del anuncio → titular → bajada → **VSL** → CTA
3. **CTA tipo tarjeta** (ref. Physica): primario = pagar evaluación · secundario = WhatsApp
4. **Antes / Después**: dónde estás hoy vs cómo sales
5. **Qué incluye la evaluación** + CTA
6. **Cómo funciona**: proceso de 5 pasos con línea de tiempo (ref. AU Coaching)
7. **Por qué acá y no en cualquier parte**
8. *(Testimonios — comentados hasta tenerlos)*
9. **FAQ**: orden médica, reembolso isapre, "ya hice kine y no me resultó", precio, ubicación
10. **Cierre** con CTA + ubicación
11. **Barra fija móvil** con los dos botones

## Notas de campaña

- Cada anuncio debe apuntar a **su** landing: el gancho del video es el mismo que el
  titular de la página (message match).
- **No mezclar con el 3 a 1.** Son dolores distintos; si la persona ve todos los servicios
  juntos, se pierde.
- Las páginas van con `noindex`: son destinos de anuncio, no páginas de la web.
- La objeción de la orden médica se resuelve dentro de la landing (FAQ), para que nadie
  se vaya pensando "primero tengo que ir al doctor".
