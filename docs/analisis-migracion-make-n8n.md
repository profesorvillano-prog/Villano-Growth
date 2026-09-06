# Análisis: migrar los bots GHL de Make a n8n

**Fecha:** 6 de septiembre de 2026
**Alcance:** los 5 escenarios activos en Make — 2 de Cool Drive y 3 de Setter Marce (Dachshund) — todos integrados con GoHighLevel (LeadConnector) y Claude Sonnet 5.

---

## 1. Qué hay hoy en Make (auditoría real)

Los 5 escenarios comparten el mismo patrón de arquitectura:

| Escenario | Disparo | Ejecuciones | Operaciones | Ops/ejecución |
|---|---|---:|---:|---:|
| [BOT] Cool Drive - WhatsApp + Instagram | Webhook GHL | 327 | 2.929 | ~9,0 |
| [BOT] Cool Drive - Seguimiento automático | Cada 4 h | 26 | 212 | ~8,2 |
| [BOT] Marcelo - Instagram | Webhook GHL | 207 | 1.419 | ~6,9 |
| [BOT] Marcelo - Seguimiento (ventana 24h) | Cada 2 h | 21 | 61 | ~2,9 |
| [BOT] Marcelo - Apertura por comentario IG | Webhook GHL | 10 | 30 | ~3,0 |
| **Total (≈2 semanas de piloto)** | | **591** | **4.651** | |

**Flujo del bot principal (idéntico en ambos clientes):**

1. Webhook desde GHL con el mensaje entrante.
2. Data Store de Make como memoria del lead (turnos, resumen, estado, datos capturados, pausado, contador de follow-ups).
3. Debounce de 45 s (`Sleep`) + verificación "¿sigo siendo el último mensaje?" para agrupar tandas.
4. HTTP a la API de GHL: tags del contacto (bot-off / alumno), buscar conversación, traer últimos 10 mensajes.
5. HTTP crudo a `api.anthropic.com` — Claude Sonnet 5 con system prompt de ~10-12k tokens (cacheado 1 h) y salida JSON con schema (mensajes, resumen, estado, temperatura, acción, datos).
6. HTTP a GHL para enviar la respuesta por el canal correcto (WhatsApp/IG/FB).
7. Guardar memoria actualizada en el Data Store.
8. Router: mover la oportunidad en el pipeline + tagear `bot-off`/`atencion-humana` cuando escala.

Los seguimientos son escenarios con scheduler que barren el Data Store cada 2-4 h.

### Problemas concretos detectados en la implementación actual

1. **Tope de 1.000 registros en Data Stores (plan Core).** La licencia actual tiene `dslimit: 1000`. La memoria de leads nunca se purga: cada lead nuevo es un registro. Entre `cooldrive_memoria` y las memorias de Marce, el sistema **deja de guardar memoria al llegar a 1.000 leads acumulados**. Es un techo duro e invisible: el bot seguiría respondiendo pero con amnesia.
2. **Credenciales hardcodeadas en texto plano.** El token PIT de GHL y la API key de Anthropic están pegados dentro de los módulos HTTP de cada escenario. Replicar para un cliente nuevo = clonar escenario y re-pegar llaves a mano; cualquier export de blueprint las expone. (Recomendado: rotar la key de Anthropic y moverla a un almacén de credenciales, en Make o en n8n.)
3. **Ya hay 4 ejecuciones en la Dead Letter Queue y 31 errores acumulados** entre los dos escenarios principales. El manejo de errores es cadena de `Resume`/`Ignore`, que silencia fallos en vez de reintentarlos.
4. **El plan Core da 10.000 ops/mes.** El piloto (2 clientes, volumen bajo) ya corre a un ritmo de ~9-12.000 ops/mes. Con el tercer cliente o con más volumen de anuncios, se acaba el plan.
5. **Replicar = clonar todo.** Cada cliente nuevo son 2-3 escenarios clonados, 1 data store nuevo, webhooks nuevos, llaves re-pegadas y el prompt embebido en un módulo HTTP. No hay una sola fuente de verdad: hoy el prompt de Cool Drive vive dentro del JSON de un módulo.

---

## 2. ¿Se puede hacer en n8n?

**Sí, 1:1 y sin perder nada.** Todo lo que usan los escenarios es genérico: webhooks, HTTP, JSON, estado y un cron. Nada depende de módulos exclusivos de Make:

| Pieza en Make | Equivalente en n8n |
|---|---|
| CustomWebHook (gateway) | Webhook node (respuesta inmediata + procesamiento) |
| Data Store | Postgres/Supabase (ya tienen Supabase en el proyecto Cerebro) |
| Sleep 45 s + "¿sigo siendo el último?" | Wait node (se persiste en DB, no consume worker) + misma verificación |
| 4-6 módulos HTTP a GHL | HTTP Request nodes, con el token en Credentials |
| HTTP crudo a Anthropic | Nodo nativo de Anthropic (o HTTP igual); mismo prompt, mismo schema JSON |
| ParseJSON + cadenas Ignore/Resume | Un Code node (JavaScript) con try/catch real |
| Router + filtros | IF/Switch nodes |
| Scheduler de seguimiento | Schedule Trigger + un query a Postgres |
| DLQ | Error Workflow global (avisa por WhatsApp/Slack cuando algo falla) |

La calidad del bot ("BOT top") **no vive en Make ni en n8n: vive en el prompt y en el modelo**. Eso migra copiado y pegado. Lo que cambia es la plomería.

---

## 3. ¿Serían mejores?

Como bot conversacional, igual de buenos (mismo prompt, mismo Claude). Como **sistema**, sí, mejores en lo que pediste — escalable y replicable — por cinco razones:

1. **Multi-tenant real.** En n8n el diseño correcto es UN solo workflow que atiende a TODOS los clientes: el webhook llega con `locationId`, se busca la configuración del cliente en una tabla (`clientes`: locationId, token GHL, prompt, pipeline IDs, precios/promos). **Sumar un cliente nuevo = insertar una fila, no clonar escenarios.** Esto es imposible de hacer limpio en Make con Data Stores de 1.000 registros.
2. **Memoria sin techo y consultable.** Postgres/Supabase en vez de Data Store: sin límite de 1.000 registros, con SQL para dashboards (leads calientes por cliente, tasa de escalado a humano, etc.) — se conecta directo con el Cerebro Villano que ya está en el repo.
3. **Prompts fuera del flujo.** El system prompt de cada cliente vive en la tabla de configuración (o en este repo, versionado en git), no embebido en un módulo HTTP. Editar la promo de septiembre = editar un campo, no abrir el escenario.
4. **Workflows versionables.** n8n exporta/importa JSON: la plantilla del bot vive en `plantilla-cliente/` en git, con historial, review y rollback. Make tiene blueprints pero con las llaves adentro y sin flujo git natural.
5. **Manejo de errores de verdad.** Retries por nodo, Error Workflow global que avisa cuando un mensaje no salió (hoy los `Ignore` se tragan errores: un lead puede quedar sin respuesta y nadie se entera).

**Lo honesto — dónde Make es mejor hoy:**

- Make es SaaS administrado: cero mantenimiento. n8n barato implica self-hosting: actualizaciones, backups y uptime son responsabilidad tuya. **Un VPS caído = bots mudos y leads sin responder.** Se mitiga con un host administrado (Railway, Elest.io, ~USD 10-20/mes) o n8n Cloud.
- La depuración visual de Make (ver cada burbuja con sus datos) es un poco más cómoda que el visor de ejecuciones de n8n, aunque la diferencia es menor.
- Migrar cuesta: ~1-2 semanas de reconstrucción + corrida en paralelo antes de apagar Make.

---

## 4. ¿Más baratos?

La estructura de precios es la diferencia clave: **Make cobra por operación (cada módulo ejecutado ≈ 9 ops por mensaje); n8n cobra por ejecución (1 mensaje = 1 ejecución, da igual cuántos nodos)**, y self-hosted no cobra nada.

Proyección con un escenario realista de crecimiento — 5 clientes, ~30 conversaciones/día por cliente, ~4 turnos por conversación (≈18.000 mensajes/mes):

| Concepto | Make | n8n Cloud | n8n self-hosted |
|---|---|---|---|
| Unidad de cobro | ~162.000 ops/mes | ~20.000 ejecuciones/mes | ilimitado |
| Costo plataforma | ~USD 60-100+/mes (tiers de ops, crece lineal) | ~EUR 60+/mes | **~USD 5-20/mes (VPS o Railway), plano** |
| Con 10 clientes | ~USD 150-200+/mes | ~EUR 120+/mes | **igual: ~USD 5-20/mes** |
| Claude API | igual en los tres (es el costo real por conversación y no depende de la plataforma) | | |

- **Al volumen actual del piloto, Make es más barato** (~USD 10/mes vs. el esfuerzo de montar n8n). No hay urgencia económica *hoy*.
- **Desde el cliente 3-4 en adelante, n8n self-hosted gana por paliza** y el costo deja de crecer con el volumen. Es la única de las tres opciones donde escalar clientes no escala el costo de plataforma.
- n8n **Cloud** no es más barato que Make a este volumen; el ahorro está en self-hostear (o host administrado barato).
- Los precios de planes son aproximados a la fecha; verificar antes de contratar.

---

## 5. Arquitectura objetivo propuesta en n8n

```
                        ┌─────────────────────────────────────────┐
GHL (todos los clientes)│  WF 1: BOT (un solo workflow)           │
  webhook ──────────────►  1. Webhook (llega locationId)          │
                        │  2. Lookup cliente en Supabase          │
                        │     (token, prompt, pipeline, promos)   │
                        │  3. Debounce (Wait 45s + último gana)   │
                        │  4. GHL: tags + conversación            │
                        │  5. Claude (prompt del cliente, schema) │
                        │  6. GHL: enviar respuesta               │
                        │  7. Supabase: guardar memoria           │
                        │  8. Pipeline / escalar a humano         │
                        └─────────────────────────────────────────┘
                        ┌─────────────────────────────────────────┐
   Cron cada 2h ────────►  WF 2: SEGUIMIENTOS (un solo workflow)  │
                        │  SQL: leads pendientes de TODOS los     │
                        │  clientes → mismo cerebro → enviar      │
                        └─────────────────────────────────────────┘
                        ┌─────────────────────────────────────────┐
                        │  WF 3: ERROR HANDLER global             │
                        │  cualquier fallo → aviso por WhatsApp   │
                        └─────────────────────────────────────────┘

Tablas Supabase: clientes (config + prompt) · leads_memoria · followups_log
```

Onboarding de un cliente nuevo: fila en `clientes` + webhook en su subcuenta GHL apuntando a la misma URL. Nada más.

## 6. Recomendación y plan

**Veredicto: sí migrar, pero a n8n self-hosted (o Railway/Elest.io) con diseño multi-tenant — no una copia 1:1 de los escenarios.** Copiar los 5 escenarios tal cual a n8n daría el mismo sistema difícil de replicar, solo que más barato. El valor está en rediseñar a plantilla única.

**Cuándo:** antes de firmar el cliente 3, o antes de subir presupuesto de anuncios (lo que llegue primero). El tope de 1.000 registros de memoria y el de 10.000 ops/mes se alcanzan pronto y el primero falla en silencio.

**Plan (1-2 semanas):**
1. Montar n8n (Docker en VPS o Railway) + proyecto Supabase con las 3 tablas.
2. Construir WF 1 multi-tenant y cargar Cool Drive como primer cliente (prompt copiado tal cual).
3. Corrida en paralelo 3-5 días: GHL manda el webhook a ambos, n8n en modo "sombra" (loguea sin enviar) hasta validar respuestas.
4. Switch de Cool Drive, luego Marce. Construir WF 2 (seguimientos) y WF 3 (errores).
5. Apagar escenarios de Make, exportar blueprints como respaldo a este repo, bajar el plan.
6. Higiene de seguridad: rotar la API key de Anthropic y el token PIT de GHL, y guardarlos solo en Credentials de n8n.

**Mientras tanto (hoy mismo, en Make):** purgar registros viejos del Data Store o subir el plan, para no chocar con el tope de 1.000 leads en plena campaña.
