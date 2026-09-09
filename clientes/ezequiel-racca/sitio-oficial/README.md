# Sitio oficial · Sana tu Autoinmune (Una Vida Sin Medicamentos LLC)

Sitio institucional "tradicional" de Ezequiel Racca, pensado para **aprobación de
Meta y para respaldar la LLC en Estados Unidos**. No es una VSL ni una landing de
venta directa: describe el servicio en detalle, presenta al equipo y publica los
tres documentos legales exigidos.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: servicio detallado + precio, qué incluye y qué **no** incluye, cómo funciona, para quién es, **Nosotros / Equipo** (nombre, foto y descripción de cada socio), aviso médico, FAQ y contacto. |
| `politica-de-privacidad.html` | Datos recopilados, tratamiento de **datos de salud** (categoría especial), cookies, píxel de Meta y Google, proveedores, transferencias internacionales, plazos y derechos (RGPD, Ley 25.326, CCPA). |
| `terminos-y-condiciones.html` | 20 secciones: alcance, aviso médico, requisitos, pago, agenda e inasistencia, reembolsos, propiedad intelectual, ausencia de garantía de resultados, limitación de responsabilidad, ley aplicable (Wyoming). |
| `politica-de-reembolso.html` | Derecho de arrepentimiento de 7 días, casos con reembolso garantizado, supuestos excluidos, procedimiento, plazos y contracargos. |

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

## Antes de publicar: completar 3 datos

Al final de **cada** archivo `.html` hay un bloque `var EMPRESA = { ... }`.
Editalo (los cuatro archivos tienen el mismo bloque) y se completa solo el pie,
la sección de contacto y los documentos legales:

```js
EMAIL:    '[EMAIL-SOPORTE]',      // correo de soporte y de ejercicio de derechos
WHATSAPP: '[WHATSAPP-SOPORTE]',   // teléfono de atención (se convierte en enlace wa.me)
SITIO:    '[DOMINIO]',            // dominio final, ej. www.sanatuautoinmune.com
```

Los datos de la LLC (nombre, domicilio principal en Miami y estado de constitución,
Wyoming) ya están cargados,
tanto en el HTML como en el bloque de configuración. También se pueden ajustar
ahí `PRECIO` y `PAGO_URL` (hoy, USD $60 y el checkout de Hotmart).

Buscá `[EMAIL-SOPORTE]`, `[WHATSAPP-SOPORTE]` y `[DOMINIO]` para confirmar que no
queda ninguno sin reemplazar.

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
