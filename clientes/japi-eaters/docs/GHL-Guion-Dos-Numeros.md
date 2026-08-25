# Guion de WhatsApp a dos números — plan de implementación

> Cómo montar el "Guion de WhatsApp Japi Eaters" (doc final de mensajes) sobre
> el sistema de pipelines ya construido. No es un rediseño: es la **capa de
> mensajes**. Etapas, movimientos y Slack no cambian; cambian los nodos de
> WhatsApp y se incorpora el segundo número.

## Arquitectura de números

| Número | Vía | Firma | Para qué |
|---|---|---|---|
| **+52** | WhatsApp **API oficial** (Meta) | Josefina · AUTO | Todo lo que necesita **botones, plantillas aprobadas y volumen confiable**: confirmación A1-A5, recordatorio M8 |
| **+569** | App "WhatsApp, iMessage and SMS" (marketplace GHL) | Rafa · lo operan Anaís y Rafa | La **conversación humana**: ghost G1-G3, diálogo del setter M1-M6, pre-llamada M7, día de llamada M9-M11 |

### ⚠ Reglas del +569 (app no oficial)

1. **Warm-up obligatorio**: 1-2 semanas solo con mensajes manuales y volumen
   bajo antes de activar los AUTO (un número nuevo con ráfagas automáticas es
   candidato a baneo de Meta). Activar gradual: G1/G2 primero, M9/M10 al final.
2. **Vigilar la conexión a diario** (la sesión puede caducar y los AUTO dejan
   de salir sin error visible). Añadirlo al ritual de `#0-llamadas-hoy`.
3. **Nunca volumen masivo** por el +569 — para eso está la API del +52.
4. Los mensajes **MANUAL** se montan como **Tasks automáticas** asignadas a
   Anaís en el momento correcto — el guion no depende de la memoria de nadie.

## Mapa guion → sistema

| Bloque del guion | Dónde vive | Cambio |
|---|---|---|
| **G1-G3** · Postuló sin agendar (+569) | ②-2 Ghost ([ADS] 2 / [ORG] 2) | Reemplaza `ghost_agenda_*`. Toques: **10 min** (G1 AUTO), **+3 h** (G2 AUTO), **día siguiente** (G3 → Task manual). Goal de salida: agendó (ya existe) |
| **A1-A5** · Al agendar, botones (+52) | [ADS] 3 / [ORG] 3 Confirmación | Reemplaza `v2_confirmar_jose` + video selfie. Plantillas nuevas **a aprobar en Meta** (con botones Ver vídeo / Sí confirmo / Cancelar). A4 (Cancelar) → mover a ② *Re-Agendar* + link. **A5 al confirmar → Add tag `guion-569`** (activa el carril del segundo número) |
| **M1-M2** · Día del agendamiento (+569 AUTO) | Workflow nuevo `[+569] Día del agendamiento` — trigger: tag `guion-569` | M1 y M2 con la app (Send Whatsapp Message); M2 con 5 seg de wait |
| **M3-M6** · Calificación conversacional (+569 MANUAL) | Tasks para Anaís (firma Rafa) | La pregunta según respuesta del survey (rutas 🅐🅑🅒); registrar el dolor en nota del contacto para Rafa |
| **M7** · Video personalizado (+569 MANUAL) | Task día pre-llamada (24 h antes, junto al 🔔 de #5) | El video lo graba Josefina; Anaís lo envía |
| **M8** · Recordatorio esa noche (+52 AUTO) | Ya existe: `wa_recordatorio_24h` en [ADS] 4 / [ORG] 4 | Sin cambios |
| **M9-M10** · Día de llamada (+569 AUTO) | [ADS] 4 / [ORG] 4 | Reemplazan `wa_recordatorio_8h` y `wa_recordatorio_1h` por nodos de la app (M9 en la mañana, M10 15 min antes con link del meet) |
| **M11** · A la hora (+569 MANUAL) | Task 15 min antes (complementa el DM a Rafa) | — |

## Orden de implementación

1. **Hoy**: conectar el +569 con la app · enviar las plantillas A1-A5 del +52 a
   aprobación de Meta (son el cuello de botella, tardan días).
2. **Semana de warm-up**: +569 solo manual (Anaís ya puede usar el guion M1-M6
   a mano); mientras, continuar los workflows del closer (Fase 2 — no chocan).
3. **Al aprobar plantillas**: swap de la confirmación A1-A5 en [ADS/ORG] 3 +
   tag `guion-569`.
4. **Tras el warm-up**: activar G1-G2 AUTO en el ghost, M1-M2 AUTO, y al final
   M9-M10 en recordatorios.
5. **QA**: postulación de prueba → recorrer el guion completo de punta a punta
   con los dos números.

## Nota de métricas

El cambio de número no toca tags, etapas ni fuente: la atribución y los KPIs
siguen intactos. El único ajuste: los mensajes del +569 quedan en la misma
conversación del contacto en GHL, así que Anaís y Rafa ven el hilo completo.
