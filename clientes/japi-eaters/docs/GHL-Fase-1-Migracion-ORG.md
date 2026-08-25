# Fase 1 — Migración ORG a la autopista nueva (guía de ejecución)

> **Modelo de 3 carriles (decisión 24-08):** el canal de contacto sigue al dueño
> del lead. **ORG Bio** (llegó solo por el link de la bio) → entra a **②** y
> Anaís lo trabaja por WhatsApp, igual que ADS. **ORG Setter** (setteada por
> Valen en DM) → vive en **①**, sin WhatsApp automático: Valen la empuja desde
> IG. Todas confluyen en ② al **agendar** y siguen ② → ③ → ④.
> Requiere la [Fase 0](./GHL-Fase-0-Quick-Fixes.md) completada.

| Lead | Pre-agenda | Ghost (no agendó) | Al agendar |
|---|---|---|---|
| ADS | ② Calificada (Formulario) | ② Sin Agendar (Ghost) + WhatsApp | ② Nueva Agenda |
| ORG Bio | ② Calificada (Formulario) | ② Sin Agendar (Ghost) + WhatsApp + Slack | ② Nueva Agenda |
| ORG Setter | ① (Valen) | ① Seguimiento, **sin WhatsApp** — Valen por IG | ① Agendada **Won** + ② Nueva Agenda |

---

## Paso A — Repuntar los workflows ORG

### A1 · [ORG] 1 · Calificación (Bio) → ② — ID `c98e6ba6`

Igual que el carril ADS:

1. Nodo **Crear en Descalificada** → Pipeline `②`, Stage *Calificada
   (Formulario)*, Status **Lost**, reason `Inversion`.
2. Los 3 nodos de tier → Pipeline `②`, Stage **Calificada (Formulario)**,
   Status Open, Owner **Anaís**, sin valor.

### A2 · [SETTER - ORG] 1 · Calificación (Setter) → ① — ID `8439135d`

1. Nodo **Crear en Descalificada** → Pipeline `①`, Stage **Descalificada**,
   Status **Lost**, reason `Inversion`.
2. Los 3 nodos de tier → Pipeline `①`, Stage **Formulario Completado**,
   Status Open, Owner **Valen**, sin valor.

### A3 · [ORG] 2 · Agenda + Ghost — ID `851e8b99` ✅ ya editado (ramas Bio/Setter)

Como quedó armado: if/else **¿Es ORG?** con ramas *ORG Bio* (`lead-org`),
*ORG Setter* (`lead-setter-org`) y None→END. Bio: wait 2 h → ghost → WhatsApp +
Slack Anaís. Setter: ghost sin WhatsApp. Remates:

1. **Verificar destinos de los dos nodos "Cambiar a Ghost Agenda"**:
   rama Bio → `②` / *Sin Agendar (Ghost)*; rama Setter → `①` / *Seguimiento*.
2. **Añadir el Wait 2 Horas a la rama Setter** (hoy evalúa ¿Ya agendó? al
   instante del tag de tier → todas caerían en ghost al minuto 0).
3. Opcional: al final de la rama Setter, **DM Slack a Valen**
   ("👻 {{contact.name}} no agendó — empújala por IG").

### A4 · [ORG] 3 · Confirmación — el puente con Go To — ID `4a74420d` ✅ ya editado

Estructura final (el **Go To** reunifica la rama Setter con el carril genérico):

```
Trigger (booking [ORG])
└─ Condition ¿Es Setter?
   ├─ Setter (tags include lead-setter-org):
   │     Cerrar ① Agendada (Won) → Go to ──┐
   └─ None (Bio, ADS re-agendas): ─────────┴→ Remove Tag → Crear ② Nueva Agenda
                                     → tag agenda-org → ¿Primera vez o re-agenda? → …
```

Remates:

1. **Go To → destino = nodo Remove Tag** (primer paso del carril genérico), para
   que las setter también reciban ② Nueva Agenda + confirmación tras cerrar ①.
2. El nodo de la rama Setter: confirmar **① / Agendada / Won / Owner Valen** y
   renombrarlo `Cerrar ① Agendada (Won)`.
3. Nodo genérico `Crear ② Nueva Agenda`: Open, Owner **Anaís** — corre para todas.
4. Nodo **Remove Tag**: dejar solo `agenda-ads` (no quitar `lead-ads`). Espejo
   en [ADS] 3: dejar solo `agenda-org`.

La Condition con `lead-setter-org` es el gate: Bio y ADS caen en None y nunca
tocan ① (sin ella, un booking de Bio crearía una Won fantasma en el pipeline de
Valen). No hace falta ningún workflow aparte.

### A5 · [ORG] 4 · Recordatorios — ID `5296147d` (y espejo en [ADS] 4)

- Nodo **Cambiar a Llamada en Preparación** → `②` / **Pre-Llamada
  (Preparación)**. Post-agenda todas viven en ②.
- **Alerta 🚨 de "HOY"** (en [ADS] 4 y [ORG] 4): entre el nodo *Wait 4h* y
  *WhatsApp 4 hrs*, añadir **solo un Slack** a `#5-llamadas-preparacion`:
  `🚨 HOY — llamada con {{contact.first_name}} a las
  {{appointment.only_start_time}} · 📱 {{contact.phone}} [ADS]/[ORG]`
  Complementa el 🔔 de 24 h; el DM al closer 35 min antes queda igual.
  ⚠ **No mover la tarjeta a *Día de Llamada* en este paso**: si Anaís ya
  confirmó antes de las 4 h, el Handoff marcó la tarjeta de ② como Won y un
  movimiento automático la reabriría. El movimiento a *Día de Llamada* se
  monta en la Fase 2 con una condición que respete las ya confirmadas.

### A6 · Handoff único — [ADS] 5 absorbe a [ORG] 5

1. Renombrar [ADS] 5 (`8ab3d347`) a `[②] 5 · Handoff Closer (ADS + ORG)`;
   Slack neutro en `#6-confirmaciones-llamadas`.
2. **[ORG] 5** (`c0eead4d`) → **Draft** (no borrar todavía).

---

## Paso B — Migrar las abiertas del legacy

Opportunities → `[SETTER - ORG] Formación` → filtro **Open**. El destino
pre-agenda depende del tag del contacto: con `lead-setter-org` → ① (owner
Valen); con `lead-org` → ② (owner Anaís). Post-agenda → ② para todas.

| Etapa legacy | Setter (`lead-setter-org`) | Bio (`lead-org`) |
|---|---|---|
| Formulario [ORG] / Primer Contacto | ① Formulario Completado | ② Calificada (Formulario) |
| Ghost (ambas) / Follow Up | ① Seguimiento | ② Sin Agendar (Ghost) |
| Nuevas Agendas | ② Nueva Agenda | ② Nueva Agenda |
| Llamada Preparación | ② Pre-Llamada | ② Pre-Llamada |
| Cancelada (Re-Agendar) | ② Re-Agendar (Cancelada) | ② Re-Agendar (Cancelada) |
| Descalificada | **No migrar** — bulk Lost, se quedan | ídem |
| Llamada Confirmada | ⚠ ver nota | ⚠ ver nota |

> ⚠ **Llamada Confirmada**: mover a ②/Llamada Confirmada dispara el handoff
> (crea en ③ + Slack). Si el contacto ya tiene oportunidad en ③ → marcar la del
> legacy Won y no mover; si no → mover y dejar correr.

Las Won/Lost históricas se quedan en el legacy como registro.

## Paso C — Retirar el legacy (sin borrar)

1. Renombrar a `zz [RETIRADO] Setter ORG`, desmarcar *Show in funnel* /
   *Show in pie chart*. **No borrarlo** (borraría oportunidades e histórico).
2. Archivar el canal Slack `5-confirmaciones-llamadas`.

## Métricas del modelo de 3 carriles

- **Valen (①):** win rate = Agendada Won / tarjetas ①. Solo leads setteadas:
  su métrica es pura.
- **Anaís (②):** trabaja por WhatsApp los carriles ADS y Bio desde *Calificada*;
  las Setter le llegan ya agendadas a *Nueva Agenda*.
- Comparación de fuentes en ②: usar **agenda → llamada confirmada** (existe
  para los 3 carriles). El formulario → agenda de Setter se lee en ①.

## QA — dos carriles de prueba (15 min)

**Carril Setter:** survey `[SURVEY - ORG SETTER]` tier Silver → ① *Formulario
Completado* (Open, Valen), nada en ②. Sin agendar 2 h → ① *Seguimiento*,
**sin WhatsApp**. Agenda [ORG] → ① *Agendada/Won* + ② *Nueva Agenda* (Anaís).

**Carril Bio:** survey `[SURVEY - ORG]` tier Silver → ② *Calificada
(Formulario)* (Anaís), **nada en ①**. Sin agendar 2 h → ② *Sin Agendar (Ghost)*
+ WhatsApp ghost. Agenda [ORG] → ② *Nueva Agenda* y **① sigue vacío** (gate
`lead-setter-org` funcionando).

Ambos: mover ② a *Llamada Confirmada* → ③ (Rafa, 1250) + ② Won + Slack #6.
Legacy: 0 Open. Limpiar contactos de prueba.

| ✔ | Paso |
|---|---|
| ☐ | A1 · [ORG] 1 (Bio) → ② |
| ☐ | A2 · [SETTER - ORG] 1 (Setter) → ① |
| ☐ | A3 · [ORG] 2 ramas Bio/Setter ✅ + destinos + wait Setter |
| ☐ | A4 · [ORG] 3 con Condition Setter + Go To ✅ |
| ☐ | A5 · [ORG] 4 → ② Pre-Llamada |
| ☐ | A6 · Handoff unificado + [ORG] 5 a draft |
| ☐ | B · Migración por tag (①/②) |
| ☐ | C · Legacy oculto, canal archivado |
| ☐ | QA · Carriles Setter y Bio |
