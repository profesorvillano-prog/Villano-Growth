# Bots setter (GHL + Claude): arquitectura, coste real y cómo cobrarlos

> Playbook interno de Villano Growth para los bots de WhatsApp/Instagram.
> Aplica a **Cool Drive Maipú** (Sebastián) y **Dachshund Salud** (Marcelo), y a
> cualquier cliente que venga después.
>
> Pregunta que origina este documento: *"el gasto de Make se va a disparar,
> ¿cómo lo hago más económico y cómo le cobro al cliente por el uso del bot?"*

---

## 0. Resumen ejecutivo (si solo lees esto)

1. **Make no debe tocar el tráfico por mensaje.** Make cobra por *operación* y un
   bot conversacional es justamente un multiplicador de operaciones. Con la
   arquitectura ingenua, **cada mensaje del lead cuesta ~9–12 operaciones**;
   dos clientes con anuncios activos se comen ~90.000 ops/mes ≈ **US$ 90–100/mes
   solo de Make**.
2. **Tampoco uses el "Custom Webhook" de GHL en el camino del mensaje.** Es una
   *premium action*: **US$ 0,01 por ejecución**. 400 conversaciones × 12 mensajes
   = 4.800 ejecuciones = **US$ 48/mes por cliente**. Más caro que Make bien hecho.
3. **La arquitectura barata existe y es sencilla:** GHL dispara el **Webhook
   clásico (gratis, fire-and-forget)** → una **Supabase Edge Function** llama a
   Claude → la función responde escribiendo por la **API de GHL** (gratis).
   **Coste de infraestructura por mensaje: US$ 0.** Lo único que pagas son los
   tokens de Claude.
4. **Con prompt caching, un bot cuesta ~US$ 0,08 por conversación completa**
   (Sonnet 5) o **~US$ 0,04** (Haiku 4.5). Un cliente con 400–500 conversaciones
   al mes = **US$ 30–40/mes de coste real**.
5. **Cobra fijo con cupo:** US$ 180/mes con 500 conversaciones incluidas y
   US$ 0,30 por conversación extra. Margen ~75 % y factura previsible para el
   cliente. Con un tope de gasto duro en Supabase, el precio fijo no te puede
   explotar.

---

## 1. Diagnóstico: por qué Make se dispara

En Make **cada módulo que se ejecuta = 1 operación por bundle**. Los routers y
filtros son gratis, pero todo lo que va después del filtro cuenta. El escenario
típico de bot que se arma "a lo natural" es este:

| # | Módulo | Ops |
|---|---|---|
| 1 | Webhook (mensaje entrante) | 1 |
| 2 | GHL → Get contact | 1 |
| 3 | Data store → Get record (historial) | 1 |
| 4 | HTTP → Claude API | 1 |
| 5 | JSON → Parse | 1 |
| 6 | Data store → Update record | 1 |
| 7 | GHL → Send message | 1 |
| 8 | GHL → Update contact / tags | 1 |
| 9 | GHL → Update opportunity (etapa) | 1 |
| | **Total por mensaje entrante** | **~9** |

Y eso *antes* del patrón de "esperar a que el lead termine de escribir"
(sleep + segundo escenario), que suma 3–4 ops más → **~12 ops por mensaje**.

### La cuenta que asusta

| Escenario | Conversaciones/mes | Mensajes (×12) | Ops (×12) | Coste Make |
|---|---|---|---|---|
| Cool Drive con anuncios | 400 | 4.800 | 57.600 | ~US$ 62 |
| Marcelo (high ticket) | 250 | 3.000 | 36.000 | ~US$ 40 |
| **Los dos juntos** | 650 | 7.800 | **93.600** | **~US$ 100/mes** |

Referencia de precio: Core cuesta ~US$ 16/mes por 10.000 créditos (US$ 12 con
pago anual) y **los packs extra cuestan ~US$ 9 por cada 10.000**. Es decir,
Make sale a **~US$ 0,90–1,60 por cada 1.000 operaciones**. En un bot, esa unidad
se consume a razón de 12 ops por mensaje: es el peor caso de uso posible para
un pricing por operación.

> Y ojo: los packs extra se facturan **25 % más caros** que los créditos
> incluidos en el plan (cambio de noviembre 2025). El sobreconsumo se castiga.

### El otro coste escondido: las premium actions de GHL

GoHighLevel separa las acciones de workflow en dos grupos:

| Acción | ¿Cuesta? |
|---|---|
| **Webhook** (el clásico, dispara y olvida) | **Gratis** ✅ |
| **Custom Webhook** (espera y mapea la respuesta) | **US$ 0,01 / ejecución** |
| **Inbound Webhook** (trigger externo) | US$ 0,01 / ejecución |
| Custom Code, Google Sheets, Slack, formatters | US$ 0,01 / ejecución |
| Enviar SMS/WhatsApp/email, tags, etapas, Wait, condiciones | Gratis ✅ |
| **Llamadas a la API v2 de GHL desde fuera** | **Gratis** ✅ |

Cada sub-cuenta trae **100 ejecuciones premium gratis** y después se descuenta
del wallet de la agencia. Un bot que usa Custom Webhook en cada mensaje:
4.800 mensajes × US$ 0,01 = **US$ 48/mes por cliente**. Es la trampa más común
al montar "GHL + Claude": parece elegante porque te devuelve la respuesta al
workflow, y es lo más caro del stack.

---

## 2. La regla de oro

> **El camino del mensaje (por cada mensaje del lead) tiene que costar US$ 0 de
> infraestructura. Make y las premium actions se reservan para lo que ocurre
> pocas veces al día, no para lo que ocurre cientos de veces.**

Traducido:

- Lo que pasa **por mensaje** → GHL webhook gratis + función propia + API de GHL.
- Lo que pasa **1 vez al día o 3 veces por semana** (dashboards, sincronizaciones,
  reportes, Meta Ads → Supabase) → **ahí sí Make**, y con el plan Core alcanza.

---

## 3. Arquitectura recomendada (Plan A)

```
WhatsApp / IG DM
      │
      ▼
┌─────────────────────────────────────────────┐
│ CAPA 1 — GoHighLevel  (gratis, ilimitado)   │
│  Trigger: Customer Replied / Message In     │
│  Filtros: solo inbound, bot no pausado,     │
│           sin tag "humano", horario, etc.   │
│  Acción: Webhook clásico (NO Custom) ──────┼──┐
│  Recibe la respuesta ya escrita por la API  │  │
└─────────────────────────────────────────────┘  │
                                                 ▼
┌─────────────────────────────────────────────────────────┐
│ CAPA 2 — Supabase Edge Function `setter-bot`  (~US$ 0)  │
│  1. Debounce 7 s (buffer en tabla `bot_buffer`)         │
│  2. Carga KB del cliente por slug (tabla `bot_kb`)      │
│  3. Trae historial: GET /conversations/{id}/messages    │
│  4. Claude API (Sonnet 5, effort low, prompt caching)   │
│  5. Devuelve JSON: {respuesta, tags, etapa, escalar}    │
│  6. Escribe en GHL por API: mensaje + tags + etapa      │
│  7. Loguea tokens y coste en `bot_usage`  ◄── FACTURACIÓN│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CAPA 3 — Make  (Core, ~US$ 12–16/mes total) │
│  Meta Ads → campaign_metrics   (1×/día)     │
│  Instagram → organic_content   (3×/semana)  │
│  GHL pipeline → ht_pipeline    (3×/semana)  │
│  Ventas (webhook Hotmart/GHL)               │
│  ➜ NADA del tráfico por mensaje             │
└─────────────────────────────────────────────┘
```

### Por qué Supabase y no otra cosa

Ya tienes el proyecto **Villano OS** en Supabase alimentando el Cerebro. Las Edge
Functions entran en el mismo proyecto, comparten la base, y el free tier cubre
holgadamente el volumen de dos bots. Además — y esto es lo importante para
cobrar — **la tabla `bot_usage` te da la métrica de consumo por cliente**, que es
exactamente lo que necesitas para facturar y para mostrarlo en el panel.

Alternativas equivalentes si prefieres: Cloudflare Workers (100k req/día
gratis) o una función en Vercel. La lógica no cambia.

### Tablas nuevas en Supabase

```sql
-- Base de conocimiento del bot, versionada por cliente
create table bot_kb (
  cliente      text not null,          -- 'cool-drive' | 'marcelo'
  version      int  not null default 1,
  system_prompt text not null,          -- el prompt completo, ~10k tokens
  activo       boolean default true,
  updated_at   timestamptz default now(),
  primary key (cliente, version)
);

-- Consumo por conversación → esto es lo que factura
create table bot_usage (
  id                  bigserial primary key,
  cliente             text not null,
  contact_id          text not null,
  conversation_id     text,
  fecha               date not null default (now() at time zone 'America/Santiago'),
  modelo              text not null,
  input_tokens        int  not null,
  cache_write_tokens  int  not null default 0,
  cache_read_tokens   int  not null default 0,
  output_tokens       int  not null,
  coste_usd           numeric(10,6) not null,
  escalado_humano     boolean default false
);
create index on bot_usage (cliente, fecha);

-- Tope de gasto por cliente (el seguro del precio fijo)
create table bot_budget (
  cliente         text primary key,
  tope_usd_mes    numeric(10,2) not null,
  conv_incluidas  int not null,
  alerta_al_pct   int not null default 80
);

-- Buffer del debounce
create table bot_buffer (
  contact_id  text primary key,
  cliente     text not null,
  mensajes    text[] not null,
  updated_at  timestamptz default now()
);
```

---

## 4. Coste real de Claude (los números)

### Precios API (por millón de tokens)

| Modelo | Entrada | Salida | Escritura de caché (1 h) | Lectura de caché |
|---|---|---|---|---|
| Claude Haiku 4.5 | US$ 1 | US$ 5 | US$ 2 | US$ 0,10 |
| **Claude Sonnet 5** | **US$ 2** | **US$ 10** | **US$ 4** | **US$ 0,20** |
| Claude Opus 5 | US$ 5 | US$ 25 | US$ 10 | US$ 0,50 |

La lectura de caché cuesta **el 10 %** de la entrada normal. Ahí está todo el
ahorro.

### El prompt caching es la palanca #1

El system prompt del bot (identidad + reglas + FAQ + avatares) pesa ~10.000
tokens y **es idéntico en todas las conversaciones del mismo cliente**. Con
`cache_control` y TTL de 1 hora:

- Se escribe **una vez por hora activa**, no una vez por conversación.
- Cuantas más conversaciones simultáneas, más barato sale cada una.

**Comparación por cada 1.000 conversaciones** (12 mensajes por conversación,
system de 10k tokens, historial medio 800 tokens/turno, respuesta 150 tokens):

| | Sin caché | Con caché 1 h | Ahorro |
|---|---|---|---|
| Sonnet 5 | US$ 277 | **US$ 77** | **−72 %** |
| Haiku 4.5 | US$ 138 | **US$ 39** | −72 % |
| Opus 5 | US$ 692 | US$ 193 | −72 % |

### Coste por conversación (con caché)

| Modelo | US$/conversación | 250 conv/mes | 500 conv/mes | 1.000 conv/mes |
|---|---|---|---|---|
| Haiku 4.5 | **0,039** | US$ 10 | US$ 20 | US$ 39 |
| **Sonnet 5** | **0,077** | US$ 19 | US$ 39 | US$ 77 |
| Opus 5 | 0,193 | US$ 48 | US$ 97 | US$ 193 |

### Qué modelo usar

**Empieza con Sonnet 5 con `effort: "low"`.** Razones:

- Un setter tiene prohibiciones duras (no inventar promos, no garantizar la
  aprobación del examen, no confirmar cupos). Sonnet las respeta con fiabilidad;
  Haiku se sale del guion con más frecuencia cuando el lead insiste.
- La conversación y la clasificación **no se benefician de effort alto**. `low`
  baja tokens y latencia sin perder calidad en este tipo de tarea.
- Un solo modelo = **una sola caché**. Montar un cascade Haiku→Sonnet parece
  ahorrador pero rompe el reuso de caché (la caché es por modelo) y suele salir
  más caro en total.

Después de 2–3 semanas con datos reales en `bot_usage`, prueba Haiku 4.5 en la
ruta de FAQ pura (ubicación, precio, horarios) y mide. Si aguanta, ahí bajas a
la mitad. **Mide antes de bajar, no al revés.**

### Las otras cuatro palancas de tokens

1. **KB curada, no volcada.** La carpeta de Marcelo tiene 120 KB de docs (~33.000
   tokens). El bot **no necesita eso**: necesita un `Bot-KB.md` de ~10–12k tokens
   destilado de la doc madre + FAQ + objeciones. Meter la carpeta entera triplica
   el coste de entrada de cada turno, para siempre. Cool Drive ya está bien
   dimensionado (~31 KB ≈ 8k tokens).
2. **`max_tokens: 300`.** Los mensajes de WhatsApp son cortos por diseño (el
   propio `Bot-WhatsApp.md` lo exige). Es un techo duro sobre el coste de salida.
3. **Historial recortado a los últimos 10 turnos.** El resto que lo resuma el
   propio bot en un campo del contacto de GHL.
4. **Filtra en GHL, no en la función.** Todo mensaje que no debe llegar al bot
   (respuesta de un humano, alumno ya inscrito, "STOP", fuera de horario) se
   descarta en el workflow de GHL, que es gratis. Cada filtro que pones en la
   capa 1 es un turno de Claude que no pagas.

### El seguro: tope de gasto duro

En la Edge Function, antes de llamar a Claude:

```
gasto_mes = SUM(coste_usd) FROM bot_usage WHERE cliente = X AND fecha en el mes
si gasto_mes > bot_budget.tope_usd_mes:
    → no llamar a Claude
    → responder con el mensaje puente ("Eso te lo confirma Sebastián altiro 👍")
    → notificar a Villano Growth
```

Esto es lo que hace **seguro vender un precio fijo**: el peor mes posible tiene
un techo conocido.

---

## 5. Plan B — si te quieres quedar en Make

Si por ahora no quieres montar la Edge Function, Make se puede bajar de ~12 ops
a **3 ops por mensaje** (−75 %):

| Cambio | Ahorro |
|---|---|
| **Payload rico desde GHL**: manda nombre, tags, campos personalizados y el mensaje en el propio webhook → elimina `Get contact` | −1 op |
| **Historial por API dentro del mismo módulo HTTP** o guardado en un campo personalizado de GHL → elimina los 2 módulos de Data store | −2 ops |
| **Una sola llamada a Claude que devuelve JSON estructurado** con respuesta + tags + etapa → elimina el módulo de parseo separado | −1 op |
| **Escribir en GHL desde un solo módulo HTTP** (o devolver el JSON al workflow y que GHL haga tags/etapa con acciones gratis) | −2 ops |
| **Debounce en el workflow de GHL** (acción Wait, gratis) en vez de sleep + segundo escenario en Make | −3 ops |
| **Cero triggers por polling.** Un escenario programado cada 15 min gasta 2.880 ops/mes aunque no pase nada | según caso |

Resultado: **webhook (1) + HTTP a Claude (1) + HTTP a GHL (1) = 3 ops/mensaje**.

| | Ingenuo (12 ops) | Optimizado (3 ops) |
|---|---|---|
| 650 conv/mes (7.800 msg) | 93.600 ops → **~US$ 100** | 23.400 ops → **~US$ 34** |

Sigue siendo peor que el Plan A (US$ 0), pero es asumible y se monta en una tarde.

---

## 6. Coste total por cliente (Plan A)

Cliente con **400 conversaciones/mes**, Sonnet 5:

| Concepto | Coste |
|---|---|
| Claude API | US$ 31 |
| Supabase Edge Functions | US$ 0 (free tier) |
| GHL — webhook clásico + API | US$ 0 |
| Make (prorrateado, solo dashboards) | US$ 8 |
| WhatsApp (respuestas dentro de la ventana de 24 h) | US$ 0 |
| **Coste marginal real** | **≈ US$ 39/mes** |

> **WhatsApp:** desde noviembre 2024 las conversaciones de *servicio* (las que
> abre el propio lead y se responden dentro de las 24 h) no se cobran. Solo pagas
> plantillas de *marketing/utility* — es decir, la recaptación de los "no ahora",
> que se factura aparte como campaña. Verifica la tarifa de Chile con tu
> proveedor antes de prometer números al cliente.

---

## 7. Cómo cobrarles a Marcelo y a Sebastián

### El principio

No vendas "un bot". Vendes **un setter que trabaja 24/7 y no falta los domingos**.
El ancla no es tu coste, es **lo que cuesta el humano al que reemplaza o
complementa**: un setter part-time en Chile o Argentina son US$ 400–700/mes.

### Tres modelos

| | A — Fijo con cupo ⭐ | B — Setup + variable | C — Por resultado |
|---|---|---|---|
| **Setup** | US$ 590 | US$ 890 | US$ 390 |
| **Mensual** | US$ 180 (500 conv incl.) | US$ 79 base | US$ 99 base |
| **Extra** | US$ 0,30 / conv adicional | US$ 0,35 / conv | US$ 12 / lead calificado agendado |
| **Tu coste a 400 conv** | US$ 39 | US$ 39 | US$ 39 |
| **Margen** | ~78 % | variable | variable |
| **Ventaja** | Factura previsible para ambos | Entrada barata, escala sola | Alineado con su resultado |
| **Riesgo** | Ninguno si pones el tope duro | El cliente vigila el contador | Discutir qué cuenta como "calificado" |

### Recomendación: **A para los dos**, con matices

**Sebastián / Cool Drive** — volumen y precio, curso a $140.000 CLP.
- Setup US$ 590 + **US$ 180/mes** (≈ $170.000 CLP) con 500 conversaciones.
- El argumento de venta: *"una sola inscripción extra al mes ya paga el bot"*.
  Con la tasa de cierre por WhatsApp que ya tiene, contestar en 30 segundos a las
  3 de la mañana en vez de a las 10 del día siguiente vale mucho más que eso.
- Extra natural: cobrar aparte las campañas de recaptación de verano (los "no
  ahora" etiquetados en el CRM) — ahí sí hay coste de plantillas de WhatsApp.

**Marcelo / Dachshund Salud** — high ticket, acompañamiento 1:1 a US$ 497.
- Menos volumen, más valor por conversación. Setup US$ 690 + **US$ 149/mes** con
  300 conversaciones incluidas.
- El argumento: *"una venta extra cada tres meses ya lo paga; el bot filtra a los
  N1–N2 para que solo hables tú con los N4–N5"*.
- Aquí sí conviene subir a Opus 5 en la ruta de **objeciones de precio del high
  ticket** (US$ 0,19/conv, son pocas conversaciones y valen US$ 497 cada una).
  El resto del tráfico se queda en Sonnet.

### Cláusulas que te protegen

1. **Cupo mensual explícito** en el contrato + precio del extra.
2. **Tope de gasto duro** en Supabase: al superarlo el bot escala a humano en
   lugar de seguir gastando. Se lo cuentas al cliente como una *función*
   ("nunca te va a llegar una factura sorpresa"), porque lo es.
3. **La KB es un entregable versionado.** Cambios mayores del guion (nueva oferta,
   nuevo curso) se cobran aparte o entran en una bolsa de horas.
4. **Reporte mensual desde `bot_usage`** en el panel del Cerebro: conversaciones
   atendidas, % resueltas sin humano, leads calificados, coste. Eso justifica la
   factura sin discutir y es la mejor herramienta de retención que vas a tener.

---

## 8. Plan de implementación

| Fase | Qué | Tiempo |
|---|---|---|
| **1** | Migrar Cool Drive al Plan A: Edge Function `setter-bot` + tablas + workflow de GHL con webhook clásico. Un solo cliente, un solo modelo. | 2–3 días |
| **2** | Destilar `Bot-KB.md` (≤ 12k tokens) para Cool Drive desde FAQ + Escuela-y-Servicio + Bot-WhatsApp + Avatares. Verificar en `usage.cache_read_input_tokens` que la caché pega. | 1 día |
| **3** | 2 semanas en producción midiendo `bot_usage`: coste real/conversación, % de escalado a humano, calidad de las respuestas. | 2 semanas |
| **4** | Con datos reales: cerrar el precio de Sebastián y clonar todo para Marcelo (misma función, otro slug, otra KB). | 2 días |
| **5** | Panel de consumo del bot en el Cerebro (lee `bot_usage`) → reporte mensual automático. | 2 días |
| **6** | Prueba controlada de Haiku 4.5 en la ruta FAQ. Si aguanta la calidad, el margen sube ~20 puntos. | 1 semana |

### Verificaciones que no te puedes saltar

- [ ] Confirmar en tu cuenta de GHL que el **Webhook clásico** (no Custom) sigue
      disponible en workflows y sale **gratis** en el log de premium actions.
- [ ] Confirmar que el payload del trigger *Customer Replied* trae el cuerpo del
      mensaje y el `conversationId`; si no, añadir custom data al webhook.
- [ ] Confirmar la tarifa de WhatsApp de Chile con el proveedor de Sebastián.
- [ ] Verificar que `usage.cache_read_input_tokens > 0` en las llamadas reales —
      si sale 0, algo está invalidando la caché (una fecha en el system prompt,
      el orden de las claves JSON, tools que cambian de orden).

---

## Fuentes de precios

- Make.com — planes y packs de operaciones:
  [Zapier](https://zapier.com/blog/make-com-pricing/) ·
  [Lindy](https://www.lindy.ai/blog/make-com-pricing) ·
  [Emergent](https://emergent.sh/learn/make-pricing)
- GoHighLevel — premium actions a US$ 0,01/ejecución:
  [HL Growth Partner](https://hlgrowthpartner.com/post/gohighlevel-premium-workflow-actions-costs-2026) ·
  [Marketing Nativo](https://marketingnativo.com/en/gohighlevel-premium-actions-cost/) ·
  [Docs oficiales del Custom Webhook](https://help.gohighlevel.com/support/solutions/articles/48001238167-guide-to-custom-webhook-workflow-action)
- Claude API — precios por modelo y prompt caching: https://claude.com/pricing

> Los precios de terceros cambian. Revalida esta tabla antes de firmar un
> contrato anual con un cliente.
