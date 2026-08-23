# Embudo y estrategia — FIXUS

> **Fuente:** documento *Embudo Inicial FIXUS*, que consolida las reuniones del
> **30/jul (Felipe)** y **4/ago (Natalia)**. Este archivo es el resumen operativo
> de esa estrategia; lo que sigue en `Pipeline-CRM.md`, `Automatizaciones-y-Pago.md`
> y `Medicion.md` es la traducción de esto a sistema.

## La lógica en una línea

No se vende el plan en línea. Se vende una **entrada barata y pagada** que lleva a
la persona al centro, y **la venta grande ocurre presencialmente**, que es donde
Fixus ya es fuerte.

```
Anuncio → Landing con video → Pago de entrada → Agenda → Asiste → Venta presencial del plan
```

## Por qué se cobra la entrada

La entrada no es un negocio, es un mecanismo con tres funciones:

| Función | Qué resuelve |
|---|---|
| **Filtra** | Quien paga $8.990 tiene intención real. El lead gratis se cae solo. |
| **Mide** | Da una métrica limpia de tráfico → persona sentada en el centro, sin depender de conversaciones de WhatsApp. |
| **Compromete** | Quien ya pagó, asiste. La ausencia es el gran enemigo del embudo. |

El contexto lo obliga: en Chile el grado de conciencia sobre el formato es bajo
(la gente asume Smart Fit, gimnasio normal o clase grupal). Eso no se explica por
texto, hay que mostrarlo — de ahí la landing con video y el objetivo de llevar a
la persona al lugar físico.

## Dos embudos separados, nunca mezclados

> **Regla dura:** los anuncios de kinesiología van solo a la landing de
> kinesiología, y los del 3 a 1 solo a la del 3 a 1. **Ninguno va a la web actual
> de Fixus**, donde conviven todos los servicios y la persona se pierde.

|  | **Embudo A · 3 a 1** | **Embudo B · Kinesiología** |
|---|---|---|
| **Entrada** | Clase de prueba **$8.990** (se testea a 8, meta subir a 10) | Evaluación kinesiológica **$24.990** (bajada desde $40.000 a propósito) |
| **Destino** | Plan mensual 2x/sem: **$115.000** punta / ~**$98.000** valle. Trimestral −5% | Plan **10 sesiones $300.000**, reembolsable con orden médica |
| **Geo** | Radio corto: Providencia y alrededores de Metro Colón | Amplio: Providencia + Las Condes, Ñuñoa, La Reina |
| **Problema del mensaje** | No saber qué hacer en el gimnasio, esperar por máquinas, no progresar, no ser constante | Una lesión que impide jugar, o un dolor pateado por meses que ya interfiere con el día a día |
| **Efecto secundario esperado** | Parte termina en 1 a 1 cuando el profe lo recomienda. Se acepta, no se pauta | Alta continuidad hacia entrenamiento tras el alta |

**Lógica del precio de entrada:** se cede margen en la entrada para ganar el plan.
La evaluación baja de $40.000 a $24.990 porque a $40.000 la gente lo cuestiona y no
entra. En el 3 a 1, la clase de prueba pagada **se descuenta del plan** si la
persona continúa *(política a confirmar y luego comunicar en la landing)*.

## Etapa 1 — Anuncios

- Un **ángulo por avatar**, nunca un anuncio genérico por servicio: 3 avatares
  para el 3 a 1, 2 para kinesiología.
- **Coherencia anuncio → landing.** Lo que promete el anuncio es lo que se ve al
  llegar. Si el anuncio habla de deporte y la landing muestra un video genérico,
  la persona rebota.
- **Orgánico ≠ pauta.** El contenido abre conversaciones y alimenta marca; el
  embudo directo a pago se hace por anuncios.

## Etapa 2 — Landing con video

Dos landings independientes, misma arquitectura, contenido distinto:

1. Promesa principal, en lenguaje de la persona.
2. Bajada de la promesa.
3. Dos o tres beneficios que se vean fáciles de obtener.
4. **Video de venta de 2:30 a 3 min máximo.**
5. Testimonios ligados a cada avatar.
6. **Botón de pago directo** de la clase de prueba o la evaluación.

**El video** no es institucional, es de venta: alterna persona a cámara con voz en
off sobre imágenes del servicio. *Lo dicho tiene que estar mostrado.* Su objetivo
no es explicar todo el programa: es que la persona resuelva **una sola pregunta**
— *esto es para mí o no* — y pague.

**Lenguaje acordado (sin tecnicismos):**

| No decir | Decir |
|---|---|
| "Entrenamiento personalizado" | "un profesor mirándote el 100% de la clase y corrigiéndote" |
| "Reintegro deportivo" | "volver al deporte con tranquilidad y romperla el fin de semana" |
| "Programación individualizada" | "tu propio plan, distinto al del de al lado" |

## Etapa 3 — Pago

**Orden correcto del flujo — y el orden importa:**

```
Ve el video → quiere agendar → va a pago → PAGA → recién ahí entrega sus datos → agenda
```

Hoy Xflow obliga a crear usuario **antes** de pagar, y son demasiados datos para
alguien que todavía no compró. Después de pagar, en cambio, la persona llena sus
datos sin problema — misma lógica que pedir hora al médico. Esa captura posterior
además es necesaria: **el RUT alimenta la boleta automática de Simple Factura**
para el reembolso de kinesiología.

Las rutas de pago (Xflow / Mercado Pago / página de gracias) están desarrolladas
en [`Automatizaciones-y-Pago.md`](./Automatizaciones-y-Pago.md).

**Alcance del CRM:** el CRM **no reemplaza a Xflow** ni recibe la operación del
centro. Solo se integran **los dos productos de entrada**. Recovery, nutrición,
1 a 1 y planes mensuales siguen en Xflow. *El CRM es exclusivamente para marketing.*

## Etapa 4 — Agendamiento

Después de pagar, la persona ve **horarios disponibles reales** y agenda. Para eso
el calendario del CRM tiene que estar sincronizado con las agendas del equipo.

Pendiente: hoy Natalia tiene su Google Calendar vinculado solo a sus propias
sesiones. Son **tres profesores en el 3 a 1** con horarios repartidos, más la
agenda de kinesiología.

- *Opción 1:* integrar vía Xflow, si su equipo lo permite.
- *Opción 2:* sumar cada profesor al CRM y conectar su Gmail. Cinco minutos por
  persona, con un Loom explicativo.

> El CRM **solo lee disponibilidad**, no el contenido de las citas. Muestra
> "ocupado", no de qué se trata.

**Codificación por color:** un color para evaluaciones de kine vendidas y otro
para clases de prueba del 3 a 1, para ver de un vistazo qué está trayendo la pauta.

## Etapa 5 — Automatizaciones de asistencia

> El punto más frágil del embudo es **entre el pago y la asistencia**. Toda esta
> capa existe para que la persona efectivamente llegue.

Correo de confirmación apenas paga · confirmación por WhatsApp · recordatorio el
día anterior · recordatorio la mañana del día · recordatorio una hora antes ·
chatbot para confirmaciones y cambios.

**Beneficio operativo:** Natalia se desliga del WhatsApp para esta parte del flujo.
La agencia se hace cargo de toda esta capa.

## Etapa 6 — La venta presencial

Es la etapa que decide el resultado del embudo y **la única que no depende de la
agencia**.

- **3 a 1:** la clase de prueba funciona como evaluación (movilidad, sentadilla,
  peso muerto, flexión, tracción). Con eso el profesor arma la planificación. La
  venta ocurre cuando la persona ya conoce el espacio, al profe y el formato.
- **Kinesiología:** la evaluación tiene que terminar con la persona entendiendo
  **qué tiene, en cuánto se recupera y por qué necesita las 10 sesiones**. Para el
  deportista, el gancho es el plazo de retorno; para el dolor crónico, entender la
  causa y que el tratamiento no sea solo camilla.

**Puentes entre servicios:** 3 a 1 → 1 a 1 (adultos mayores, principiantes
absolutos) · kine → entrenamiento al alta (el puente más natural y de mayor valor)
· hacia nutrición interna.

## Etapa 7 — Medición

El CRM no recibe el pago del plan, **pero sí registra el resultado**. Cada lead que
asistió se marca ganado o perdido con su precio. Ver [`Medicion.md`](./Medicion.md).

## Producción de recursos

**Fixus:** B-rolls horizontales 3 a 1 (Felipe) y kinesiología (Natalia), tomas
exteriores de Metro Colón y fachada (Felipe tiene dron), consultar a candidatos a
testimonio sin grabar todavía.

**Agencia:** guiones de los dos videos de venta, estructura de preguntas para
testimonios, diseño y montaje de las dos landings, campañas, CRM, automatizaciones
e integraciones, plantilla de Notion para entrega y aprobación de contenido.

**Testimonios (5):** 3 a 1 — mujer que retomó, deportista de fin de semana,
derivado de oficina. Kine — deportista lesionado que volvió a jugar, paciente 40+
con dolor crónico. Formato: 2–3 tomas del cliente entrenando como B-roll con parte
del testimonio en voz en off, alternando.

## Riesgos a vigilar

| Riesgo | Mitigación en el sistema |
|---|---|
| **Que la gente pague y no asista** | Capa de recordatorios (W4) + etapa *No asistió · recuperar* medida desde el día 1 |
| **Que la venta presencial no se estandarice** | Formulario de cierre idéntico para los 4 profesionales → la métrica queda interpretable |
| **Que la confusión "3 a 1 = clase grupal" llegue al centro** | Romperla en la landing **y** repetirla en el correo/WhatsApp de confirmación |
| **Capacidad operativa** | Viernes tarde sin horario y fin de semana solo 1 a 1 rotativo. Revisar cobertura antes de escalar pauta |
