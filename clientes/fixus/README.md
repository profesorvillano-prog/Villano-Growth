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
| `previsualizar/` | — | Las mismas 3 landings en **un solo archivo** cada una (doble clic y listo) |
| `ghl/` | — | Las mismas 3 en **bloque para pegar en GoHighLevel** (ver `ghl/COMO-PEGAR.md`) |
| `assets/` | — | CSS y JS compartidos |
| `docs/` | — | Documentos fuente: Avatar, ADS y VSL |

Las tres páginas son **idénticas en estructura**. Solo cambia el copy.

## Cómo abrirlas

- **Para revisarlas rápido:** usa `previsualizar/`. Cada archivo lleva el CSS, el JS y el
  logo dentro, así que se abre con doble clic desde cualquier carpeta y se ve bien.
- **Para publicar en GoHighLevel:** usa `ghl/`. Es un bloque para el elemento
  *Custom Code / HTML*, con el CSS y el JS aislados bajo `#fixus-lp` para que los estilos
  de GHL no lo rompan. Instrucciones en `ghl/COMO-PEGAR.md`.
- **Para publicar en un hosting propio:** sube los archivos de la raíz **junto con la carpeta
  `assets/`**. Si subes el HTML solo, la página se ve sin estilos (letra Times New Roman
  y logo roto): es que no encuentra `assets/fixus.css`.

Las tres versiones salen del mismo `build.py`, así que nunca se desincronizan.

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

Eso regenera las tres versiones (raíz, `previsualizar/` y `ghl/`). **No edites los `.html` a mano**: se sobreescriben.
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

## Temas de color

Cada campaña elige su piel con la clave `tema` en `CAMPANAS`. El esqueleto, el copy y
el CTA son los mismos; solo cambia el color.

| Tema | Campañas | Cómo se ve |
|---|---|---|
| `electrico` (por defecto) | deportista, post-operado | Negro con rojo Fixus intenso, halos y rejilla. Energía deportiva. |
| `calma` | dolor de espalda | Franja oscura arriba (logo y video) y el resto claro. Rojo ladrillo apagado, sin brillos. Sobrio, para el perfil de oficina 40-55. |

Para cambiarle el tema a una campaña, edita su `"tema"` en `build.py` y vuelve a
generar. El tema `calma` vive al final de `assets/fixus.css`, bajo `[data-tema="calma"]`.

## Logo

El logo sale del CDN del cliente:
`https://assets.cdn.filesafe.space/LK0isBMjR28HLsU5VrX3/media/6a8a40b7cdd4b797a357456c.png`

Está definido una sola vez, en la constante `LOGO` de `build.py`. Si cambia, se cambia ahí
y se regeneran las páginas. Ojo: al venir de un CDN externo, si ese link cae el logo
desaparece; cuando montes las landings en el hosting definitivo conviene subir el archivo
al mismo servidor.

## Notas de campaña

- Cada anuncio debe apuntar a **su** landing: el gancho del video es el mismo que el
  titular de la página (message match).
- **No mezclar con el 3 a 1.** Son dolores distintos; si la persona ve todos los servicios
  juntos, se pierde.
- Las páginas van con `noindex`: son destinos de anuncio, no páginas de la web.
- La objeción de la orden médica se resuelve dentro de la landing (FAQ), para que nadie
  se vaya pensando "primero tengo que ir al doctor".
