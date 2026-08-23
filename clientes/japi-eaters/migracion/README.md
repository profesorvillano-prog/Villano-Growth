# Migración a v2 — por reutilización

> **Cambio de enfoque.** En vez de crear 4 pipelines nuevos y mover 124 tarjetas,
> se **reutilizan los tres existentes** renombrando sus etapas. Las tarjetas se
> quedan donde están y el histórico se conserva. El único pipeline nuevo es
> `[VALEN] Instagram`, que ya está creado.
>
> Detalle por tarjeta en [`plan-migracion.csv`](./plan-migracion.csv) (foto del
> 23/ago). Estructura destino en [`../docs/Sistema-Pipelines-v2.md`](../docs/Sistema-Pipelines-v2.md).

## Por qué reutilizar es mejor

| | Crear de cero | **Reutilizar** |
|---|---:|---:|
| Tarjetas a mover por API | 124 | **~20** |
| Tarjetas a cerrar | 18 | ~26 |
| Etapas a crear | 30 | **4** |
| Histórico conservado | en tableros archivados | **en el mismo sitio** |

Reutilizar `②` es el gran ahorro: sus **52 tarjetas en *Ghost - Nueva Agenda***
—el bloque más grande de toda la cuenta— son exactamente lo que la etapa
*Sin Agendar* de v2 describe. Renombrando la etapa, aterrizan solas.

## ⚠ Antes de tocar nada: los workflows

Renombrar una etapa **conserva su ID**. Eso es lo que hace que las tarjetas no se
muevan… y también lo que hace que **los workflows actuales sigan disparando**,
ahora sobre una etapa que significa otra cosa.

**Pausar todos los workflows que tocan `②`, `③` y `④` antes del primer renombrado**,
y reactivarlos solo cuando la estructura nueva esté completa y verificada. Si no,
durante la transición salen mensajes que no corresponden a nadie.

---

## ② `[SETTER - ADS]` → **Agenda · WhatsApp**

Renombrar el pipeline y luego, etapa por etapa:

| Etapa actual | Abiertas | Acción |
|---|---:|---|
| Formulario [ADS] | 1 | renombrar → **Calificada (Formulario)** |
| Ghost - Nueva Agenda | **52** | renombrar → **Sin Agendar** |
| Nuevas Agendas | 2 | renombrar → **Nueva Agenda** |
| Llamada Confirmada | 11 | renombrar → **Confirmada** |
| Llamada Preparación | 0 | renombrar → **Pre-Llamada** |
| Cancelada (Re-Agendar) | 3 | renombrar → **Re-Agendar** |
| Follow Up | 4 | **vaciar** → mover las 4 a *Sin Agendar* · luego borrar |
| Descalificada | 25 | **vaciar** → cerrar las 25 como Perdida · luego borrar |
| — | | **crear** *Sin Confirmar* |
| — | | **crear** *Diagnóstico* |
| — | | **crear** *Día de Llamada* |

Después: reordenar a las 9 posiciones de la §4 y cargar probabilidades (§14).

**Recibe además las 16 abiertas de `①`** según el mapeo de la sección siguiente.

---

## ③ `[CLOSER] Agenda` → **Llamadas · Closer**

El encaje aquí es aún mejor: **seis renombrados, ninguna etapa nueva**.

| Etapa actual | Abiertas | Acción |
|---|---:|---|
| Llamada Confirmada Setter | 8 | renombrar → **En Llamada** |
| Asistió | 22 | *(sin cambios)* |
| Follow Up Asistentes | 28 | renombrar → **Seguimiento** |
| No-Show Llamada | 34 | renombrar → **No-Show** |
| Cancelada Última Hora | 2 | renombrar → **Reagendada** |
| Venta High Ticket | 0 abiertas · **18 ganadas** | renombrar → **Cerrada · Va a Pagar** |
| Paga Reserva | 6 | **vaciar** → mover las 6 a `④`/0 · luego borrar |

> *Venta High Ticket* se renombra en vez de borrarse **a propósito**: ahí viven las
> 18 oportunidades ganadas del histórico. Borrar la etapa las pondría en riesgo, y
> el nombre nuevo les sigue quedando bien —cerraron—.

---

## ④ `[VENTAS] Cobros` → **Ventas · Cobros**

Cero tarjetas en toda su historia, así que es trivial:

| Etapa actual | Acción |
|---|---|
| Nuevo Cierre | renombrar → **Cuota de Entrada Pagada** |
| Pago Cuota 1 · 2 · 3 | *(sin cambios)* |
| Venta Total | *(sin cambios)* |
| — | **crear** *Pago Fallido · En Riesgo* |

---

## ① `[SETTER - ORG]` → se vacía y se archiva

Sus 16 abiertas se reparten en el `②` renombrado:

| Etapa actual | Abiertas | → Destino |
|---|---:|---|
| Formulario [ORG] | 4 | `②` 0 · Calificada (Formulario) |
| Ghost Intento Agenda | 5 | `②` 1 · Sin Agendar |
| Primer Contacto | 1 | `②` 1 · Sin Agendar |
| Follow Up | 1 | `②` 1 · Sin Agendar |
| Nuevas Agendas | 1 | `②` 2 · Nueva Agenda |
| Cancelada (Re-Agendar) | 3 | `②` 8 · Re-Agendar |
| Descalificada | 1 | Perdida · motivo *No cualifica* |

Una vez vacío, se oculta. **No se borra**: conserva 54 oportunidades de histórico.

---

## Sobre las «smart tags»

En el editor de pipeline hay una pestaña **Smart tags** junto a *Stages*. La API
de pipelines no la expone, así que **no puedo verificar qué hace exactamente**
desde aquí — si querés, mandame una captura de esa pestaña abierta y lo cierro.

Lo que sí es seguro: **para distinguir orgánico de pauta no hace falta construir
nada nuevo.** Ya está resuelto y con cobertura del 100 %:

| Señal | Dónde vive | Cobertura |
|---|---|---|
| `lead-org` · `lead-ads` | etiqueta de contacto | todos |
| `survey-org` · `survey-ads` | etiqueta de contacto | todos los que postularon |
| `source` | campo de la oportunidad | `[SURVEY - ORG]…` / `[SURVEY - ADS]…` |

Con eso, filtrar el board por origen es un filtro guardado, no una estructura.
Sea lo que sea que hagan las Smart tags, no hace falta inventar taxonomía.

---

## El coste de reutilizar, dicho claro

**Los reportes históricos de `②` cambian de significado en la fecha del corte.**
Antes de la migración, `②` era solo pauta; después, es todo. Cualquier serie que
cruce esa fecha mezcla dos cosas distintas.

No es grave —los filtros por `lead-org` / `lead-ads` permiten separar— pero hay
que anotar la fecha del corte y avisar al panel Cerebro, que agrupa por
`pipeline_name`.

---

## Orden de ejecución

1. **Pausar** los workflows que tocan `②`, `③` y `④`.
2. Cerrar las **25 Descalificada** de `②` y la **1** de `①` (Perdida con motivo).
3. Mover las **4** de *Follow Up* de `②` → *Sin Agendar*, y las **6** de
   *Paga Reserva* de `③` → `④`/0.
4. **Borrar** las etapas ya vacías: *Follow Up* y *Descalificada* de `②`,
   *Paga Reserva* de `③`.
5. **Renombrar** las 13 etapas y los 3 pipelines.
6. **Crear** las 4 etapas nuevas, reordenar y cargar probabilidades (§14).
7. Mover las **15 abiertas restantes de `①`** a `②`.
8. Ocultar `①`.
9. **Verificar** los cuatro tableros a ojo.
10. **Reactivar** workflows, ya apuntando a la estructura nueva.

Los pasos 2, 3 y 7 son los únicos que requieren API: **unas 46 operaciones**, que
puedo ejecutar de una pasada en cuanto los renombrados estén hechos.
