# Oferta High-Ticket — Dachshund Salud

> **Qué es:** documentación completa de la oferta de acompañamiento 1:1: productos, reglas, landings, flow de venta, calificación y manejo de objeciones.
> **Regla madre:** NUNCA aparece en contenido orgánico. Solo ads, retargeting y upsell a compradores del Pack.
> **Modelo full high-ticket:** este es el producto principal y motor de ingresos del ecosistema.
> **Última actualización:** Julio 2026

---

## 1. Productos

| Programa | Precio | Público | Canal |
|---|---|---|---|
| **Acompañamiento 3 meses** | $497 USD | **Oferta principal** — tráfico frío externo | Ads / Landing #1 |
| **Acompañamiento 6 meses** | Personalizado | Compradores del Pack / clientes previos | Landing #2 / upsell |

**Qué incluye el acompañamiento (base para copy):**
- Evaluación inicial personalizada del caso (60 min)
- Protocolo nutricional individualizado para el perro específico
- Seguimiento por WhatsApp con Marcelo
- Ajustes según evolución (controles 30–45 min)

**Límites éticos (obligatorios en copy y venta):**
- Marcelo NO trata casos neurológicos, ortopédicos, traumatológicos ni oncológicos → deriva a clínico
- NUNCA prometer recuperación 100% antes de 90 días
- Disclaimer: cada caso se evalúa individualmente; el contenido de redes no reemplaza consulta

---

## 2. Landings

### Landing #1 — Tráfico frío
- Sin VSL, sin Calendly
- CTA directo a WhatsApp (Walink)
- Testimonios reales incorporados
- Mensaje Walink estándar: *"Hola Marcelo, vi tu página y necesito ayuda urgente con mi perro salchicha 🐾"*

### Landing #2 — Lista caliente (compradores del Pack / clientes previos)
- Walink: `https://wa.link/qxhgge`
- Tono de confianza (no venta desde el problema — ya confían)
- Ofrece 6 meses vs. los 3 del programa externo
- Topbar: **"No compartir este link"**
- `[PLACEHOLDER — actualizar copy: eliminar toda mención a membresía/descuento por membresía]`

---

## 3. Flow de venta

```
Landing → click Walink → mensaje entrante en WhatsApp
    → Marcelo responde por AUDIO (nunca llamada/Calendly)
    → Conversación de calificación (2-4 audios)
    → Presentación de precio por audio
    → Link de pago → cierre
```

**Por qué audio:** humaniza, transmite autoridad veterinaria real, no exige agendar (fricción cero), y permite a Marcelo evaluar el caso antes de dar precio.

### Guion de calificación (audios de Marcelo)

**Audio 1 — Apertura + diagnóstico:**
> "Hola [nombre], gracias por escribirme. Cuéntame: ¿cómo se llama tu salchicha, cuántos años tiene y qué es lo que más te preocupa hoy de su salud?"

**Audio 2 — Profundizar + descartar no-aptos:**
> "¿Qué está comiendo actualmente y hace cuánto está así? ¿Lo ha visto un veterinario por esto?"
> *(Si el caso es neurológico/traumatológico agudo → derivar: "Esto primero necesita evaluación clínica presencial. Cuando esté estable, la nutrición va a ser clave en su recuperación y ahí te acompaño yo.")*

**Audio 3 — Puente al programa:**
> "Mira, lo que me cuentas de [dolor específico] es exactamente lo que trabajo en mi acompañamiento. No es una consulta suelta — es un proceso donde diseño la dieta exacta para [nombre del perro] y te acompaño paso a paso hasta que veas el cambio."

**Audio 4 — Precio + cierre:**
> "El acompañamiento de 3 meses tiene un valor de $497 dólares. Incluye [entregables]. Si estás lista para empezar, te mando el link de pago y agendamos tu evaluación inicial esta misma semana."

`[PLACEHOLDER — validar guiones con script de venta que Sebastián está convirtiendo a doc]`

### Criterios de calificación

| Señal | Acción |
|---|---|
| Dolor nutricional (peso, piel, digestión, ansiedad, transición) | Avanzar a oferta |
| Caso especial (pancreatitis, Cushing, senior, cachorro) | Avanzar — avatar de máxima urgencia y disposición a pagar |
| Caso neurológico/traumatológico agudo (IVDD en crisis) | Derivar a clínico + dejar puerta abierta post-estabilización |
| Solo busca info gratis / regateo fuerte | Redirigir al Pack de eBooks como alternativa |

---

## 4. Manejo de objeciones (por audio)

| Objeción | Respuesta base |
|---|---|
| "Está caro" | "Compáralo con una sola cirugía de columna: parte en $3.000 dólares. Esto es prevención con acompañamiento real." + alternativa: Pack |
| "Mi veterinario ya me dijo qué darle" | "Tu veterinario sabe de todo. Yo solo me dedico a esto — y solo a esta raza." |
| "¿Y si mi perro no acepta el cambio?" | "Para eso existe el acompañamiento. El protocolo de transición es gradual y lo ajustamos juntos según cómo responda." |
| "Ya intenté BARF y no funcionó" | "No falló el método — faltó implementación guiada. Eso es exactamente lo que corregimos." |
| "Necesito pensarlo" | Urgencia honesta: cupos limitados de acompañamiento (Marcelo atiende personalmente) + costo de esperar para la columna del perro |

---

## 5. Retargeting (estructura de campañas)

| Audiencia | Mensaje | Destino |
|---|---|---|
| Visitó Landing #1, no clickeó Walink | Testimonio + "¿Sigue igual tu salchicha?" | Landing #1 |
| Clickeó Walink, no escribió | Recordatorio suave + prueba social | Walink directo |
| Compradores de eBooks (Paso 1/2) | "Del libro al acompañamiento: el siguiente nivel" | Landing #1 |
| Clientes previos de asesoría | Reactivación / upgrade a 6 meses | Landing #2 |

**Reglas de copy en ads (heredadas del proyecto):**
- Hook con "perro salchicha" o "salchicha" en primera línea
- CTA: "Clickea el botón de abajo si quieres…" / "Contáctame"
- Sin doble CTA, sin testimonios inventados, sin "masterclass/webinar"

---

## 6. Métricas del funnel high-ticket

| Métrica | Dónde se mide |
|---|---|
| Clicks Walink | Webhook GHL click tracking |
| Conversaciones iniciadas | WhatsApp (manual/Miro) |
| Tasa conversación → venta | Registro manual (Sebastián) |
| CAC por programa | Meta Ads Manager |
| Pendiente | CAPI server-side desde GHL (pixel match 6.1/10) |
