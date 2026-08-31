# Arquitectura de la sala — El puzle

> **Qué es este documento:** el plano de cómo está construido el **Lab del dinero**.
> Antes de grabar una sola clase hay que entender esto, porque define qué es una
> clase, cómo se nombra, de qué puede depender y dónde vive.
> **Regla madre:** si una clase no se puede insertar en este esquema, no entra a la sala.

---

## 1 · El problema que esta arquitectura resuelve

La formación anterior era **una línea**: clase 1 → clase 2 → clase 3. Eso funciona
en un colegio, donde todos los alumnos entran el mismo día con el mismo nivel. En
una sala de marketing no pasa nunca.

En el mismo mes entran:

- El que no tiene nada. Ni producto, ni cuenta, ni idea.
- El que lleva dos años publicando en Instagram y no ha vendido un peso.
- El que vende, pero cada venta le cuesta tres semanas de conversaciones a mano.
- El que ya factura y lo que necesita es dejar de depender de sí mismo.

Si los cuatro empiezan en la clase 1:

| Quién | Qué le pasa en una sala lineal |
|---|---|
| El que no tiene nada | Le sirve… hasta la clase 6, donde se habla de leads que él no tiene. Se pierde y se va. |
| El que publica y no vende | Se aburre en las 4 primeras clases. Cree que ya lo sabe. Se va antes de llegar a lo que sí le servía. |
| El que vende a pulso | Se ofende. "Esto es para principiantes." Pide reembolso. |
| El que quiere escalar | Ni siquiera termina la primera clase. |

**Nadie llega a la clase que le habría cambiado el negocio.** Ese es el problema.
No es un problema de contenido, es un problema de arquitectura.

## 2 · La idea: piezas, no capítulos

El Lab del dinero no es un camino, es **un tablero de piezas**. Cada clase es una
pieza que resuelve **un** problema y deja **un** entregable. La persona no "avanza
por el curso": **arma su embudo** tomando las piezas que su situación pide.

```
        SALA LINEAL (lo viejo)              EL PUZLE (lo nuevo)

   1 → 2 → 3 → 4 → 5 → 6 → 7          Diagnóstico
   ─────────────────────────►               │
   Un solo orden. Un solo nivel.      ┌─────┴─────┬─────────┬──────────┐
   El 80% se cae en el camino.      Ruta 1     Ruta 2    Ruta 3     Ruta 4
                                       │          │         │          │
                                       └──── mismas piezas, ──────────┘
                                            distinto orden
```

Consecuencia práctica: **la misma clase sirve a dos personas distintas en momentos
distintos de su negocio**, y ninguna de las dos tiene que ver lo que no le toca.

## 3 · Las 5 reglas del juego (los pilares)

Todo lo que se enseña en la sala cae en una de cinco cajas. No hay una sexta. Si
aparece un tema que no cabe en ninguna, o está mal explicado o no es de esta sala.

| # | Pilar | Código | La pregunta que responde |
|---|---|---|---|
| 1 | **Tráfico** | `TR` | ¿Quién te ve? Si nadie te conoce, nadie te compra. Una tienda en una calle sin gente no vende, por buena que sea la tienda. |
| 2 | **Oferta** | `OF` | ¿Lo que ofreces le importa a esa gente? Vender agua en una maratón o cerveza en el festival: el mismo producto cambia de valor según dónde y a quién. |
| 3 | **Cliente ideal** | `CI` | ¿A quién exactamente? El que tiene el pelo en llamas y te compra el extintor **ahora**. |
| 4 | **Canal** | `CA` | ¿Dónde ocurre? Instagram, YouTube, TikTok, email. Uno. Dominado. Un año antes de pensar en el segundo. |
| 5 | **Conversión y automatización** | `CV` | ¿Cómo se transforma la atención en conversación, y la conversación en venta? Y qué parte de eso deja de depender de ti. |

Un embudo **no es un sexto pilar**: un embudo es la forma concreta en que esos cinco
se conectan en tu caso. Por eso no existe el embudo copy-paste — porque no existen
dos personas con los mismos cinco.

Además de los cinco pilares hay tres cajas de apoyo que sostienen la sala:

| Pilar de apoyo | Código | Para qué |
|---|---|---|
| **Núcleo** | `NU` | Cómo se usa la sala, el mapa, las reglas del juego. Lo transversal. |
| **Armado (embudo)** | `EM` | La mesa donde se ensamblan las piezas: elegir tu embudo, dibujarlo, revisarlo. |
| **Métricas y dinero** | `ME` | Los números: qué mirar, cuánto puedes pagar por un lead, cuándo un embudo está roto. |
| **Mentalidad y ejecución** | `MN` | Lo que hace que la persona siga ahí en el mes tres. Constancia, precio, miedo, aguante. |

## 4 · Los 4 niveles del jugador

El nivel **no** es "cuánto sabes". Es **qué tienes montado hoy**. Se declara con
hechos, no con autoestima.

| Nivel | Nombre | Se reconoce porque… | Lo que le falta de verdad |
|---|---|---|---|
| **N0** | Sin mesa | No hay oferta clara ni audiencia. Puede tener un talento, un oficio, un servicio suelto. | Definir a quién y qué. Nada más. |
| **N1** | Ruido sin ventas | Publica, tiene seguidores o algo de audiencia, pero no entra plata. "Me ven y no me compran." | Oferta y conversión. Casi nunca es tráfico. |
| **N2** | Vende a pulso | Vende, pero cada venta es artesanal: DMs eternos, precios distintos, meses buenos y meses muertos. | Sistema: un embudo repetible y un precio sostenido. |
| **N3** | Con sistema | Hay un embudo que funciona y números conocidos. Quiere volumen o quiere sacarse de encima el trabajo manual. | Tráfico pagado, automatización, delegación. |

**Regla dura:** nadie se autodeclara N3 sin números. Si no puede decir cuántos leads
entraron el último mes y cuántos compraron, es N2 como mucho.

## 5 · Anatomía de una pieza (clase)

Toda clase de la sala se define con esta ficha. Sin ficha completa, no se graba.

| Campo | Qué es | Ejemplo |
|---|---|---|
| **Código** | Pilar + número. Es el nombre real de la clase para mentores y alumnos. | `OF-02` |
| **Título** | Corto, en lenguaje del alumno, no académico. | "Tu oferta en una frase" |
| **Nivel** | N0–N3. Puede abarcar dos (`N1–N2`). | N1 |
| **Síntoma** | *"Esta clase es para ti si dices…"*. La frase literal que dice la persona. Es lo que usa el mentor para derivar. | "Me escriben, preguntan precio y desaparecen." |
| **Promesa** | Qué sabrá hacer al terminar. Un verbo, un resultado. | "Vas a poder decir qué vendes en una frase que la otra persona entienda sin explicación." |
| **Prerrequisito** | **Máximo uno.** Si necesita dos, la clase está mal cortada. | `CI-01` |
| **Entregable** | El archivo, documento o cosa que existe después de la clase. Si no hay entregable, es una charla, no una clase. | Ficha de oferta de 1 página |
| **Siguiente sugerida** | 1 o 2 piezas, no más. | `OF-03` o `CV-01` |
| **Duración** | 8–18 min. Lo que pase de 20 se parte en dos. | 12 min |

## 6 · Las siete reglas de construcción

Estas reglas son lo que mantiene el puzle armable. Romperlas convierte la sala en
una línea otra vez, aunque las carpetas parezcan sueltas.

1. **Una clase, un problema, un entregable.** Si al terminar no hay algo escrito,
   dibujado o publicado, la clase no está terminada.
2. **Prohibido decir "como vimos en la clase anterior".** No existe clase anterior.
   Si hay que apoyarse en algo previo, se nombra por código: *"esto asume que ya
   hiciste `CI-01`; si no, párala aquí y anda a verla"*.
3. **Máximo un prerrequisito duro.** Dos dependencias = clase mal cortada.
4. **La clase se abre con el síntoma, no con el temario.** Los primeros 20 segundos
   dicen para quién es y para quién **no** es. El que no calza se va, y eso es bueno.
5. **El nivel se declara en pantalla.** El alumno tiene que poder decidir en 15
   segundos si esa pieza es suya.
6. **Toda clase termina en una acción de menos de 30 minutos.** Si la tarea es de
   una semana, se parte.
7. **El orden nunca se asume, se recomienda.** Se cierra con "lo más probable es
   que ahora te sirva X", nunca con "en la próxima clase veremos".

## 7 · El núcleo obligatorio

No linealidad **no** significa que todo sea opcional. Hay tres piezas por las que
pasa absolutamente todo el mundo, entre en el nivel que entre. Son el marco del
puzle: sin marco, las piezas no cierran.

| Pieza | Por qué es obligatoria |
|---|---|
| `CI-01` · Tu cliente ideal en serio | Todo lo demás se dirige a alguien. Si eso está borroso, el resto es adivinanza cara. |
| `OF-01` · La oferta (transformación A → B) | Sin oferta clara no hay nada que convertir, por mucho tráfico que llegue. |
| `EM-01` · Elegir **tu** embudo | Es la clase donde la persona deja de buscar el embudo de otro y arma el suyo. |

Todo el resto de la sala es **ruta**, no obligación.

## 8 · Qué se cuenta gratis y qué se cuenta pagando

Una sola línea de corte, y se respeta en todas las clases:

- **Módulo 0 (gratis): el QUÉ y el POR QUÉ.** Qué existe, por qué funciona, por qué
  lo que te vendieron no te sirvió. Se muestra el mapa completo del territorio.
- **Módulos pagados: el CÓMO y el CON QUÉ.** Los pasos, las plantillas, los guiones,
  las configuraciones, la revisión.

Esto no es una táctica de retención: es que el "cómo" sin el "qué" no funciona. La
gente que compra el cómo sin entender el qué es exactamente la que termina con un
embudo copiado que no le sirve.

## 9 · Cómo se ve esto dentro de Skool

Skool empuja a lo lineal (módulos ordenados, uno tras otro). Hay que forzarlo:

| Decisión | Cómo se implementa |
|---|---|
| **Los módulos son pilares, no etapas** | Se nombran "Cliente ideal", "Oferta", "Tráfico"… nunca "Módulo 3". El orden visual no implica orden de consumo. |
| **La primera clase de la sala es el mapa** | `NU-00 · Cómo usar esta sala` explica el puzle y manda al diagnóstico. Es la única clase que todos ven primero. |
| **El código va en el título** | `OF-02 · Tu oferta en una frase`. Así el mentor dice "anda a OF-02" y el alumno la encuentra en 5 segundos. |
| **El diagnóstico vive fijo arriba** | Post anclado en la comunidad + enlace en la primera clase. Devuelve una ruta con 4–6 códigos. |
| **Cada clase enlaza a su siguiente** | En la descripción, no en el video: los enlaces se pueden corregir sin regrabar. |
| **Las rutas son posts anclados** | "Ruta 2 · Tienes público y no vendes" con la lista de códigos en orden. Se actualiza sin tocar los videos. |

## 10 · Cómo se añade una clase nueva sin romper el puzle

1. Escribe primero **el síntoma** (la frase literal del alumno). Si no puedes
   escribirla, la clase no existe todavía.
2. Asígnale **pilar y nivel**. Si cae en dos pilares, está mal cortada.
3. Define **el entregable**. Si no hay, es un post de comunidad, no una clase.
4. Busca **qué pieza queda huérfana** con esta: si la nueva hace que otra sobre,
   se retira la otra. La sala crece en cobertura, no en cantidad.
5. Añádela a `05-Mapa-de-Clases.md` **antes** de grabar.
6. Actualiza la ruta o rutas donde entra en `02-Diagnostico-y-Rutas.md`.

---

## Documentos relacionados

- [`01-Modulo-0-Gratuito.md`](./01-Modulo-0-Gratuito.md) — la puerta de entrada: las 3 clases gratis.
- [`02-Diagnostico-y-Rutas.md`](./02-Diagnostico-y-Rutas.md) — cómo se enruta a cada persona.
- [`03-Bases-Cliente-Ideal.md`](./03-Bases-Cliente-Ideal.md) — contenido de `CI-01`.
- [`04-Bases-Oferta-Hormozi.md`](./04-Bases-Oferta-Hormozi.md) — contenido de `OF-01` y siguientes.
- [`05-Mapa-de-Clases.md`](./05-Mapa-de-Clases.md) — el catálogo completo de piezas.
