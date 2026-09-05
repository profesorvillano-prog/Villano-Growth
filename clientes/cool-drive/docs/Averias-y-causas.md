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

## 5. Datastore compartido entre bots

El datastore `cooldrive_memoria` (id 173778) contiene registros de otro bot
(campos `persona=`, `perro=`, `sintoma=`). Dos escenarios distintos escriben
ahí. Si coincide un `contactId` se cruza la memoria entre clientes.

**Pendiente:** separar en datastores distintos.
