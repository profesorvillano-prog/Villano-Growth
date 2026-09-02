# Embudo de la consulta · Sana tu Autoinmune

Bloques para pegar en el elemento **Custom Code / HTML** de cada paso en
GoHighLevel. Todos comparten el branding clínico de la landing: azul profundo
`#0E2E3E`, verde-azulado `#0E7C8B`, verde de confirmación `#2F9E7C`, hairlines
`#DCE7EB` y las tipografías Instrument Sans (titulares) e IBM Plex Sans (cuerpo).

| Paso | Archivo | Qué es |
|---|---|---|
| 1 | [`../landing-consulta.html`](../landing-consulta.html) | Landing de la consulta (VSL, copy y botón de pago a Hotmart). |
| 2 | `2-redireccion-post-pago.html` | Pantalla inmediata al pago. Confirma el cobro y empuja al calendario. |
| 3 | `3-calendario-consulta.html` | **Solo el bloque superior.** El calendario se inserta debajo con el elemento nativo de GHL. |
| 4 | `4-thankyou-post-agenda.html` | Página posterior a reservar la hora. |

## Al pegarlos

- **Paso 2:** el botón apunta a `/agendaconsulta`. Cambiar si el paso de agenda
  tiene otra URL. El enlace de ayuda va a `https://ig.me/m/ezequielracca`.
- **Paso 3:** el bloque **no pinta fondo propio** a propósito, para que tome el
  de la sección de GHL y no quede una franja de otro color justo encima del
  calendario. Se quitaron el `iframe` y `form_embed.js` de la versión anterior:
  el calendario lo inserta GHL.
- **Paso 4:** el año del pie se calcula solo.

## Decisiones de copy

- Sin guiones largos, igual que en la landing.
- El paso 3 se redujo a barra, encabezado y tres datos (`1 hora`,
  `Uno a uno`, `Por videollamada`). La lista de "ve preparando" y la nota de
  horarios se quitaron de ahí porque ya viven en el paso 4, después de que la
  persona reservó, que es cuando le sirven.

## Fuentes

`../docs/Mensajes-Angulos-y-Copy.md`; `../landing-consulta.html`.
