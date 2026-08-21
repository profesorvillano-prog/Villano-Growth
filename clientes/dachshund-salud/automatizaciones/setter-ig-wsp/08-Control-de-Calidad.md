# 08 · Que no meta la pata

> Un prompt bien escrito no alcanza. Un modelo obedece casi siempre, y "casi
> siempre" sobre 1.600 mensajes al mes son varias decenas de mensajes malos.
> Acá van tres capas: la del prompt, la determinista en Make, y la humana.
> Ninguna sola sirve.

---

## Qué es "meter la pata" en este negocio

Ordenado por daño real, de mayor a menor:

| # | Metida de pata | Consecuencia |
|---|---|---|
| 1 | Dar una indicación médica o una dosis | Riesgo para el perro y responsabilidad profesional de un veterinario colegiado |
| 2 | Decirle a alguien que espere cuando el caso es una urgencia | Un perro con IVDD agudo que llega tarde a la clínica |
| 3 | Decirle que suspenda una medicación de otro veterinario | Igual que 1, y además conflicto con el colega |
| 4 | Prometer curación o un plazo | Reembolsos, reseñas, y el argumento de venta de la competencia |
| 5 | Inventar un testimonio o una cifra | Publicidad engañosa |
| 6 | Dar el precio del acompañamiento por chat | Quema el embudo entero |
| 7 | Regalar el protocolo completo | La persona ya no necesita pagar |
| 8 | Sonar a bot | Pierde la venta, nada más |

Los primeros tres son los únicos que justifican apagar el sistema. Los otros se
corrigen iterando.

---

## Capa 1 · El prompt (previene, no garantiza)

Las 15 reglas duras están en `03-Prompt-Setter-IA.md`. Tres cosas que hacen que
un prompt de reglas funcione mejor:

**Reglas en positivo con la salida incluida.** "No des dosis" deja al modelo sin
saber qué hacer. "No des dosis; cuando te la pidan, respondé que eso es
exactamente lo que se define en la consulta" le da a dónde ir. Cada prohibición
del prompt tiene que traer su reemplazo.

**El motivo, no solo la orden.** Un modelo cumple mejor una regla cuando entiende
por qué existe. "No hablás del acompañamiento **porque el precio depende del caso
y darlo antes de que Marcelo lo evalúe hace que la persona compare mal**" se
sostiene mejor que la orden sola.

**Las reglas al final, no al principio.** Lo último que lee el modelo antes de
responder pesa más. La ficha de voz va arriba, las reglas duras abajo.

---

## Capa 2 · El validador en Make (garantiza, no previene)

Acá está lo que falta hoy en el sistema. Un módulo entre el cerebro y el envío
que revisa el texto **antes** de que salga, con reglas deterministas. No es IA:
es una comprobación de texto que siempre da el mismo resultado.

### Cómo se implementa

Un filtro sobre cada ruta de envío del router, o un módulo **Tools › Set variable**
que calcula `bloqueado` y después un filtro. La expresión, en la sintaxis de Make:

```
{{ if(
     contains(lower(4.respuesta); "gramo") or
     contains(lower(4.respuesta); " mg") or
     contains(lower(4.respuesta); " ml") or
     contains(lower(4.respuesta); "dosis") or
     contains(lower(4.respuesta); "cucharada") or
     contains(lower(4.respuesta); "suspend") or
     contains(lower(4.respuesta); "deja de dar") or
     contains(lower(4.respuesta); "garantiz") or
     contains(lower(4.respuesta); "cura ") or
     contains(lower(4.respuesta); "curar") or
     contains(lower(4.respuesta); "497") or
     contains(lower(4.respuesta); "masterclass") or
     contains(lower(4.respuesta); "webinar") or
     contains(4.respuesta; "—")
   ; true; false) }}
```

### Qué hace cuando salta

No manda el mensaje del bot. Manda esto, que es una respuesta perfectamente
válida y además empuja a la consulta:

```
Esa te la respondo mal si te la respondo por acá, porque depende del peso, la
edad y el estado de tu salchicha. Es justo lo que Marcelo revisa en la consulta.
```

Y en paralelo avisa a Marcelo con el texto que el bot **iba** a mandar. Ese aviso
es la mina de oro: cada bloqueo es una línea del prompt que hay que arreglar.

### Los términos y por qué cada uno

| Término | Bloquea |
|---|---|
| `gramo`, ` mg`, ` ml`, `dosis`, `cucharada` | Prescripción nutricional |
| `suspend`, `deja de dar` | Indicación de suspender medicación |
| `garantiz`, `cura`, `curar` | Promesa de resultado |
| `497` | El precio del acompañamiento |
| `masterclass`, `webinar` | Reglas de marca |
| `—` (guion largo) | Regla de copy de la casa |

Falsos positivos: sí, algunos. "Cucharada" puede aparecer en una respuesta
legítima sobre vegetales. **Está bien que salte.** Un falso positivo cuesta un
mensaje raro; un falso negativo cuesta una indicación médica de un bot.

### El campo `riesgo` en la salida de la IA

Se agrega al esquema de respuesta (doc 02 §5) un campo más:

```
"riesgo": "ninguno" | "medico" | "urgencia" | "fuera_de_alcance"
```

El propio modelo marca cuando siente que está pisando terreno delicado. No es
confiable como única defensa, pero como **segunda señal** sirve mucho: si el
validador de texto no saltó pero el modelo marcó `medico`, igual se frena.

Coste: cero operaciones extra, cero tokens relevantes. Es un campo más en un JSON
que ya se está devolviendo.

### Salida estructurada en vez del truco del prefill

El escenario original forzaba el JSON con un prefill (una respuesta del asistente
que empezaba con `{`). Eso se corrigió: **el prefill devuelve error 400 en los
modelos actuales** (Opus 5, Sonnet 5 y la familia 4.6-4.8). Ahora el JSON se fuerza
con salida estructurada, que es una función de la API:

```json
"output_config": {
  "format": {
    "type": "json_schema",
    "schema": { ... }
  }
}
```

Con eso el modelo **no puede** devolver algo que no cumpla el esquema. Se acabaron
los errores de parseo, los reintentos y el "el bot devolvió texto en vez de JSON".
Funciona en Haiku 4.5, Sonnet 5 y Opus 5 por igual.

---

## Capa 3 · La humana

**Modo sombra la primera semana.** El bot procesa y redacta, pero no envía: la
respuesta le llega a Marcelo, que la aprueba o la corrige. 30 conversaciones
revisadas a mano antes de soltar nada. Está en el doc 06 §5 y no se saltea.

**Freno de mano permanente.** Si Marcelo escribe a mano desde el inbox de GHL, el
bot se calla para ese contacto (Workflow B, doc 05 §6).

**Revisión semanal de 10 conversaciones completas.** No de los KPIs: de las
conversaciones. El 90% de las mejoras del prompt van a salir de leer lo que
escribe la gente.

**El registro de bloqueos.** Cada vez que salta el validador queda anotado. Si un
mismo tipo de bloqueo aparece 3 veces, es una regla nueva para el prompt.

---

## Cambios que hay que aplicar al escenario

Ya aplicados en Make y en el blueprint del repo:

- [x] Modelo corregido a `claude-opus-5` (el ID anterior tenía sufijo de fecha, que no corresponde)
- [x] Prefill eliminado, reemplazado por salida estructurada (`output_config.format`)
- [x] `cache_control` con TTL de 1 hora sobre el bloque `system`
- [x] Lectura robusta del bloque de texto de la respuesta

Pendientes, que se hacen cuando estén el prompt y el token:

- [ ] Agregar el campo `riesgo` al esquema
- [ ] Agregar el módulo validador y su filtro en cada ruta de envío
- [ ] Agregar el aviso a Marcelo cuando el validador bloquea
- [ ] Pegar el núcleo de conocimiento y los 12 pares few-shot (doc 07)

---

## La regla de oro

Cuando dudes entre que el bot responda o que derive a la consulta, **derivá a la
consulta**. Un bot que se queda corto pierde una venta. Un bot que se pasa de
listo le arruina la reputación a un veterinario que se la ganó en cinco años.
