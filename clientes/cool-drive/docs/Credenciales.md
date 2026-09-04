# Credenciales y conexiones — Cool Drive Maipú

> **Este repositorio es público.** Ningún token, API key, contraseña ni webhook
> con secreto se escribe aquí. Este documento dice **dónde vive** cada
> credencial y **cómo reponerla**, nunca su valor.
>
> Los valores viven en el gestor de contraseñas de Villano Growth. Si un token
> no está ahí, está perdido y hay que generar uno nuevo.

## 1. Private Integration Token (PIT) de GoHighLevel

Es el token que usan el bot y las automatizaciones para leer y escribir en la
subcuenta de Cool Drive (contactos, conversaciones, oportunidades, calendario).

| | |
|---|---|
| **Formato** | `pit-` + UUID |
| **Dónde se genera** | GHL → subcuenta Cool Drive → *Settings → Private Integrations* |
| **Dónde se usa** | (a) conector MCP `GHL_Cool_Drive` en Claude · (b) conexión *GoHighLevel* de los escenarios de Make |
| **Dónde se guarda el valor** | Gestor de contraseñas, entrada *Cool Drive — GHL PIT* |

### Cómo se configura el conector MCP en Claude

El endpoint MCP de GHL no usa OAuth: la credencial va en cabeceras. En el
conector (menú **⋮ → Editar**) tienen que estar las dos:

| Cabecera | Valor |
|---|---|
| `Authorization` | `Bearer ` + el PIT — **con el prefijo `Bearer` y el espacio**. Pegar el `pit-...` pelado devuelve `401 Invalid Private Integration token`. |
| `locationId` | El ID de la subcuenta Cool Drive (el mismo que aparece en la URL del conector). |

URL del conector: `https://services.leadconnectorhq.com/mcp/`.

Que el panel diga **Conectado** no significa que el token sirva: solo que
Claude alcanza el endpoint y ve la lista de herramientas. La prueba real es
llamar a una herramienta. Si además dice *Iniciar sesión: No requerido*, es
normal en este conector — la autenticación es por cabecera, no por login.

### Reponerlo

1. **En Claude:** *Settings → Connectors* → conector `GHL_Cool_Drive` →
   reconectar y pegar el PIT. (No se puede hacer desde una sesión de Claude
   Code; hay que entrar a la configuración de la cuenta.)
2. **En Make:** abrir cualquier escenario de Cool Drive → módulo de GoHighLevel
   → la conexión guardada → *Reconnect* y pegar el mismo PIT. La conexión es
   compartida: se arregla una vez y sirve para todos los escenarios.
3. Verificar: en Claude, pedir los datos de la ubicación
   (`locations_get-location`). Si responde `401 Invalid Private Integration
   token`, el PIT sigue mal.

### Cuándo hay que rotarlo

Cuando se filtró (pegado en un chat, en un ticket, en un mensaje) o cuando se
va alguien con acceso. Rotar es: generar un PIT nuevo en GHL, actualizar los
dos lugares de arriba y **recién entonces** borrar el viejo — al revés se cae
el bot.

## 2. Otras conexiones del bot

| Conexión | Dónde vive | Notas |
|---|---|---|
| Make ↔ GHL | Conexión guardada en Make (ver §1) | Compartida por todos los escenarios de Cool Drive |
| Webhooks de Make | URL del webhook en el escenario | La URL **es** el secreto: no se publica |
| WhatsApp / Instagram | Conectado dentro de GHL, no en Make | Se reconecta desde GHL, no requiere PIT |

## 3. Límite del entorno remoto

Las sesiones de Claude Code en la nube **no alcanzan
`services.leadconnectorhq.com`** (la política de red del entorno corta el
túnel con 403). Desde una sesión remota no se puede validar un PIT con `curl`
ni arreglar el conector: lo único disponible es llamar a las herramientas del
conector ya configurado. La configuración se hace sí o sí desde
*Settings → Connectors* en la cuenta.

## 3.5 Los tres 401 posibles

| Síntoma | Causa |
|---|---|
| `401 Invalid Private Integration token` con el conector recién creado | Falta la cabecera `Authorization`, o le falta el prefijo `Bearer ` |
| Mismo 401 con la cabecera puesta | El PIT se generó en otra subcuenta (o a nivel agencia) y no corresponde al `locationId` |
| 401 en unas herramientas y no en otras | Al PIT le faltan scopes: revisar contactos, conversaciones, oportunidades y calendarios en *Private Integrations* |

## 4. Regla operativa

Antes de borrar o regenerar cualquier credencial: anotar en el gestor de
contraseñas dónde estaba usada. La mayoría de las caídas del bot no son del
bot, son un token que alguien rotó sin actualizar los dos lugares.
