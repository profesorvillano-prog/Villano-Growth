# Captación previa al pago — FIXUS

> **La pregunta que responde:** ¿se puede captar a quien hace clic en el botón de
> pago pero no paga, y a quien escribe por WhatsApp antes de comprar?
>
> **Respuesta corta:** sí, pero en cuatro niveles muy distintos de identidad y de
> valor. Confundirlos es lo que hace que un embudo se llene de "leads" que no se
> pueden convertir ni medir.

---

## 1. Los cuatro niveles de captación

| Nivel | Quién es | ¿Lo tengo identificado? | ¿Le puedo escribir? | Dónde vive |
|---|---|---|---|---|
| **N1 · Clic anónimo** | Tocó "Pagar" y no completó | ❌ No | ❌ No | Solo Meta (públicos de retargeting) |
| **N2 · Checkout abierto** | Entró al checkout, dejó datos, no pagó | ✅ Sí *(solo Xflow)* | ✅ Sí | CRM · etapa 1 |
| **N3 · Pago fallido o pendiente** | Intentó pagar y fue rechazado, o quedó pendiente | ✅ Sí | ✅ Sí | CRM · etapa 2 |
| **N4 · Conversación** | Escribió por WhatsApp / DM antes de pagar | ✅ Sí | ✅ Sí | Pipeline `FIXUS · Conversaciones` |

**N1 no entra al CRM y está bien que así sea.** Un clic sin identidad no es un lead;
es una audiencia. Su valor está en Meta (retargeting y optimización de campaña), no
en el CRM. Meterlo al CRM como "oportunidad" solo ensucia el conteo.

**N3 es el más subestimado.** Alguien cuya tarjeta fue rechazada ya tomó la
decisión de comprar — lo único que falló fue el medio de pago. Es el segmento de
recuperación más barato de todo el embudo y **hoy se pierde entero**.

---

## 2. N1 · El clic al botón de pago

**Qué se puede hacer:** disparar un evento de conversión en el clic
(`InitiateCheckout` en Meta, vía píxel + **API de Conversiones** para que sobreviva
al bloqueo de cookies), con `value` y `content_name` del producto.

**Para qué sirve realmente:**

- **Público de retargeting**: "tocó pagar y no pagó" es la audiencia más caliente
  que vas a tener. Anuncio distinto, presupuesto chico, ventana de 7 días.
- **Métrica de diagnóstico**: `clics al checkout ÷ visitas a la landing` te dice si
  el problema está en la landing (poca gente llega al botón) o en el checkout
  (mucha gente llega y no paga). Sin esta métrica, si el embudo no convierte no vas
  a saber cuál de las dos arreglar.
- **Optimización de campaña**: con volumen suficiente, Meta optimiza hacia
  `InitiateCheckout` mucho antes que hacia `Purchase` — útil las primeras semanas,
  cuando todavía no hay compras suficientes para alimentar el algoritmo.

**Lo que NO da:** un contacto. No hay a quién escribirle.

### La tentación que conviene evitar

Poner un formulario de 2 campos (nombre + WhatsApp) **antes** del botón de pago
convierte N1 en N2 y te deja escribirle a todos. Suena obvio, pero:

> El documento de estrategia es explícito en que el orden correcto es **pagar
> primero, datos después**, porque el formulario largo de Xflow espanta a quien
> todavía no compró. Un formulario de 2 campos no es lo mismo que el de Xflow, pero
> **sigue siendo un paso entre la intención y el pago**.

**Mi recomendación:** no lo pongas al encender. Si más adelante quieres probarlo,
pruébalo como test A/B y **júzgalo por costo por entrada pagada, nunca por costo
por lead**. Es perfectamente posible ganar 40 contactos, convertir 3, y perder 8
pagos en el camino. La única cifra que decide es cuántas entradas pagadas salen por
cada peso invertido.

### La versión sin costo: captura solo a quien se va

Un **exit-intent en la página de pago** —no en la landing— que aparece únicamente
cuando la persona hace ademán de cerrar:

> *"¿Prefieres que te lo expliquemos por WhatsApp antes de pagar?"*

Cero fricción para quien iba a comprar (nunca lo ve), y captura a quien de otro modo
se perdía. Esto sí conviene desde el día uno.

---

## 3. N2 · Checkout abierto sin pagar

**Depende enteramente de la ruta de pago:**

| Ruta | ¿Captura N2? | Por qué |
|---|---|---|
| **Xflow** | ✅ Sí, siempre | Xflow obliga a crear usuario antes de pagar. Ese usuario creado y sin pago **es** el N2 |
| **Mercado Pago** | ❌ No de forma fiable | MP pide email en el checkout, pero no notifica abandonos: solo avisa cuando hay un intento de pago |
| **Página de gracias (Ruta C)** | ❌ No | La captura ocurre después del pago, por definición |

> **El "defecto" de Xflow se vuelve ventaja aquí.** Lo que hoy es el problema —te
> obliga a registrarte antes de pagar— es exactamente lo que permite recuperar
> abandonos. Vale tenerlo presente al decidir la ruta: Xflow con webhook da un
> nivel de captación que Mercado Pago no da.

Si la ruta elegida no captura N2, la etapa 1 del pipeline queda vacía. **No pasa
nada** — se deja creada para cuando la ruta lo permita, y si sigue vacía a las tres
semanas, se elimina.

---

## 4. N3 · Pago rechazado o pendiente

Este es el que vale la pena montar sí o sí.

**Cómo llega:** Mercado Pago notifica **todos** los intentos de pago, no solo los
aprobados. El webhook trae `status` con valores como `approved`, `pending`,
`in_process` o `rejected`, más `status_detail` con el motivo concreto (fondos
insuficientes, datos de tarjeta inválidos, rechazo del emisor).

En el escenario de Make, en vez de filtrar `status = approved` y descartar el resto,
se enruta:

```
approved              → etapa 3 · Entrada pagada   (flujo normal, W1)
pending / in_process  → etapa 2 · Pago pendiente   (W10)
rejected              → etapa 2 · Pago rechazado   (W10)
```

**Por qué importa más de lo que parece en Chile:** los medios de pago que quedan
`pending` —transferencia, cupones de pago presencial— son de uso frecuente. Esa
gente **quiso pagar y no completó el trámite**, y hoy no se entera nadie. Y los
`rejected` por tarjeta suelen resolverse con un simple *"prueba con transferencia"*.

**El mensaje cambia según el motivo**, y ahí está la diferencia entre recuperar y
molestar:

| Motivo del rechazo | Mensaje |
|---|---|
| Fondos insuficientes | *"Tu clase sigue reservada. Si prefieres, puedes pagarla por transferencia:"* |
| Datos de tarjeta inválidos | *"Parece que se cayó el pago, acá va el link de nuevo:"* — suele ser un error de tipeo |
| Rechazo del emisor | *"Algunos bancos rechazan pagos online por seguridad. Con otro medio funciona:"* |
| Pendiente (transferencia) | Recordatorio a las 2 h y a las 24 h de completar el pago |

Con Xflow aplica lo mismo **si su webhook informa pagos fallidos**. Es un punto
concreto que vale la pena preguntarle a su equipo técnico: no solo *"¿me avisas
cuando alguien paga?"*, sino *"¿me avisas también cuando alguien intenta pagar y no
puede?"*.

---

## 5. N4 · Conversaciones de WhatsApp

### La decisión de fondo, antes de la técnica

Sí, se puede captar todo lo que entra por WhatsApp y DM, y conviene hacerlo. Pero
hay una trampa que hay que nombrar antes de montarlo:

> **Todo este embudo existe para dejar de vender por WhatsApp.** El pago de entrada
> se cobra precisamente para no depender de conversaciones, y el documento de
> estrategia dice explícitamente que uno de los beneficios es que *"Natalia se
> desliga del WhatsApp"*.
>
> Si el pipeline de conversaciones se convierte en un canal de venta —donde se
> explica el plan, se negocia y se cierra por chat— **recreamos exactamente lo que
> el embudo vino a reemplazar**, con el trabajo extra de haber montado un CRM.

**La regla que lo mantiene sano:** el pipeline de conversaciones **enruta, no
vende**. Su único trabajo es responder dos preguntas y mandar el link de pago. Si
una conversación necesita más que eso, es señal de que la landing no está
explicando bien — y el arreglo va en la landing, no en el chat.

### El pipeline `FIXUS · Conversaciones`

Un **tercer pipeline**, separado de los dos de pago, con cuatro etapas:

| # | Etapa | Disparador | Salida |
|---|---|---|---|
| 1 | **Conversación abierta** | Primer mensaje entrante (WhatsApp, IG DM, FB) | → 2 al identificar servicio |
| 2 | **Calificado** | Se sabe **servicio** y **comuna** | → 3 al enviar link · → `Lost` si está fuera de zona |
| 3 | **Link de pago enviado** | Se mandó el link | → 4 si paga · seguimiento 24 h / 72 h / 7 d |
| 4 | **Derivado a pipeline de servicio** | Pago aprobado | `Won` acá + oportunidad nueva en el pipeline del servicio |

**Por qué un pipeline aparte y no etapas dentro de los de pago:**

1. **Al abrir la conversación no sabes qué servicio es.** "Hola, quiero info" no te
   dice si es 3 a 1 o kine — y los pipelines de servicio exigen saberlo desde la
   primera etapa. La etapa de calificación existe justamente para resolver eso.
2. **Protege el costo por entrada vendida.** Si las conversaciones orgánicas
   entraran a los pipelines de pago, estarías dividiendo la inversión en pauta entre
   entradas que llegaron gratis. El número resultante se ve mejor de lo que es, y
   con él decides el presupuesto.
3. Es la continuación de la regla que ya estaba en `Pipeline-CRM.md` §6: lo que no
   pagó entrada no entra a los pipelines de pago.

### Las dos preguntas de calificación

El bot pregunta exactamente esto, y nada más:

1. **¿Vienes por entrenamiento o por una lesión / dolor?** → define `servicio`
2. **¿En qué comuna estás?** → valida geo

Con eso responde con el link de pago correcto y el argumento de una línea. Si la
comuna está fuera de zona → `Lost` con motivo `Fuera de zona` — que además es **dato
de calidad para la geo de la pauta**: si se acumulan pérdidas por zona, el targeting
está mal apuntado.

### Atribución: el punto técnico que hay que resolver

El problema clásico de WhatsApp es que la conversación llega sin saber de dónde
viene. Dos maneras de resolverlo, y conviene usar las dos:

**a) Mensaje pre-llenado distinto por origen.** El link `wa.me` admite texto inicial.
Un texto por landing y por anuncio:

- Landing 3 a 1 → *"Hola, vengo por la clase de prueba 3 a 1"*
- Landing kine → *"Hola, vengo por la evaluación kinesiológica"*

Es gratis, funciona en cualquier canal y ya da servicio + origen en el primer
mensaje, sin preguntar nada. Cubre buena parte del problema.

**b) Anuncios Click-to-WhatsApp.** Cuando alguien llega desde un anuncio de Meta con
destino WhatsApp, el primer mensaje trae un bloque `referral` con el **id del
anuncio**, el titular y un identificador de clic (`ctwa_clid`). Eso permite atribuir
la conversación **al anuncio concreto**, no solo a la campaña, y devolver la
conversión a Meta por la API de Conversiones para que optimice.

> ⚠️ Esto requiere **WhatsApp Business API (Cloud API)**, no la app de WhatsApp
> Business. Y hay que **confirmar si la integración de WhatsApp de GoHighLevel
> expone el bloque `referral`**; si no lo expone, el webhook tiene que entrar primero
> a Make y de ahí al CRM. Es el punto a verificar antes de prometer atribución a
> nivel de anuncio.

### Sobre lanzar anuncios Click-to-WhatsApp

Se puede, y este montaje lo deja medido. **Pero no al encender.**

Al principio conviene concentrar el presupuesto en un solo modelo de adquisición
(anuncio → landing → pago) para llegar rápido al volumen que se necesita para leer
resultados. Partir con dos modelos en paralelo y presupuesto chico da dos muestras
insuficientes en vez de una decente.

Cuando la pauta ya tenga historia, CTWA es un test que vale la pena — y como ambos
caminos terminan en la misma métrica (**costo por entrada pagada**), la comparación
es directa: ¿sale más barata una clase de prueba mandando el tráfico a la landing o
mandándolo a WhatsApp? Esa respuesta vale mucho y casi nadie la tiene medida.

---

## 6. El beneficio que no es obvio

Montar el pipeline de conversaciones **no necesita ninguna integración de pago**. Se
puede construir esta semana, antes de decidir Xflow vs Mercado Pago, y antes de
encender un peso de pauta.

Y hace algo que ninguna otra pieza hace: **produce la tasa de cierre actual sobre
consultas de WhatsApp** — el dato que figura como pendiente en el documento de
estrategia, que hoy solo vive en la cabeza de Natalia, y que es **la única línea base
contra la cual se va a poder decir si el embudo nuevo mejoró o empeoró lo que ya
existía**.

Si se monta ahora, en tres o cuatro semanas ese número está medido con datos reales
en vez de estimado de memoria. Cuando la pauta se encienda, la comparación existe.

**Por eso, si hay que ordenar el trabajo, este pipeline va primero.** Es el único que
no depende de decisiones de terceros y el que produce el dato más valioso.
