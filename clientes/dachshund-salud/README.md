# Cliente: Dachshund Salud

Carpeta del cliente **Dachshund Salud** (Dr. Marcelo Hernán — Método
Recomposición Dachshund). Aquí va todo lo de este cliente: su web, embudos y
archivos.

## Contenido

- **`index.html`** — landing / VSL del Método Recomposición Dachshund (90 días).
- **`docs/`** — base de conocimiento del cliente (fuente de verdad). Ver
  [`docs/README.md`](./docs/README.md) para el índice completo.

### `docs/` — base de conocimiento

| Documento | Qué contiene |
|---|---|
| [`docs/Avatar.md`](./docs/Avatar.md) | Cliente ideal: dolores, deseos, miedos, objeciones, voz del cliente. |
| [`docs/Oferta.md`](./docs/Oferta.md) | Escalera de valor: Pack low ticket, Club DAX Saludable, Plan Salchicha 30, Plan VIP 90. |
| [`docs/Oferta-Recomposicion-Dachshund.md`](./docs/Oferta-Recomposicion-Dachshund.md) | High ticket ($497): Big Idea, promesa 90 días, mecanismo, 3 pilares, CTA. |
| [`docs/Conocimiento-Nicho.md`](./docs/Conocimiento-Nicho.md) | El "porqué": fisiología, IVDD, eje intestino-piel, croqueta, mitos. |
| [`docs/Metodo-Alimentacion-BARF.md`](./docs/Metodo-Alimentacion-BARF.md) | El "cómo": protocolo completo (síntesis de las 23 transcripciones). |
| [`docs/FAQ.md`](./docs/FAQ.md) | Preguntas frecuentes en la voz de Marcelo (bot/setter y web). |
| [`docs/Casos-de-Exito.md`](./docs/Casos-de-Exito.md) | Transformaciones reales con métrica y tiempo. |
| [`docs/Mensajes-Angulos-y-Copy.md`](./docs/Mensajes-Angulos-y-Copy.md) | Ganchos, ángulos, argumento anticroqueta, objeciones y CTAs. |
| [`docs/ebooks/`](./docs/ebooks/) | 6 ebooks estructurados: Salchicha Pro, Apetito Salchicha, Brillo Total, Columna Feliz, Sabores Seguros, Salchicha Zen. |

**Fuentes:** 23 transcripciones (Masterclass Salchi BARF + 2 VSLs + webinar), 4
ebooks originales, KB y Resumen Ejecutivo (Google Drive), y la landing.

## Skills

Esta carpeta está conectada a la biblioteca **Villano Growth**
(`profesorvillano-prog/Villano-Growth`) mediante `.claude/settings.json`. Al
trabajar aquí en Claude Code, las skills (como `impeccable`) se cargan solas.

Para mejorar el diseño de la landing, por ejemplo:

```
/impeccable polish
/impeccable audit
```

> Cuando quieras, esta carpeta se puede mover a su propio repositorio
> (p. ej. `dachshund-salud`) sin cambiar nada: ya viene auto-contenida.
