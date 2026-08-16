# TeraXcel — Diagnóstico y Embudo MVP

**Cliente:** TeraXcel Clinics · Terapia celular avanzada
**Ubicación:** Puerto Varas, Región de Los Lagos, Chile (−41.318762, −72.983102)
**Alcance:** Gestión de campañas Meta + tráfico a landing de dolor lumbar
**Fecha:** 16 de agosto de 2026
**Preparado por:** Villano Growth

---

## Resumen ejecutivo

TeraXcel tiene un producto validado y un problema de captación. Cinco años de
piloto en Puerto Varas, una tasa de éxito declarada del 90% en dolor lumbar
crónico de larga data, un ticket de ~$700.000 CLP y pacientes que ya gastaron
entre $1.000.000 y $1.100.000 antes de llegar. El producto no está en duda.

Lo que falla es todo lo que ocurre **antes** de que el paciente entre a la
clínica:

1. **No hay medición.** Sin Pixel ni API de Conversiones, Meta optimiza a
   ciegas y entrega el tráfico más barato, no el más rentable.
2. **No hay filtro.** El dolor lumbar afecta a uno de cada tres chilenos.
   Cualquier campaña genera volumen; sin calificación, ese volumen es ruido.
   Es exactamente lo que hizo perder dinero con la agencia anterior.
3. **No hay activo propio donde aterrizar el tráfico.** Instagram apunta a
   AgendaPro, la ubicación apunta a coordenadas GPS y no existe ficha de Google
   Business Profile. El negocio es presencial y no tiene dirección verificable.
4. **La promesa está a medio camino.** La bio de Instagram ya dice lo correcto
   ("no somos una clínica de kinesiología"), pero el resto de la comunicación
   no lo sostiene y no le habla directo a quien ya lo intentó todo.
5. **La prueba social está secuestrada.** Hay 62 reseñas con 4.9 de promedio
   atrapadas dentro de AgendaPro, donde no las ve nadie que busque en Google.

El MVP propuesto ataca los cinco puntos en orden de bloqueo: primero la
infraestructura de medición, después el filtro, después el tráfico. Un solo
avatar, una sola patología: **dolor lumbar**. Nada más hasta validar.

**Compromiso:** método, medición y gestión. No cantidad de pacientes.

---

## 1. Contexto del negocio (lo que declaró el cliente)

- Clínica de patologías musculoesqueléticas complejas. El paciente objetivo ya
  pasó por tratamiento tradicional, infiltraciones e incluso cirugía, y sigue
  con dolor.
- Se posicionan en el **vacío terapéutico** entre la kinesiología tradicional y
  la cirugía.
- Método propio con equipamiento de alta tecnología (**láser percutáneo**).
  Únicos en Latinoamérica con esta tecnología y modelo de trabajo.
- Se comunican como **fisioterapeutas**, no como kinesiólogos, por decisión
  estratégica: el paciente ya tuvo mala experiencia con kinesiología.
- Tasa de éxito declarada: **90%** en pacientes con dolor lumbar crónico de
  larga data.
- Ticket del tratamiento: **~$700.000 CLP**. Promedio de tratamiento: 2 semanas.
- El paciente promedio ya gastó entre **$1.000.000 y $1.100.000** de su bolsillo
  antes de llegar.
- Piloto de 5 años en Puerto Varas. Modelo pensado para escalar a **10–15
  sucursales** a nivel nacional.
- Hoy **no invierten nada en Meta** y no tienen Business Manager propio.
- Ya tienen grabado un video de 30–40 segundos y una landing en desarrollo
  (a cargo de un tercero externo).
- Tienen CRM clínico propio + **Nexor** contratado para el filtro y
  agendamiento final. Agenda Pro y MediLink en evaluación.

**Posición del cliente frente a agencias:** experiencia previa negativa. No
quiere contratos con mínimos de meses ni gasto fijo alto. Quiere una prueba
acotada, medible, y escalar solo si funciona.

### Cifras de referencia

| Indicador | Valor |
|---|---|
| Ticket del tratamiento | ~$700.000 CLP |
| Duración del tratamiento | ~2 semanas |
| Tasa de éxito declarada | 90% (dolor lumbar crónico de larga data) |
| Gasto previo del paciente | $1.000.000 – $1.100.000 CLP |
| Años de piloto | 5 (Puerto Varas) |
| Inversión actual en Meta | $0 |
| Sucursales objetivo | 10–15 a nivel nacional |

---

## 2. Diagnóstico: por qué falló la agencia anterior

**Lo que hacían:** publicación pagada sobre una patología → landing → CRM →
agendamiento. Sin filtro, sin medición de retorno.

**Resultado:** volumen alto de pacientes que no calificaban ni compraban.
Perdieron dinero.

### Las tres causas reales

1. **No había filtro previo.** El dolor lumbar afecta a uno de cada tres
   chilenos. Cualquier campaña genera volumen; sin calificación, ese volumen es
   ruido.
2. **No había retroalimentación de datos hacia Meta.** Sin Pixel ni API de
   Conversiones configurados, el algoritmo no sabe qué es un buen lead y
   optimiza hacia lo más barato, no hacia lo más rentable.
3. **Se optimizó por costo por lead, no por costo por paciente.** Un lead a
   $3.000 se ve barato en el reporte y no vale nada en la caja.

---

## 3. Mejoras detectadas

### 3.1 Infraestructura y medición — bloqueante

Sin esto la campaña no funciona. Es lo primero que se implementa.

| Hallazgo | Impacto | Acción |
|---|---|---|
| No se sabe dónde está alojada la landing ni en qué software | Sin acceso no se puede instalar medición | Contacto con el desarrollador de la landing y definición del stack |
| Pixel y API de Conversiones sin configurar | Meta optimiza a ciegas y entrega tráfico de baja calidad | Instalación de Pixel + CAPI con eventos por etapa del lead |
| No existe un CRM de marketing separado del CRM clínico | Un CRM médico no se conecta a Meta; sin eso no hay devolución de datos | CRM de marketing intermedio (GoHighLevel) antes de Nexor |
| No hay Business Manager ni cuenta publicitaria | Riesgo de que los activos queden fuera del control del cliente | Creación desde cero, en sesión limpia, con el cliente como propietario |
| Sin registro de compra en el CRM | No se puede calcular CAC ni ROAS real por campaña | Marcar estado "comprado" y devolver el evento a Meta |

### 3.2 Riesgo de fatiga creativa

Un solo video, por bien producido que esté, se quema rápido. La frecuencia sube,
el costo por lead sube y el rendimiento cae. La producción continua de creativos
no es un extra: **es lo que sostiene el costo por lead en el tiempo**.

---

## 4. Auditoría de presencia digital

> Esta sección amplía y reemplaza el apartado "3.2 Activos digitales" de la
> versión anterior del documento. Lo que antes era una lista de oportunidades
> ahora es una auditoría con evidencia, severidad y corrección propuesta.

### 4.1 Tabla de hallazgos

| # | Hallazgo | Evidencia | Severidad | Corrección |
|---|---|---|---|---|
| A1 | **No existe Google Business Profile.** Al buscar la dirección aparecen coordenadas GPS en lugar de una ficha. | Captura: resultado de Google Maps mostrando `41°19'07.5"S 72°58'59.2"W` / `−41.318762, −72.983102` sin nombre de negocio | **Crítica** | Crear y verificar la ficha de Google Business Profile con categoría, horario, fotos, servicios y dirección exacta |
| A2 | **Sin reseñas de Google.** Sin ficha no hay reseñas acumuladas, que es el principal validador para un paciente que ya desconfía. | Ausencia de ficha (A1) | **Crítica** | Campaña de solicitud de reseñas a la base de pacientes tratados; enlace directo de reseña en el alta del tratamiento |
| A3 | **62 reseñas 4.9 atrapadas en AgendaPro.** La prueba social existe, pero vive en una plataforma que nadie busca. | Captura del enlace del perfil: `4.9 ★ (62 reseñas)` dentro del linktree de AgendaPro | **Alta** | Migrar el flujo de solicitud de reseña hacia Google; usar las 62 existentes como prueba social en landing y retargeting |
| A4 | **"Visita nuestra web" no lleva a la web del negocio.** El botón del linktree apunta a AgendaPro, no a un destino propio de TeraXcel. | Captura del linktree `link.agendapro.com/cl/teraxcel/3f996812` | **Alta** | Reemplazar el linktree por un destino propio; el botón de web debe llevar a `teraxcel.cl` |
| A5 | **"Nuestra ubicación" lleva a coordenadas.** Para un negocio presencial es de los peores destinos posibles: no da nombre, ni horario, ni fotos, ni cómo llegar. | Captura de Google Maps con coordenadas planas | **Crítica** | Apuntar el botón a la ficha de Google Business Profile una vez verificada |
| A6 | **Todo el tráfico social pasa por AgendaPro.** El único enlace del perfil es un linktree de un proveedor: sin píxel, sin analítica propia, sin control del diseño ni del mensaje. | Bio de Instagram: un solo enlace, a AgendaPro | **Alta** | Centralizar el tráfico en destino propio (web simple o chatbot), con Pixel instalado |
| A7 | **Perfil de Instagram sin optimizar.** Nombre de perfil sin palabra clave ni ciudad, sin CTA en la bio, destacadas desordenadas (logística mezclada con clínica). | Captura del perfil: `teraxcel.clinics` · "TERAXCEL Clinics \| Casos Complejos" · destacadas *Testimonios, Tratamientos, Fibromialgia, Dolor lumbar, Estacionamiento, SIS, UBICACIÓN* | **Media** | Reescritura de nombre, bio y CTA; reordenar destacadas por prioridad clínica |
| A8 | **Sigue a más cuentas de las que lo siguen** (2.895 seguidos vs 2.478 seguidores). Señal de autoridad negativa para un perfil médico. | Captura del perfil | **Media** | Limpieza de seguidos; crecimiento por contenido, no por follow-back |
| A9 | **Feed en formato antiguo con recortes visibles.** Fotografías fijas y piezas de texto con la imagen cortada dentro de la cuadrícula. | Captura de la cuadrícula del feed | **Media** | Plantillas 4:5 con zona segura; auditoría de las piezas ya publicadas |
| A10 | **Bot de WhatsApp actual es el de AgendaPro**, con limitaciones de integración frente a Nexor. | Declarado por el cliente | **Media** | Evaluar reemplazo por chatbot propio conectado al CRM de marketing |
| A11 | **Marca personal del fundador sin explotar.** Creador del método, director de una academia de láser percutáneo en Europa, único referente en Sudamérica, dos ponencias en CLAF 2026. | Captura del feed (pieza CLAF 2026) | **Oportunidad** | Fuera del MVP. Se levanta como activo de autoridad para una fase posterior |

### 4.2 Detalle de las capturas

**Perfil de Instagram — `@teraxcel.clinics`**
302 publicaciones · 2.478 seguidores · 2.895 seguidos · Categoría: Medicina y
salud. Bio: *"Tratamiento avanzado. No somos una clínica de kinesiología. Somos
el lugar al que llegan los pacientes cuando lo convencional ya no funcionó."*
Enlace único: `link.agendapro.com/cl/teraxcel/3f996812`. Destacadas:
Testimonios · Tratamientos · Fibromialgia · Dolor lumbar · Estacionamiento ·
SIS · UBICACIÓN.

> La bio ya contiene el mejor ángulo de la marca. El problema es que ese ángulo
> muere en un enlace de AgendaPro.

**Cuadrícula del feed**
Mezcla de piezas de marca (fondo blanco/azul con hexágonos), fichas de equipo
médico, video de procedimiento y testimonios en video con subtítulos quemados.
Los testimonios son el material más fuerte y hoy están dispersos entre piezas
institucionales.

**Linktree de AgendaPro**
Cabecera con logo, "Bienvenido a método TeraXcel", 4.9 ★ (62 reseñas) y cuatro
botones: *Agenda tu próxima cita · Visita nuestra web · Hablar por WhatsApp ·
Nuestra ubicación*. Pie con marca de AgendaPro y un botón "Prueba AgendaPro
aquí" — publicidad del proveedor dentro del activo de la marca.

**"Visita nuestra web" → agendapro.com**
El botón no lleva a la web de TeraXcel, lleva al sitio comercial de AgendaPro
("Agenda servicios de belleza, salud y bienestar cerca de ti"). Un paciente que
busca información clínica termina en un marketplace de reservas de estética.

**"Nuestra ubicación" → coordenadas**
`41°19'07.5"S 72°58'59.2"W` · `−41.318762, −72.983102`. Un pin sin nombre, sin
horario, sin fotos y sin reseñas. Para un negocio presencial que necesita que el
paciente viaje hasta Puerto Varas, es el peor resultado posible.

### 4.3 Por qué esto importa más de lo que parece

El paciente objetivo de TeraXcel ya desconfía. Gastó un millón de pesos, pasó
por kinesiología, por infiltraciones y a veces por pabellón, y sigue con dolor.
Cuando ve un anuncio, lo primero que hace **no** es hacer clic: busca el nombre
de la clínica en Google.

Hoy esa búsqueda no devuelve nada verificable. Ni ficha, ni reseñas, ni
dirección con nombre. Un restaurante de barrio tiene más señales de existencia
real que una clínica con cinco años de operación y un ticket de $700.000.

Esto no es cosmético: es una fuga silenciosa que se paga en cada peso invertido
en Meta. La ficha de Google y las reseñas son **el mínimo**, no un extra.

---

## 5. Reposicionamiento de la promesa

La promesa actual es correcta en el fondo y tibia en la forma. Está escrita para
describir a la clínica, no para interpelar al paciente.

**Regla:** la promesa le habla a quien ya lo intentó todo y está cansado. No a
quien tiene una molestia lumbar de tres semanas.

### 5.1 Reescritura

| Elemento | Hoy | Propuesta |
|---|---|---|
| Nombre de perfil IG | `TERAXCEL Clinics \| Casos Complejos` | `TeraXcel \| Dolor crónico · Puerto Varas` |
| Primera línea de bio | "Tratamiento avanzado" | "Para quien ya probó todo y sigue con dolor" |
| Cuerpo de bio | "No somos una clínica de kinesiología. Somos el lugar al que llegan los pacientes cuando lo convencional ya no funcionó." | Se mantiene: es el mejor activo de copy que tiene la marca |
| CTA de bio | *(no hay)* | "Responde 5 preguntas y te decimos si eres candidato ↓" |
| Enlace | Linktree de AgendaPro | Destino propio con Pixel |

### 5.2 Los cuatro ángulos de la promesa

Todos parten del mismo lugar: **el paciente ya lo intentó**.

1. *"Te operaste y sigues con dolor."*
2. *"No te has operado y ya no aguantas más."*
3. *"Cada mes estás peor que el anterior."*
4. *"Si ya no confías en la kinesiología: nosotros no somos kinesiólogos, somos
   fisioterapeutas."*

El cuarto es el ángulo de diferenciación y el que mejor recoge la objeción real
del avatar.

### 5.3 Lo que la promesa no debe hacer

- No prometer curación ni porcentajes de éxito en el anuncio frío.
- No hablar de tecnología antes de hablar del dolor. El láser percutáneo es la
  razón por la que funciona, no la razón por la que hacen clic.
- No usar testimonios con público frío: no le sirven de nada a quien todavía no
  conoce la marca. Van en retargeting.

---

## 6. Arquitectura de tráfico centralizado

Hoy el tráfico se reparte entre Instagram → AgendaPro → (web de AgendaPro,
WhatsApp de AgendaPro, coordenadas GPS). Nada de eso es medible ni propio.

**Principio:** un solo destino, propio, con Pixel. Web **simple, no
corporativa**: una página que hace una pregunta y captura una respuesta, no un
sitio institucional con "Quiénes somos".

```
                 Instagram bio ─┐
                    Anuncios ──┼──▶  DESTINO PROPIO  ──▶  CRM de marketing
   Google Business Profile ────┤     (web simple o          (GoHighLevel)
                  WhatsApp ────┘      chatbot)                    │
                                          │                       ▼
                                       Pixel                    Nexor
                                          │              filtro + agendamiento
                                          ▼                       │
                                    Meta (CAPI)  ◀────────────────┘
```

### 6.1 Las dos opciones de destino

| | Web simple | Chatbot |
|---|---|---|
| Qué es | Una página: promesa + VSL + formulario de 5 preguntas | Conversación guiada en WhatsApp con las mismas 5 preguntas |
| A favor | Medible al detalle, retargeting limpio, escala sin costo marginal | Menor fricción, el paciente ya está en WhatsApp, califica conversando |
| En contra | Requiere que el paciente lea | Más difícil de medir, depende de la integración con Nexor |
| Recomendación | **Destino principal del MVP** | Segunda fase, o como salida del formulario |

En ambos casos el requisito es el mismo: **destino propio, con Pixel, bajo
control del cliente**. Nunca más un enlace de proveedor como único activo.

### 6.2 Qué se hace con AgendaPro

No se elimina. Se degrada de "puerta de entrada" a "herramienta de
agendamiento". El linktree deja de ser el enlace de la bio; el botón de agenda
sigue existiendo, pero dentro del destino propio.

---

## 7. Embudo MVP propuesto

Un solo avatar, una sola patología: **dolor lumbar**. Nada más hasta validar.

```
  1  Anuncio (video 30–40 seg)
        ↓
  2  Formulario de calificación (4–5 preguntas)
        ↓
  3  Landing con VSL técnica sobre dolor lumbar
        ↓
  4  Captura de datos
        ↓
  5  CRM de marketing  (Pixel + CAPI devuelven el evento a Meta)
        ↓
  6  Nexor → filtro final → agendamiento clínico
```

### 7.1 Dos variantes a testear en paralelo

| Variante | Orden | Hipótesis |
|---|---|---|
| **A** | Anuncio → Formulario → Landing/VSL | Filtra antes de gastar atención; menos curiosos llegan a la landing |
| **B** | Anuncio → Landing/VSL → Formulario | La VSL calienta antes de pedir datos; mejor calidad, menor volumen |

Se comparan por **costo por lead y por calidad de lead**, no solo por volumen.

### 7.2 Formulario de calificación

Cuatro o cinco preguntas directas, **antes** de pedir datos de contacto:

1. ¿Hace cuánto tiempo tiene dolor lumbar?
2. ¿Qué tratamientos ha probado antes? (kinesiología, infiltraciones, cirugía)
3. ¿Ha invertido antes en algún otro tipo de tratamiento?
4. Del 1 al 10, ¿cuánto le duele o cuánto le perjudica su día a día?
5. ¿Qué tan urgente necesita resolverlo?

Las respuestas alimentan un **lead scoring** que se devuelve a Meta como señal
de calidad. Cada etapa marcada le enseña al algoritmo a buscar más gente como
esa: *"solo está explorando opciones"* es una señal distinta a *"ya me operé y
no aguanto más"*.

### 7.3 Lead scoring — rúbrica propuesta

Cada pregunta puntúa de 0 a 3. Total: 0–15.

| Pregunta | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Tiempo con dolor | < 3 meses | 3–12 meses | 1–3 años | > 3 años |
| Tratamientos probados | Ninguno | Kinesiología | Kinesiología + infiltraciones | Cirugía |
| Inversión previa | No ha invertido | < $300.000 | $300.000–$1.000.000 | > $1.000.000 |
| Intensidad del dolor (1–10) | 1–4 | 5–6 | 7–8 | 9–10 |
| Urgencia | Explorando | Próximos meses | Este mes | Ahora |

| Rango | Segmento | Qué ocurre |
|---|---|---|
| **10–15** | **A — Caliente** | Se marca `LeadCalificado`, pasa a Nexor con prioridad, se devuelve a Meta como evento de calidad |
| **6–9** | **B — Tibio** | Entra a secuencia de nurture; se reevalúa a los 14 días |
| **0–5** | **C — Frío** | No pasa a Nexor. Se excluye de audiencias similares para no enseñarle al algoritmo a traer más gente igual |

> El valor real del scoring no es ordenar la agenda: es **impedir que Meta
> aprenda del lead equivocado**. Un lead C que se devuelve como conversión le
> enseña al algoritmo a traer mil más como él.

---

## 8. Pipeline de GoHighLevel

El CRM de marketing es la pieza que hoy no existe y sin la cual no hay
devolución de datos. El CRM clínico no se conecta a Meta; Nexor filtra y agenda,
pero no alimenta al algoritmo. GoHighLevel se sitúa **entre la landing y Nexor**.

### 8.1 Etapas del pipeline `TeraXcel — Dolor Lumbar MVP`

| # | Etapa | Se entra cuando | Automatización | Evento a Meta |
|---|---|---|---|---|
| 1 | **Lead nuevo** | Se envía el formulario | Etiquetado por variante (A/B) y por creativo | `Lead` |
| 2 | **Calificado A** | Score ≥ 10 | WhatsApp inmediato + aviso a Nexor | `LeadCalificado` *(custom)* |
| 3 | **Nurture B** | Score 6–9 | Secuencia de 4 mensajes en 14 días | — |
| 4 | **Descartado C** | Score ≤ 5 | Cierre automático + exclusión de audiencias | — |
| 5 | **Contactado** | Primera respuesta del paciente | Registro de hora de primer contacto | `Contact` |
| 6 | **Evaluación agendada** | Nexor confirma hora | Recordatorio 24 h y 2 h antes | `Schedule` |
| 7 | **Evaluación asistida** | Se marca asistencia | — | `EvaluacionAsistida` *(custom)* |
| 8 | **Propuesta entregada** | Se presenta el tratamiento | Seguimiento a 48 h | — |
| 9 | **Tratamiento comprado** | Pago confirmado | Cierre + solicitud de reseña en Google | `Purchase` · valor 700.000 CLP |
| 10 | **Perdido** | Sin respuesta o rechazo | Motivo obligatorio de pérdida | — |

La etapa 9 es la que cierra el circuito: sin marcar la compra en el CRM no hay
CAC ni ROAS real por campaña, y Meta nunca aprende qué anuncio trajo pacientes
de verdad.

### 8.2 Campos personalizados obligatorios

| Campo | Tipo | Origen | Para qué |
|---|---|---|---|
| `lead_score` | Número (0–15) | Calculado en el formulario | Segmentación A/B/C y señal a Meta |
| `tiempo_dolor` | Lista | Pregunta 1 | Scoring + contexto clínico |
| `tratamientos_previos` | Multi-selección | Pregunta 2 | Scoring + ángulo de retargeting |
| `inversion_previa` | Lista | Pregunta 3 | Scoring + capacidad de pago |
| `dolor_escala` | Número (1–10) | Pregunta 4 | Scoring + urgencia |
| `urgencia` | Lista | Pregunta 5 | Priorización en Nexor |
| `variante_embudo` | A / B | UTM | Comparar las dos variantes |
| `creativo_id` | Texto | UTM `utm_content` | Atribución por creativo |
| `fbclid` / `fbp` / `fbc` | Texto | Cookie + parámetro de URL | Emparejamiento en CAPI |
| `event_id` | UUID | Generado al enviar | Deduplicación Pixel ↔ CAPI |
| `estado_compra` | Sí / No | Etapa 9 | Cálculo de CAC y ROAS |

### 8.3 Automatizaciones mínimas del MVP

1. **Enrutamiento por score** — al crear el contacto, calcular `lead_score` y
   mover a la etapa 2, 3 o 4.
2. **Primer contacto en menos de 5 minutos** — WhatsApp automático a los leads
   A. La velocidad de respuesta es el factor con más impacto sobre la tasa de
   agendamiento.
3. **Puente a Nexor** — webhook con la ficha completa del lead A; Nexor hace el
   filtro final y el agendamiento.
4. **Devolución a Meta** — webhook saliente en cada cambio de etapa hacia la API
   de Conversiones.
5. **Solicitud de reseña en Google** — al llegar a la etapa 9, mensaje
   automático con el enlace directo de reseña. Esta automatización es la que
   construye el activo del hallazgo A2.
6. **Reporte diario** — resumen de leads por segmento, costo por lead calificado
   y estado del pipeline.

---

## 9. Meta: Pixel y API de Conversiones

Sin esta capa el algoritmo optimiza a ciegas. Es la causa #2 del fracaso
anterior y la primera prioridad técnica del MVP.

### 9.1 Arquitectura

```
  Navegador                          Servidor
  ─────────                          ────────
  Pixel (fbq)                        GoHighLevel (webhook)
      │                                    │
      │  event_id: 9f3c-…                  │  event_id: 9f3c-…
      │  fbp / fbc                         │  PII con hash SHA-256
      ▼                                    ▼
  ┌──────────────────────────────────────────────┐
  │        Meta — deduplicación por event_id      │
  └──────────────────────────────────────────────┘
                        │
                        ▼
        Optimización por lead calificado y compra
```

El mismo evento se envía por los dos caminos con el **mismo `event_id`**. Meta
descarta el duplicado y se queda con el que llegue completo. Esto recupera las
conversiones que el navegador pierde por bloqueadores, iOS y cookies de
terceros.

### 9.2 Mapa de eventos

| Evento | Origen | Cuándo | Parámetros clave |
|---|---|---|---|
| `PageView` | Pixel | Carga de la landing | `fbp`, `fbc` |
| `ViewContent` | Pixel | 25% de la VSL reproducida | `content_name: vsl-lumbar` |
| `Lead` | Pixel + CAPI | Envío del formulario | `event_id`, `lead_score`, PII con hash |
| `LeadCalificado` *(custom)* | CAPI | Score ≥ 10 | `value` estimado, `lead_score` |
| `Contact` | CAPI | Primera respuesta del paciente | — |
| `Schedule` | CAPI | Evaluación agendada en Nexor | fecha de la cita |
| `EvaluacionAsistida` *(custom)* | CAPI | Asistencia marcada | — |
| `Purchase` | CAPI | Pago confirmado | `value: 700000`, `currency: CLP` |

### 9.3 Requisitos técnicos

- **Business Manager y cuenta publicitaria creados desde cero**, en sesión
  limpia, con **el cliente como propietario** de los activos.
- Dominio `teraxcel.cl` **verificado** en el Business Manager.
- Configuración de **Eventos Agregados** priorizando: `Purchase` >
  `LeadCalificado` > `Schedule` > `Lead` > `ViewContent`.
- PII con hash SHA-256 en el lado servidor: correo, teléfono en formato E.164,
  nombre, apellido, ciudad, `country: cl`.
- `action_source`: `website` para eventos de navegador, `system_generated` para
  los eventos de etapa del CRM.
- Ventana de envío del evento servidor: menos de 60 minutos desde que ocurre.
- Objetivo de calidad de emparejamiento (*Event Match Quality*): **≥ 6.0**.

### 9.4 Qué se optimiza en cada fase

| Fase | Evento de optimización | Por qué |
|---|---|---|
| Días 1–7 | `Lead` | No hay volumen suficiente para optimizar por eventos posteriores |
| Semana 2–3 | `LeadCalificado` | Ya hay señal de calidad; se deja de comprar volumen |
| Semana 4 en adelante | `Purchase` (si hay ≥ 15/semana) o `LeadCalificado` | Solo con volumen suficiente la optimización por compra es estable |

---

## 10. Estructura de campañas

Tres campañas trabajando en conjunto:

1. **Testeo de creativos.** Presupuesto de entrada. Todos los ángulos compiten
   entre sí; en pocos días uno o dos se comen el presupuesto y aparecen los
   ganadores.
2. **Escalado.** Recibe solo los creativos validados en testeo. Es la que recibe
   la mayor parte de la inversión.
3. **Retargeting.** La más barata y la de menor presupuesto. Impacta a quien ya
   llenó parte del formulario, visitó la landing o no agendó. **Aquí sí van los
   testimonios y la prueba social.** No se muestran testimonios a público frío:
   no sirven de nada a quien todavía no conoce la marca.

### 10.1 Ángulos de creativo (4–5 mínimo, grabables con teléfono)

- Ya se operó y sigue con dolor.
- No se ha operado pero ya no aguanta más.
- Ve que la situación va empeorando.
- Adulto en edad laboral, el dolor le está afectando el trabajo.
- **Ángulo de diferenciación:** "si ya no confía en la kinesiología, nosotros no
  somos kinesiólogos, somos fisioterapeutas".

El video profesional ya grabado funciona como creativo principal; los ángulos
adicionales se producen rápido y sin producción.

### 10.2 Testeo de hooks

Manteniendo cuerpo y llamado a la acción idénticos, se cambian **solo los
primeros 3 segundos**. La diferencia de rendimiento entre hooks puede ser enorme
sobre un mismo contenido. Esto evita descartar un buen anuncio por un mal
gancho.

---

## 11. Presupuesto e inversión

Partir bajo es deliberado: con la cuenta nueva y sin historial, meter mucho
presupuesto de entrada quema dinero en fase de aprendizaje.

| Etapa | Testeo | Escalado | Retargeting | Total diario |
|---|---|---|---|---|
| Días 1–7 | USD 10–15 | — | — | **USD 10–15** |
| Semana 2 | USD 15–20 | USD 15–20 | USD 10 | **USD 40–50** |
| Semana 3 en adelante | USD 20 | USD 30 | USD 15 | **USD 60–70** |

El escalado solo avanza si el testeo está entregando leads de calidad. Si la
configuración trae leads malos, **no se escala: se corrige**.

---

## 12. Economía del lead — cómo se mide el éxito

- Ticket del tratamiento: **~$700.000 CLP**.
- Costo por lead tolerable: **~$70.000 CLP** (10% del ticket).
- Una campaña tradicional entrega leads a $3.000 y no convierte. **Barato no es
  bueno.**
- Métricas de gestión: costo por lead calificado, costo de adquisición de
  cliente (CAC) y ROAS por campaña.
- El registro de compra en el CRM cierra el circuito y permite ver qué campaña
  genera **pacientes reales**, no solo formularios.

**Referencia interna de que el modelo funciona:** en un proyecto propio con
formación de USD 1.900 se opera con un CAC de USD 80, escalando desde USD
300–400 mensuales hasta cerca de USD 1.000. Se presenta como referencia
metodológica, **no como proyección para TeraXcel**.

---

## 13. Alcance del MVP

### Incluye

- Creación de Business Manager y cuenta publicitaria a nombre del cliente.
- Instalación de Pixel y API de Conversiones.
- CRM de marketing y conexión con la landing existente.
- Formulario de calificación y lead scoring.
- Estructura de tres campañas, testeo de creativos y hooks.
- Gestión, optimización y reporte diario de la inversión.

### No incluye (por ahora)

- Producción de nuevas patologías o avatares.
- Gestión de redes sociales orgánicas o marca personal.
- Integración con el CRM clínico o Nexor (lo maneja el proveedor
  correspondiente; se coordina en paralelo).
- Contenido audiovisual de producción profesional.

### Zona gris: los activos digitales

Los hallazgos de la sección 4 (**Google Business Profile, reseñas, enlaces del
perfil**) están fuera del alcance de gestión de campañas, pero afectan
directamente el rendimiento de lo que sí está dentro. Se proponen como un
paquete corto y acotado, previo o paralelo al arranque:

| Entregable | Esfuerzo | Bloqueante para campañas |
|---|---|---|
| Ficha de Google Business Profile creada y verificada | Bajo (verificación por correo postal: 1–2 semanas) | No, pero afecta la conversión desde el primer día |
| Automatización de solicitud de reseñas | Bajo | No |
| Corrección de enlaces del perfil de Instagram | Muy bajo | No |
| Destino propio con Pixel | Medio | **Sí** |

**Sin promesas de resultado.** Esta primera etapa es una prueba controlada para
validar el embudo, medir el costo real de un paciente calificado y decidir con
datos si se escala. El compromiso es sobre **método, medición y gestión**, no
sobre cantidad de pacientes.

---

## 14. Qué se necesita del cliente para arrancar

1. Contacto del desarrollador de la landing y acceso al software donde está
   alojada.
2. Video de 30–40 segundos ya grabado, para revisión.
3. Definición del perfil de paciente objetivo (documento a completar por el
   cliente).
4. Facturación mensual actual y objetivo de corto plazo, para dimensionar la
   inversión.
5. Confirmación de que el Business Manager se crea desde la cuenta del cliente,
   con propiedad de los activos de su lado.
6. **Acceso o autorización para reclamar la ficha de Google Business Profile**
   (dirección exacta, horario y persona que reciba el código de verificación).

---

## 15. Anclas para la conversación comercial

> **Uso interno de Villano Growth.** Esta sección no se incluye en la versión
> que ve el cliente.

- Condiciones estándar de la agencia: implementación + fee mensual + porcentaje
  sobre resultados.
- Para este caso se propone una **entrada reducida, sin contrato de
  permanencia**, cubriendo solo la mano de obra de implementación y gestión
  diaria (landing, Pixel, CRM, campañas).
- Justificación del monto ante el cliente: desglose entre horas de trabajo,
  herramientas digitales y porcentaje de la implementación que la agencia asume
  como riesgo compartido.
- **Modelo de ajuste progresivo:** el fee mensual sube proporcionalmente a los
  ingresos generados, en lugar de un porcentaje fijo sobre ventas. Esto responde
  directamente a su objeción con la agencia anterior.
- Punto de revisión: reporte comparativo a los 3, 6 y 12 meses de facturación
  antes y después.

---

## Anexo — Orden de implementación

| Semana | Bloque | Entregable |
|---|---|---|
| 0 | Accesos | Business Manager, cuenta publicitaria, dominio verificado, contacto del desarrollador de la landing |
| 0–1 | Medición | Pixel + CAPI, GoHighLevel, pipeline y campos personalizados |
| 1 | Filtro | Formulario de 5 preguntas, lead scoring, puente a Nexor |
| 1 | Activos | Ficha de Google Business Profile iniciada, enlaces de Instagram corregidos |
| 1–2 | Campañas | Testeo de creativos con 4–5 ángulos y testeo de hooks |
| 2–3 | Escalado | Solo si el testeo entrega leads calificados |
| 3+ | Optimización | Cambio del evento de optimización a `LeadCalificado`, retargeting con testimonios |

---

*Documento preparado por Villano Growth · 16 de agosto de 2026*
