# MCP de GoHighLevel · Marcelo Dachshund

Conecta Claude Code directamente a la sub-cuenta de Marcelo en GHL: contactos,
conversaciones, oportunidades, calendarios y pagos.

---

## 1. Las credenciales NO van en este repo

Este repositorio es **público**. El token de integración privada da acceso de
lectura y escritura a los datos de los pacientes de Marcelo. Por eso
[`.mcp.json`](../../.mcp.json) usa variables de entorno y no valores literales:

```json
{
  "mcpServers": {
    "GHL_Marcelo": {
      "type": "http",
      "url": "https://services.leadconnectorhq.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GHL_MARCELO_TOKEN}",
        "locationId": "${GHL_MARCELO_LOCATION}"
      }
    }
  }
}
```

Los valores se definen en tu máquina, nunca en un archivo versionado:

```bash
# macOS / Linux: en ~/.zshrc o ~/.bashrc
export GHL_MARCELO_LOCATION="TzjuywpjnaS5aZn5RTs8"
export GHL_MARCELO_TOKEN="pit-..."      # el token real, nunca acá
```

```powershell
# Windows PowerShell
setx GHL_MARCELO_LOCATION "TzjuywpjnaS5aZn5RTs8"
setx GHL_MARCELO_TOKEN "pit-..."
```

Cerrá y volvé a abrir la terminal, y después Claude Code.

> **Los servidores MCP se cargan al iniciar la sesión.** No aparece en la sesión
> en curso: hay que abrir una nueva.

---

## 2. Comprobar que funciona

Antes de abrir Claude Code, verificá que el token y el location responden:

```bash
curl -sS -X POST "https://services.leadconnectorhq.com/mcp/" \
  -H "Authorization: Bearer $GHL_MARCELO_TOKEN" \
  -H "locationId: $GHL_MARCELO_LOCATION" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

- Devuelve una lista de herramientas → está bien.
- `401` → el token está mal, vencido o revocado.
- `403` → el token es válido pero le faltan scopes (ver punto 3).
- `404` → el `locationId` no corresponde a esa cuenta.

---

## 3. Scopes que necesita el token

En GHL: **Settings → Private Integrations → el token → Edit**. Marcá exactamente
estos, ni más ni menos:

- `contacts.readonly` · `contacts.write`
- `conversations.readonly` · `conversations.write`
- `conversations/message.readonly` · `conversations/message.write`
- `opportunities.readonly` · `opportunities.write`
- `calendars.readonly` · `calendars/events.readonly`
- `locations/customFields.readonly`
- `payments/transactions.readonly` *(opcional, para ver ventas)*

Si falta alguno, las herramientas de esa familia devuelven 403 y el resto sigue
funcionando. Es el mismo token que usa el escenario de Make, así que los scopes
sirven para las dos cosas.

---

## 4. Alternativa: conectarlo a nivel de cuenta

Si preferís tenerlo disponible en todas las sesiones y no solo dentro de este
repositorio (que es como están hoy `GHL_Cool_Drive` y el de Japi Eaters), se
agrega como conector en **claude.ai → Settings → Connectors → Add custom
connector**:

| Campo | Valor |
|---|---|
| Nombre | `GHL_Marcelo` |
| URL | `https://services.leadconnectorhq.com/mcp/` |
| Header 1 | `Authorization: Bearer <el token>` |
| Header 2 | `locationId: TzjuywpjnaS5aZn5RTs8` |

Ahí sí va el token literal, pero queda guardado en tu cuenta y no en un archivo
público.

---

## 5. Para qué sirve, concretamente

Con esto conectado se puede trabajar sobre la operación real sin salir de Claude:

- **Leer conversaciones reales** para iterar el cerebro de Paula. Es lo que más
  falta hoy: el doc `cerebro/COMO-CIERRA.md` dice que el prompt te lleva al 70% y
  el otro 30% sale de leer conversaciones. Ahora se pueden leer.
- **Crear los 11 custom fields y los tags** del setter sin hacerlo a mano.
- **Revisar el pipeline** y ver dónde se caen los leads de verdad.
- **Auditar** que los workflows están mandando lo que creemos que mandan.

---

## 6. Rotar el token

El token que se usó para armar esto viajó por un chat. Conviene **regenerarlo en
GHL una vez que la configuración esté probada**: Settings → Private Integrations →
Delete y crear uno nuevo con los mismos scopes. Después se actualiza la variable
de entorno y el módulo HTTP del escenario de Make.

Y la recomendación de siempre, que ya está en `cerebro/fuentes.md`: **este
repositorio debería estar en privado.**
