---
name: ads-audit
description: "Entrada a la suite de publicidad de pago (claude-ads): auditoría y optimización de Google, Meta, YouTube, LinkedIn, TikTok, Microsoft, Apple y Amazon Ads. 250+ checks con scoring, agentes en paralelo, creatividades con IA, PPC math, tests A/B, attribution y server-side tracking. Úsala cuando el usuario quiera auditar u optimizar campañas de paid ads / PPC, o diga 'auditar mis ads', 'optimizar Google/Meta Ads', 'ROAS', 'CPA', 'ad spend audit'."
argument-hint: "audit | google | meta | youtube | linkedin | tiktok | microsoft | apple | amazon | attribution | tracking | creative | landing | budget | plan <type> | competitor | math | test | report | dna <url> | create | generate | photoshoot"
license: MIT
---

# claude-ads — Suite de Paid Ads (entrada: `ads-audit`)

Esta es la **entrada del plugin `claude-ads`**, renombrada a `ads-audit` para no
chocar con la skill `ads` de `marketing-skills`. El plugin es un orquestador de un
solo comando con 22 sub-skills internas.

## Cómo proceder (obligatorio)

1. **Lee y sigue el orquestador completo:** `plugins/claude-ads/ads/SKILL.md`.
   Ahí está el flujo real, el ruteo por sub-comando y el sistema de scoring.

2. **Rutea según el argumento** que dio el usuario (lo que venga después de
   `/ads-audit`). Mapea el sub-comando a su sub-skill y **léela** antes de actuar.
   Las sub-skills viven en `plugins/claude-ads/skills/ads-<x>/SKILL.md`:

   | Sub-comando | Sub-skill a leer |
   |---|---|
   | `audit` (o sin argumento) | `ads-audit` (auditoría multiplataforma en paralelo) |
   | `google` / `meta` / `youtube` / `linkedin` / `tiktok` / `microsoft` / `apple` / `amazon` | `ads-<plataforma>` |
   | `attribution` | `ads-attribution` |
   | `tracking` | `ads-server-side-tracking` |
   | `creative` / `create` / `generate` / `photoshoot` | `ads-creative` / `ads-create` / `ads-generate` / `ads-photoshoot` |
   | `landing` | `ads-landing` |
   | `budget` | `ads-budget` |
   | `plan` | `ads-plan` |
   | `competitor` | `ads-competitor` |
   | `math` | `ads-math` |
   | `test` | `ads-test` |
   | `dna <url>` | `ads-dna` |

3. **Archivos de referencia:** el orquestador menciona `~/.claude/skills/ads/references/`.
   En este repo **están en `plugins/claude-ads/ads/references/`** — usa esa ruta.

> Nota: las sub-skills de claude-ads son `user-invokable: false` (internas); por eso
> no aparecen sueltas en `/`. Esta skill `ads-audit` es la única entrada pública.
