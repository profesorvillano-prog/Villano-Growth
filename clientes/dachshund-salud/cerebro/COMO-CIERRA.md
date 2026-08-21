# Cómo hacer que este bot realmente cierre

> Objetivo único: **consultas de diagnóstico pagadas ($197)**. Todo lo demás
> (libros, seguimientos, derivaciones) es secundario o salida de emergencia.
> Aplicado en `CEREBRO-MARCELO.md`. Agosto 2026.

---

## 1. Lo que decide la venta no es la oferta

En este nicho la persona no llega a decidir entre proveedores. Llega **agotada**.
Los propios libros de Marcelo lo documentan: meses o años de veterinarios,
corticoides, cambios de croqueta, plata gastada, y el perro igual o peor. La frase
textual que más escucha es *"ya no sé qué más hacer"*.

Eso significa que la venta **no se gana con información**. Se gana siendo el
primero que le explica **por qué** pasa lo que pasa. Cuando llega la oferta, la
decisión ya está tomada o ya se perdió.

Consecuencia práctica: el bot tiene que gastar sus primeros tres o cuatro mensajes
en escuchar y devolver, no en vender. Un bot que ofrece en el mensaje dos pierde.

---

## 2. El diagnóstico parcial: el cambio que más mueve la aguja

Para vender un **diagnóstico** hay que demostrar capacidad de diagnosticar sin
entregar el diagnóstico. Casi todos los bots hacen una de las dos cosas mal: o
regalan el protocolo completo (y entonces nadie paga), o no dicen nada útil (y
entonces no hay autoridad).

La fórmula, en un solo mensaje y siempre en este orden:

1. **El mecanismo general** que explica su caso
2. **Lo que no se puede determinar** sin evaluar al perro
3. **Por qué eso requiere la consulta**

> "Lo que me describes tiene toda la forma de un problema que empieza en el
> intestino, no en la piel. El corticoide apaga el síntoma, pero la croqueta sigue
> inflamando todos los días. Por eso mejora y vuelve.
> Lo que no te puedo decir por acá es qué proteínas tolera Kira, en qué cantidad y
> con qué secuencia hay que hacer el cambio. Eso depende de su peso, su edad y su
> historial, y es justo lo que reviso en la consulta."

Esto respeta la regla de no diagnosticar (no dice qué tiene el perro, dice qué
mecanismo suele explicarlo) **y** crea el hueco exacto que llena el producto.

---

## 3. Las dos fotos son un cierre, no un trámite

Ya estaban en la guía del setter humano. Ahora son obligatorias antes de ofertar.

Hacen tres cosas al mismo tiempo: dejan evaluar mejor, generan un micro-compromiso
(ya invirtió esfuerzo en esta conversación) y, sobre todo, le hacen sentir que su
caso **está siendo mirado de verdad**. Eso es exactamente lo que viene a comprar.

Se piden después de que contó algo, enlazadas con lo que dijo. Nunca de entrada
junto con las demás preguntas.

---

## 4. La escalera de micro-compromisos

Cada sí chico hace más probable el sí grande:

```
responde  →  da el nombre del perro  →  cuenta qué ya intentó
   →  manda las fotos  →  dice que sí al link
```

Saltarse un paso para acelerar es lo que hace que la persona desaparezca. El bot
no ofrece hasta tener los cinco datos **y** las fotos.

---

## 5. Cambios de encuadre que valen la pena probar

**Renombrar el producto.** En Hotmart figura como "Asesoría Nutricional". El bot lo
llama **Consulta de Diagnóstico**. "Asesoría" suena a consejos; "diagnóstico" suena
a respuesta, que es lo que la persona busca después de meses sin ninguna. Vale la
pena testear el nombre también en la página de venta.

**No dar precio antes del espejo.** Si preguntan el precio en el primer mensaje,
el bot devuelve la pregunta al caso. Recién da el número después del diagnóstico
parcial, cuando el $197 ya tiene contra qué compararse.

**Anclar contra lo ya gastado, no contra otros productos.** El ancla fuerte no es
"vale $285 y pagas $197": es lo que ya lleva gastado sin resultado.

**Prueba social pegada al síntoma.** Piel → Max (35 días). Peso o columna → Dalí
(40 días). Rascado severo → Mandí (45 días). Nunca un caso genérico.

---

## 6. Los seguimientos tienen que traer algo nuevo

Un seguimiento que dice "¿viste mi mensaje?" quema la conversación. Cada uno tiene
que aportar: una pregunta distinta, un caso parecido al suyo, o un reencuadre.
Máximo cuatro y se termina.

---

## 7. La métrica única

**Consultas pagadas ÷ conversaciones iniciadas.**

Todo lo demás es diagnóstico interno. Si esa tasa es baja, se mira en este orden:

1. ¿Cuántas llegan a dar los 5 datos? Si caen ahí, el bot pregunta mal o pregunta
   demasiado rápido.
2. ¿Cuántas mandan las fotos? Si caen ahí, el pedido está mal enlazado.
3. ¿Cuántas reciben el diagnóstico parcial? Si caen ahí, el bot está ofertando
   antes de tiempo.
4. ¿Cuántas reciben el link y no pagan? Ahí el problema es precio o pasarela, no
   el bot.

---

## 8. Lo que de verdad va a hacer que cierre

El prompt te lleva al 70%. El otro 30% sale de **leer conversaciones reales**.

- Semana 1 en modo sombra: el bot redacta, Marcelo aprueba o corrige, no se envía
  nada. 30 conversaciones revisadas a mano.
- Después, 10 conversaciones completas leídas por semana, buscando **dónde se
  cae la gente**. Casi siempre es el mismo mensaje.
- Cada objeción que el bot no supo responder se agrega al cerebro esa misma semana.

Ningún prompt escrito de una sola vez convierte bien. Los que convierten son los
que llevan veinte iteraciones sobre conversaciones reales.

---

## 9. Lo que sigue faltando

Lo más valioso que no tenemos: **20 o 30 conversaciones reales** de Marcelo o del
setter que renunció, atendiendo por WhatsApp o DM. Con eso se arman los ejemplos
que hacen que el bot deje de sonar a bot. Es el pedido de mayor impacto que se le
puede hacer al cliente.
