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

El endpoint MCP de GHL **no usa OAuth**: autentica con el PIT en una cabecera.
Al crear el conector, Claude "detecta" OAuth y preselecciona *Autenticación:
Siempre requerido* — **esa detección es incorrecta para GHL** y es la causa
número uno del `401`, incluso con un token perfectamente válido.

Configuración que funciona (verificada):

| Campo | Valor |
|---|---|
| URL | `https://services.leadconnectorhq.com/mcp/?locationId=<ID de la subcuenta>` |
| **Autenticación** | **Ninguno** — *"para servidores que usan una API key en lugar de OAuth"*. No dejar "Siempre requerido". |
| Encabezado | `Authorization` = `Bearer ` + el PIT |

Sobre las cabeceras:

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
3. Verificar con dos llamadas, no una: `locations_get-location` (debe devolver
   *COOL DRIVE*, Maipú) y `contacts_get-contacts` con `limit: 1`. La primera
   sola no prueba los scopes de contactos, que son los que usa el bot.

### Cuándo hay que rotarlo

Cuando se filtró (pegado en un chat, en un ticket, en un mensaje) o cuando se
va alguien con acceso. Rotar es: generar un PIT nuevo en GHL, actualizar los
dos lugares de arriba y **recién entonces** borrar el viejo — al revés se cae
el bot.

## 2. Otras conexiones del bot

**Make no usa una "conexión" de GoHighLevel.** Los escenarios de Cool Drive
llaman a la API de GHL con módulos **HTTP genéricos**, con el token escrito a
mano dentro de cada módulo. No hay nada que "reconectar": hay que editar módulo
por módulo.

Escenarios en la carpeta *Cool Drive* (equipo `My Team`):

| Escenario | Módulos con el PIT en la cabecera `Authorization` |
|---|---|
| `[BOT] Cool Drive - WhatsApp + Instagram` | Enviar mensaje · Mover en el pipeline · Avisar a Sebastián |
| `[BOT] Cool Drive - Seguimiento automatico` | (mismos módulos HTTP hacia GHL) |

El módulo *Cerebro* del primer escenario lleva además la **API key de Anthropic**
en la cabecera `x-api-key`, también en texto plano.

> **Riesgo conocido:** todos los módulos de GHL tienen manejo de error
> `Ignore`/`Resume`. Si el token es inválido, GHL devuelve 401, el módulo lo
> traga y **Make marca la ejecución como exitosa**. O sea: el bot puede estar
> sin responder a nadie y el panel de Make se ve todo verde. No confíes en el
> estado de la ejecución para saber si el token sirve.

| Otras conexiones | Dónde vive | Notas |
|---|---|---|
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
| Mismo 401 con la cabecera puesta | **Autenticación quedó en "Siempre requerido"**: Claude intenta OAuth y el PIT nunca se usa. Cambiar a *Ninguno*. |
| Mismo 401 con autenticación en *Ninguno* | El PIT se generó en otra subcuenta (o a nivel agencia) y no corresponde al `locationId` |
| 401 en unas herramientas y no en otras | Al PIT le faltan scopes: revisar contactos, conversaciones, oportunidades y calendarios en *Private Integrations* |

## 4. Regla operativa

Antes de borrar o regenerar cualquier credencial: anotar en el gestor de
contraseñas dónde estaba usada. La mayoría de las caídas del bot no son del
bot, son un token que alguien rotó sin actualizar los dos lugares.

## 5. Edición de los escenarios: por API, no a mano

Los prompts y las expresiones de Make se editan **por la API** (Claude tiene
acceso al conector de Make), no pegando a mano en la UI.

Motivo concreto, no teórico: el pegado manual del 2026-09-04 rompió cinco
expresiones en los dos escenarios. En todos los casos se perdió el tercer
argumento de `replace()` — quedó `replace(x; newline; )` en vez de
`replace(x; newline; " ")` — y en el escenario de seguimiento el contador de
intentos `{{ifempty(1.data.fu_count; 0) + 1}}` se convirtió en una
concatenación de texto, dejando al bot sin saber si iba por el intento 1, 2 o 3.

Ninguno de esos errores hace fallar el escenario de forma visible: se combinan
con los manejadores `Ignore`/`Resume` y el panel sigue en verde.
