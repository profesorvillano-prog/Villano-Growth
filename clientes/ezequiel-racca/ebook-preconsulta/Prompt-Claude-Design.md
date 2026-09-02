# Prompt maestro para Claude Design — Ebook Pre-Consulta

> **Cómo usarlo:** copiá y pegá el bloque de abajo en Claude Design (o en Claude con
> la skill de diseño / Cloud Design), **adjuntando el archivo `Ebook-Contenido.md`**
> como fuente del texto. El prompt le dice a Claude Design *cómo* diseñarlo; el
> contenido exacto (palabra por palabra) sale del `.md`. No inventar texto médico
> nuevo: usar el del archivo.
>
> Antes de generar, reemplazá en el contenido los marcadores: `[NOMBRE-MARCA]`,
> `[LINK-AGENDA]`, `[WHATSAPP]`, `[@INSTAGRAM]`, `[EMAIL-CONTACTO]`, `[FOTO-DUO]`.

---

## ▼▼▼ PROMPT (copiar desde acá) ▼▼▼

Necesito que diseñes un **ebook educativo en PDF, vertical A4**, de ~18 páginas, a partir del contenido que te adjunto en `Ebook-Contenido.md`. Usá **exactamente ese texto** (no lo reescribas ni agregues afirmaciones médicas nuevas); tu trabajo es la **maquetación visual**. Respetá los cortes `═══ PÁGINA N ═══` como páginas del PDF.

**Contexto:** es el producto que se entrega en Hotmart cuando alguien paga una "Consulta de Diagnóstico" de medicina funcional para enfermedades autoinmunes de la piel (psoriasis, eczema, vitíligo, lupus). Es material **pre-llamada**: educativo, cálido y profesional. Debe transmitir **autoridad clínica + cercanía + esperanza honesta**, nunca sensacionalismo ni estética de "cura milagrosa".

### Identidad visual

- **Paleta:** púrpura/ciruela profundo como color principal (es el color de la concienciación autoinmune y del lupus), con acento **dorado** para destacados y CTAs. Fondos mayormente claros (blanco/marfil) para lectura cómoda; secciones destacadas o portada pueden ir sobre ciruela. Verdes suaves como color de apoyo en la sección de alimentación.
- **Tipografía:** una serif elegante y confiable para títulos (aire editorial, tipo revista de salud); una sans-serif limpia y muy legible para el cuerpo. Buen interlineado, líneas no demasiado largas.
- **Tono gráfico:** limpio, con mucho aire, tipo "guía premium de bienestar". Cero look de folleto de farmacia. Evitá imágenes clínicas crudas o de piel enferma; preferí ilustración conceptual, íconos y formas orgánicas.

### Sistema de página

- **Encabezado/pie sutil** en páginas interiores: nombre de marca `[NOMBRE-MARCA]` arriba, número de página abajo.
- **Aperturas de capítulo** (Cap. 1 a 6): página con número de capítulo grande en dorado, título en serif, mucho espacio en blanco.
- **Destacados / frases ancla** (los bloques que en el `.md` van como cita `>`): mostralos como **pull-quotes** grandes, centrados, sobre fondo ciruela o con barra dorada lateral. Son el alma del ebook: "La crema apaga lo que se ve, el incendio sigue adentro", "El 80% de tu sistema inmune se regula en tu intestino", "Tu piel no falló, te está avisando", etc.
- **Avisos/disclaimers:** en recuadro discreto pero legible, con ícono ⚠️. No esconderlos ni achicarlos de más — son parte de la confianza.

### Piezas gráficas específicas a crear

1. **Portada (pág. 1):** fondo ciruela con textura orgánica suave; título "EL ORIGEN ESTÁ ADENTRO" en serif dorada, grande; subtítulo en sans clara; abajo, marca y los dos nombres (Ezequiel Racca · Dra. Catalina Klimboski). Espacio reservado para `[FOTO-DUO]` (foto de ambos) si se quiere sumar.
2. **Diagrama de la cadena (Cap. 2):** una **infografía horizontal en 5 pasos** con íconos y flechas: *Alimentación que inflama → Intestino permeable → Sistema inmune descontrolado → Ataca la piel → Brotes que vuelven.* Es la pieza visual clave del ebook; que se entienda de un vistazo.
3. **Analogía visual "canilla abierta":** un ícono/ilustración simple de piso mojado + canilla abierta para reforzar "secar el piso con la canilla abierta".
4. **Cap. 3 (las 4 condiciones):** 4 tarjetas consistentes, cada una con su emoji/ícono y color de acento, con la misma estructura interna ("Lo que te dijeron / Lo que muestra la ciencia / La nota honesta"). Que se vean como un set.
5. **Cap. 4 — las 5 palancas:** tratamiento tipo **listicle premium**. Una portadilla que numere las 5 palancas, y luego cada palanca como su propia sección con número grande dorado, ícono, y una caja "**Empezá hoy**" destacada (acción concreta).
6. **Listas de alimentos (Palanca 2):** maquetá las dos listas ("Permitidos de origen animal" / "Permitidos de origen vegetal") como **tarjetas con emojis**, en dos columnas, muy escaneable — inspirado en las capturas de referencia que ya existen (títulos a dos colores, tarjetas suaves). Verde para el bloque vegetal, tonos cálidos para el animal.
7. **Checklist (Cap. 6):** casillas reales `☐` bien visibles, para que la persona lo use antes de la consulta.
8. **Contraportada (pág. 18):** CTA dorado grande "Agendá tu Consulta de Diagnóstico" con el `[LINK-AGENDA]`, íconos de contacto (WhatsApp, Instagram, email), y el disclaimer final completo en letra chica pero legible.

### Reglas de contenido (no negociables — respetarlas en cualquier decisión de diseño)

- **Nunca** agregar la palabra "doctor" delante de Ezequiel (es odontólogo). La "Dra." es solo para Catalina.
- **No** eliminar ni minimizar los disclaimers ni el aviso "no dejes tu medicación".
- **No** agregar promesas de cura, cifras de éxito, ni testimonios inventados. Si más adelante se suman testimonios reales (con consentimiento), dejá un espacio previsto pero no inventes ninguno.
- Nada de imágenes que parezcan diagnóstico o "antes/después" falsos.

**Entregable:** ebook listo para **exportar a PDF** (formato Hotmart), más los artboards editables por si hay que ajustar textos o marca. Cuidá que todo el texto del `.md` esté incluido y que el PDF se lea bien tanto en celular como impreso.

## ▲▲▲ PROMPT (copiar hasta acá) ▲▲▲

---

### Notas para el equipo (no van en el prompt)

- Si Claude Design pide una imagen de portada y todavía no está `[FOTO-DUO]`, que
  genere una **portada solo tipográfica**; la foto del dúo se suma después (pendiente
  de la sesión de fotos de Ezequiel + Catalina).
- Paleta alternativa si Ezequiel no quiere ciruela: mantener la lógica (un color
  principal serio + dorado), p. ej. verde bosque + dorado. Está abierto a opciones
  (ver `docs/Oferta.md`, pendientes).
- El nombre de marca sigue **pendiente de confirmar** (candidato de las llamadas:
  "Sánate Autoinmune"). Confirmar con Ezequiel antes de imprimirlo en portada.
