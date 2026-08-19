# ManyChat — Mensaje de levantamiento para que Valen setee

> Automatización de Instagram para `@japieaters`. **El bot solo abre el DM; Valen
> hace todo el setteo manual.** Decidido en la reunión del 18/08 (Josefina, Seba,
> Valen, Anaís). Voz y reglas de lenguaje: [`Voz-y-Marca.md`](./Voz-y-Marca.md).
> Calificación y funnel: [`Operaciones-y-Embudo.md`](./Operaciones-y-Embudo.md).

## 1. El problema que resuelve

Valen abre las conversaciones a mano desde las notificaciones de Instagram. Cuando
entran muchos seguidores nuevos, **la lista de notificaciones se satura**: baja,
escribe uno, vuelve, se le refresca el feed y ya no puede seguir bajando. Se están
perdiendo bienvenidas.

**Decisión de la reunión:** que ManyChat mande **un solo mensaje genérico y corto**
que deje el DM abierto, y que Valen continúe desde ahí de forma 100% manual.

> *"Un mensaje genérico, pero que deje la conversación abierta para que yo la siga."*
> — Valen
>
> *"Que al menos el primer mensaje se mande automático, pero que sea algo piola.
> Y ya el resto 100% manual, para que no se vea que es una automatización y se
> genere cercanía."* — Seba

## 2. Las 6 reglas del mensaje de levantamiento

1. **Genérico de verdad.** No pregunta nada comprometedor, no vende, no explica la
   marca. Su único trabajo es que el DM quede abierto.
2. **Sin botón.** Hay que borrar el quick reply "Siii, estoy curios@" del nodo de
   mensaje. Un botón delata al bot y además no abre conversación real.
3. **Sin link.** Josefina ya decidió que a quien se interesa en la formación se le
   habla directo, no con automatización.
4. **Con retraso.** 10 min para seguidores nuevos, 5-10 min para comentarios.
   Instantáneo = robot.
5. **Una sola pregunta, fácil.** La que Valen ya usa de entrada: el país. Así el
   bot le ahorra el primer paso y ella arranca en el segundo, sin repetir nada.
6. **Seguro para cualquier destinatario.** También le va a llegar a exalumnas,
   amigas y familia de Josefina (las "naranjitas"). Un "hola, bienvenida" no
   incomoda a nadie; el mensaje actual ("¿te gustaría saber por qué esta cuenta se
   llama Japi Eaters?") sí queda raro con una exalumna.

## 3. Copy — Seguidores nuevos *(el que hay que pegar)*

### ✅ Recomendado

```
Hola, holaa 👋🥕

Vi que empezaste a seguirme y quería darte la bienvenida 💛

Cuéntame, ¿de qué país me lees?
```

### Variante B — más Josefina

```
Holaaa 👋🍓 qué linda que llegaste por acá

Bienvenida a Japi Eaters 💛 gracias de verdad por seguirme.

Cuéntame, ¿de qué país me lees?
```

### Variante C — la más corta ("piola")

```
Hola, holaa 👋🥦 bienvenida 💛

¿De qué país me lees?
```

> **Sobre el nombre:** mejor **no usarlo** en el mensaje automático. El campo de
> nombre de Instagram a veces trae el usuario en vez del nombre real y queda
> "rarísimo" (le pasó a Josefina). El nombre lo pone Valen a mano en el segundo
> mensaje, que es donde de verdad suma. Si igual quieren probarlo, insertar el
> campo de nombre **con valor por defecto "bella"** y revisar cómo sale.

## 4. Copy — Quien comenta "ÉXITO" o "IA" en un post

Mismo criterio, pero acá la persona ya mostró interés: el mensaje lo reconoce y
pide contexto, **sin mandar el link** (decisión de Josefina: a estas se les habla
personalizado).

```
Hola, holaa 👋🥕 perdón la demora, tengo hartos mensajes 🙈

Vi que comentaste en el post — me alegra un montón que te interese 💛

Cuéntame, ¿en qué estás trabajando ahora?
```

Retraso: **5-10 minutos**. La disculpa por la demora es lo que hace que se lea
humano (Josefina ya la usa y Valen la notó natural en una conversación real).

> **Ojo:** hoy conviven varias publicaciones con automatización de "IA" y de
> "ÉxiTO". Si a alguien no le llega el DM, suele ser la automatización del post que
> falló, no este flujo. Revisar post por post cuál tiene automatización activa.

## 5. Montaje en ManyChat

El disparador **"El usuario sigue tu cuenta"** sí existe en el Flow Builder, pero
**no aparece en el selector de "Inicia automatización cuando..."** al crear una
automatización nueva. Se llega abriendo la automatización **"Saludá a tus nuevos
seguidores"** que ya existe (carpeta SETE) y editando su flujo.

1. Abrir esa automatización → el flujo muestra `El usuario sigue tu cuenta` →
   `Send Message`.
2. En el nodo de mensaje: **borrar el botón** "Siii, estoy curios@" y pegar el copy
   de la §3.
3. **Retraso: 10 minutos** (la opción "añade un corto retraso para que resulte más
   natural y humano").
4. **Acción → etiqueta `levantado_seguidor`.** Esta etiqueta es lo que después le
   permite a Valen filtrar (§6).
5. **No agregar nada más**: ni segundo mensaje, ni pregunta automática, ni link.
   El flujo termina ahí.
6. Duplicar la lógica en la automatización de comentarios con el copy de la §4 y la
   etiqueta `levantado_comentario`.

**Prueba antes de encender** (con otra cuenta): seguir la cuenta → ¿llega a los 10
min?, ¿llega sin botón?, ¿queda etiquetada?, ¿aparece filtrable en el chat en vivo?

## 6. Cómo trabaja Valen después (esto es lo que arregla el problema)

**Dejar de trabajar desde las notificaciones de Instagram.** Trabajar desde el
**chat en vivo de ManyChat**, filtrando por etiqueta:

| Filtro | Qué es | Prioridad |
|---|---|---|
| `levantado_comentario` + no leídos | Comentaron ÉxiTO/IA: ya mostraron interés | 🔴 Primero |
| `levantado_seguidor` + no leídos | Respondieron el saludo de bienvenida | 🟠 Segundo |
| `levantado_seguidor` sin respuesta | No contestaron | ⚪ No insistir |

La lista de ManyChat no se refresca ni se reordena como el feed de notificaciones:
se puede ir una por una sin perder el hilo. Y las que respondieron aparecen como no
leídas, que es exactamente la señal de "acá tengo que seguir yo".

**A quien no responde el saludo no se le manda un segundo DM.** Se deja ahí.

## 7. Guion manual de Valen (después del mensaje automático)

El bot ya preguntó el país. Valen arranca en el paso 2.

| # | Objetivo | Ejemplo |
|---|---|---|
| 1 | *(automático)* Abrir el DM + país | §3 |
| 2 | Calidez + profesión | `Ay, qué lindo 💛 [comentario real sobre el país] Cuéntame, ¿tú eres terapeuta ocupacional o llegaste por otro motivo?` |
| 3 | ¿Trabaja con niños y niñas? | `¿Y estás trabajando con niños y niñas ahora?` |
| 4 | Caso concreto *(acá se engancha)* | `¿Y te están llegando casos de alimentación? Selectividad, rechazo, niños dentro del espectro...` |
| 5 | Profundizar el razonamiento | `Uf, te entiendo. ¿Y qué has probado hasta ahora con ese caso?` |
| 6 | Formulario | Solo si califica (§8) |

> **Insight de Valen, muy valioso:** las TO se enganchan muchísimo más cuando el
> contenido o la pregunta plantea **un caso clínico concreto**, porque quieren
> explicar su razonamiento. No buscan un listado de actividades: buscan entender
> **por qué** pasa lo que pasa en sus casos. El paso 4 es el que abre de verdad la
> conversación — y coincide con lo que más se repite: *"en sesión funciona, pero en
> la casa se corta"*.

### Reglas de estilo (voz de Josefina)

- **"Hola, holaa"**, alargar palabras, tono de amiga cercana.
- **Emojis de alimentación**: 🥕🍓🥦🍉 — es la firma de la marca.
- **Signos de pregunta completos: ¿...?** (Josefina lo pidió expresamente; en Chile
  se estila solo el de cierre, pero acá se usan los dos).
- **Nombre acortado y cariñoso**: si es Catalina → "Cata". Si no aparece el nombre:
  `hola bella`, `hola reina`, `hola colega`, o directamente
  `Hola, ¿cómo estás? No encontré tu nombre, ¿cómo te llamas?`
- **Las preguntas salen de la respuesta anterior**, no de una lista fija. Si repite
  una pregunta ya contestada, la persona siente que no la leyeron.
- Nunca "paciente" (→ usuario / niño o niña), nunca solo "niño" (→ "niño y niña" /
  "niñ@"), nunca "papás" (→ familia / mamá).

## 8. Reglas de calificación (definidas por Josefina en la reunión)

| Perfil | Qué hacer |
|---|---|
| **Profesional del área de la salud QUE trabaja con niños y niñas** | ✅ **Al formulario.** Ahí se hace la calificación. |
| **Prime:** terapeutas ocupacionales, nutricionistas, fonoaudiólogas | ✅ Máxima prioridad |
| **Mamás, papás o quien busca algo para su propio hijo o hija** | ❌ No califica → **etiqueta azul** (enviado / no califica). Josefina las contacta y las deriva a su otro Instagram con el curso para familias. |
| **No profesional del área de la salud** | ❌ No califica → etiqueta azul |
| **Marca naranja** (exalumnas, amigas y familia de Josefina) | 🚫 **Omitir.** Se las deja a Josefina — el ticket para exalumnas está en construcción. |

> **Si aparece una profesión que no conoces** (pasa seguido, son muchos países): no
> googlear, preguntar. `¿Y en qué consiste tu trabajo con niños y niñas?` La
> respuesta califica sola y además hace avanzar la conversación.

## 9. Qué NO hacer

- Botones, menús o "responde X para recibir Y" en el mensaje automático.
- Mandar el link de la formación desde el bot.
- Encadenar un segundo DM automático a quien no respondió.
- Que el bot pregunte algo que Valen va a volver a preguntar.
- Explicar la marca ("Japi Eaters viene de Happy Eaters...") antes de saber con
  quién se está hablando.
- Ofrecer ÉxiTO a alguien marcado como no califica.
- Escribir en el mensaje automático algo que afirme que lo está tipeando alguien en
  ese momento.

## 10. Pendientes a confirmar

1. **Acompañante terapéutico:** en la reunión quedó ambiguo si califica. Regla
   general: área de la salud + trabaja con niños y niñas. **Confirmar con Josefina.**
2. **Lista de profesiones que califican** — Josefina ofreció armarla; sirve como
   referencia rápida para Valen.
3. **CRM:** Seba va a enseñarle el CRM a Valen. Hasta entonces, registro manual de a
   quién se le mandó el formulario.
4. **Marcajes de Instagram:** Anaís tiene que explicarle a Valen el sistema de
   marcas (naranja / azul / etc.) para que no se pisen con lo ya marcado.
5. **Sesión 1:1 Josefina + Valen** para revisar juntas una conversación real (quedó
   pendiente la de Rocío).
