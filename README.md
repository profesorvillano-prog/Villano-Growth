# Villano Growth — Biblioteca de Skills

Esta carpeta es **la biblioteca de habilidades (skills) de Villano Growth para
Claude Code**. Aquí guardo, en un solo sitio, todo el conocimiento que quiero
reutilizar con todos mis clientes.

> Repo en GitHub: `profesorvillano-prog/Villano-Growth`.
> El catálogo de skills (marketplace) se llama internamente `marketingskills`,
> por eso las skills se instalan como `impeccable@marketingskills`.

## ¿Qué hay dentro?

| Skill | Para qué sirve |
|-------|----------------|
| **impeccable** | Diseño de páginas web e interfaces (UI/UX). Trae 23 comandos: `/impeccable polish`, `/impeccable audit`, `/impeccable critique`, etc. Creada por Paul Bakaus — https://impeccable.style |

*(Iremos añadiendo más skills aquí: análisis de clientes, copywriting, embudos, etc.)*

## Cómo trabajan juntas la biblioteca y los clientes

Las skills viven **aquí** (Villano Growth). Cada cliente vive en **su propia
carpeta**. Aunque estén separadas, **al trabajar se usan juntas**:

```
Villano Growth (esta carpeta)        Marcelo Dachshund (carpeta del cliente)
   └─ skills (impeccable, …)   ←──────  .claude/settings.json  (línea de conexión)

  Abres la carpeta del cliente  →  las skills se cargan solas  →  /impeccable polish
```

No hay que copiar las skills a cada cliente. Y si mejoro una skill aquí,
**todos los clientes la reciben actualizada** al instante.

## Dar de alta un cliente nuevo

Usa la carpeta **`plantilla-cliente/`**: contiene el `.claude/settings.json` que
conecta el repo del cliente con esta biblioteca. Pasos detallados en
[`plantilla-cliente/COMO-CREAR-UN-CLIENTE.md`](plantilla-cliente/COMO-CREAR-UN-CLIENTE.md).

```
Villano Growth (repo: Villano-Growth)
├─ .claude/skills/        ← las skills (impeccable, …)
├─ plantilla-cliente/     ← base para clientes nuevos
└─ clientes/
   ├─ dachshund-salud/    ← Dachshund Salud (su index.html)
   ├─ gian-fp-coach/      ← Gian FP Coach
   ├─ japi-eaters/        ← Japi Eaters
   ├─ family-eaters/      ← Family Eaters
   └─ ingresos-extra-to/  ← Ingresos Extra TO (Sala de Skool)
```

Cada cliente vive en su propia subcarpeta dentro de `clientes/`. Cuando crezca,
cualquier cliente puede moverse a su propio repositorio sin cambiar nada
(ya viene auto-contenido).

## Añadir más skills en el futuro

1. Copia la nueva skill dentro de `.claude/skills/<nombre>/`.
2. Para poder instalarla en clientes, añádela también como plugin en
   `plugins/<nombre>/` y regístrala en `.claude-plugin/marketplace.json`.
3. Guarda los cambios (commit + push).

## Créditos y licencia

La skill **impeccable** es obra de Paul Bakaus y se distribuye bajo licencia
Apache-2.0. Se conservan los archivos `LICENSE` y `NOTICE.md` con la atribución
correspondiente.
