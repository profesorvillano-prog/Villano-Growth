# Criterios de calificación del bot — Teraxcel

> **Qué resuelve este documento:** la especificación exacta que pidió Nexor
> para configurar el segundo filtro (Guía 2): con qué criterios un lead se
> considera `calificado`, y qué valores puede mencionar el bot.
>
> El tablero y los estados están en
> [`Integracion-Nexor-Medilink.md`](./Integracion-Nexor-Medilink.md).

---

## 1. Valores que el bot puede mencionar

| Concepto | Valor | Cómo lo dice el bot |
|---|---|---|
| Tratamiento | **$700.000 CLP aproximado** | "El tratamiento tiene un valor aproximado de $700.000. El valor exacto se define en la evaluación, según tu caso." |

Reglas sobre el precio:

- El bot **siempre** dice "aproximado" y **siempre** ancla el valor exacto a la
  evaluación. Nunca promete un precio final.
- El bot **no negocia, no descuenta y no inventa facilidades de pago**. Si le
  preguntan por cuotas o convenios, responde lo que Teraxcel defina (pendiente
  §4) o deriva la pregunta a la evaluación.
- El bot menciona el valor **aunque el lead venga del formulario que ya lo
  mostró** — hay quien marca que sí sin leer; ese es el motivo de la doble
  calificación.

---

## 2. Los tres criterios (los tres deben cumplirse)

### Criterio 1 — Intención real

**Califica** quien demuestra un problema concreto y disposición a tratarse:

- Describe qué le pasa y hace cuánto (dolor, molestia, situación específica).
- Quiere **resolverlo**, no solo saber cuánto cuesta.
- Está dispuesto a iniciar el tratamiento si la evaluación lo confirma, en un
  horizonte cercano (semanas, no "algún día").

**No califica** (→ No Interesado, motivo `Sin intención real`):

- "Solo estoy cotizando" / "es para más adelante" sin fecha ni urgencia.
- Pregunta por un tercero que no está en la conversación y no puede decidir.
- No describe ningún problema concreto tras dos intentos del bot.

*Pregunta guía del bot:* "Cuéntame qué te pasa y hace cuánto — ¿y si la
evaluación confirma que tiene solución, es algo que quieres partir pronto?"

### Criterio 2 — Expectativa de precio

El bot informa el valor aproximado ($700.000) y pregunta si le hace sentido.

| Respuesta del lead | Resultado | Efecto |
|---|---|---|
| Lo acepta sin problema | `compatible` | ✅ califica |
| Lo acepta pero pregunta por formas de pago | `ajustada` | ✅ califica (se registra para la evaluación) |
| Esperaba mucho menos / dice que no puede / lo descarta | `incompatible` | ❌ No Interesado, motivo `Expectativa de precio` |

Regla: la duda no descalifica; el **rechazo** descalifica. Si el lead titubea,
el bot recuerda que el valor exacto se define en la evaluación y pregunta una
sola vez más. Dos rechazos = incompatible.

*Pregunta guía del bot:* "Para que no pierdas tu tiempo: el tratamiento tiene
un valor aproximado de $700.000 (el exacto se define en la evaluación). ¿Te
hace sentido avanzar con eso en mente?"

### Criterio 3 — Disponibilidad real

**Califica** quien entrega **al menos una franja concreta** (día + rango
horario) dentro de los próximos **14 días**, compatible con los horarios de
atención de la clínica.

**No califica** (→ No Interesado, motivo `Sin disponibilidad horaria`):

- "Cuando pueda" / "yo aviso" tras dos intentos del bot por concretar.
- Solo puede en horarios en que la clínica no atiende.
- Disponibilidad real recién en más de 14 días (se etiqueta para recontacto en
  la fecha que indique, pero no se agenda ni califica hoy).

*Pregunta guía del bot:* "¿Qué días y en qué horario te acomoda venir? Tengo
horas esta semana y la próxima."

---

## 3. La regla de decisión

```
CALIFICADO  =  intención real (C1)
            +  precio compatible o ajustada (C2)
            +  franja concreta ≤ 14 días (C3)
```

- Los tres a la vez. Falla uno → `no calificado` → **No Interesado** con el
  motivo del criterio que falló (si fallan varios, se registra el primero que
  falló en la conversación).
- Con `calificado`, el bot pasa **inmediatamente** a ofrecer horas de Medilink
  en la misma conversación — nunca "te contactaremos".
- **Excepción — derivación médica:** entra calificada de origen; el bot omite
  el criterio 2 (precio) y solo confirma disponibilidad y agenda. La capa de
  asistencia (confirmación, recordatorios, reagenda) aplica igual.
- El objetivo del bot **no es maximizar calificados** — es que quien llegue a
  la agenda de Medilink asista y convierta a tratamiento. Ante la duda
  persistente, no califica.

---

## 4. Pendientes de Teraxcel para cerrar esta especificación

- [ ] ¿El $700.000 es un valor único o varía por tipo de tratamiento? Si varía,
      lista de tratamientos con su valor aproximado.
- [ ] Valor de la **evaluación** (se agenda sin pago, pero ¿tiene costo el día
      de la visita? El bot debe poder decirlo).
- [ ] Respuesta oficial a "¿hay facilidades de pago / cuotas?" para los
      `ajustada`.
- [ ] Horarios de atención de la clínica (para el criterio 3 y las ofertas de
      hora).
