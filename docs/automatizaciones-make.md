# Automatizaciones Make → Supabase (Villano OS)

Runbook de las integraciones que alimentan la app desde Meta e Instagram.
Equipo Make: `2094866` · Organización: `8286748` (plan **Free**).

> ⚠️ **Límites del plan Free de Make**
> - Máximo **2 escenarios activos** a la vez.
> - **1000 operaciones/mes** (se reinician cada mes).
> - Tiempo máximo de ejecución **5 min** por corrida.
>
> Por esto no se pueden tener todos los escenarios de todos los clientes
> activos al mismo tiempo, y hay que cuidar el gasto de operaciones.

Conexión Facebook/Instagram usada por todos los escenarios: **`8842055`**
("Conexión Make", OAuth Facebook, con scopes `instagram_basic`,
`instagram_manage_insights`, `ads_management`, etc. Vence 2026-09-05).

---

## Tablas destino en Supabase

- `campaign_metrics` — métricas de Meta Ads a nivel anuncio
  (columnas clave: `cliente, fecha, ad_id`; incluye `thumbnail_url`,
  `preview_url` para el creativo).
- `organic_content` — publicaciones de Instagram
  (clave `cliente, media_id`; incluye `caption`, `media_url`,
  `thumbnail_url`, `permalink`, más métricas).

Autenticación a PostgREST vía header `apikey`/`Authorization` con el
`service_role` key y `Prefer: resolution=merge-duplicates,return=minimal`
(upsert por `on_conflict`).

---

## 1. Orgánico (Instagram) — ✅ funcionando con foto y texto

Escenario Family: **`6481495`** — "Integration Instagram for Business".
Flujo: `GetUserMedia` (25 piezas) → HTTP upsert a `organic_content` →
`GetMediaInsights` → HTTP upsert de métricas.

El módulo HTTP (id 3) envía, además de las métricas, la **foto y el texto
reales** de cada pieza. Campos añadidos al `data`:

```
"caption":"{{replace(2.caption; newline; " ")}}",
"media_url":"{{2.media_url}}",
"thumbnail_url":"{{2.thumbnail_url}}",
```

Notas:
- `replace(2.caption; newline; " ")` quita saltos de línea para no romper
  el JSON del body. **No** usar `replace` con comillas literales
  (`"\""`) porque el validador de blueprint de Make lo rechaza al correr.
- Tras cada `scenarios_update` hay que **`scenarios_activate`** antes de
  `scenarios_run`, o falla con "Scenario validation failed - 1 problem".
- La miniatura de Instagram es un URL de CDN firmado que puede expirar; el
  frontend hace fallback al ícono del tipo con `onError` en el `<img>`.

El frontend ya lee estas columnas en `OrganicLiveCard`
(`cerebro/app/clientes/[id]/page.tsx`): muestra la imagen
(`thumbnail_url || media_url`), el caption como título y el enlace al post.

---

## 2. Meta Ads (creativo/foto del anuncio) — ⏳ PENDIENTE (correr tras subir de plan)

Escenario Family: **`6480230`** — "[ADS] Family - Villano OS".
Flujo actual: `GetAdAccountInsights` (level `ad`, `last_30d`,
`time_increment=all_days`) → HTTP upsert a `campaign_metrics`.

**Problema:** el módulo de *insights* de Meta **no** devuelve la imagen del
creativo, solo métricas + `ad_id`/`ad_name`. Para traer la foto hay que
hacer **una llamada extra al Graph API por cada anuncio**.

El frontend **ya está listo**: `MetaDrilldown` lee `thumbnail_url` /
`preview_url` de `campaign_metrics` y muestra la miniatura del anuncio en
cuanto exista el dato. Solo falta poblar esas columnas.

### Paso exacto para habilitarlo (cuando el plan lo permita)

Agregar un módulo entre el insights (id 2) y el upsert (id 3) que, por cada
`ad_id`, llame al Graph API y saque la miniatura del creativo:

```
GET https://graph.facebook.com/v21.0/{{2.ad_id}}
      ?fields=creative{thumbnail_url,image_url,object_story_spec}
      &access_token=<token de la conexión 8842055>
```

- El `thumbnail_url` del creativo va a `campaign_metrics.thumbnail_url`.
- Opcional: guardar el preview del anuncio con
  `GET /{{2.ad_id}}/previews?ad_format=MOBILE_FEED_STANDARD` → `preview_url`.
- Luego extender el `data` del upsert (id 3) con:
  `"thumbnail_url":"{{<módulo_creativo>.thumbnail_url}}"`.

**Costo en operaciones:** ~1 llamada por anuncio por corrida.
Family tiene 8 anuncios → ~8 ops/día ≈ 240 ops/mes solo para Family.
Con el plan Free (1000 ops/mes compartidas entre todos los clientes) esto
no es sostenible; por eso se recomienda **subir de plan en Make** antes de
activarlo para todos los negocios.

### Recordatorios operativos

- Mantener el escenario dentro del cupo de **2 activos**; pausar los que no
  se estén usando.
- Tras editar el blueprint: `scenarios_activate` y recién ahí `scenarios_run`.
- El upsert usa `on_conflict=cliente,fecha,ad_id` (constraint
  `campaign_metrics_uniq_ad`), que permite varios anuncios por fecha.
