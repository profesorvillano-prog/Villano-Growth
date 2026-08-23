# Migración a v2 — leads de los últimos 30 días

> Plan de traspaso de los pipelines actuales a los cuatro de
> [`../docs/Sistema-Pipelines-v2.md`](../docs/Sistema-Pipelines-v2.md).
> El detalle tarjeta por tarjeta está en [`plan-migracion.csv`](./plan-migracion.csv).

## Qué entra

Criterio: **oportunidad abierta con actividad en los últimos 30 días**
(creación, cambio de etapa o última actualización). Medido el 23/ago/2026.

| | |
|---|---:|
| Abiertas en toda la cuenta | 214 |
| **Con actividad ≤ 30 días** | **142** |
| → se mueven | **124** |
| → se cierran como perdidas | **18** |
| Personas únicas | 136 |

Las 72 abiertas restantes llevan más de 30 días quietas: se quedan en los
pipelines viejos y se cierran allí con motivo.

## A dónde va cada una

| Destino v2 | Tarjetas | Viene de |
|---|---:|---|
| `②` 1 · Sin Agendar | **62** | Ghost-Nueva Agenda (52) · Ghost Intento Agenda (5) · Follow Up (4) · Primer Contacto (1) |
| `③` 4 · Seguimiento | 16 | Follow Up Asistentes |
| `③` 2 · No-Show | 15 | No-Show Llamada |
| `②` 4 · Confirmada | 10 | Llamada Confirmada Setter (8) · Llamada Confirmada (2) |
| `②` 8 · Re-Agendar | 6 | Cancelada (Re-Agendar) (4) · Cancelada Última Hora (2) |
| `③` 1 · Asistió | 5 | Asistió |
| `④` 0 · Cuota de Entrada Pagada | 4 | Paga Reserva |
| `②` 0 · Calificada (Formulario) | 3 | Formulario [ORG] |
| `②` 2 · Nueva Agenda | 3 | Nuevas Agendas |
| **Perdida · No cualifica** | 12 | Descalificada |
| **Perdida · Duplicada** | 6 | ver abajo |

**Duplicados.** 6 contactos tienen dos tarjetas dentro de la ventana (el patrón
típico: una en `②` *Llamada Confirmada* y otra en `③`). Se conserva **la más
avanzada** y la otra se cierra con motivo *Duplicada*. Es la regla que evita
arrancar v2 con la misma persona en dos tableros.

## Dos cosas que hay que decidir antes de ejecutar

### 1. Las 62 de *Sin Agendar* no pueden recibir `G1` al migrar

Es el bloque más grande y el más delicado. Si entran a la etapa 1 con el
workflow **W7** activo, 62 personas reciben `G1` de golpe — y `G1` dice
*"vi que completaste tu postulación pero no alcanzaste a elegir tu horario"*,
que a alguien de hace tres semanas le suena a error del sistema.

Recomendación: **migrar con W7 pausado**, etiquetar el lote como `migrada-v2` y
excluir esa etiqueta del workflow. Después, una reactivación aparte con mensaje
propio — reconociendo el tiempo pasado, no fingiendo que postuló hoy.

Son 62 leads calificadas que ya levantaron la mano. Merecen un mensaje escrito
a propósito, no el de otro momento del embudo.

### 2. Ocho tarjetas de *Llamada Confirmada Setter* piden ojo humano

Van a `②` 4 · Confirmada, pero dos llevan 14 días quietas: una llamada
confirmada hace dos semanas ya ocurrió o fue no-show, y nadie movió la tarjeta.
Conviene revisarlas antes de moverlas.

| Días quieta | Nombre |
|---:|---|
| 1 | Olga Lucia Serrano |
| 2 | Belen Anais Ortiz Martínez |
| 3 | Isabel Valenzuela |
| 5 | Constanza Salas Pontigo |
| 8 | Iara Epifani |
| 9 | Loren Vanessa Beltran Piñeros *(marcada duplicada)* |
| 14 | Xochitl Ahtziri Hernández López |
| 14 | Jennifer Gualotuña |

## Cómo se ejecuta

1. **Crear los 4 pipelines** con los nombres de etapa exactos de la §3-§6 del
   documento de v2. Es lo único que no se puede automatizar: la API de GHL no
   expone escritura de pipelines.
2. Leo los IDs de las etapas nuevas por API — no hay que copiarlos a mano.
3. **Re-consulto las oportunidades en ese momento.** El CSV es una foto del
   23/ago; entre hoy y la ejecución entran leads nuevas, y esas ya nacen en el
   sistema nuevo.
4. Ejecuto los movimientos (`PUT /opportunities/{id}`: pipeline + etapa) y los
   cierres con motivo.
5. Devuelvo el CSV de resultado: qué se movió, qué falló y qué quedó pendiente.

**Orden importante:** pausar los workflows nuevos → migrar → verificar el
tablero → reactivar workflows. Si se migra con los workflows encendidos, cada
cambio de etapa dispara su automatización y salen mensajes que no corresponden.
