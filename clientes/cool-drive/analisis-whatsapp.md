# Cool Drive — Análisis de conversaciones de WhatsApp (GoHighLevel)

> Fuente: exportación de **214 conversaciones** de WhatsApp (2.265 mensajes,
> **844 escritos por clientes**) de la subcuenta COOL DRIVE en GoHighLevel.
> Fecha: 28-08-2026. Escuela de conductores, Maipú (Santiago, Chile).

Este documento tiene 3 partes:
1. **Qué preguntan los clientes** (con frecuencia real) → qué debe saber responder el bot.
2. **Datos maestros del negocio** → el "cerebro" del bot, sacado de las respuestas reales de Sebastián.
3. Sirve de base para el bot de Make (ver `bot-make.md`).

---

## 1. Preguntas típicas (sobre 844 mensajes de clientes)

| # | Tema | % de mensajes | Qué preguntan textualmente |
|---|------|--------------|----------------------------|
| 1 | **Horarios y días** | ~20% | "¿Qué horarios tienen?", "¿hacen sábados?", "salgo del trabajo a las 19:30", "¿de mañana o tarde?" |
| 2 | **Saludo / interés inicial** | ~19% | "Hola", "Me gustaría inscribirme", "Más información por favor", "Tengo dudas sobre el curso" |
| 3 | **Ubicación** | ~18% | "¿Dónde están ubicados?", "¿en qué parte de Maipú?", "no ubico la calle, ¿alguna referencia?" |
| 4 | **Precio / valor** | ~16% | "¿Cuánto sale el curso?", "valores", "¿qué precio tiene clase B?" |
| 5 | **Desde cero / no sé manejar** | ~4% | "Desde cero", "no sé nada de manejo", "partir de 0" |
| 6 | **Cuántas clases / duración** | ~4% | "¿Cuántas clases son?", "¿cuánto dura el curso?", "¿8 o 12?" |
| 7 | **Clase B / tipo de licencia** | ~4% | "Curso clase B", "¿es para automático o mecánico?" |
| 8 | **Examen / municipalidad / trámite** | ~2% | "¿Ustedes tramitan la licencia?", "¿con qué municipalidad tienen convenio?", "¿prestan el auto para el examen?" |
| 9 | **Conocimiento previo / reforzar** | ~2% | "Tengo licencia pero me da miedo manejar", "no practico hace años", "quiero reforzar" |
| 10 | **Formas de pago** | ~1% | "¿Cómo se paga?", "¿aceptan transferencia?", "¿en cuotas?" |
| 11 | **Solo práctica vs. teoría** | ~1% | "¿Es solo práctica o también teoría?", "¿qué incluye?" |
| 12 | **A domicilio / prestar auto** | <1% | "¿Van a domicilio?", "¿me recogen?", "¿necesito auto propio?" |
| 13 | **Edad / requisitos** | <1% | "Tengo 63 años, ¿puedo?", "¿hasta qué edad?", "¿nivel de estudios?" |

**Conclusión:** el 70%+ de las conversaciones se resuelven contestando 4 cosas:
**ubicación, precio, horarios y "desde cero vs. con experiencia"**. Un bot que
responda bien esas 4 (y derive a inscripción) resuelve la mayoría del volumen.

### Objeciones y frenos más comunes (para que el bot sepa rebatir)
- **"Me queda lejos"** → varios lo dicen tras conocer la dirección.
- **"Estoy cotizando / comparando"** (mencionan a la competencia: *conduce.cl*).
- **"Lo tengo que conversar / con mi hijo / esposo"** → decisión de terceros.
- **"Te aviso / déjame ver mi presupuesto"** → falta de urgencia.
- **"Me da miedo / mala experiencia previa"** → freno emocional.
- **Horario laboral** → "salgo a las 19:30", "trabajo 2x2".

---

## 2. Datos maestros del negocio (el "cerebro" del bot)

> Extraído **textualmente** de las respuestas reales de Sebastián en los chats.
> Esto es lo que el bot debe saber. **Verificar con Cool Drive antes de publicar**
> (precios y promos cambian).

**Escuela:** Cool Drive — Escuela de conductores.
**Dirección:** Sergio Silva Acuña 464, Maipú, Región Metropolitana, Santiago.
**Licencia:** Clase B.

### Cursos y precios
| Curso | Clases prácticas | Para quién | Precio normal | Precio promo | Con transferencia |
|-------|------------------|-----------|--------------|-------------|-------------------|
| **Avanzado** | 8 clases | Ya tiene algo de experiencia | $110.000 | **$90.000** | — |
| **Full** | 12 clases | Parte desde cero | $140.000 | **$120.000** | **$110.000** |

- Clases prácticas de **45 minutos** cada una.
- **Clase suelta / reforzamiento:** $20.000 c/u (solo prácticas, sin teoría ni pruebas).
- **Solo material + pruebas + 2 psicotécnicas** (sin prácticas): normal $80.000, oferta $50.000.
- Pago con transferencia = **$10.000 de descuento** sobre la promo.

### Cómo es el curso (estructura)
1. **Teoría online** (autoaprendizaje, avanzas a tu ritmo, ~2 semanas).
2. Semana de **pruebas**.
3. **8 o 12 clases prácticas** de manejo (45 min c/u), en auto **mecánico** (lo exige la municipalidad; te da base para automático).
4. Termina con **2 clases psicotécnicas** (máquinas que miden habilidades).
- Las clases **parten y terminan en la escuela** (por ley, circuito aprobado).
- **Duración total:** aprox. 1½ a 2 meses.
- **El curso parte todos los lunes** → hay que inscribirse antes para empezar el lunes siguiente.

### Horarios
- **Clases prácticas: solo lunes a viernes** (NO sábados ni domingos).
- Mañana **09:00–13:00**, tarde **16:00–20:00**. Primera clase 09:00, última parte ~20:15.
- **El alumno elige sus horarios** dentro de ese rango; las prácticas se agendan todas juntas al terminar la teoría.
- Hay horario post-laboral (última hora ~19:45) para quienes trabajan.

### Examen y licencia
- El **alumno saca la hora** en la **Municipalidad de Maipú** (presencial, con carnet).
- **La escuela lo acompaña y le facilita el vehículo** el día del examen (el mismo auto en que practicó). **No necesita auto propio.**
- La **licencia se paga a la municipalidad**: ~$34.000.
- **Tasa de aprobación: más de 87%.**

### Otros
- **Sin edad límite** (han tenido alumnos de 70+ que sacaron licencia).
- **Instructores certificados**; hay **2 instructoras mujeres**.
- **Formas de pago:** efectivo, transferencia, débito, crédito (**hasta 3 cuotas sin interés**), link de pago (Mercado Pago). Se paga la **totalidad al inscribirse**; se puede **dejar pagado y comenzar hasta 60 días después**.

### Guion de venta que usa Sebastián (a replicar por el bot)
1. Saluda: *"Hola, hablas con Sebastián, un gusto"*.
2. **Califica:** *"¿Deseas partir desde cero o ya tienes conocimientos previos?"*
3. Según respuesta, **recomienda** curso (cero → Full; con experiencia → Avanzado).
4. Da **precio con promo** y **cierra con urgencia**: *"Si te inscribes hoy te lo dejo a…"*.
5. Ofrece **link de pago / transferencia** para asegurar el cupo.

---

## 3. Siguiente paso

Ver **`bot-make.md`**: prompt del bot listo para pegar + arquitectura del
escenario en Make conectado a GoHighLevel.
