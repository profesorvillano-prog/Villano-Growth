# marketingskills — Mi biblioteca de skills (Marcelo Dachshund)

Esta carpeta es **mi biblioteca de habilidades (skills) para Claude Code**.
Aquí guardo las skills que quiero reutilizar con todos mis clientes.

## ¿Qué hay dentro?

| Skill | Para qué sirve |
|-------|----------------|
| **impeccable** | Diseño de páginas web e interfaces (UI/UX). Trae 23 comandos: `/impeccable polish`, `/impeccable audit`, `/impeccable critique`, etc. Creada por Paul Bakaus — https://impeccable.style |

## Cómo usar estas skills

### Opción 1 — Dentro de esta misma carpeta
Si abres este proyecto (*Marcelo Dachshund / marketingskills*) en Claude Code,
las skills de `.claude/skills/` ya están disponibles automáticamente. Solo escribe,
por ejemplo, `/impeccable polish`.

### Opción 2 — En el proyecto de un cliente (recomendado)
En cualquier otro proyecto de cliente, instala esta biblioteca con **un comando**:

```
/plugin marketplace add profesorvillano-prog/marketingskills
/plugin install impeccable@marketingskills
```

A partir de ahí tendrás los comandos `/impeccable ...` en ese proyecto.

## Gestionar clientes (1 repo por cliente)

Cada cliente tiene **su propio repositorio** (con sus productos, embudos y web),
y todos usan las skills de esta biblioteca **sin copiarlas**:

```
profesorvillano-prog/
├─ marketingskills      ← esta biblioteca (las skills, en un solo sitio)
├─ marcelo-dachshund    ← Cliente 1
├─ cliente-2            ← Cliente 2
└─ …
```

Para dar de alta un cliente nuevo, usa la carpeta **`plantilla-cliente/`**:
contiene un `.claude/settings.json` que conecta el repo del cliente con esta
biblioteca y carga las skills automáticamente. Pasos detallados en
[`plantilla-cliente/COMO-CREAR-UN-CLIENTE.md`](plantilla-cliente/COMO-CREAR-UN-CLIENTE.md).

Ventaja: cuando mejoras una skill aquí, **todos los clientes la reciben actualizada**.

## Añadir más skills en el futuro

1. Copia la nueva skill dentro de `.claude/skills/<nombre>/`.
2. Si quieres poder instalarla en proyectos de clientes, añádela también como
   plugin en `plugins/<nombre>/` y regístrala en `.claude-plugin/marketplace.json`.
3. Guarda los cambios (commit + push).

## Créditos y licencia

La skill **impeccable** es obra de Paul Bakaus y se distribuye bajo licencia
Apache-2.0. Se conservan los archivos `LICENSE` y `NOTICE.md` con la atribución
correspondiente.
