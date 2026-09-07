# Criterios de calificación — Teraxcel

> **Qué resuelve este documento:** con qué criterios exactos un lead queda
> `calificado` para agendarse en Medilink. Es la fuente del Word entregado a
> Nexor (*Criterios de Calificación — Teraxcel, v2*), que contiene **solo
> criterios** — sin instrucciones ni guiones para el bot (esos quedan aquí,
> en §5, como notas internas de la agencia).
>
> El formulario completo está transcrito en
> [`Formulario-Calificador.md`](./Formulario-Calificador.md). Tablero y
> estados: [`Integracion-Nexor-Medilink.md`](./Integracion-Nexor-Medilink.md).

---

## 1. Valor de referencia

| Concepto | Valor | Alcance |
|---|---|---|
| Ciclo de tratamiento | **$700.000 CLP aproximado** | El valor final se define en la evaluación, según el caso |

---

## 2. Primer filtro — Formulario calificador (dolor lumbar)

Las preguntas decisivas son la **7, 8, 9 y 10**. Las preguntas 1–6 (dolor,
antigüedad, impacto, historial, inversión previa, imagenología) son de
contexto y **no descalifican** — pero alimentan la conversación del bot y la
segmentación.

| Pregunta | Califica | No califica |
|---|---|---|
| **8 · Inicio del tratamiento** | Lo antes posible · Dentro de 2 a 4 semanas | Más adelante, solo estoy averiguando |
| **9 · Forma de pago** | Pago directo · Reembolso Isapre/seguro · Necesitaría financiamiento *(califica; queda como expectativa `ajustada`)* | Hoy no podría costear un tratamiento particular |
| **10 · Ubicación** | Puerto Varas o alrededores · Otra ciudad de la R. de Los Lagos · Otra región y puede viajar | Otra región, sin posibilidad de viajar |
| **7 · Situación médica** | Ninguna de las anteriores | Cualquier alternativa marcada → **no descarta**: pasa a revisión clínica humana |

**Resultado:** una respuesta descalificante en 8, 9 o 10 rechaza el formulario
→ **Descartado** (según el criterio del tablero: murió antes de conversar). La
pregunta 7 es la excepción: no es un rechazo comercial sino una bandera
clínica — el lead sale de la vía automática y lo revisa una persona.

---

## 3. Segundo filtro — Conversación de calificación

Tres criterios; **deben cumplirse los tres**.

### Criterio 1 — Intención real

**Califica:** describe un problema concreto (qué le pasa y hace cuánto);
quiere resolverlo, no solo saber cuánto cuesta; dispuesto a iniciar en un
horizonte cercano (semanas) si la evaluación lo confirma.

**No califica** (→ No Interesado · `Sin intención real`): "solo estoy
cotizando" / "para más adelante" sin fecha; consulta por un tercero que no
puede decidir; no llega a describir ningún problema concreto.

### Criterio 2 — Expectativa de precio

Sobre el valor de referencia ($700.000 aprox.):

| Respuesta del lead | Resultado | Efecto |
|---|---|---|
| Lo acepta sin problema | `compatible` | ✅ califica |
| Lo acepta pero pregunta por formas de pago / financiamiento | `ajustada` | ✅ califica (registrado para la evaluación) |
| Esperaba mucho menos / no puede / lo descarta | `incompatible` | ❌ No Interesado · `Expectativa de precio` |

**La duda no descalifica; el rechazo descalifica.** Dos rechazos = incompatible.

### Criterio 3 — Disponibilidad real

**Califica:** al menos una franja concreta (día + rango horario) dentro de los
próximos **14 días**, compatible con los horarios de la clínica.

**No califica** (→ No Interesado · `Sin disponibilidad horaria`): "cuando
pueda" sin concretar; solo horarios en que la clínica no atiende; más de 14
días (se registra para recontacto en la fecha que indique).

---

## 4. Regla de decisión

```
CALIFICADO = formulario aprobado + intención real
           + precio compatible o ajustada + franja concreta ≤ 14 días
```

- Falla el formulario → **Descartado**.
- Falla un criterio de la conversación → **No Interesado** con el motivo del
  criterio que falló (si fallan varios, el primero).
- **Excepción — derivación médica interna:** entra calificada de origen,
  exenta del formulario y del criterio de precio; solo aplican disponibilidad
  y la capa de asistencia.

---

## 5. Notas internas de la agencia (no van en el documento a Nexor)

Guías de implementación que sí necesitaremos al configurar la Guía 2 con
Nexor, separadas del documento de criterios a pedido de Teraxcel:

- **Cómo se menciona el precio:** siempre "aproximado", siempre anclando el
  valor exacto a la evaluación; el bot no negocia, no descuenta ni inventa
  facilidades; menciona el valor aunque el formulario ya lo mostró (hay quien
  marca sin leer — es la razón de la doble calificación).
- **Preguntas guía sugeridas** — intención: *"Cuéntame qué te pasa y hace
  cuánto — ¿y si la evaluación confirma que tiene solución, es algo que
  quieres partir pronto?"* · precio: *"Para que no pierdas tu tiempo: el
  tratamiento tiene un valor aproximado de $700.000 (el exacto se define en la
  evaluación). ¿Te hace sentido avanzar con eso en mente?"* · disponibilidad:
  *"¿Qué días y en qué horario te acomoda venir? Tengo horas esta semana y la
  próxima."*
- **Con el CALIFICADO, el bot ofrece horas de Medilink inmediatamente** en la
  misma conversación — nunca "te contactaremos".
- **El objetivo del bot no es maximizar calificados** — ante la duda
  persistente, no califica.

### Pendientes de Teraxcel

- [ ] Valor de la **evaluación** (se agenda sin pago, pero ¿tiene costo el día
      de la visita?).
- [ ] Respuesta oficial a "¿hay facilidades de pago / cuotas?" para los
      `ajustada` (la pregunta 9 del formulario ya admite "financiamiento").
- [ ] Horarios de atención de la clínica (criterio 3 y ofertas de hora).
- [ ] Quién revisa las banderas clínicas de la pregunta 7 y por qué canal se
      le notifica.
