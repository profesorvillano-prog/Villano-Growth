# Cliente: Cool Drive

Carpeta del cliente **Cool Drive** — escuela de conductores en Chile. Aquí va todo
lo suyo: web, embudos, copy y archivos.

Producto principal: **Cursos de manejo Clase B** (Curso Avanzado y Curso Full),
con una propuesta cercana, práctica y "cool" para aprender a manejar sin miedo.

- 📄 Contexto rápido: [`PRODUCT.md`](./PRODUCT.md)
- 🌐 Landing page: [`index.html`](./index.html)

## La web (`index.html`)

Réplica de la landing de Cool Drive (`preview.heyrod.cl/clientes/cooldrive/`),
reconstruida a partir del diseño de referencia. Un solo archivo autocontenido:
HTML + CSS + JS inline, sin dependencias externas salvo Google Fonts.

**Secciones**
1. Nav (logo, Cursos · Story · Sucursales, botón *Hazle Cool*)
2. Hero — *"Aprender a manejar nunca fue tan Cool"* + story-card + chips
3. ¿Por qué todos hablan de Cool Drive? — grid de videos
4. Nuestra Story — La idea / imagen / Hoy
5. Elige tu camino — precios (Curso Avanzado $100.000 · Curso Full $120.000)
6. Así se vive Cool Drive — bento gallery
7. FAQ — *Te respondemos de una.*
8. CTA final + sedes + footer

**Sistema de diseño** (variables en `:root`)
- Rojo Cool Drive `--red:#E8121B` · amarillo `--yellow:#F5C518` · celeste `--sky`
- Beige hero `--cream` con patrón de puntos (`.dots`)
- Tipografías: **Archivo** (títulos) + **DM Sans** (texto)

**Marcadores de posición (placeholders)**
Las fotos y videos reales del sitio original no se pudieron descargar (el host
está bloqueado por la política de red de la sesión). En su lugar hay bloques con
degradado + caption que reproducen la composición. Para pasar a producción,
reemplaza cada `.ph*` / `.vbg` por `<img>`/`<video>` reales y conecta el modal de
video con las URLs correspondientes.

**Datos de contacto**
- 6 sedes: Maipú, Cerrillos, El Bosque, Puente Alto, Rancagua, San Vicente de Tagua Tagua
- +56 9 5779 7476 · cooldrive.maipu@gmail.com

## Skills

Conectada a la biblioteca **Villano Growth** vía `.claude/settings.json`.
Al trabajar aquí en Claude Code, las skills (como `impeccable`) se cargan solas.
Prueba: `/impeccable polish`.

> Esta carpeta es auto-contenida: puede moverse a su propio repositorio cuando quieras.
