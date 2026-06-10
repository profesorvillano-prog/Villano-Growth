# Importación Masiva en Meta — Cómo usar el Excel

> Acompaña a `Importacion-Masiva-Meta-Recomposicion.xlsx` (hoja **Import**).
> El Excel respeta las 114 columnas oficiales de la plantilla v2.3 de Meta y trae
> **1 campaña + 1 conjunto (Prospección) + 7 anuncios** (5 IA + 2 de Marcelo).

---

## 1. Importante: 3 cosas que el Excel NO puede llevar

La plantilla oficial de Meta **no tiene columnas** para esto, así que se completa al
importar o en la interfaz (por eso todo se importa en **PAUSED**, para revisar antes
de gastar):

1. **Los videos.** No existe columna de video en la plantilla. Tras importar, en cada
   anuncio:
   - Anuncios `IA_*` → **sube el video IA** correspondiente (9:16, con subtítulos).
   - Anuncios `Marcelo_*` → mejor usar **"Usar publicación existente"** con el post
     que ya corre (hereda likes/comentarios). El Excel trae un placeholder
     `<STORY_ID_MARCELO_1/2>` en la columna **Story ID**: reemplázalo por el ID real
     del post y se conecta solo. Si lo dejas, el importador ignorará esa fila para
     creativo y la armas en la interfaz.
2. **El evento de conversión (Schedule) y el Pixel.** La plantilla deja
   `Optimization Goal = OFFSITE_CONVERSIONS`, pero el **Pixel + evento `Schedule`**
   se asignan en la interfaz al revisar el conjunto (campo "Evento de conversión").
   Si esperas pocas agendas al inicio, cambia a `Lead` temporalmente.
3. **Page ID.** En la columna **Link Object ID** hay un placeholder `<TU_PAGE_ID>`.
   Reemplázalo por el **ID de tu página de Facebook** antes de importar (lo ves en
   Configuración de la página o en el Administrador del negocio).

---

## 2. Campos a verificar antes de importar

| Columna | Valor puesto | Verifica |
|---|---|---|
| **Link Object ID** | `<TU_PAGE_ID>` | Poner tu Page ID real |
| **Story ID** (filas Marcelo) | `<STORY_ID_MARCELO_1/2>` | Poner el ID del post real o dejar vacío y armar en UI |
| **Ad Set Daily Budget** | `50` | En la moneda de tu cuenta. Ajusta si tu cuenta usa otra |
| **Countries** | `ES, CL, UY, CR, PR, US` | Grupo A. Agrega MX/CO solo al escalar |
| **Locales** | `Spanish` | Si el importador se queja, déjalo vacío y pon "Español" en la interfaz |
| **Gender** | `All` | Correcto (el avatar es mayormente mujer, pero deja optimizar) |
| **Age Min/Max** | `25` / `55` | Correcto |

Ubicaciones (placements) van **en blanco a propósito** = **Advantage+
(automáticas)**. Audiencia: agrega los intereses Advantage+ (Dachshund, Teckel, BARF,
comida para perros) en la interfaz, ya que la plantilla no los trae en columna fija.

---

## 3. Pasos para importar

1. Abre **Administrador de anuncios** → **Anuncios** → botón **"…/Más"** →
   **Importar/Exportar** → **Importar anuncios desde archivo**
   (o Editor múltiple → Importar).
2. Selecciona `Importacion-Masiva-Meta-Recomposicion.xlsx`.
3. Revisa la previsualización: 1 campaña, 1 conjunto, 7 anuncios. Corrige lo que
   marque en rojo (normalmente Page ID, Locales o evento).
4. **Confirma la importación.** Todo entra en **PAUSED**.
5. En la interfaz, completa por anuncio: **video / publicación existente**.
6. En el conjunto, asigna **Pixel + evento `Schedule`** (o `Lead` al inicio).
7. Corre el **checklist de la PARTE 6** de `Setup-Campana-Meta-Recomposicion.md`.
8. Activa campaña, conjunto y anuncios cuando todo esté verde.

---

## 4. Retargeting (semana 2-3) — NO está en este Excel

El conjunto de Retargeting no se incluye porque sus **públicos personalizados aún no
existen** (no hay tráfico todavía) y el importador fallaría. Cuando ya tengas tráfico:
crea los públicos (VV-50, visitantes LP, abrió calendario sin agendar) y monta el
conjunto siguiendo la **PARTE 5** de `Setup-Campana-Meta-Recomposicion.md`. El copy de
los 3 anuncios de retargeting está en la **PARTE 7** del mismo documento.

---

### Resumen del contenido del Excel
- **Campaña:** `META_Leads_Recompo_Agenda_2026Q2` · Objetivo Outcome Leads · AUCTION
- **Conjunto:** `Prospeccion_Broad_GrupoA` · $50/día · ES/CL/UY/CR/PR/US · 25-55 ·
  Todos · Español · OFFSITE_CONVERSIONS · placements automáticos
- **7 anuncios:** IA_Alergias, IA_IVDD, IA_Dermatitis, IA_EnergiaBaja, IA_Sobrepeso,
  Marcelo_Autoridad, Marcelo_Dermatitis · CTA Más información · URL con UTMs
