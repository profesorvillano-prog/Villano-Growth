# MCP de GoHighLevel · Marcelo Dachshund

Conecta Claude directamente a la sub-cuenta de Marcelo en GHL: contactos,
conversaciones, oportunidades, calendarios y pagos.

---

## 0. El locationId NO va en la URL

Es la confusión más común. GoHighLevel expone **una sola URL para todo el mundo**;
la sub-cuenta se identifica por cabecera, no por la dirección. No existe algo como
`.../mcp/TzjuywpjnaS5aZn5RTs8`.

Hay dos endpoints, y la diferencia importa:

| Endpoint | Cómo identifica la cuenta | Autenticación |
|---|---|---|
| `https://services.leadconnectorhq.com/mcp/` | Cabecera `locationId` | Token de integración privada (PIT) |
| `https://services.leadconnectorhq.com/mcp/anthropic/v2` | **Multi sub-cuenta.** El `locationId` sale del OAuth y la cabecera es opcional: nombrás la cuenta en el prompt | OAuth (botón conectar) |

Cabeceras del primero:

```
Authorization: Bearer pit-...
locationId:    TzjuywpjnaS5aZn5RTs8
Version:       2021-07-28
```

## 0.1 Por qué probablemente buscabas la URL con el ID

Porque **claude.ai no deja tener dos conectores con la misma URL**. Al intentar
agregar el de Marcelo teniendo ya `GHL_Cool_Drive`, tira:

```
Error: A server with this URL already exists
```

Es un límite conocido de claude.ai, reportado y todavía abierto
([issue #178](https://github.com/anthropics/claude-ai-mcp/issues/178)), y **no
tiene workaround**: agregarle un query string o un path a la URL no sirve, porque
el que tiene que reconocer esa dirección es GoHighLevel, no Claude.

**La solución es el endpoint `v2`**, que HighLevel sacó justamente para agencias
con varias sub-cuentas: se conecta **una sola vez** por OAuth y desde ahí trabajás
con Marcelo, Cool Drive y las que vengan, eligiendo la cuenta al nombrarla en el
prompt. Si no queda claro cuál, Claude lista las disponibles y te pregunta.

> Este dato sale de la documentación de HighLevel, que no pude abrir desde este
> entorno (la política de red bloquea sus dominios). Verificá el endpoint `v2` en
> su portal de soporte antes de darlo por hecho. Si el `v2` no te sirve, el `.mcp.json`
> de este repositorio (punto 1) funciona igual: **el límite de URL duplicada es de
> claude.ai, no de Claude Code**, donde podés tener tantos servidores con la misma
> URL como quieras mientras cambien las cabeceras.

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

Para tenerlo en todas las sesiones y no solo en este repositorio, va en
**claude.ai → Settings → Connectors → Add custom connector**. Dos caminos:

**Recomendado: el endpoint multi-cuenta.** Un solo conector para todos los clientes.

| Campo | Valor |
|---|---|
| Nombre | `GoHighLevel` |
| URL | `https://services.leadconnectorhq.com/mcp/anthropic/v2` |
| Auth | OAuth: conectar → login en HighLevel → aprobar las sub-cuentas |

Durante la autorización elegís qué sub-cuentas habilitar. Después trabajás
nombrando la cuenta ("en la cuenta de Marcelo, buscá..."). No hace falta PIT.

**Si preferís uno dedicado a Marcelo** (y todavía no tenés otro GHL conectado):

| Campo | Valor |
|---|---|
| Nombre | `GHL_Marcelo` |
| URL | `https://services.leadconnectorhq.com/mcp/` |
| Header 1 | `Authorization: Bearer <el token>` |
| Header 2 | `locationId: TzjuywpjnaS5aZn5RTs8` |
| Header 3 | `Version: 2021-07-28` |

Ojo: si ya tenés `GHL_Cool_Drive` con esa misma URL, claude.ai lo va a rechazar
(ver punto 0.1). Ahí no queda otra que el `v2`.

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
