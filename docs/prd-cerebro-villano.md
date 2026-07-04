# PRD — "Cerebro Villano" · Sistema operativo interno de la agencia

> Propuesta de producto para la app centralizada de gestión de Villano Growth.
> Fuentes: SOPs de contenido (Family-Eaters, Dr. Marcelo, Ezequiel), Excels de
> métricas de tráfico (estructura idéntica en los 3 clientes), y reuniones del
> equipo en Fathom (Org. Semanal, Métricas, revisiones por cliente, jun–jul 2026).
> **v1.1** — incorpora las decisiones de la reunión "Villano Growth - Métricas"
> del 2 de julio (transcripción completa): matriz RACI, ciclos de 14 días
> escalonados por cliente, publicación/medición de orgánico vía GHL Social
> Planner, estrategia viva por cliente y acciones del infoproductor en el tracker.

---

## 1. Problema

Hoy la operación vive repartida entre Notion (sobrado de funcionalidades), 3+
Excels de métricas por cliente, GHL, Meta Ads y la cabeza del equipo. Lo que más
cuesta cada semana no es la estrategia sino **la ejecución recurrente**: analizar
contenido, dejarlo programado, cargar métricas, hacer las reuniones cada 14 días,
enviar informes. No hay un lugar donde ver de una mirada: métricas, tareas,
avances y metas por cliente para decidir.

## 2. Objetivo

Una sola app interna ("cerebro central") donde el equipo:
1. Ve la **salud de cada cliente** y de la agencia en un dashboard.
2. Ejecuta y marca las **acciones recurrentes semanales** (el "action tracker",
   estilo grilla de hábitos) por cliente y por área.
3. Carga y analiza **métricas** de orgánico, ads high ticket, ads low ticket y
   ventas — con la misma taxonomía de los Excels actuales.
4. Corre la **revisión cada 14 días** con snapshot automático + decisiones.
5. Gestiona **metas** por cliente/área y tareas internas livianas.

**Principio rector: nada de sobra.** Los entregables hacia el infoproductor
siguen en Notion. Sin chat, sin docs, sin CRM, sin facturación. Solo gestión
interna de la operación.

## 3. Usuarios y roles

| Persona | Rol en la app | Uso principal |
|---|---|---|
| Sebastián (dueño) | Admin | Dashboard agencia, decisiones, metas |
| Rodrigo | Manager | Gestión semanal de clientes: tracker, reuniones, revisiones |
| Patricio | Miembro | Área contenido: acciones + métricas orgánico |
| Javier | Miembro | Métricas, finanzas de campañas, procesos |

Roles de acceso simples: **admin** (todo) y **miembro** (ejecuta y carga datos).

**Matriz RACI por acción** (decisión de la reunión del 2/jul): cada acción
recurrente lleva **R** (responsable, quien ejecuta) y **A** (accountable, quien
responde si no pasa) obligatorios; **C** (consultado) e **I** (informado)
opcionales. La app la hace operativa sin burocracia: R ve la acción en "Mi
semana", A recibe la alerta si vence sin completarse, I ve el registro en el
feed del cliente. Ejemplo real de la reunión: revisión de contenido → R:
infoproductor (Marcelo) · A: Rodrigo · I: Sebastián/Patricio.

**El infoproductor también tiene acciones en el tracker** (sin acceso a la
app): revisar piezas en Notion y grabar en sus ventanas fijas (2–3 días al
inicio y 2–3 a mitad de cada ciclo). Las marca su A (Rodrigo) — así queda
registro de si el cuello de botella fue agencia o cliente.

## 4. Estructura de navegación

```
├── Dashboard (vista agencia — todos los clientes)
├── Semana (action tracker global de la semana en curso)
├── Clientes
│   └── [Cliente]  ← switcher rápido en el sidebar
│       ├── Resumen (salud, metas, próximas revisiones)
│       ├── Acciones (tracker recurrente del cliente)
│       ├── Orgánico (feed + historias)
│       ├── Ads High Ticket (embudo semanal)
│       ├── Ads Low Ticket (embudo semanal)
│       ├── Ventas (cierres, facturación, CAC/ROAS)
│       └── Revisiones (historial de análisis 14 días)
├── Metas
└── Configuración (clientes, áreas, plantillas de acciones, equipo)
```

Las 4 **áreas** son transversales y fijas: `Contenido Orgánico` · `Tráfico de
Pago` · `Embudos de Venta` · `Ventas`. Todo (acciones, métricas, metas,
revisiones) se etiqueta con área para poder filtrar.

## 5. Módulos

### 5.1 Action Tracker semanal (el corazón — "hit tracker" de la agencia)

Grilla tipo habit-tracker (referencia visual: StarkLab /habits, ya especificado
en `docs/analisis-starklab-habits.md`), pero por **cliente × semana**:

- **Filas** = acciones recurrentes. Cada una tiene: nombre, área, cliente (o
  "Agencia" para internas), responsable, cadencia y día objetivo.
- **Columnas** = días de la semana (L–D) o slot único si la acción es semanal.
- **Cadencias soportadas**: diaria, días específicos (L/X/V), semanal,
  **cada 14 días**, mensual. El sistema genera automáticamente las instancias
  de cada semana — nadie tiene que recordar qué toca.
- **Ciclos de 14 días escalonados por cliente** (decisión del 2/jul: "que no
  nos coincidan todos en la misma semana"). Cada cliente tiene su fecha ancla
  de ciclo; la app reparte las revisiones para que en una semana toque
  optimizar Family, en otra Ezequiel, etc.
- **Regla del ciclo cerrado**: la planificación de 14 días no se altera a
  mitad de ciclo (un viral en la semana 1 se replica recién en el ciclo
  siguiente, día 15+). La app refuerza esto: el plan del ciclo en curso queda
  "sellado" y las ideas nuevas caen en un backlog para el próximo ciclo.
- Check con estado: pendiente → hecho / no aplica / bloqueado (con nota).
- **% de cumplimiento semanal** por cliente y por responsable, y racha de
  semanas completas (gamificación mínima, útil para el equipo).

Plantilla inicial de acciones (derivada de SOPs + reuniones — editable):

| Acción | Área | Cadencia | Responsable |
|---|---|---|---|
| Planificar contenido del ciclo | Orgánico | Cada 14 días | Patricio |
| Publicar/programar pieza 1 y 2 del feed | Orgánico | Semanal | Patricio |
| Historias según pauta (L autoridad · X conversión · V educación) | Orgánico | L/X/V o L–V según cliente | Patricio |
| Análisis de contenido de la semana | Orgánico | Semanal | Patricio |
| Cargar métricas de ads (semana) | Tráfico | Semanal | Javier |
| Revisar campañas / fatiga / CPL vs benchmark | Tráfico | Semanal | Rodrigo |
| Revisar conversión del funnel (LP→lead→agenda / checkout) | Embudos | Semanal | Sebastián |
| Seguimiento setter / pipeline de ventas | Ventas | Semanal | Rodrigo |
| Reunión Org. Semanal | Agencia | Semanal (lunes) | Rodrigo |
| Reunión Métricas | Agencia | Semanal | Javier |
| **Revisión de métricas del negocio (por cliente)** | Agencia | **Cada 14 días** | Rodrigo |
| Enviar informe al cliente | Agencia | Cada 14 días | Rodrigo |

### 5.2 Métricas por cliente (reemplaza los Excels)

Misma taxonomía de los Excels actuales — cero curva de aprendizaje:

- **Feed Orgánico** — 1 fila por pieza: fecha, pilar, formato, gancho/tema,
  alcance, impresiones, reproducciones, me gusta, comentarios, compartidos,
  guardados, nuevos seguidores, DMs, leads. Calculados: interacción, tasa de
  interacción, tasa de guardado.
- **Historias** — 1 fila por día: tipo, alcance, retención %, respuestas,
  toques/clics, mensajes generados.
- **Ads High Ticket** — embudo semanal (Sem 1–4 del mes): inversión,
  impresiones, alcance, frecuencia, CPM, clics, CTR, CPC → visitas LP, plays
  VSL, play rate, engagement → leads, tasa LP→lead, CPL, agendas, tasa
  lead→agenda, costo por agenda → show ups, show up rate, cierres, close rate,
  ticket, facturación, CAC, ROAS. **Con los benchmarks 2026 embebidos** y
  semáforo automático (verde/amarillo/rojo vs benchmark).
- **Ads Low Ticket** — inversión→tráfico→VSL→checkout→compra: CVR total,
  AOV, facturación, CPA, ROAS, con benchmarks.
- Derivadas automáticas: todo lo que hoy es fórmula negra en el Excel.

Carga **manual primero** (igual que hoy), con integraciones después (fase 3):
Meta Ads API y GHL para autocompletar inversión/tráfico y pipeline.

**Nota sobre orgánico (decisión del 2/jul):** todo el contenido se publica por
el **Social Planner de GHL**, que ya entrega seguidores, likes, comentarios y
posts ganadores. La app no duplica ese detalle pieza a pieza en la v1: registra
el resumen semanal/por ciclo (los KPIs del SOP: alcance, guardados, compartidos,
mensajes, leads) para las revisiones y las metas, y en fase 3 lee GHL directo.
El proceso semanal de contenido queda estandarizado y fijo para todos los
clientes: **Selección → Creación → Revisión (cliente) → Recepción → Edición →
Programación → Medición** — cada paso es una acción del tracker con su RACI.

### 5.3 Revisión cada 14 días

Al vencer el ciclo, la app genera el **snapshot** (equivalente a la hoja
"Dashboard" del Excel: orgánico + HT + LT consolidados, comparado vs ciclo
anterior y vs benchmark) y abre una revisión donde se registran:
**qué funcionó · qué no · decisiones · compromisos** (los compromisos se
convierten en tareas con responsable y fecha). Historial navegable por cliente.

### 5.4 Metas

Por cliente y área, con métrica objetivo y plazo: ej. "ROAS HT ≥ 2x",
"2 piezas/semana sin fallar", "10 agendas/mes", "Facturación $X del ciclo".
Progreso calculado desde las métricas cargadas — sin doble carga.

### 5.5 Dashboard agencia

- **Tarjeta por cliente**: semáforo de salud (cumplimiento de acciones % +
  métricas clave vs benchmark + metas), facturación del ciclo, próxima revisión.
- **Mi semana**: qué acciones me tocan hoy/esta semana (vista por responsable —
  la vista principal de Rodrigo).
- **Alertas honestas**: métricas sin cargar hace >7 días, acciones vencidas,
  revisiones de 14 días atrasadas. (El sistema no puede prometer análisis si no
  hay datos: la alerta de "dato faltante" es primera ciudadana.)

### 5.6 Estrategia viva por cliente

Reemplaza los PDFs de SOP y la "planilla de estrategia" que se planeó en la
reunión del 2/jul: una ficha editable por cliente con **pilares de contenido,
frecuencia de feed, pauta de historias (ej. L autoridad · X conversión · V
educación), tono y oferta principal**. Se revisa ~1 vez al mes (en la reunión
mensual con el cliente) y guarda historial de cambios — "frecuencia pasó de 2
a 4 piezas/semana el 15/8" queda registrado y contextualiza las métricas. El
proceso semanal estándar NO es editable por cliente: es el ancla del sistema.

Aquí también viven los **colaboradores externos por cliente** (ej. Ina, setter
de Marcelo): sus actividades diarias entran al tracker del cliente con su
nombre como R y Rodrigo como A, sin darle acceso a la app en la v1. Sus
comisiones se calculan fuera de la app (no es scope).

## 6. Modelo de datos (resumen)

```
User(id, nombre, email, rol)
Client(id, nombre, nicho, oferta, estado, notion_url, ciclo_ancla)  ← fecha ancla del ciclo de 14 días
ClientStrategy(id, client_id, pilares, frecuencia_feed, pauta_historias, tono, oferta, vigente_desde)
Collaborator(id, client_id, nombre, rol_texto)  ← setter, editor externo, o el propio infoproductor
Area(fija: organico | trafico | embudos | ventas | agencia)
RecurringAction(id, client_id?, area, nombre, cadencia, dias?, R_id, A_id, C_ids?, I_ids?, activa)
ActionInstance(id, action_id, fecha_objetivo, estado, nota, completed_by, completed_at)
ContentPiece(id, client_id, fecha, pilar, formato, gancho, métricas…)
StoryDay(id, client_id, fecha, tipo, métricas…)
FunnelWeek(id, client_id, tipo: HT|LT, año, semana, métricas…)  ← 1 fila = 1 semana
Review(id, client_id, ciclo_inicio, ciclo_fin, snapshot_json, funciono, no_funciono, decisiones)
Commitment(id, review_id, descripcion, responsable_id, fecha_limite, estado)
Goal(id, client_id, area, metrica, objetivo, plazo, estado)
Task(id, client_id?, area?, titulo, responsable_id, fecha, estado)  ← livianas
Benchmark(metrica, rango_verde, rango_amarillo, fuente)  ← seed de los Excels
```

## 7. Stack propuesto

- **Next.js 15 + TypeScript + Tailwind**, desplegado en **Vercel**.
- **Supabase**: Postgres + Auth (login del equipo, roles) + RLS. Es
  multi-usuario real (Rodrigo, Patricio, Javier y tú a la vez), gratis en este
  volumen, y ya tienes el conector activo.
- UI oscura estilo StarkLab (spec de la grilla ya documentada en este repo).
- Sin apps móviles: PWA instalable (igual que StarkLab).

## 8. Roadmap propuesto

| Fase | Alcance | Criterio de éxito |
|---|---|---|
| **1 · MVP (núcleo)** | Clientes + Action Tracker semanal con cadencias (incl. 14 días) + vista "Mi semana" + dashboard simple de cumplimiento | El equipo deja de olvidar acciones recurrentes; Rodrigo gestiona la semana desde la app |
| **2 · Métricas** | Los 4 módulos de métricas con carga manual + benchmarks/semáforos + Revisión 14 días con snapshot y compromisos | Se abandonan los 3 Excels |
| **3 · Metas + integraciones** | Metas conectadas a métricas · Meta Ads API · lectura de GHL | Menos carga manual; decisiones desde el dashboard |

Fase 1 es deliberadamente chica: el dolor declarado ("lo que más nos cuesta son
las acciones recurrentes") se resuelve ahí, y valida la app con el equipo antes
de migrar las métricas.

## 9. Fuera de alcance (explícito, para que no crezca)

- Entregables y tareas hacia el infoproductor → **siguen en Notion**.
- Chat interno → Slack. Reuniones/transcripciones → Fathom.
- CRM de leads/ventas del cliente → GHL.
- Facturación/cobros de la agencia, contratos, RR.HH.
- Editor de contenido, calendario editorial detallado (el tracker marca "pieza
  publicada", el contenido vive donde vive hoy).

## 10. Preguntas abiertas

1. ~~¿Ciclo de 14 días global o por cliente?~~ **Resuelta (reunión 2/jul): por
   cliente y escalonado**, para no acumular todas las revisiones la misma semana.
2. ¿Semana L–D o L–V para el tracker? (Historias de Marcelo son L–V; Family es
   diaria.) Propuesta: L–D con días de fin de semana atenuados.
3. ¿Los clientes de mentoría (no DFY) entran en la v1 o solo los DFY
   (Family, Marcelo, Ezequiel, + Fixus/Naty que entra a mitad de julio)?
4. ¿Moneda única USD o USD + CLP? (En reuniones aparecen ambas; con Fixus se
   cobra en CLP proporcional.)
5. La reunión mensual con cada cliente (análisis de su negocio por área) ¿se
   registra como una Revisión más en la app, o solo como acción del tracker?
   Propuesta: acción del tracker que enlaza a la Revisión del ciclo vigente.
