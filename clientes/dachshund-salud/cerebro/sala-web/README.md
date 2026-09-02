# Sala de pruebas · versión web

La misma sala, pero **sin necesidad de que Marcelo tenga cuenta de Claude**. La
API key vive en el servidor y él solo abre un link.

## Desplegar

```bash
cd clientes/dachshund-salud/cerebro
python3 build.py paula claude-sonnet-5    # arma el cuerpo con el cerebro actual
python3 sala.py                           # arma la web
cd sala-web
vercel --prod
```

En el dashboard de Vercel, **Settings → Environment Variables**:

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | Una key propia de Marcelo, con límite de gasto |
| `CLAVE_SALA` | Una palabra cualquiera, ej. `hansel2026` |

`CLAVE_SALA` evita que la sala quede abierta a internet. El link que le mandas a
Marcelo lleva la clave al final:

```
https://tu-proyecto.vercel.app/?c=hansel2026
```

Sin `?c=...` la página carga pero no responde. Si no pones la variable, no hay
puerta y cualquiera con el link puede usarla, gastando tu key.

## Cuando cambies el cerebro

```bash
python3 build.py paula claude-sonnet-5 && python3 sala.py && cd sala-web && vercel --prod
```

## Cuánto cuesta que pruebe

Con Sonnet 5, cada mensaje son unos $0,005. Una tarde entera de pruebas no llega
a un dólar. Igual conviene ponerle límite de gasto a la key.

## Qué NO prueba

Igual que el artifact: usa el mismo cerebro pero no pasa por Make, así que no
valida el Sleep, ni el pipeline, ni los tags, ni el webhook. Prueba lo único que
Marcelo puede juzgar: qué dice Paula y cuándo se calla.
