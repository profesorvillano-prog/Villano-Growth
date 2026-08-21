# Fuentes del cerebro (no versionadas)

`fuentes/` y `salida/` están en `.gitignore` **a propósito**: contienen el texto
íntegro de los libros que Marcelo vende y la transcripción de su webinar. Eso es
su producto, y este repositorio es público.

## Cómo reconstruir `fuentes/` en local

Descargar del Drive de Marcelo y guardar como `.txt` en `cerebro/fuentes/`:

| Archivo en Drive | Dónde está |
|---|---|
| `Nutricion-Dachshund-Manuscrito-con-Prompts.docx` | `[07] Productos → [Ebook 1] Nutrición Dachshund` |
| `Recomposicion-Dachshund-Capitulos-1-4.docx` | `[07] Productos → [Ebook 2] Recomposición Dachshund` |
| `Nutrición y salud para perros salchicha.srt` | carpeta de transcripciones |
| `KB_Marcelo_Nutricion_Perros_Salchicha.docx` | carpeta de estrategia inicial |

Solo hacen falta si se va a usar `python3 build.py completo`. Para el modo núcleo
(el recomendado) alcanza con `CEREBRO-MARCELO.md`, que sí está versionado.

## Por qué el núcleo sí puede estar en el repo

`CEREBRO-MARCELO.md` es documento de trabajo de la agencia: conocimiento
reorganizado para operar un bot, no el libro. Aun así contiene precios y reglas
internas.

> **Recomendación para Villano:** poner este repositorio en privado. Hoy son
> públicos los precios de todos los clientes, las fichas internas, los avatares y
> los guiones de venta. Nada de eso debería estar abierto. Ojo con un detalle: lo
> que ya se subió sigue en el historial de git aunque se borre del último commit.
> Pasar el repo a privado es la forma rápida y completa de cerrarlo.
