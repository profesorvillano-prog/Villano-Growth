# Sitio oficial · Sana tu Autoinmune (Una Vida Sin Medicamentos LLC)

Sitio institucional "tradicional" de Ezequiel Racca, pensado para **aprobación de
Meta y para respaldar la LLC en Estados Unidos**. No es una VSL ni una landing de
venta directa: describe el servicio en detalle, presenta al equipo y publica los
tres documentos legales exigidos.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: servicio detallado + precio, qué incluye y qué **no** incluye, cómo funciona, para quién es, **Nosotros / Equipo** (nombre, foto y descripción de cada socio), aviso médico, FAQ y contacto. |
| `politicas-privacidad.html` | Datos recopilados, tratamiento de **datos de salud** (categoría especial), cookies, píxel de Meta y Google, proveedores, transferencias internacionales, plazos y derechos (RGPD, Ley 25.326, CCPA). |
| `terminos-condiciones.html` | 20 secciones: alcance, aviso médico, requisitos, pago, agenda e inasistencia, reembolsos, propiedad intelectual, ausencia de garantía de resultados, limitación de responsabilidad, ley aplicable (Wyoming). |
| `politicas-de-reembolso.html` | Derecho de arrepentimiento de 7 días, casos con reembolso garantizado, supuestos excluidos, procedimiento, plazos y contracargos. |

Las cuatro páginas comparten cabecera, pie y estética (paleta clínica azul/verde
azulado, Instrument Sans + IBM Plex Sans), la misma del embudo *Sana tu Autoinmune*.

## Qué exige Meta / la LLC y dónde está resuelto

| Requisito | Dónde |
|---|---|
| Producto o servicio claramente visible | `index.html#servicio` — ficha con formato, duración, entregables, precio y plazo de entrega |
| Sección "Nosotros / Equipo" con nombre, foto y descripción | `index.html#equipo` — Ezequiel Racca y Dra. Catalina Clembosky (MN 171999) |
| Políticas de privacidad, términos y reembolso visibles | Enlazadas en la barra superior **y** en el pie de todas las páginas |
| Nombre de la LLC en el pie | `Una Vida Sin Medicamentos LLC` |
| Dirección física registrada en el pie | `1000 Brickell Avenue, Suite #715, PMB 153, Miami, Florida 33131, Estados Unidos` (domicilio principal de la LLC) |

## Dónde vive cada página

Los archivos llevan el nombre del slug final y todos los enlaces internos son
absolutos al dominio del cliente, así funcionan igual pegados en GoHighLevel.
Las tres páginas legales llevan un enlace "Volver al inicio" arriba del título y
otro, como botón, al final del documento:

| Archivo | URL final |
|---|---|
| `index.html` | https://ezequielracca.com/inicio |
| `politicas-privacidad.html` | https://ezequielracca.com/politicas-privacidad |
| `terminos-condiciones.html` | https://ezequielracca.com/terminos-condiciones |
| `politicas-de-reembolso.html` | https://ezequielracca.com/politicas-de-reembolso |

## Versión para pegar en GoHighLevel (`ghl/`)

Las mismas tres páginas legales, pero **sin menú de navegación**, pensadas para
enlazar directo desde la landing VSL:

- `ghl/ghl-politicas-privacidad.html`
- `ghl/ghl-terminos-condiciones.html`
- `ghl/ghl-politicas-de-reembolso.html`

Diferencias con las de la raíz:

- No son documentos completos: son un bloque para pegar tal cual en un elemento
  **Custom Code / HTML** de GoHighLevel (sin `<!DOCTYPE>`, `<head>` ni `<body>`).
- Todo el CSS está acotado a `#sta-legal`, así los estilos de la plantilla de GHL
  no los tocan ni ellos tocan al resto de la página. Probado contra una plantilla
  con tipografía, colores y viñetas propias.
- Arriba llevan solo el logo (enlazado al inicio) y el enlace «Volver al inicio»;
  abajo, el mismo pie con la LLC, el domicilio y los avisos legales.
- Al final de cada archivo hay un bloque `var LEGAL = { ... }` donde se editan los
  datos de la empresa y, sobre todo, `INICIO_URL` y las URLs de las otras dos
  páginas legales, para el caso de que la landing viva en otra ruta.

## Datos cargados

Al final de cada `.html` hay un bloque `var EMPRESA = { ... }` con los datos que
se inyectan en el pie, el contacto y los documentos legales:

```js
LLC:       'Una Vida Sin Medicamentos LLC',
DIRECCION: '1000 Brickell Avenue, Suite #715, PMB 153, Miami, Florida 33131, Estados Unidos',
ESTADO:    'Wyoming',                     // estado de constitución
EMAIL:     'ezequielracca1984@gmail.com',
WHATSAPP:  '+54 9 336 400-7472',
SITIO:     'ezequielracca.com',
PRECIO:    'USD $60',
PAGO_URL:  'https://pay.hotmart.com/P107408158S'
```

Si cambia alguno, editalo en los cuatro archivos (el bloque es idéntico) y el
resto de la página se actualiza solo.

Los datos de la LLC aparecen **solo en el pie** y en los textos legales: la
sección de contacto muestra correo, WhatsApp, horario y sitio web.

## Criterios de compliance sostenidos en todo el copy

- Ezequiel Racca **no es médico** (odontólogo y health coach en nutrición funcional): se aclara en el equipo, en la FAQ y en los términos.
- La Dra. Clembosky **supervisa clínicamente** el servicio; no presta consulta médica individual ni abre historia clínica.
- El servicio es **complementario**, no reemplaza al médico tratante, y **nunca** se sugiere abandonar medicación.
- **No se prometen ni garantizan resultados**; los testimonios se presentan como casos individuales.
- No se comparten datos de salud con plataformas publicitarias ni se crean audiencias con ellos (requisito de las políticas de anuncios de Meta sobre salud).
- Descargo de no afiliación con Meta ni Google en el pie.

> Revisión legal: los textos son un borrador profesional listo para usar, pero
> conviene que un abogado del estado de Wyoming (y, si se factura a la UE, un
> especialista en RGPD) los valide antes de publicar.
