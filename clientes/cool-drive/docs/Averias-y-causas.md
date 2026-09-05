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

---

## 7. Mensajes duplicados y saludos repetidos: carrera de ejecuciones (5 sep 2026)

**Síntomas:** a Carol le llegó **el mismo mensaje dos veces**, idéntico, a las
03:20. Y a otro lead el bot le mandó tres mensajes seguidos empezando los tres
con "Hola!".

**Causa: condición de carrera, no el prompt.** El lead escribió tres mensajes
en el mismo minuto (03:28). GHL disparó tres webhooks. El escenario estaba en
modo **paralelo**, así que las tres ejecuciones arrancaron a la vez y las tres
leyeron la memoria **antes** de que ninguna alcanzara a guardar. Resultado: las
tres vieron `TURNOS = 0`, las tres creyeron ser el primer mensaje de la
conversación, y las tres saludaron.

Ninguna regla de prompt puede arreglar esto. El modelo respondió correctamente
a la información que tenía; el problema es que las tres recibieron información
idéntica y desactualizada.

**Corrección:**
1. **`sequential: true`** en el escenario. Ahora las ejecuciones se procesan
   de a una, en orden. Cada una lee la memoria que dejó la anterior. Es la
   corrección de fondo.
2. **Delay de escritura más corto**, de máximo 22s a máximo 12s. Menos ventana
   para que se acumulen mensajes y más natural en la conversación.
3. **Regla de saludo en el prompt**, como segunda barrera: si `TURNOS` es mayor
   que 0, prohibido saludar. Cinturón además de tirantes.

**⚠️ ESTA CORRECCIÓN SE REVIRTIÓ EL MISMO DÍA. Ver punto 8.**

**Regla:** cuando el bot repite algo, primero descartar si dos ejecuciones
corrieron sobre el mismo estado. Un síntoma de "el bot no recuerda" puede ser
concurrencia, no memoria.


---

## 8. El modo secuencial dejó el bot mudo 33 minutos (5 sep 2026)

**Lo que pasó.** A las 19:50 activé `sequential: true` para arreglar los
mensajes duplicados del punto 7. A partir de ese segundo el escenario **dejó de
procesar**. Última ejecución 19:42, luego nada. Los leads escribían y no recibía
respuesta nadie.

Lo detectó el cliente, no yo, mirando su bandeja de entrada: cuatro
conversaciones sin responder entre las 15:53 y las 16:04 hora de Chile.

**Causa, en palabras del propio Make:**

> *This scenario is not processing new executions because it is set to run
> sequentially and has incomplete executions that must be resolved first.*

El escenario arrastraba **4 ejecuciones incompletas** del bug de `or()` (punto
2). En modo paralelo eran inofensivas, quedaban ahí sin molestar. En modo
secuencial pasan a bloquear la cabeza de la cola: Make procesa estrictamente en
orden y no arranca nada nuevo hasta resolverlas. Se acumularon 6 mensajes en la
cola del webhook, sin atender.

**Corrección: revertir a `sequential: false`.** A los 5 segundos del cambio
arrancaron las 8 ejecuciones encoladas y la cola empezó a drenar.

**El error de fondo no fue técnico, fue de secuencia.** Yo mismo había visto las
4 ejecuciones incompletas horas antes y recomendé dejarlas sin tocar, con el
argumento de que reintentarlas podía duplicar mensajes. Después activé el modo
secuencial sin conectar las dos cosas. La deuda que decidí no pagar es
exactamente la que tumbó el bot.

**Antes de volver a activar el modo secuencial hay que, en este orden:**

1. Vaciar *Incomplete Executions* hasta dejarlo en cero.
2. Recién ahí activar `sequential: true`.
3. Verificar a los dos minutos que `queueCount` del webhook esté en 0 y que
   haya ejecuciones nuevas en el historial.

Sin el paso 1, el paso 2 apaga el bot otra vez.

**Regla:** después de cualquier cambio en el escenario, no basta con confirmar
`isActive: true`. Hay que mirar **`queueCount` del webhook** y que existan
ejecuciones posteriores al cambio. Un escenario puede estar encendido, sin
errores y aun así no procesar nada.

---

## 9. Agrupar mensajes: el debounce (5 sep 2026)

**El problema.** La gente no escribe un mensaje, escribe tandas: *"Hola"*,
*"cuánto cuesta"*, *"y los sábados?"*, tres mensajes en veinte segundos. Cada
uno disparaba una ejecución y el lead recibía tres respuestas, cada una
saludando y preguntando por su cuenta. Ilegible, y delata al bot al instante.

**Por qué NO sirve un Wait en GHL.** Cada mensaje entra al workflow por
separado, así que los tres esperarían su minuto y dispararían igual. El Wait
retrasa, no agrupa. Para agrupar hace falta estado compartido entre las
ejecuciones, y eso solo existe en el datastore de Make.

**El patrón implementado, un debounce clásico:**

1. Llega un mensaje. Lo primero es **escribir `ultimo_mensaje_at = now`** en el
   datastore (módulo *Marcar llegada*, `UpdateRecord` con upsert). No responde
   nada todavía.
2. Lee la memoria y **se guarda esa marca de tiempo** (módulo *Memoria y mi
   marca*).
3. **Duerme 45 segundos.**
4. Vuelve a leer el datastore (*Sigo siendo el último?*).
5. **Filtro de corte:** continúa solo si la marca guardada sigue siendo la
   misma. Si llegó otro mensaje después, esa ejecución la pisó y esta se apaga
   **en silencio, sin responder**. La última de la tanda es la única que sigue.

**El que sobrevive ve la tanda completa.** Un módulo nuevo trae de GHL los
últimos 8 mensajes de la conversación y filtra los entrantes:

```
join(map(43.data.messages.messages; "body"; "direction"; "inbound"); " // ")
```

Eso llega al modelo como *MENSAJES NUEVOS DEL LEAD*, del más reciente al más
antiguo, con la instrucción de responderlos **todos en un solo mensaje**.

**Qué se arregla de una sola vez:**

- Se acaban las respuestas por goteo, una por mensaje.
- **Se acaba la carrera de ejecuciones.** Solo una responde por tanda, así que
  desaparecen los saludos triplicados y los mensajes idénticos duplicados. El
  modo secuencial deja de ser necesario para esto.
- El modelo pasa a ver los mensajes reales de GHL, no solo su propio resumen.
- Cuesta menos: una llamada al modelo por tanda en vez de una por mensaje.

**Diseño defensivo.** El filtro tiene una segunda condición en OR que deja
pasar cuando la marca viene vacía. Si el datastore fallara, el bot vuelve al
comportamiento anterior (responde de más) en vez de quedarse mudo. Entre
duplicar y callar, siempre duplicar: el silencio es la falla cara.

**Verificado en producción (5 sep, 16:47).** Cuatro mensajes del mismo lead en
17 segundos, cuatro ejecuciones:

| Hora | Operaciones | Qué hizo |
|---|---|---|
| 20:47:48 | 5 | se apagó en el filtro |
| 20:47:53 | 5 | se apagó en el filtro |
| 20:47:58 | 5 | se apagó en el filtro |
| 20:48:05 | **13** | **respondió, una sola vez** |

Las tres primeras ni llamaron al modelo: 1,1 KB de tráfico contra 24 KB de la
que sí respondió. La respuesta única cubrió precio, promo, horarios y sábados.

**Sobre la ventana de espera.** Se probó con 90 segundos y se bajó a **45**. La
tanda real duró 17 segundos, así que 45 da margen de sobra sobre los 10-20
segundos que tarda alguien en escribir sus preguntas, y reduce a la mitad lo
que el lead percibe como demora.

Criterio para ajustarla: la ventana tiene que ser **mayor que el hueco entre
mensajes de una misma tanda**, no que la tanda completa. Si se acorta de más,
vuelven las respuestas partidas.

**Contrapartida aceptada:** el bot ya no responde al instante, se demora hasta
45 segundos. Suma más de lo que resta — contestar en 4 segundos es de las cosas
que más delatan a un bot.
