# Automatizaciones de Make → Cerebro Villano

Guía para conectar Make con Supabase y alimentar los tableros del panel.
Cada tablero lee una tabla de Supabase; Make es quien la llena.

- **Proyecto Supabase:** `Villano OS` — `https://bkyufepwfwzjzrriptmc.supabase.co`
- **REST base:** `https://bkyufepwfwzjzrriptmc.supabase.co/rest/v1/`
- **Zona horaria de referencia:** America/Santiago (usar la fecha local de Chile para `fecha`).

---

## 0. El mapa (qué escenario alimenta qué)

| Tablero del panel | Tabla Supabase | Fuente de datos | Frecuencia sugerida |
|---|---|---|---|
| Meta Ads | `campaign_metrics` | Meta / Facebook Ads (Insights) | cada 6–12 h |
| Orgánico · Instagram | `organic_content` | Instagram Graph API | 1–2 veces/día |
| Embudo High Ticket | `ht_pipeline` | GoHighLevel (pipeline) | 1 vez/día |
| Ventas | `ventas` | Hotmart + GHL (webhooks) | en tiempo real |

> Planificador, Tareas, Accesos y KPIs **NO** los toca Make — los maneja la app
> directamente (los edita el equipo/cliente y se guardan en Supabase).

### El campo `cliente` (slug)
Todas las tablas usan una columna `cliente` con el **slug canónico** del cliente.
Usá siempre estos (uno fijo por cuenta/escenario):

| Cliente | slug (`cliente`) |
|---|---|
| Family Eaters | `family` |
| Marcelo Dachshund | `marcelo` |
| Ezequiel Racca | `ezequiel` |
| Fixus | `fixus` |

---

## 1. Conexión Make → Supabase (una sola vez)

Supabase expone una API REST automática (PostgREST). Se escribe con la key
**`service_role`** (server-side; nunca la pongas en el navegador ni en el repo).

**Dónde sacar la key:** Supabase → Project Settings → API → `service_role` (secret).

Tenés dos formas de escribir desde Make:

### Opción A — Módulo "Supabase" de Make (recomendado si aparece)
1. Agregá un módulo **Supabase → Upsert a Row(s)**.
2. Conexión nueva: URL del proyecto + `service_role` key.
3. Elegí la tabla y mapeá los campos (ver secciones 2–5).
4. En "Upsert", elegí las columnas de conflicto (las claves únicas de abajo).

### Opción B — Módulo "HTTP" genérico (siempre funciona)
Un módulo **HTTP → Make a request** por cada escritura:

- **Método:** `POST`
- **URL:** `https://bkyufepwfwzjzrriptmc.supabase.co/rest/v1/<TABLA>?on_conflict=<COLUMNAS_CLAVE>`
- **Headers:**
  - `apikey: <SERVICE_ROLE>`
  - `Authorization: Bearer <SERVICE_ROLE>`
  - `Content-Type: application/json`
  - `Prefer: resolution=merge-duplicates,return=minimal`
- **Body (raw JSON):** un objeto con las columnas (o un array para lote).

`on_conflict` + `Prefer: resolution=merge-duplicates` = **upsert**: si ya existe
la fila (según la clave única), la actualiza; si no, la inserta. Así podés correr
el escenario muchas veces sin duplicar.

> Ya dejé creadas las **claves únicas** en la base (sección de cada tabla). Usalas
> tal cual en `on_conflict` / en las columnas de conflicto del módulo Supabase.

---

## 2. Escenario A — Meta Ads → `campaign_metrics`

**Clave única (upsert):** `on_conflict=cliente,fecha,ad_id`
**Nivel:** anuncio (`level = ad`). Un escenario por cuenta publicitaria (fijás `cliente`).

**Flujo:**
1. **Schedule** cada 6–12 h.
2. **Facebook Ads → Get Insights** con:
   - `level = ad`
   - `date_preset = last_30d` (o el rango que quieras ver)
   - `fields`: `spend, impressions, reach, frequency, clicks, ctr, cpc, cpm,
     actions, action_values, purchase_roas, account_id, account_name,
     campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, objective`
3. (Opcional) **Facebook → Get an Ad Creative** para `thumbnail_url` y el
   `preview_shareable_link`.
4. **Supabase Upsert / HTTP POST** por cada anuncio.

**Mapeo (columna ← Meta):**

| Columna | Origen |
|---|---|
| `cliente` | constante del escenario (`family` / `marcelo` / …) |
| `fecha` | fecha de captura (hoy, zona Chile) — `formatDate(now; "YYYY-MM-DD")` |
| `level` | `"ad"` |
| `account_id`, `account_name`, `currency` | de la cuenta |
| `campaign_id`, `campaign_name`, `objective` | de la campaña |
| `adset_id`, `adset_name` | del conjunto |
| `ad_id`, `ad_name` | del anuncio |
| `spend`, `impressions`, `reach`, `frequency`, `clicks`, `ctr`, `cpc`, `cpm` | de Insights |
| `leads` | `actions[]` con `action_type` = `lead` (u `onsite_conversion.lead_grouped`) |
| `purchases` | `actions[]` con `action_type` = `purchase` |
| `purchase_value` | `action_values[]` con `action_type` = `purchase` |
| `roas_meta` | `purchase_roas[].value` |
| `thumbnail_url` | creative `thumbnail_url` |
| `preview_url` | `preview_shareable_link` |

> **Cómo lo lee el panel:** cada fila es la "foto" del anuncio en su ventana,
> capturada en `fecha`. El drill-down toma la **captura más reciente por anuncio**
> dentro del rango elegido. Por eso corré 1 vez al día como mínimo.

---

## 3. Escenario B — Instagram orgánico → `organic_content`

**Clave única (upsert):** `on_conflict=cliente,media_id`
Una fila por publicación; se actualiza en cada corrida con las métricas frescas.

**Flujo:**
1. **Schedule** 1–2 veces/día.
2. **Instagram Graph API** — listar `media` de la cuenta (últimos N) y, por cada
   media, pedir `insights`.
3. **Supabase Upsert / HTTP POST** por cada pieza.

**Mapeo (columna ← Instagram):**

| Columna | Origen |
|---|---|
| `cliente` | constante del escenario |
| `ig_account` | @usuario (opcional) |
| `media_id` | `id` del media |
| `tipo` | `media_type` (`IMAGE` / `VIDEO` / `CAROUSEL_ALBUM`) |
| `producto` | `media_product_type` (`FEED` / `REELS` / `STORY`) |
| `caption` | `caption` |
| `permalink` | `permalink` |
| `publicado` | `timestamp` |
| `fecha` | `timestamp` recortado a `YYYY-MM-DD` |
| `thumbnail_url` | `thumbnail_url` (video) o `media_url` (imagen) |
| `media_url` | `media_url` |
| `alcance` | insight `reach` |
| `impresiones` | insight `impressions` |
| `reproducciones` | insight `plays` / `video_views` (reels) |
| `likes` | `like_count` |
| `comentarios` | `comments_count` |
| `guardados` | insight `saved` |
| `compartidos` | insight `shares` |
| `interacciones` | insight `total_interactions` |
| `respuestas` (stories) | insight `replies` |
| `toques_adelante` (stories) | insight `taps_forward` |
| `toques_atras` (stories) | insight `taps_back` |
| `salidas` (stories) | insight `exits` |

> Los reels/posts muestran miniatura desde `thumbnail_url`/`media_url`. Si no
> mandás esos campos, el panel intenta sacarla del `permalink`, pero lo ideal es
> cargarlos desde la API.

---

## 4. Escenario C — Embudo High Ticket (GHL) → `ht_pipeline`

**Clave única (upsert):** `on_conflict=cliente,fecha,pipeline_name`
Una fila **por día** con los **conteos de ese día** (no acumulados — el panel
suma el rango).

**Flujo:**
1. **Schedule** 1 vez/día (al cierre del día, zona Chile).
2. **GoHighLevel** — leer el pipeline / oportunidades y contar lo del día:
   - `mensajes`: conversaciones/oportunidades nuevas del día
   - `respuestas`: que respondieron
   - `propuestas`: a las que se les ofreció agenda
   - `bookings`: agendas creadas
   - `asistencias`: que asistieron (show)
   - `ventas`: cierres ganados
   - `facturacion`: monto ganado del día
3. **Supabase Upsert / HTTP POST** una fila (`fecha` = hoy, `pipeline_name` = nombre del pipeline).

| Columna | Origen |
|---|---|
| `cliente` | constante del escenario |
| `fecha` | hoy (YYYY-MM-DD) |
| `pipeline_name` | nombre del pipeline en GHL |
| `mensajes`, `respuestas`, `propuestas`, `bookings`, `asistencias`, `ventas` | conteos del día |
| `facturacion` | monto ganado del día |

> ⚠️ Este es el escenario más dependiente de **cómo tenés armado el pipeline en
> GHL** (nombres de stages). Conviene armarlo juntos: definimos qué stage cuenta
> como cada etapa y con qué módulo de GHL se cuenta (opportunities por stage +
> fecha). El resto (`campaign_metrics`, `organic_content`, `ventas`) es más directo.

---

## 5. Escenario D — Ventas (Hotmart + GHL) → `ventas`

**Clave única (upsert):** `on_conflict=fuente,transaction_id`
Una fila por transacción. En tiempo real vía **webhooks**.

### Hotmart
1. **Webhooks → Custom webhook** en Make (te da una URL).
2. En Hotmart: configurá el **Postback / Webhook** de compras a esa URL.
3. **Supabase Upsert / HTTP POST** con:

| Columna | Origen Hotmart |
|---|---|
| `cliente` | constante (o según el producto) |
| `fuente` | `"hotmart"` |
| `evento` | tipo de evento (`PURCHASE_APPROVED`, `PURCHASE_REFUNDED`, …) |
| `transaction_id` | `data.purchase.transaction` |
| `producto` | `data.product.name` |
| `producto_id` | `data.product.id` |
| `comprador_nombre` | `data.buyer.name` |
| `comprador_email` | `data.buyer.email` |
| `monto` | `data.purchase.price.value` |
| `moneda` | `data.purchase.price.currency_value` |
| `estado` | `data.purchase.status` (ej. `APPROVED`) |
| `fecha` | `data.purchase.order_date` |

### GoHighLevel (pagos)
1. En GHL: un **Workflow** que en "Payment received" haga un **Webhook** a Make.
2. Mapeo equivalente con `fuente = "ghl"`, `transaction_id` = id del pago,
   `estado` = `paid`/`won`, etc.

> El panel considera "venta aprobada" cuando `estado` contiene: `approved`,
> `complete(d)`, `paid`, `active`, `won`. Reembolsos/otros quedan registrados
> pero no suman a facturación.

---

## 6. Verificación

1. Corré el escenario en modo test (Run once).
2. En Supabase → Table Editor, revisá que aparezcan filas en la tabla.
3. En el panel, abrí el cliente → pestaña correspondiente (Meta Ads / Orgánico /
   High Ticket / Ventas). Los datos aparecen al instante (realtime).
4. Volvé a correr el escenario: **no deben aparecer duplicados** (upsert).

## 7. Buenas prácticas

- **Fecha en horario de Chile.** Formateá `fecha` con la zona America/Santiago.
- **Un escenario por cliente** (o un escenario con router que fija `cliente`
  según la cuenta) — nunca mezclar cuentas en la misma fila.
- **service_role solo en Make.** No la pongas en el frontend ni la subas al repo.
- **Empezá por lo simple:** Ventas (webhooks) e Instagram son los más directos;
  Meta Ads es medio; el embudo GHL es el que más conviene armar juntos.
