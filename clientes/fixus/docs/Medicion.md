# Medición y economía del embudo — FIXUS

> El CRM no recibe el pago del plan, pero **sí registra el resultado**. De ahí
> salen las métricas que gobiernan la pauta.

---

## 1. Las cinco métricas que importan

| # | Métrica | Cómo se calcula | Qué decide |
|---|---|---|---|
| 1 | **Costo por entrada vendida** | `inversión ÷ entradas pagadas` | Si el anuncio y la landing funcionan |
| 2 | **Tasa de agendamiento** | `agendados ÷ entradas pagadas` | Si la página de gracias y el calendario funcionan |
| 3 | **Tasa de asistencia** | `asistieron ÷ entradas pagadas` | Si la capa de recordatorios funciona ← **el riesgo #1** |
| 4 | **Conversión presencial** | `planes vendidos ÷ asistieron` | Si el speech del centro funciona |
| 5 | **Valor por entrada pagada** | ver §2 | **Cuánto se puede pagar por un lead** |

Las cuatro primeras son diagnóstico: cada una apunta a un responsable y a un
arreglo distinto. La quinta es la que permite escalar con criterio en vez de con
intuición.

**Se miden separadas por embudo, siempre.** Promediar 3 a 1 con kinesiología no
produce información, produce un número que no describe a ninguno de los dos.

---

## 2. Valor por entrada pagada

```
VEP = precio_entrada + (tasa_asistencia × conversión_presencial × ticket_plan)

CPA máximo por entrada pagada = VEP ÷ ROAS objetivo
```

### Escenario de trabajo *(hipótesis, no promesas)*

Los porcentajes de abajo son **supuestos iniciales para dimensionar presupuesto**.
FIXUS todavía no tiene el histórico para confirmarlos — se recalculan con datos
reales a las 4 semanas de encendida la pauta.

**3 a 1** — asistencia 80% · conversión presencial 40% · ticket $105.000 (promedio punta/valle)

```
VEP = 8.990 + (0,80 × 0,40 × 105.000) = 8.990 + 33.600 = $42.590
CPA máximo a ROAS 3x = $14.196 por entrada pagada
```

**Kinesiología** — asistencia 85% · conversión presencial 50% · ticket $300.000

```
VEP = 24.990 + (0,85 × 0,50 × 300.000) = 24.990 + 127.500 = $152.490
CPA máximo a ROAS 3x = $50.830 por evaluación pagada
```

### Lo que estos números dicen

**Kinesiología tolera un CPA 3,6 veces mayor que el 3 a 1.** Con los mismos
supuestos, kine puede pagar hasta ~$50.800 por una evaluación vendida y el 3 a 1
solo ~$14.200 por una clase de prueba vendida. Si hay que decidir dónde entra el
primer presupuesto de prueba, **kine tiene mucho más margen de error** — y además
su geo es más amplia (Providencia + Las Condes, Ñuñoa, La Reina), lo que da más
volumen de audiencia.

**El 3 a 1 no se sostiene con el primer mes: se sostiene con la permanencia.** Ese
mismo cálculo con una permanencia media de 4 meses da un VEP de ~$143.000 en vez de
$42.590 — más del triple. Es decir: **el dato de permanencia media del plan mensual
cambia por completo cuánto se puede invertir en el 3 a 1**, y hoy no lo tenemos.
Es el número más valioso que FIXUS puede darnos y hay que pedirlo explícitamente.

> Con el descuento de la entrada aplicado al plan, el VEP del 3 a 1 baja a ~$39.700.
> Es un costo bajo por un argumento de cierre fuerte — pero hay que decidirlo y
> escribirlo, no dejarlo al criterio de cada profesor.

---

## 3. Umbrales de alarma

Se revisan en la reunión semanal. Cada uno apunta a un arreglo concreto:

| Métrica | Bien | Alarma | Dónde está el problema |
|---|---|---|---|
| Tasa de agendamiento | ≥ 85% | < 70% | Página de gracias, calendario o disponibilidad real |
| **Tasa de asistencia** | ≥ 80% | < 65% | Recordatorios, plantillas de WhatsApp, o el horario elegido |
| Conversión presencial 3 a 1 | ≥ 40% | < 25% | Speech del centro · comparar entre profesores |
| Conversión presencial kine | ≥ 50% | < 30% | La evaluación no está cerrando con plazo de retorno claro |
| `Esperaba clase grupal` | 0% | > 10% de las pérdidas | **Landing y anuncio**, no el centro |
| Etapa 5 estancada | < 3 tarjetas | > 8 tarjetas | Nadie está llenando el formulario de cierre → la métrica 4 está muerta |
| Pagos ÷ oportunidades creadas | ≥ 95% | < 90% | La captura post-pago está perdiendo gente |

Los umbrales "bien" son objetivos, no benchmarks verificados. Se ajustan con el
dato real del primer mes.

---

## 4. Conexión con el panel Cerebro

Dos escenarios de Make, **uno por pipeline** — la clave única de la tabla es
`cliente + fecha + pipeline_name`, así que los dos embudos quedan como dos series
separadas en el tablero sin trabajo extra.

### `ht_pipeline` — 3×/semana (lun · mié · vie)

| Columna | Significado en FIXUS | Origen |
|---|---|---|
| `cliente` | `fixus` (constante) | — |
| `fecha` | Fecha de la corrida, zona Chile | — |
| `pipeline_name` | `FIXUS · 3 a 1` o `FIXUS · Kinesiología` | constante del escenario |
| `mensajes` | **Pagos iniciados** (etapa 1) | 0 si la ruta de pago no captura pre-pago |
| `respuestas` | **Entradas pagadas** (nuevas en etapa 2) | ← la métrica de la pauta |
| `propuestas` | **Confirmaciones de asistencia** (respondieron CONFIRMO) | mide la capa de recordatorios |
| `bookings` | **Agendados** (nuevos en etapa 3) | |
| `asistencias` | **Asistieron** (nuevos en etapa 5) | |
| `ventas` | **Planes vendidos** (`Won` en la ventana) | |
| `facturacion` | `Σ monto_entrada + Σ monto_plan` de la ventana | |

> ⚠️ **Ventanas que no se solapan.** El panel **suma** las filas del rango, así que
> cada corrida cuenta solo lo nuevo desde la anterior: la del miércoles cuenta
> mar+mié, la del viernes cuenta jue+vie. Si se cuentan acumulados, la semana suma
> el doble.

> 📝 Las etiquetas `mensajes` / `respuestas` / `propuestas` vienen del modelo high
> ticket de los otros clientes. En FIXUS significan lo de la tabla de arriba. Si
> confunde en la revisión semanal, el arreglo es renombrar las etiquetas en la
> pestaña del panel por cliente — cambio de UI en `cerebro/`, no de datos.

### `ventas` — tiempo real (webhook)

Una fila por transacción, `on_conflict=fuente,transaction_id`.

| Columna | Entrada pagada | Plan vendido |
|---|---|---|
| `fuente` | `mercadopago` / `xflow` | `ghl` |
| `transaction_id` | id del pago | id de la oportunidad |
| `producto` | `Clase de prueba 3 a 1` / `Evaluación kinesiológica` | valor de `plan_vendido` |
| `monto` | 8.990 / 24.990 | `monto_plan` |
| `moneda` | `CLP` | `CLP` |
| `estado` | `approved` | `won` |
| `fecha` | `fecha_pago` | fecha del cierre |

El panel considera venta aprobada cuando `estado` contiene `approved`, `paid`,
`complete`, `active` o `won` — los dos casos entran.

---

## 5. Lo que falta para que la medición sirva

Estos datos no bloquean el encendido de la pauta, pero **sin ellos no se puede
decir si el embudo funcionó**:

- [ ] **Tasa de cierre actual sobre consultas de WhatsApp.** La maneja Natalia. Es
      la línea base: sin ella no hay contra qué comparar y en dos meses la
      discusión va a ser de opiniones.
- [ ] **Permanencia media del plan mensual del 3 a 1.** Cambia el CPA máximo por
      un factor de 3 o más. Es el dato de mayor impacto de toda esta lista.
- [ ] Facturación mensual actual y meta a 6 meses.
- [ ] Costo máximo aceptable por cliente nuevo *(el que FIXUS considere, para
      contrastarlo con el VEP calculado)*.
- [ ] Clientes nuevos esperados al mes por servicio → define el volumen de pauta.
- [ ] Presupuesto de publicidad disponible.
