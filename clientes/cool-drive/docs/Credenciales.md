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

## 3. Regla operativa

Antes de borrar o regenerar cualquier credencial: anotar en el gestor de
contraseñas dónde estaba usada. La mayoría de las caídas del bot no son del
bot, son un token que alguien rotó sin actualizar los dos lugares.
