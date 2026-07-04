# Análisis técnico — StarkLab / Página de Hábitos

> Objetivo: documentar la app desplegada en `starklab.vercel.app/habits` con el detalle
> suficiente para **replicarla** desde cero.
>
> Fuente: análisis visual/funcional de la app en producción (julio 2026). El código
> fuente no estaba accesible desde esta sesión (el proyecto no está en la cuenta de
> Vercel conectada y la URL está bloqueada por la política de red), por lo que el stack
> exacto es inferido y se indica como recomendación.

---

## 1. Visión general

StarkLab es una app de productividad personal tipo "life OS": hábitos, tareas, metas,
finanzas, entrenamiento, dieta, calendario, etc. Es una SPA con tema oscuro, instalable
como PWA (botón "Instalar app" en la barra superior) y desplegada en Vercel.

La página **Hábitos** es un tracker de ejecución diaria estilo "grilla mensual"
(habit grid), con resumen del día, gráfico de progreso mensual y porcentaje global del mes.

## 2. Estructura de navegación (app shell)

Sidebar fija a la izquierda, colapsable (botón `<` en el header del sidebar), con logo
"⚡ StarkLab" (rayo rojo, "Stark" blanco + "Lab" rojo). Secciones con label de grupo en
mayúsculas pequeñas y gris:

| Grupo | Ítems (icono + label) |
|---|---|
| Principal | Dashboard, **Hábitos** (activo, en rojo con punto indicador), Tareas |
| Progreso | Metas, Progreso, Logros, Ranking, StarkChat |
| Herramientas | Plan del día, Finanzas, Entrenamiento, Cronograma, Dieta, Calendario, Enfoque, Wallpapers (badge `NEW` rojo) |
| Config | Perfil, Familia, Configuración |

Barra superior derecha: campana de notificaciones (con dot indicador) + botón
"Instalar app" (icono descarga) → la app registra un manifest PWA y captura el evento
`beforeinstallprompt`.

Rutas inferidas: `/dashboard`, `/habits`, `/tasks`, `/goals`, `/progress`,
`/achievements`, `/ranking`, `/chat`, `/day-plan`, `/finances`, `/training`,
`/schedule`, `/diet`, `/calendar`, `/focus`, `/wallpapers`, `/profile`, `/family`,
`/settings`.

## 3. Página `/habits` — bloques de UI

### 3.1 Header de página
- Título `Hábitos` (h1, blanco, bold) + subtítulo gris: "Control de ejecución diaria — hábitos y progreso."
- A la derecha: **KPI del mes** — `0%` grande en violeta + label "Progreso Julio" — y
  botón primario violeta `+ Agregar` (abre modal/form de creación de hábito).

### 3.2 Card "Hoy" (resumen del día)
- Título: `Hoy: 0/1 hábitos completados` — a la derecha `Faltan 1`.
- Barra de progreso horizontal (track gris oscuro, fill violeta según %).
- Texto secundario: "Falta 1 hábito para completar el día".
- Mensaje motivacional en violeta: "¡Hoy puedes lograr tu nuevo récord! 🔥" — ligado a
  la racha (streak): si completar hoy supera el récord histórico, muestra este mensaje.

⚠️ **Inconsistencia observada (bug a evitar en la réplica):** el card dice `0/1`
mientras la grilla de abajo dice `Hoy: 0 de 3 completados`. Causas probables en el
original: el card filtra hábitos "programados para hoy" (frecuencia/días activos) con
un filtro incorrecto, o lee un estado desincronizado (dos stores/consultas distintas).
En la réplica, ambos números deben derivarse del **mismo selector**.

### 3.3 Card de gráfico mensual
- Header: navegación de mes `‹ Julio 2026 ›`.
- Gráfico de línea (% de cumplimiento diario): eje Y con gridlines punteadas en
  0/25/50/75/100%, eje X con los días 1–31 (ticks cada ~5). Línea naranja/roja; solo
  dibuja segmentos para días con datos (en la captura, un tramo plano cerca de 0%
  alrededor de los días 2–4).
- Fórmula por día: `completados(día) / hábitosActivos(día) * 100`.

### 3.4 Card "Grilla de Hábitos"
- Header: título "Grilla de Hábitos" + hint gris "Arrastra para reordenar · Clic en el
  lápiz para editar". A la derecha, label del mes ("Julio 2026").
- Tabla:
  - Columna fija izquierda `Hábito`: por fila → handle de drag (⠿), icono del hábito
    (emoji sobre chip cuadrado con fondo de color), nombre. Al hover aparece lápiz de edición.
  - Columnas 1–31 (días del mes) con scroll horizontal (scrollbar visible abajo);
    el día actual se resalta (número sobre círculo violeta relleno).
  - Celdas: checkbox cuadrado con borde redondeado; sin marcar = fondo gris oscuro;
    marcado = fondo violeta con check blanco; el día actual sin marcar usa borde
    punteado violeta (afford "pendiente de hoy").
  - Días futuros: sin celda interactiva (vacío) — solo se puede marcar hasta hoy.
- Debajo: botón violeta `+ Agregar` (mismo flujo de creación).
- Footer del card: `Hoy: 0 de 3 completados` a la izquierda, `0%` violeta a la derecha.

Hábitos de ejemplo en la captura: 💻 Revisar Notion, 🧘 Escribir / Visualizar,
📚 Leer 30 minutos.

## 4. Modelo de datos

```ts
interface Habit {
  id: string;            // uuid
  name: string;          // "Leer 30 minutos"
  emoji: string;         // "📚"
  color?: string;        // fondo del chip del icono
  order: number;         // para drag & drop
  createdAt: string;     // ISO
  archivedAt?: string | null;
  // opcional si se soporta frecuencia:
  activeDays?: number[]; // 0-6; ausente = todos los días
}

interface HabitCompletion {
  habitId: string;
  date: string;          // "2026-07-04" (clave por día, zona horaria local)
}
```

Persistencia del original: probablemente `localStorage` (app personal, sin login
visible) o Supabase. Para la réplica: empezar con `localStorage` y una capa de
repositorio para poder migrar a Supabase después.

### Selectores derivados (una sola fuente de verdad)
```ts
const habitsToday = habits.filter(h => !h.archivedAt && isActiveOn(h, today));
const doneToday   = habitsToday.filter(h => isCompleted(h.id, today));
// Card "Hoy" y footer de la grilla usan EXACTAMENTE estos dos valores.

// % del mes (KPI header):
// suma de completados del mes / (hábitos activos × días transcurridos del mes)
const monthPct = totalCompletions(month) / (activeHabitCount * daysElapsed) * 100;
```

### Racha / récord
```ts
interface StreakState { current: number; best: number; }
// current: días consecutivos con 100% de cumplimiento (hasta ayer u hoy si ya completó).
// Mensaje "¡Hoy puedes lograr tu nuevo récord! 🔥" cuando current === best
// y hoy aún no está completo.
```

## 5. Interacciones

1. **Toggle de celda**: click marca/desmarca `HabitCompletion` para (hábito, día).
   Optimista e inmediato; recalcula card Hoy, KPI del mes y gráfico en el mismo render.
   Bloquear días futuros.
2. **Agregar hábito**: modal con nombre + selector de emoji (+ color). Inserta al final
   (`order = max + 1`).
3. **Editar**: lápiz por fila → mismo modal; permitir eliminar/archivar.
4. **Reordenar**: drag & drop vertical por el handle (en React: `@dnd-kit/sortable`).
5. **Navegación de mes**: `‹ ›` cambian mes visible; la grilla y el gráfico se
   re-derivan; los meses pasados son de solo lectura (opcional).
6. **PWA**: manifest + service worker; botón "Instalar app" visible solo si
   `beforeinstallprompt` fue capturado.

## 6. Design tokens (tema oscuro)

| Token | Valor aproximado |
|---|---|
| Fondo app | `#0a0a0b` (casi negro) |
| Fondo card | `#121214` con borde `#1f1f23` y radio ~14px |
| Fondo sidebar | `#0d0d0f`, borde derecho sutil |
| Texto primario | `#f5f5f5` |
| Texto secundario | `#8a8a93` |
| Acento primario (acciones, checks, KPI) | violeta `#8b5cf6` (violet-500) |
| Acento marca (logo, nav activa, badge NEW, línea del gráfico) | rojo `#ef4444` / naranja `#f97316` |
| Track de progreso / celdas vacías | `#1c1c20` |
| Tipografía | sans (Inter/Geist), pesos 400/600/700 |

Nota: la app usa **dos acentos** — rojo para identidad/navegación y violeta para
progreso/acciones. Mantener esa separación en la réplica.

## 7. Stack recomendado para la réplica

- **Next.js 15 (App Router) + React + TypeScript**, desplegado en Vercel.
- **Tailwind CSS** para el tema (tokens arriba como CSS variables).
- **Zustand** (o Context + reducer) como store único; persistencia con
  `persist` middleware → `localStorage`; repositorio intercambiable para Supabase.
- **@dnd-kit/sortable** para reordenar hábitos.
- **Recharts** (LineChart) para el gráfico mensual — o SVG propio, es simple.
- **next-pwa** o manifest + SW manual para el botón "Instalar app".
- Fechas: `date-fns` con claves `yyyy-MM-dd` en zona horaria local (evitar UTC:
  causa el clásico bug de "se marcó el día equivocado" cerca de medianoche).

### Árbol de componentes sugerido
```
AppShell (Sidebar + Topbar)
└─ HabitsPage
   ├─ PageHeader (título, MonthKpi, AddHabitButton)
   ├─ TodayCard (progreso del día + mensaje de racha)
   ├─ MonthChartCard (MonthNav + CompletionLineChart)
   └─ HabitGridCard
      ├─ GridHeader (mes)
      ├─ HabitRow[] (DragHandle, HabitIcon, nombre, EditButton, DayCell[1..31])
      ├─ AddHabitButton
      └─ GridFooter (hoy X de Y, %)
   └─ HabitModal (crear/editar)
```

## 8. Casos borde a cubrir (donde el original falla o puede fallar)

1. **Desincronización 0/1 vs 0/3** (vista en producción): derivar ambos contadores del
   mismo selector. Test: crear 3 hábitos → card Hoy debe decir `0/3`.
2. **KPI mensual en 0% con completions existentes** (vista en producción: hay un check
   el día 2 pero el header marca 0%): asegurarse de que el KPI incluya todo el mes
   transcurrido y se recalcule al togglear cualquier día, no solo hoy.
3. Cambio de mes con 0 hábitos → gráfico y grilla vacíos sin división por cero.
4. Hábito creado a mitad de mes → decidir si cuenta para días previos (recomendado: no;
   usar `createdAt` como piso del denominador).
5. Medianoche / cambio de día con la app abierta → recalcular `today` (evento
   `visibilitychange` o interval).
6. Zona horaria: claves de fecha siempre locales.

---

*Documento generado como espec de replicación; los valores exactos de colores,
espaciados y copy pueden ajustarse contra la app real cuando el repo fuente esté
disponible en la sesión.*
