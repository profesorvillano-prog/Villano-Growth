# Exportar mensajes de WhatsApp desde GoHighLevel

Herramienta para descargar **todas las conversaciones de WhatsApp** de una
subcuenta (location) de GoHighLevel — por ejemplo **Cooldrive** — y dejarlas
listas para analizar preguntas típicas y montar un bot con Make.

Sirve para cualquier cliente: solo cambian el token y el `locationId`.

## Paso 1 — Crear el token en la subcuenta (Private Integration)

Los tokens de GHL son **por subcuenta**, así que esto se hace dentro de la
subcuenta de Cooldrive:

1. Entra en la subcuenta Cooldrive → **Settings** (Configuración).
2. En el menú lateral: **Private Integrations** → **Create new integration**.
3. Nombre: `Export WhatsApp` (o el que quieras).
4. Scopes (permisos) mínimos, todos de solo lectura:
   - `conversations.readonly` (View Conversations)
   - `conversations/message.readonly` (View Conversation Messages)
   - `contacts.readonly` (View Contacts)
5. Copia el token (empieza por `pit-...`). **Guárdalo en un gestor de
   contraseñas; no lo subas nunca al repo.**
6. El **Location ID** está en Settings → **Business Profile** (o en la URL de
   la subcuenta: `/location/XXXXXXXX/`).

## Paso 2 — Ejecutar la exportación

Necesitas Node 18 o superior (no hay dependencias que instalar):

```bash
cd herramientas/ghl-export-whatsapp
GHL_TOKEN=pit-xxxx GHL_LOCATION_ID=xxxx node exportar.mjs
```

Opciones útiles:

```bash
# Prueba rápida con 20 conversaciones
GHL_TOKEN=... GHL_LOCATION_ID=... node exportar.mjs --max 20

# Solo actividad desde una fecha
GHL_TOKEN=... GHL_LOCATION_ID=... node exportar.mjs --desde 2026-01-01
```

Genera una carpeta `out/` con:

| Archivo | Qué contiene |
|---------|--------------|
| `conversaciones.jsonl` | Una línea JSON por conversación: contacto, tags y todos sus mensajes en orden cronológico |
| `mensajes.csv` | Todos los mensajes en plano — se abre en Excel / Google Sheets |
| `corpus-entrantes.txt` | **Solo lo que escriben los clientes** (mensajes entrantes), una línea por mensaje — el material para detectar preguntas típicas |
| `resumen.json` | Totales de la exportación |

El script respeta el límite de la API de GHL (100 peticiones cada 10 s por
subcuenta) y reintenta solo si recibe un `429`. Con cientos de conversaciones
tarda unos minutos; déjalo correr.

> La carpeta `out/` contiene datos personales de clientes (teléfonos,
> conversaciones). Está en el `.gitignore` de esta carpeta: **no se sube al
> repo**. Trátala con el mismo cuidado que una base de datos de clientes.

## Paso 3 — Detectar las preguntas típicas

La forma más rápida: abre esta carpeta con Claude Code y pídele, por ejemplo:

> Lee `out/corpus-entrantes.txt` y agrupa los mensajes en temas. Dame:
> (1) las 15 preguntas más frecuentes con su frecuencia aproximada,
> (2) las objeciones de venta más comunes,
> (3) una respuesta modelo para cada pregunta basada en cómo respondió el
> equipo en `out/conversaciones.jsonl`.

Con eso obtienes el **FAQ real del negocio** (no el que uno imagina), que es
la base del prompt del bot.

## Paso 4 — Montar el bot con Make

Arquitectura recomendada (la que menos se rompe):

```
Cliente escribe por WhatsApp
        │
GHL Workflow  (Trigger: "Customer Replied" · canal = WhatsApp)
        │  acción: Webhook → URL de Make (envía mensaje, contactId, conversationId)
        ▼
Make (escenario)
  1. Webhook (recibe el mensaje)
  2. Filtro: ignorar si el contacto tiene la tag `bot-off` (para tomar el control a mano)
  3. Módulo de IA (Claude/OpenAI) con un system prompt construido con las
     FAQs del Paso 3 + reglas del negocio + "si no sabes, deriva a humano"
  4. HTTP → GHL: POST https://services.leadconnectorhq.com/conversations/messages
     Headers: Authorization: Bearer pit-xxxx · Version: 2021-04-15
     Body: { "type": "WhatsApp", "contactId": "{{contactId}}", "message": "{{respuesta}}" }
  5. (Opcional) Si la IA marca "derivar" → añadir tag `atencion-humana` en GHL
     y avisar por Slack/email al equipo
```

Notas importantes:

- Para que el paso 4 funcione, el token necesita además el scope
  `conversations/message.write`.
- **Ventana de 24 h de WhatsApp**: solo se puede responder en formato libre
  dentro de las 24 h desde el último mensaje del cliente. Como el bot responde
  al momento, en la práctica no es problema, pero no sirve para iniciar
  conversaciones (para eso hacen falta plantillas aprobadas).
- Pon siempre una **vía de escape a humano**: la tag `bot-off` en el filtro del
  paso 2 permite silenciar el bot en una conversación concreta desde el propio GHL.
- Alternativa sin Make: el **Conversation AI** nativo de GHL. Menos control
  sobre el prompt y el modelo, pero cero mantenimiento. Vale la pena probarlo
  antes de comprometerse con el escenario de Make si el caso es simple.

## Reutilizar con otro cliente

Nada que tocar en el código: crea la Private Integration en la subcuenta del
otro cliente y ejecuta el script con su `GHL_TOKEN` y `GHL_LOCATION_ID`.
