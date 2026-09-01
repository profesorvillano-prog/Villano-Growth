# Blueprints

**Los archivos JSON se quitaron a propósito.** Estaban desactualizados respecto a
lo que hay en Make, y un blueprint viejo importado por error revierte el escenario
entero sin avisar.

**Make es la fuente de verdad** de la estructura de los escenarios:

| Escenario | ID |
|---|---|
| `[BOT] Marcelo - WhatsApp + Instagram` | `7035201` |
| `[BOT] Marcelo - Seguimiento automatico` | `7035204` |

Para sacar una copia fresca: Make → escenario → menú `···` → **Export Blueprint**.

> ⚠️ Un blueprint exportado **lleva las credenciales en texto plano** (la API key
> de Anthropic y el token de GHL). Nunca lo subas a este repositorio, que es
> público. Si necesitás versionarlo, borrá los valores de los headers primero.

Lo que sí vive versionado acá es el **cerebro** (`../../cerebro/`), que es lo que
de verdad se itera.
