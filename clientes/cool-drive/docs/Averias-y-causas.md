# Averías del bot: causas confirmadas y cómo diagnosticarlas

Registro de fallas reales que tumbaron el bot, con la causa verificada y la
señal que hay que mirar para detectarlas rápido. Cada una costó horas de
diagnóstico; están aquí para no repetirlas.

---

## 1. Instagram dejó de responder (31 ago – 5 sep 2026)

**Síntoma:** el bot respondía por WhatsApp pero jamás por Instagram. El
workflow `Bot Respuesta Instagram` en GHL marcaba **0 enrolled** pese a haber
134 conversaciones de IG. El webhook de Make mostraba `queueCount: 0`.

**Causa real:** en GHL → Settings → Integrations → Instagram, la cuenta
`Escuela Cool Drive Maipú` tenía el toggle **"Enable messaging + automation"
apagado**. Sin ese toggle, Meta no entrega los DM a GHL. No llegaba nada que
el workflow pudiera evaluar.

**Cómo detectarlo en 30 segundos:** ordena las conversaciones por fecha del
último mensaje y compara canales. Si el último mensaje de Instagram tiene días
de antigüedad mientras WhatsApp está al día, el problema es la conexión del
canal, no el workflow ni el prompt.

**Descartes que costaron tiempo:**
- No era el filtro `Reply channel is "Instagram DM"` del trigger.
- No era el trigger `Customer Replied`. Ese **es** el trigger de mensaje
  entrante en GHL; no existe un trigger llamado `Inbound Message`.

---

## 2. La memoria no se guardaba (4 – 5 sep 2026)

**Síntoma:** el bot repetía preguntas ya contestadas, se volvía a presentar y
`turnos` quedaba en 0. Parecía un problema de prompt.

**Causa real:** el módulo "Guardar memoria" fallaba **siempre**, en el mapeo
del campo `pausado`:

```
Failed to map 'data.pausado': Function 'if' finished with error!
Function 'or' not found!  ·  Code: DataError
```

La expresión era:

```
{{if(or(4.accion = "derivar_humano"; 4.accion = "alumno_existente"); true; false)}}
```

**Make no tiene la función `or()`.** El módulo reventaba antes de escribir, la
ejecución se iba a *Incomplete Executions* y el datastore quedaba congelado.
Como el envío del mensaje está **antes** del guardado, el lead sí recibía
respuesta: la falla era invisible desde fuera.

**Corrección aplicada** — `if` anidados, sin depender de funciones extra:

```
{{if(4.accion = "derivar_humano"; true; if(4.accion = "alumno_existente"; true; false))}}
```

**Cómo detectarlo:** si el bot repite preguntas, no toques el prompt todavía.
Primero mira el datastore `cooldrive_memoria` y compara `ultimo_mensaje_at` del
lead contra la hora real de la conversación. Si está congelado, el problema es
el guardado, no el modelo.

**Regla general:** una ejecución en **WARNING** no es ruido. Significa que un
módulo falló y un error handler lo tapó. Ábrela siempre.

---

## 3. Escenarios apagados después de editar por API

`scenarios_update` reemplaza el blueprint completo y **puede dejar el escenario
apagado**. Ha pasado varias veces que el bot quedó caído sin que nadie lo
notara.

**Regla:** después de cualquier edición por API, verificar `isActive` y
encenderlo si quedó en `false`. El aviso va **primero** en el mensaje al
cliente, nunca al final.

---

## 4. Filtros OR cuando se querían AND

En Make, el arreglo externo de condiciones son grupos **OR** y el interno es
**AND**. Escribir dos condiciones como dos grupos separados las convierte en
OR.

Pasó con el gate del bot: `notcontain "alumno"` y `notcontain "bot-off"` en
grupos distintos hacía que un contacto con tag `alumno` pero sin `bot-off`
pasara igual. Las condiciones que significan "ninguna de estas" van **en un
solo grupo AND**. Lo mismo aplica a las ramas If/Else de GHL.

---

## 5. Memorias de clientes distintos en el mismo datastore

**Riesgo:** si dos bots de clientes distintos comparten datastore y coincide un
`contactId`, un lead recibe el contexto del otro negocio. Es la peor falla
posible de cara al cliente.

**Estado verificado (5 sep 2026):** los escenarios ya estaban bien apuntados.

| Datastore | Lo usan |
|---|---|
| `cooldrive_memoria` (173778) | los 2 escenarios de Cool Drive, y solo esos |
| `setter_marcelo` (180176) | los 3 escenarios de Marcelo, y solo esos |

Lo que había en `cooldrive_memoria` eran **7 registros veterinarios residuales**
del 2 y 3 de septiembre, de cuando el bot de Marcelo todavía apuntaba ahí,
antes de que existiera `setter_marcelo`. Ningún escenario los leía, pero si un
`contactId` de Cool Drive hubiera coincidido con uno de ellos, el bot le habría
hablado de perros salchicha. Se eliminaron.

**Pendiente, coupling menor:** los dos datastores comparten la misma
`datastructureId` (552700). No cruza datos de leads — es solo la definición de
campos — pero si alguien renombra o elimina un campo pensando en un cliente, se
lo cambia al otro. Conviene duplicar la estructura y dejar una por cliente, en
un horario sin conversaciones activas.

**Regla:** un cliente, un datastore, una estructura. Antes de crear un bot
nuevo, crear su datastore propio; nunca reutilizar el de otro cliente "por
mientras", porque ese "por mientras" es el que deja los residuos.

---

## 6. El bot escribía sin eñes ni tildes (5 sep 2026)

**Síntoma:** el bot escribió "manana" en vez de "mañana". También venía
escribiendo "Acuna" por "Acuña", "practicas", "teoria", "anos".

**Causa:** los prompts de sistema estaban escritos **enteros sin eñes ni
tildes**, para evitar problemas de escape al editarlos por API. El modelo imita
la ortografía de sus instrucciones: si sus 200 líneas dicen "manana", escribe
"manana".

**Por qué no bastaba una regla.** Añadir "usa eñes y tildes" a un texto que no
las usa es contradecirse. La demostración pesa más que la instrucción. Hubo que
reescribir los dos prompts completos con ortografía correcta.

**Corrección aplicada:**
- Los dos prompts (bot y seguimiento) reescritos con eñes y tildes.
- Regla explícita de ortografía con listas de palabras concretas: las que
  llevan eñe y las que llevan tilde, incluyendo el error más caro — escribir
  "ano" cuando se quiere decir "año".
- Se mantiene la única excepción deliberada: no se usan los signos de apertura
  `¿` ni `¡`, porque en WhatsApp casi nadie los escribe. Todo lo demás va con
  su ortografía correcta.

**Nota técnica.** Los caracteres acentuados se envían al blueprint como escapes
unicode (`ñ` para ñ, `é` para é). No dan problema en Make ni en la
API; el motivo original de haberlos evitado no era real.

**Regla:** un prompt se escribe como quieres que escriba el bot. Si el prompt
está sucio, la salida sale sucia.
