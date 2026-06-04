# Cliente: (nombre del cliente)

Repositorio del cliente: aquí van **sus productos, embudos, páginas web y archivos**.

## Skills automáticas

Este repo está conectado a mi biblioteca central de skills
(`profesorvillano-prog/marketingskills`). Gracias al archivo
`.claude/settings.json`, al abrir este proyecto en Claude Code se cargan
solas las skills (por ejemplo `impeccable`, con sus comandos `/impeccable …`).

No hace falta copiar las skills aquí. Cuando mejoro una skill en la
biblioteca, este cliente la recibe actualizada automáticamente.

## Añadir o quitar skills para este cliente

Edita `.claude/settings.json`:

```json
"enabledPlugins": {
  "impeccable@marketingskills": true,
  "otra-skill@marketingskills": true
}
```

- Pon `true` para activar una skill en este cliente.
- Pon `false` (o bórrala) para desactivarla solo aquí.
