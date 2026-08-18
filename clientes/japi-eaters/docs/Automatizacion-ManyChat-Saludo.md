# Automatización ManyChat — Saludo humano a nuevos seguidores (Instagram)

> Flujo de bienvenida para `@japieaters` **sin botones, sin pitch y sin link en el
> primer DM**. Sustituye a la automatización template "Saludá a tus nuevos
> seguidores" (hoy detenida). Copy listo para pegar + montaje paso a paso.
> Voz y reglas de lenguaje: ver [`Voz-y-Marca.md`](./Voz-y-Marca.md).

## 1. Qué falla en el saludo actual

El DM de apertura vigente (el de la captura) dice, en resumen: *"Hola holaa / vi
que comenzaste a seguirme / gracias por el apoyo / ¿te gustaría saber por qué
esta cuenta se llama Japi Eaters?"* + **botón**.

| Problema | Por qué importa |
|---|---|
| **Botón** debajo del mensaje | Es la señal más obvia de "esto es un bot". Nadie escribe DMs con botones. |
| La pregunta es **sobre la marca**, no sobre la persona | Responde a la curiosidad de Josefina, no al dolor de quien llega. No segmenta. |
| El segundo mensaje es un **monólogo de presentación** | Habla de la cuenta y del objetivo de la marca antes de saber con quién habla. |
| **No califica** | No distingue TO / profesional (avatar high ticket) de mamá (7% de la audiencia, comunicación distinta). |
| La conversación **muere** después del botón | El clic no es una respuesta real: no abre conversación ni deja información útil. |

## 2. Los 7 principios del saludo humano

1. **Una pregunta abierta y fácil**, sobre *ella*, no sobre la marca. El objetivo
   único del primer DM es **que responda con texto**.
2. **Sin botones, sin "escribe YO"**, sin menús. Todo se resuelve leyendo texto libre.
3. **Burbujas cortas** (2-3 mensajes de 1-3 líneas), como escribe una persona real,
   con retardo de escritura entre cada una.
4. **Sin link en el primer DM.** El link aparece recién cuando ya hubo respuesta.
5. **Cero pitch de ÉxiTO** en el saludo. Primero conocer, después aportar, después ofrecer.
6. **Delay de 10-15 minutos** desde el follow. Instantáneo = robot.
7. **Humano ≠ mentir.** No escribir "te escribo yo ahora mismo" en un mensaje
   automático. Si preguntan si es un bot, hay respuesta honesta preparada (§6).

## 3. Arquitectura del flujo

```
Disparador: nuevo seguidor de IG
        ↓ (esperar 10-15 min)
¿Ya tiene etiqueta "saludo_enviado"? ── sí ──▶ salir
        ↓ no
DM de apertura (3 burbujas, sin botón)  → etiqueta "saludo_enviado"
        ↓
Esperar respuesta de texto libre  →  campo "respuesta_saludo"
        ↓
Enrutar por IA o por palabras clave
   ├─ Profesional / TO   → rama A → etiqueta "perfil_to"    → valor → link → aviso al equipo
   ├─ Mamá / familia     → rama B → etiqueta "perfil_mama"  → valor, sin pitch
   ├─ Ambiguo / otro     → rama C → repregunta → si sigue ambiguo, notificar humano
   └─ Sin respuesta 24 h → etiqueta "sin_respuesta_saludo"  → SIN nuevo DM, solo audiencia
```

## 4. Copy — DM de apertura (elegir una, rotar A/B)

> Cada `▸` es una **burbuja separada** dentro del mismo nodo de mensaje.
> Sin botón, sin link, sin adjuntos.

### Versión A — Cálida directa *(recomendada para arrancar)*

```
▸ Hola, holaaa 👋🥕

▸ Gracias por seguirme 💛 Acá comparto todo sobre alimentación infantil
  responsiva: cómo lograr primero paz en la mesa y por qué el avance real
  ocurre en la mesa de la casa, no en la sesión.

▸ Cuéntame para conocerte mejor 👀 ¿llegaste por tu trabajo con niños y niñas
  (terapeuta, fono, nutri...) o estás buscando ayuda para la alimentación en
  tu propia casa?
```

### Versión B — Curiosidad *(conserva el gancho del nombre, pero al final)*

```
▸ Hola, holaaa 👋

▸ Soy Josefina 💛 Vi que empezaste a seguirme y quería darte la bienvenida
  de verdad.

▸ Después te cuento por qué esta cuenta se llama Japi Eaters (spoiler: tiene
  que ver con mi nombre 😅), pero primero cuéntame tú: ¿trabajas con niños y
  niñas que no comen, o estás buscando ayuda para la alimentación en casa?
```

### Versión C — Ultra corta *(la que más respuestas suele generar)*

```
▸ Holaa! 👋 gracias por seguirme 🥕

▸ Cuéntame algo para conocerte: ¿eres terapeuta o estás buscando ayuda para
  la alimentación de tu hijo o hija?
```

## 5. Copy — Ramas según la respuesta

### Rama A · Profesional / Terapeuta Ocupacional *(avatar high ticket)*

```
▸ Uy, entonces estás en el lugar correcto 🙌

▸ Te cuento en corto: soy TO y llevo +6 años dedicada solo a alimentación
  infantil. Acá comparto sobre todo cómo evaluar y priorizar cada caso, y
  cómo guiar a la familia para que el avance se sostenga en casa (porque en
  sesión el niño o niña avanza... y en casa no cambia nada 😅).

▸ ¿Y a ti qué es lo que más te cuesta hoy? ¿Selectividad, rechazo total,
  casos dentro del espectro, o que la familia no acompaña?
```

**Cuando responde el dolor** (recién acá aparece el link):

```
▸ Te entiendo perfecto, es literalmente lo que más me escriben 💛

▸ No te faltan juegos ni actividades: te falta un orden para saber qué
  evaluar primero, qué priorizar y cómo bajar la presión en la mesa. Eso se
  puede aprender paso a paso, no se improvisa.

▸ Tengo una clase donde explico justo ese orden. ¿Te la mando por acá?
```

→ Ante cualquier confirmación: enviar el link + etiqueta `interes_alto` +
**notificar al equipo** (Rafa/setter) para seguimiento humano.

### Rama B · Mamá / familia

```
▸ Gracias por contarme 💛

▸ Lo primero: si en tu casa la hora de comer está tensa, no es tu culpa.
  Casi nadie recibió información clara sobre esto, y la presión (aunque sea
  con la mejor intención) suele hacer que coman menos, no más.

▸ Lo que sí funciona es empezar por la paz en la mesa antes que por la
  variedad. ¿Qué es lo que más te complica hoy: que come muy poquito, que
  come siempre lo mismo, o que la comida se volvió una pelea?
```

→ Etiqueta `perfil_mama`. **Nunca ofrecer ÉxiTO acá** (es formación para
profesionales). Se nutre con contenido y, si existe, con el material para familias.

### Rama C · Ambiguo / otra respuesta

```
▸ Ay, cuéntame un poquito más 👀 ¿es por tu trabajo con niños y niñas o por
  algo que están viviendo en tu casa?
```

→ Si la segunda respuesta sigue siendo ambigua: etiqueta `revisar_humano` y
notificación al equipo. No insistir con un tercer mensaje automático.

### Rama D · Sin respuesta a las 24 h

**No se envía ningún DM.** Solo etiqueta `sin_respuesta_saludo` para usarla como
audiencia de contenido/remarketing. Encadenar un segundo DM a quien nunca
respondió es lo que más rápido quema la cuenta.

### Micro-respuestas útiles (guardar como fragmentos)

| Si escribe... | Responder |
|---|---|
| "¿esto es un bot?" | `Este primer mensaje sí es automático 🙈 pero acá atrás estamos leyendo todo. Cuéntame y te respondo yo.` |
| Solo un emoji / "hola" | `Holaa 👋 cuéntame, ¿trabajas con niños y niñas que no comen o estás buscando ayuda en casa?` |
| "¿cuánto vale?" | Etiqueta `interes_alto` + notificar humano. No dar precio por bot. |

## 6. Montaje en ManyChat (paso a paso)

1. **Automatización nueva** (no editar el template "Saludá a tus nuevos seguidores":
   ese formato obliga a la estructura DM de apertura + botón).
   Disparador: **nuevo seguidor de Instagram**.
2. **Retardo inicial: 10-15 min** (el "Después de 10 minutos" actual está bien).
3. **Condición:** ¿tiene la etiqueta `saludo_enviado`? → **Sí: terminar el flujo.**
   Evita re-saludar a quien te siguió, dejó de seguir y volvió.
4. **Nodo de mensaje** con las 3 burbujas de la §4.
   - Activar el **retardo de escritura** de cada burbuja (1-3 s), o poner un
     *Smart Delay* de 3-8 s entre burbujas.
   - **Sin botón** (dejar el campo de etiqueta de botón vacío), sin link, sin quick replies.
5. **Acciones:** aplicar etiqueta `saludo_enviado` + guardar fecha en el campo
   `fecha_saludo`.
6. **Nodo de pregunta / entrada de usuario** (tipo **texto libre**, sin validación,
   sin botones) → guardar en el campo personalizado `respuesta_saludo` + aplicar
   etiqueta `respondio_saludo`.
7. **Enrutamiento** (dos opciones):
   - **Recomendado (plan Pro): paso de IA / intención**, con tres intenciones —
     `profesional`, `familia`, `otro` — descritas en español y con ejemplos reales.
     Aguanta variantes, faltas de ortografía y respuestas largas.
   - **Alternativa sin IA: condición por palabras clave** sobre `respuesta_saludo`
     con el operador *contiene*:
     - **Profesional:** `terapeuta`, `t.o`, `soy to`, `fono`, `nutri`, `psico`,
       `kine`, `educadora`, `profesional`, `atiendo`, `mis usuarios`, `consulta`,
       `centro`, `estudiante`, `trabajo con niñ`.
     - **Familia:** `mamá`, `mama`, `mami`, `hijo`, `hija`, `mi peque`, `en casa`,
       `papá`, `abuela`, `nieto`.
     - ⚠️ No usar `to` suelto como palabra clave: aparece dentro de decenas de
       palabras. Usar siempre `soy to`, `t.o`, `terapeuta ocupacional`.
     - Todo lo que no matchee → **Rama C**.
8. **Rama sin respuesta:** desde el nodo de mensaje, en paralelo, *Smart Delay 24 h*
   → condición "¿tiene `respondio_saludo`?" → si **no**, aplicar
   `sin_respuesta_saludo`. **Sin envío de DM.**
9. **Rotación A/B:** usar el nodo de división aleatoria para repartir 50/50 entre dos
   versiones del saludo (§4). Además de medir, evita que el texto idéntico se repita
   miles de veces.
10. **Respuesta por defecto (Default Reply):** revisar que no pise este flujo. Quien
    responde el saludo debe caer en el enrutamiento, no en el mensaje genérico.

### Etiquetas y campos a crear

| Tipo | Nombre | Para qué |
|---|---|---|
| Etiqueta | `saludo_enviado` | Anti-duplicado |
| Etiqueta | `respondio_saludo` | Base de la tasa de respuesta |
| Etiqueta | `perfil_to` / `perfil_mama` | Segmentación de todo el ecosistema |
| Etiqueta | `interes_alto` | Pide precio / acepta la clase → seguimiento humano |
| Etiqueta | `sin_respuesta_saludo` | Audiencia de remarketing |
| Etiqueta | `revisar_humano` | Cola de atención manual |
| Campo | `respuesta_saludo` | Texto literal de la primera respuesta (oro para copy) |
| Campo | `fecha_saludo` | Control y limpieza |

## 7. Reglas de plataforma a respetar

- **Ventana de 24 h de Instagram:** se puede conversar libremente mientras la persona
  siga respondiendo. Si no responde, **no encadenar DMs**: se cierra la ventana y la
  cuenta acumula señales negativas.
- **Link en el primer DM:** evitarlo. Va del segundo o tercer mensaje en adelante,
  siempre después de una respuesta real.
- **Nada de "responde X para recibir Y"** en el saludo: convierte la bienvenida en
  una transacción y contradice el objetivo de este flujo.
- **Un solo saludo por persona.** Lo garantiza el paso 3.
- Antes de encender, **desactivar la automatización template actual** para que nadie
  reciba los dos saludos.

## 8. Qué medir (revisar a los 14 días)

| Métrica | Cómo se calcula | Uso |
|---|---|---|
| **Tasa de respuesta** | `respondio_saludo` ÷ `saludo_enviado` | KPI principal. Establecer baseline las 2 primeras semanas y optimizar contra ella. |
| Mix de audiencia | `perfil_to` vs `perfil_mama` | Valida si el contenido está atrayendo al avatar correcto. |
| Conversaciones con link enviado | Rama A completa | Puente real hacia el funnel. |
| `interes_alto` por semana | Etiqueta | Volumen que se pasa a seguimiento humano. |
| Ganador A/B | Split del paso 9 | Se queda la versión ganadora y se testea una nueva. |

Además: leer una vez por semana el campo `respuesta_saludo` de los últimos
contactos. Es la fuente más barata de lenguaje literal del avatar para ads y copy.

## 9. Qué NO hacer

- Botones, menús o quick replies en el saludo.
- Bloques de texto largos (el mensaje actual de "Y entonces, recibirán" es un ejemplo).
- Presentar la marca antes de preguntar por la persona.
- Ofrecer ÉxiTO en el primer o segundo mensaje.
- Escribir "te escribo yo personalmente" en un mensaje automático.
- Ofrecer la formación a alguien etiquetado como `perfil_mama`.
- Romper las reglas de lenguaje de marca: nunca "paciente" (→ usuario / niño o niña),
  nunca solo "niño" (→ "niño y niña" / "niñ@"), nunca "papás" (→ familia / mamá).

## 10. Pendientes a confirmar con el cliente

1. **Link de la clase/webinar** que se envía en la rama A (¿webinar EmpoderaTO,
   VSL o clase grabada?). Hoy el flujo llega hasta la pregunta "¿te la mando?".
2. **Material para la rama mamá/familia** (¿hay guía o contenido gratuito propio, o
   solo se nutre con contenido de feed?).
3. **A quién notificar** cuando aparece `interes_alto` (¿Rafa directamente en
   ManyChat, o pasa a CLINT?).
4. **Cuenta y plan:** confirmar disponibilidad del paso de IA para el enrutamiento
   sin palabras clave.
