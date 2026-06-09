# Montaje de Campaña Meta — Método Recomposición (Embudo de Agenda)

> Paso a paso EXACTO para colgar la campaña en Meta Ads Manager: prerrequisitos,
> configuración a nivel campaña/conjunto/anuncio, segmentación, eventos, qué videos
> usar y el copy completo de cada anuncio listo para pegar.
> Landing: `https://salchichapro.com/metodorecomposicion` · Producto: $497, cierre
> en llamada agendada. Acompaña a `Estrategia-Ads-Recomposicion.md`.

---

## PARTE 0 — Prerrequisitos (ANTES de tocar Ads Manager)

Sin esto, la campaña optimiza a ciegas. Resolver primero:

1. **Pixel + API de Conversiones (CAPI)** instalados en `salchichapro.com`.
   - En **Administrador de eventos** confirma que el Pixel recibe `PageView`.
2. **Evento de agenda funcionando.** Cuando alguien reserva en el calendario
   (Calendly/cal.com/etc.) debe dispararse el evento estándar **`Schedule`
   (Programar)**. Opciones:
   - Redirigir tras reservar a una página de gracias
     (`/gracias-agenda`) con el Pixel + evento `Schedule` y CAPI, **o**
   - Disparar el evento vía Google Tag Manager en el confirmation del calendario.
   - Además, dispara **`Lead`** cuando el usuario *inicia* el agendamiento (abre el
     calendario). Sirve como evento de respaldo para el aprendizaje.
3. **Verificar el dominio** `salchichapro.com` en Configuración del negocio
   (Seguridad de marca → Dominios).
4. **Medición de eventos agregados (iOS):** en Administrador de eventos, configura
   los 8 eventos del dominio y pon **`Schedule` como prioridad #1**.
5. **Conversión personalizada (recomendado):** crea una conversión "Llamada
   Agendada" basada en el evento `Schedule` + URL de la página de gracias, para
   poder optimizar y medir limpio.
6. **Recordatorios anti no-show** listos (ver §5 de la estrategia): confirmación +
   24 h + 1 h. El show rate define la rentabilidad.
7. **Probar de punta a punta:** haz una reserva de prueba y confirma en
   Administrador de eventos que llegan `Lead` y `Schedule`.

---

## PARTE 1 — Qué videos usar

Tienes **5 videos IA voz en off** (Alergias, IVDD, Dermatitis, Energía Baja,
Sobrepeso) + los videos de Marcelo que ya corren en su campaña actual.

**En el lanzamiento (1 solo conjunto de Prospección):**
- Los **5 videos IA** = núcleo de la prospección (1 anuncio cada uno).
- **+ 1 o 2 videos de Marcelo (talking head)** dentro del MISMO conjunto, para que
  Meta compare formatos. Total: 6-7 anuncios en el conjunto.

**Cómo elegir los 2 videos de Marcelo** (de su campaña actual):
- Los de **mejor "hold/retención"** (hook rate alto, la gente se queda los primeros
  3 seg) y **menor costo por resultado** o mejor CTR.
- Prioriza los de **autoridad/dermatitis** ("yo empiezo donde la medicina termina",
  "las 3 verdades de la dermatitis"): encajan con el ángulo central.
- **TRUCO:** impórtalos con **"Usar publicación existente"** (Use Existing Post) con
  el ID de la publicación que ya corre, para **heredar likes/comentarios/veces
  compartido** (prueba social acumulada) en vez de empezar de cero.

**Videos de Marcelo para Retargeting (semana 2-3):** los más de autoridad,
testimonio/caso de éxito y manejo de objeción. Ahí brillan.

> ¿Campaña nueva o usar la de Marcelo? **Crea una campaña NUEVA y limpia** para el
> embudo de agenda. No mezcles con la campaña actual (objetivo/evento distinto =
> datos contaminados).

---

## PARTE 2 — Crear la CAMPAÑA (nivel campaña)

En Ads Manager → **Crear** → 

1. **Objetivo:** **Clientes potenciales** (Leads).
2. **Nombre de la campaña:** `META_Leads_Recompo_Agenda_2026Q2`
3. **Categoría especial de anuncios:** Ninguna (no aplica vivienda/empleo/crédito).
4. **Presupuesto Advantage de la campaña (CBO):** **DESACTIVADO** al inicio.
   Usaremos presupuesto por conjunto (ABO) para controlar prospección vs
   retargeting. (Se puede pasar a CBO al escalar.)
5. **Prueba A/B:** desactivada (se usará solo si quieres test de formato limpio más
   adelante).
6. Continuar al conjunto.

---

## PARTE 3 — Configurar el CONJUNTO de Prospección

Nombre del conjunto: `Prospeccion_Broad_GrupoA`

### 3.1 Conversión y optimización
- **Ubicación de la conversión:** **Sitio web**.
- **Evento de conversión / Pixel:** selecciona tu Pixel y el evento
  **`Schedule` (Programar)** o tu conversión personalizada "Llamada Agendada".
  - ⚠️ **Si esperas <15-20 agendas/semana** (el conjunto se quedará en aprendizaje):
    arranca optimizando a **`Lead`** (inició agendamiento) las 1-2 primeras semanas y
    cambia a `Schedule` cuando haya volumen.
- **Objetivo de rendimiento:** "Maximizar el número de conversiones".
- **Costo por resultado objetivo:** dejar **vacío** al inicio (que aprenda). Más
  tarde, si hace falta control, pon un tope cercano a tu CPA agenda objetivo
  ($15-25).

### 3.2 Presupuesto y calendario
- **Presupuesto diario del conjunto:** **$50/día** (escenario validación). Si vas a
  Crecimiento, $80-100/día.
- **Fecha de inicio:** mañana a primera hora (que arranque con día completo).
- Sin fecha de fin.

### 3.3 Segmentación / Público
- **Ubicaciones (Grupo A primero):** España, Chile, Uruguay, Costa Rica, Puerto
  Rico, **Estados Unidos**.
  - Asegura "Personas que **viven** en esta ubicación".
  - Para EE.UU. el idioma filtra (ver abajo).
- **Edad:** **25 – 55**.
- **Sexo:** **Todos** (el avatar es mayormente mujer, pero deja que Meta optimice;
  no excluyas hombres compradores).
- **Idiomas:** **Español** (clave para no pagar por anglos en EE.UU.).
- **Público de Advantage+ (recomendado):** actívalo y agrega como **sugerencias de
  público** estos intereses para orientar al algoritmo:
  - Dachshund, Teckel, Perro salchicha, Comida para perros, Raw feeding / BARF,
    Salud canina, Mascotas.
  - Si prefieres público original (control manual): mismos intereses en
    "Segmentación detallada", sin "expansión" al inicio.

### 3.4 Ubicaciones (placements)
- **Ubicaciones Advantage+ (automáticas):** **ACTIVADAS**. Deja que Meta reparta
  (Reels, Feed, Stories, etc.). El video vertical 9:16 rinde en todas.

### 3.5 Configuración de atribución
- **Ventana de atribución:** **7 días clic, 1 día visualización** (predeterminada).

Continuar al anuncio.

---

## PARTE 4 — Crear los ANUNCIOS (dentro del conjunto Prospección)

Crea **un anuncio por video**. Para cada uno:

1. **Identidad:** Página de Facebook + cuenta de Instagram de Salchicha Pro /
   Marcelo.
2. **Formato:** Un solo video. Sube el video 9:16. **Subtítulos incrustados** (ya
   vienen en tus IA; en los de Marcelo activa subtítulos automáticos si no tienen).
3. **Texto principal / Titular / Descripción:** copiar de la PARTE 7.
4. **Destino:** Sitio web → URL:
   `https://salchichapro.com/metodorecomposicion` + UTMs (ver §4.1).
5. **Botón de CTA:** **"Más información"** en prospección (la VSL necesita verse
   antes de agendar). En retargeting usa **"Reservar"**.
6. **Optimización de creativo Advantage+:** desactiva los retoques automáticos de
   texto/música que distorsionen tu mensaje (deja solo los que no cambien el copy).

**Anuncios a crear en el conjunto Prospección:**
- Anuncio 1: IA Alergias
- Anuncio 2: IA IVDD
- Anuncio 3: IA Dermatitis
- Anuncio 4: IA Energía Baja
- Anuncio 5: IA Sobrepeso
- Anuncio 6: Marcelo talking head #1 (autoridad/dermatitis) — vía "Usar publicación
  existente"
- Anuncio 7 (opcional): Marcelo talking head #2 — vía "Usar publicación existente"

### 4.1 UTMs (parámetros de URL del sitio web)
En cada anuncio, campo "Parámetros de URL":
```
utm_source=meta&utm_medium=paid&utm_campaign=recompo_agenda&utm_content={{ad.name}}&utm_term={{adset.name}}
```
Así sabrás qué ángulo/video trae las agendas y ventas reales.

---

## PARTE 5 — Públicos personalizados + Conjunto de RETARGETING (semana 2-3)

Cuando ya entró tráfico, crea los públicos y el 2º conjunto.

### 5.1 Crear Públicos personalizados (en Públicos)
- **VV-50:** Personas que vieron el **50%+** de cualquiera de tus videos, últimos
  30 días.
- **Visitantes LP:** visitaron `salchichapro.com/metodorecomposicion`, últimos 30
  días.
- **Abrió calendario sin agendar:** disparó `Lead` pero NO `Schedule`, últimos 30
  días (el más caliente).
- **Engagement IG/FB:** interactuaron con la página/perfil, últimos 365 días.

### 5.2 Conjunto de Retargeting
Nombre: `Retargeting_VV+LP_30d`
- Mismo objetivo/evento (`Schedule`), **presupuesto $10-15/día**.
- **Público:** combinar VV-50 + Visitantes LP + Abrió calendario sin agendar.
- **Excluir:** quienes ya dispararon `Schedule` (agendaron) y compradores.
- **Anuncios (Marcelo talking head + objeción):**
  - Retargeting A: **Miedo al crudo** (Marcelo).
  - Retargeting B: **Costo de no actuar / precio**.
  - Retargeting C: **Caso de éxito / autoridad + urgencia** ("agenda esta semana").
- **Botón CTA:** **Reservar**.

### 5.3 (Opcional) Públicos similares
Cuando tengas 50-100 agendas, crea **Lookalike 1-3%** basado en quienes dispararon
`Schedule` (no en todos los visitantes). Úsalo como conjunto frío adicional.

---

## PARTE 6 — Checklist de lanzamiento (revisar antes de "Publicar")

- [ ] Pixel + CAPI activos; eventos `Lead` y `Schedule` probados (reserva de prueba).
- [ ] Dominio verificado; `Schedule` priorizado en eventos agregados.
- [ ] Objetivo = Clientes potenciales; conversión = Sitio web; evento correcto.
- [ ] Presupuesto $50/día a nivel conjunto (ABO).
- [ ] Ubicaciones Grupo A; edad 25-55; idioma Español.
- [ ] Ubicaciones Advantage+ activadas.
- [ ] 6-7 anuncios subidos, todos 9:16 con subtítulos.
- [ ] Marcelo importado con "Usar publicación existente" (hereda prueba social).
- [ ] URL correcta + UTMs en cada anuncio.
- [ ] CTA "Más información" en prospección.
- [ ] Landing carga rápido en móvil (<3 s) y calendario funciona en móvil.
- [ ] Secuencia de recordatorios anti no-show activa.

---

## PARTE 7 — COPY de cada anuncio (listo para pegar)

> Voz: cálida, directa, tutea. Sin em-dashes. Sin promesas absolutas ("cura",
> "garantizado 100%"). Todo cierra en "agenda tu llamada de evaluación, sin costo".

### Anuncio 1 — Alergias
**Texto principal:**
```
¿Cambiaste de croqueta 3, 4, 5 veces y tu salchicha sigue rascándose?

El problema no es la marca. La alergia no empieza en la piel, empieza en su intestino. El 70% de su sistema inmune vive ahí, y años de ultraprocesado lo inflaman: por eso aparece la picazón, la piel roja y la caída de pelo.

Soy el Dr. Marcelo Hernán y ayudo a familias a resolver esto desde la raíz, no tapando síntomas.

Agenda una llamada de evaluación para tu salchicha, sin costo, y diseñamos juntos su plan.
```
**Titular:** `Las alergias empiezan en su intestino`
**Descripción:** `Evaluación con un especialista en nutrición de salchichas`
**CTA:** Más información

### Anuncio 2 — IVDD
**Texto principal:**
```
1 de cada 4 perros salchicha desarrolla IVDD (hernia discal). Y el factor número uno no es la genética: es el sobrepeso.

Cada kilo de más sobre esa columna larga es una bomba de tiempo. La buena noticia es que se puede prevenir desde el plato.

Soy el Dr. Marcelo Hernán. Te ayudo a proteger la columna de tu salchicha con un plan nutricional individual, paso a paso.

Agenda tu llamada de evaluación, sin costo.
```
**Titular:** `Su columna depende de lo que come`
**Descripción:** `Plan nutricional para prevenir IVDD, hecho para tu caso`
**CTA:** Más información

### Anuncio 3 — Dermatitis
**Texto principal:**
```
La piel roja, el rascado y la caída de pelo no son la temporada ni las pulgas. Son el grito de auxilio de tu salchicha.

Tratar la piel sin cambiar el plato es como secar el piso con la llave abierta. Hay 3 verdades sobre la dermatitis que casi nadie te explica, y todas empiezan dentro de su cuerpo.

Soy el Dr. Marcelo Hernán. Resolvemos la causa, de adentro hacia afuera.

Agenda una llamada de evaluación para tu salchicha, sin costo.
```
**Titular:** `La dermatitis se resuelve desde la raíz`
**Descripción:** `Un veterinario enfocado solo en perros salchicha`
**CTA:** Más información

### Anuncio 4 — Energía Baja
**Texto principal:**
```
¿Tu salchicha duerme todo el día, subió de peso y ya no es el de antes?

Con croquetas, un dachshund vive apenas al 40% de su potencial. El otro 60%, energía, peso ideal y pelaje brillante, se activa cambiando lo que entra a su plato.

Soy el Dr. Marcelo Hernán y te muestro cómo, con un plan hecho para tu perro.

Agenda tu llamada de evaluación, sin costo.
```
**Titular:** `Tu salchicha puede recuperar su energía`
**Descripción:** `Plan de nutrición natural individual para tu dachshund`
**CTA:** Más información

### Anuncio 5 — Sobrepeso
**Texto principal:**
```
El sobrepeso en un salchicha no es estético. Es una bomba de tiempo para su columna.

Cada kilo de más acerca el riesgo de hernia discal y le resta años de vida. El veterinario te reta, pero nadie te dice exactamente qué darle. Yo sí.

Soy el Dr. Marcelo Hernán. Diseñamos juntos el plan para que tu salchicha llegue a su peso ideal sin pasar hambre.

Agenda tu llamada de evaluación, sin costo.
```
**Titular:** `Su peso ideal protege su columna`
**Descripción:** `Evaluación personalizada con un especialista en salchichas`
**CTA:** Más información

### Retargeting A — Miedo al crudo (Marcelo)
**Texto principal:**
```
¿Te da miedo pasar a la alimentación cruda? Es lógico pensar "y si se atora, y si le falta calcio, y si le hace daño".

La verdad es otra: el riesgo real es seguir confiando en un ultraprocesado que lo inflama todos los días. Con el método no adivinas nada: gramajes exactos, transición paso a paso y acompañamiento.

Ya viste el problema. Demos juntos el siguiente paso.

Agenda tu llamada de evaluación, sin costo.
```
**Titular:** `El crudo se hace con método, no adivinando`
**Descripción:** `Transición paso a paso con acompañamiento real`
**CTA:** Reservar

### Retargeting B — Costo de no actuar
**Texto principal:**
```
Una croqueta "premium" cuesta unos 50 dólares al mes. Lo caro viene después: dermatólogo, exámenes, cremas, corticoides, y en el peor caso una cirugía de columna de miles de dólares.

Resolver la raíz hoy es la decisión más económica que puedes tomar por tu salchicha.

Soy el Dr. Marcelo Hernán. Hablemos de tu caso.

Agenda tu llamada de evaluación, sin costo.
```
**Titular:** `Lo barato sale caro con su salud`
**Descripción:** `Resuelve la causa antes de que el problema escale`
**CTA:** Reservar

### Retargeting C — Caso de éxito + urgencia (mejor video de Marcelo)
**Texto principal:**
```
Salchichas que llegaron con picazón, sobrepeso o problemas digestivos y hoy están en su peso, con la piel sana y llenos de energía. No fue suerte, fue cambiar lo que comían y un acompañamiento paso a paso.

Tu salchicha no puede elegir lo que come. Depende de ti.

Esta semana hay cupos para evaluación. Agenda la tuya, sin costo.
```
**Titular:** `Su cambio empieza en su plato`
**Descripción:** `Acompañamiento individual los 90 días`
**CTA:** Reservar

---

## PARTE 8 — Primeros días (qué hacer y qué NO hacer)

- **NO toques nada los primeros 3-4 días** (fase de aprendizaje). Editar reinicia el
  aprendizaje.
- Vigila que entren eventos `Lead`/`Schedule` en Administrador de eventos.
- **Día 5-7:** revisa **a nivel de ANUNCIO** el costo por agenda, CTR y retención de
  video (hook rate). Identifica 1-2 ganadores.
- Pausa anuncios con gasto alto y 0 agendas (regla 3x: si gastó 3x tu CPA objetivo
  sin resultado, fuera).
- **Mide el show rate** real apenas tengas llamadas agendadas. Si <55%, refuerza
  recordatorios antes de subir presupuesto.
- **Escala** ganadores 20-30% cada 3-5 días. No dupliques de golpe.
- **Semana 2-3:** lanza el conjunto de Retargeting (PARTE 5).

---

### Fuentes
`Estrategia-Ads-Recomposicion.md`, `Avatar.md`,
`Mensajes-Angulos-y-Copy.md`, `Oferta-Recomposicion-Dachshund.md`. Skill `ads`.
