# 05 · Setup en GoHighLevel

> GHL es el buzón y el CRM. Make es el cerebro. Este documento es todo lo que hay
> que crear en la sub-cuenta de Marcelo **antes** de importar los escenarios.

---

## 1. Requisitos previos

| Requisito | Cómo se verifica |
|---|---|
| Sub-cuenta (Location) de Marcelo en GHL | Settings → Business Profile → copiar el **Location ID** |
| Instagram conectado | Settings → Integrations → Facebook/Instagram → la cuenta @dachshundsalud aparece conectada |
| WhatsApp conectado | Settings → WhatsApp → número verificado y activo |
| Private Integration token | Settings → Private Integrations → **Create new** |

### Scopes del Private Integration token

Marcar exactamente estos, ni más ni menos:

- `conversations.readonly` · `conversations.write`
- `conversations/message.readonly` · `conversations/message.write`
- `contacts.readonly` · `contacts.write`
- `opportunities.readonly` · `opportunities.write`
- `locations/customFields.readonly`

> El token se guarda **solo** en el vault de Make (o en una variable de equipo).
> Nunca en este repo, nunca en un mensaje, nunca en una captura de pantalla.

---

## 2. Custom fields a crear

Settings → Custom Fields → carpeta nueva **`Setter Bot`**.

| Nombre | Key | Tipo |
|---|---|---|
| Nombre del perro | `setter_nombre_perro` | Text |
| Edad del perro | `setter_edad_perro` | Text |
| Síntoma principal | `setter_sintoma` | Text |
| Hace cuánto | `setter_hace_cuanto` | Text |
| Qué come hoy | `setter_come_hoy` | Text |
| Qué ya intentó | `setter_ya_intento` | Large text |
| País | `setter_pais` | Text |
| Temperatura | `setter_temperatura` | Dropdown: gold / silver / bronze / out |
| Estado del setter | `setter_estado` | Dropdown: los 10 estados de `02-Arquitectura-Make.md` §6 |
| Datos completos | `setter_datos_completos` | Checkbox |
| Nota para Marcelo | `setter_nota` | Large text |

---

## 3. Tags

| Tag | Cuándo lo pone Make |
|---|---|
| `setter-activo` | Primer mensaje procesado |
| `setter-calificado` | Los 5 datos completos |
| `setter-consulta-ofrecida` | Se mandó el link de pago |
| `consulta-pagada` | Pago confirmado (lo pone GHL) |
| `consulta-agendada` | Cita creada (lo pone GHL) |
| `setter-nurture-pack` | Ruta Pack |
| `setter-derivado-clinico` | Ruta clínica |
| `setter-handoff` | Marcelo tomó la conversación |
| `setter-frio` | 4 seguimientos sin respuesta |
| `setter-pausado` | **Freno de mano manual**: poniendo este tag a mano, el bot deja de responderle a ese contacto |

---

## 4. Pipeline `Consultas Dachshund`

| Etapa | Entra cuando |
|---|---|
| 1. DM entrante | Primer mensaje |
| 2. Calificando | El bot empezó a pedir los 5 datos |
| 3. Calificado | Los 5 datos completos |
| 4. Consulta ofrecida | Se mandó el link de pago |
| 5. Consulta pagada | Pago confirmado |
| 6. Consulta agendada | Cita en calendario |
| 7. Consulta realizada | Marcelo la marca |
| 8. Acompañamiento vendido | Cierre de los $497 |
| — Perdido | Frío, derivado o nurture |

Este pipeline es el que alimenta la tabla `ht_pipeline` de Supabase para el panel
Cerebro (`cerebro/docs/make-automations.md` §4, `cliente = marcelo`). Al armarlo,
respetar los nombres de etapa porque el escenario de métricas cuenta por stage.

---

## 5. Workflow A · `Setter → Make` (el que dispara todo)

**Trigger:** `Customer Replied`
- Filtro de canal: Instagram DM **y** WhatsApp
- ⚠️ No usar `Inbound Message` a secas: dispara también con mensajes del sistema.

**Acciones:**
1. **Wait** 15 segundos, con "solo continuar con la última ejecución"
   (esto agrupa los 3 mensajes seguidos que manda la gente en un solo disparo)
2. **If/Else:** si el contacto tiene el tag `setter-pausado` o `setter-handoff` → **Stop**
3. **Webhook** `POST` a la URL del Escenario 1 de Make, con este body:

```json
{
  "contactId":      "{{contact.id}}",
  "conversationId": "{{conversation.id}}",
  "locationId":     "{{location.id}}",
  "canal":          "{{message.type}}",
  "direccion":      "inbound",
  "mensaje":        "{{message.body}}",
  "nombre":         "{{contact.first_name}}",
  "telefono":       "{{contact.phone}}",
  "email":          "{{contact.email}}",
  "instagram":      "{{contact.instagram}}",
  "fuente":         "{{contact.source}}"
}
```

> Verificar los merge fields exactos en el editor de Workflows de GHL antes de
> guardar: cambian según versión de la cuenta. Los que no existan, sacarlos del
> body en vez de dejarlos vacíos.

---

## 6. Workflow B · `Freno de mano`

**Trigger:** `Outbound message` enviado manualmente desde el inbox por un usuario
humano (no por workflow).

**Acciones:**
1. Agregar tag `setter-handoff`
2. Webhook a un segundo endpoint de Make (o al mismo, con `direccion: "pausa"`)
   para poner `pausado = true` en el data store

Para devolverle la conversación al bot: quitar el tag `setter-handoff` a mano.

---

## 7. Workflow C · `Consulta pagada`

**Trigger:** `Order Submitted` / `Payment Received` del producto **Consulta de
Evaluación Dachshund**.

**Acciones:**
1. Tag `consulta-pagada`, quitar `setter-consulta-ofrecida`
2. Mover la oportunidad a la etapa 5
3. Mandar el mensaje post-pago (`04-Guion-...md` §6) con el link de agenda
4. Notificar a Marcelo
5. Webhook a Make para poner `estado = pagado` en el data store (así el
   Escenario 2 deja de mandarle seguimientos)

> Este workflow vive en GHL a propósito y no en Make: GHL ya sabe hacerlo nativo
> y así el plan Free de Make se ahorra un escenario y las operaciones.

---

## 8. Workflow D · `Recordatorios de la consulta`

**Trigger:** `Appointment Booked` en el calendario de la consulta.
- 24 h antes: recordatorio + repetir los 3 datos que tiene que mandar
- 1 h antes: recordatorio con el link del Meet
- No-show: mensaje de reagendar (una sola vez)

---

## 9. Producto y calendario

**Producto:** Payments → Products → **Consulta de Evaluación Dachshund**
- Precio: `[PRECIO_CONSULTA]` `[CONFIRMAR MARCELO]`
- Pago único
- Después del pago, redirigir al calendario
- Pasarela: `[DECIDIR]` Stripe cubre casi todo LATAM salvo Argentina; para
  Argentina y México puede convenir MercadoPago como alternativa.

**Calendario:** Calendars → **Consulta de Evaluación**
- Duración 60 min, buffer 15 min
- Disponibilidad **15:00-19:00 hora de Chile, lunes a viernes** (el horario real
  de Marcelo según el KB interno)
- Zona horaria: America/Santiago, con conversión automática para el lead
- Máximo 3 consultas por día (para que no se coma la agenda de acompañamientos)
- Google Meet automático

---

## 10. Orden de encendido

1. Custom fields, tags y pipeline
2. Producto + calendario + link de pago
3. Private Integration token
4. Importar los escenarios de Make y pegar token, links y prompt
5. Data store `setter_marcelo`
6. Workflow A apuntando al webhook de Make
7. Probar en modo sombra (ver `06-Checklist-y-Pruebas.md`)
8. Workflows B, C y D
9. Encender
