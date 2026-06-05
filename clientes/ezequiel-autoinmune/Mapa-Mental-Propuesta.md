# Mapa Mental — Propuesta para Ezequiel

> **Proyecto:** Nueva cuenta de Instagram nichada en **enfermedades autoinmunes**
> (psoriasis, vitíligo, colitis ulcerosa, Crohn) con enfoque de **medicina funcional**.
> **Equipo Villano Growth:** Sebastián (campañas + embudos + automatizaciones) · Pato/Patricio (contenido IG) · Rodrigo (ongoing + análisis) · Maxi (edición).
> **Fecha:** Junio 2026 · **Para:** reunión con Ezequiel (jueves/viernes).

Este documento es el **mapa mental visual** que le mostramos a Ezequiel. Tiene 3 piezas:

1. **Dónde está hoy** → comparativa "Agencia anterior vs Nosotros".
2. **Qué construiríamos** → el ecosistema completo (mapa mental).
3. **Cómo se conecta todo** → el embudo y los plazos.

> 💡 Los diagramas están en **Mermaid**. Se ven solos en GitHub y en cualquier editor con
> vista previa Mermaid. Para presentar en pantalla, pega cada bloque en
> [mermaid.live](https://mermaid.live) y exporta a imagen.
>
> **Imágenes ya generadas** (listas para mostrar / pegar en una slide):
> `comparativa-agencia.png` · `mapa-mental-propuesta.png` · `flujo-embudo.png` · `plazos-gantt.png`
>
> **Para regenerarlas tras editar este archivo:**
> ```bash
> printf '{"args":["--no-sandbox"]}' > /tmp/pptr.json
> npx -y @mermaid-js/mermaid-cli -p /tmp/pptr.json -i Mapa-Mental-Propuesta.md -o mapa.png
> ```

---

## 1) Dónde está hoy Ezequiel — Agencia anterior vs. Nosotros

El punto de partida honesto: lleva **3 meses** con la agencia anterior y **todavía no salió a la cancha**.
No es para atacar a nadie — es para que tenga un **punto de comparación** claro.

```mermaid
flowchart LR
    subgraph ANTES["🐢 AGENCIA ANTERIOR — 3 meses"]
        direction TB
        A1["💸 USD 4.000 de entrada<br/>por el 'armado'"]
        A2["📉 25% de las ventas<br/>(socios a porcentaje)"]
        A3["⏳ Prometido en 3 meses,<br/>va camino a 6+"]
        A4["❌ Sin embudo instalado"]
        A5["❌ 0 reels publicados<br/>(15–20 filmados, parados)"]
        A6["❌ 0 ventas con ellos"]
        A7["🤖 'Cero Chat IA' prometido,<br/>nunca implementado"]
        A8["✂️ Editores rotativos<br/>(agencia externa, corrige todo)"]
        A9["😶‍🌫️ Saturados / lentos<br/>'no veo nada'"]
        A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8 --> A9
    end

    subgraph NOSOTROS["⚡ VILLANO GROWTH — primeras 2–4 semanas"]
        direction TB
        N1["🧩 Equipo propio de 4<br/>cercano, no masivo"]
        N2["🚀 Embudo + landing + BSL<br/>en ~1 semana"]
        N3["📅 Primeras campañas y leads<br/>en 2–3 semanas"]
        N4["✅ Algo SIEMPRE implementado<br/>antes de seguir creando"]
        N5["🎬 Editores fijos (Maxi + Pato),<br/>sin corregir lo mismo 3 veces"]
        N6["🤖 Automatización + IA real<br/>(GoHighLevel + Make)"]
        N7["📊 Reporte semanal de métricas<br/>ABCL, anuncios, orgánico, conversión"]
        N8["🤝 Modelo a % alineado<br/>(si no vendes, no cobramos %)"]
        N1 --> N2 --> N3 --> N4 --> N5 --> N6 --> N7 --> N8
    end

    ANTES -.“punto de comparación”.-> NOSOTROS
```

| Tema | Agencia anterior | Villano Growth |
|---|---|---|
| **Tiempo de armado** | 3 meses prometidos → 6+ reales | Embudo en **~1 semana**, todo en **máx. 1 mes** |
| **Embudo de ventas** | No instalado | Llamada/agenda **funcionando** en 2–3 semanas |
| **Contenido publicado** | 0 reels en 3 meses | Base de **6 publicaciones** de inmediato |
| **Ventas** | 0 | Objetivo: **primeros leads en 2–3 semanas** |
| **Edición** | Editores rotativos externos | **Maxi + Pato fijos** |
| **Automatización / IA** | "Cero Chat IA" sin implementar | **GoHighLevel + Make** reales |
| **Visibilidad** | "No veo nada" | **Reporte semanal + Slack + WhatsApp** |
| **Filosofía** | Volumen de clientes, saturados | **Calidad > cantidad**, equipo cercano |

---

## 2) Qué construiríamos — el ecosistema completo

```mermaid
mindmap
  root(("🎯 Ezequiel<br/>Cuenta nueva<br/>Autoinmunes"))
    Contenido_Organico["📲 Contenido Orgánico — IG"]
      o1["Base inicial: 6 publicaciones rápidas"]
      o2["Luego: mínimo 4–5 por tanda"]
        o2a["Ideal 2–3 Reels"]
        o2b["Ideal 2–3 Carruseles"]
      o3["CALIDAD por sobre volumen → buscar alcance"]
      o4["Lo crea Pato + Ezequiel"]
        o4a["Ezequiel se graba"]
        o4b["Ezequiel revisa guiones"]
        o4c["Ezequiel manda el material"]
      o5["Historias: las sube Ezequiel"]
        o5a["Planificadas por Patricio"]
    Campanas["📢 Campañas Publicitarias"]
      c1["Sebastián + Rodrigo diseñan campañas"]
      c2["Creamos los anuncios"]
      c3["Mandamos guiones → Ezequiel se graba"]
      c4["Nosotros editamos los anuncios"]
      c5["Creativos también con IA"]
    Embudo["🔻 El Embudo"]
      e1["Orgánico + Ads → mismo embudo"]
      e2["Llamada de ventas / agenda"]
      e3["FASE 1: escalar HIGH TICKET"]
        e3a["Meta: USD 5.000–10.000 / mes"]
        e3b["Ideal: USD 10.000 / mes"]
      e4["FASE 2: LOW TICKET"]
        e4a["Vitrina de compradores"]
        e4b["Compradores Low → clientes High"]
    Stack["⚙️ Stack / Ecosistema"]
      s1["GoHighLevel = CRM"]
      s2["Automatizaciones en Make"]
      s3["Slack para métricas y rendimiento"]
      s4["Traqueo centralizado"]
    Reporte["📊 Reporte y Comunicación"]
      r1["Estado del embudo a nivel ABCL"]
      r2["Rendimiento de anuncios"]
      r3["Rendimiento del orgánico"]
      r4["Conversión"]
      r5["Reunión recurrente 1x por semana"]
      r6["Grupo de WhatsApp — los 4 trabajando"]
    Equipo["👥 Equipo"]
      eq1["Sebastián → campañas + embudos + automatización"]
      eq2["Pato → contenido IG, guiones, carruseles"]
      eq3["Rodrigo → ongoing + análisis de campañas"]
      eq4["Maxi → edición"]
      eq5["Setter/Closer → cuando toque, entrevista entre todos"]
```

---

## 3) Cómo se conecta todo — el flujo del embudo

```mermaid
flowchart LR
    subgraph FUENTES["Fuentes de tráfico"]
        ORG["📲 Contenido orgánico<br/>Reels · Carruseles · Historias"]
        ADS["📢 Campañas pagadas<br/>+ creativos con IA"]
    end

    FUENTES --> CTA["🔗 CTA directo<br/>(sin lead magnets gratis)"]
    CTA --> LP["🖥️ Landing + BSL<br/>+ formulario de calificación"]
    LP --> CRM["⚙️ GoHighLevel (CRM)<br/>+ automatizaciones Make"]

    CRM --> CALIF{¿Califica?}
    CALIF -->|Sí| AGENDA["📅 Agenda llamada<br/>Setter / Closer"]
    CALIF -->|Aún no| NUTRE["✉️ Nutrición<br/>email / Low ticket futuro"]

    AGENDA --> VENTA["💰 HIGH TICKET<br/>~USD 800 (a validar)"]
    NUTRE -.recicla.-> CALIF

    VENTA --> META["🎯 Escalar a<br/>USD 5k–10k / mes"]
    META --> LOW["🛍️ FASE 2: Low ticket<br/>vitrina de compradores"]
    LOW -.suben a High.-> VENTA

    SLACK["📊 Slack + reporte semanal<br/>ABCL · ads · orgánico · conversión"]
    CRM --- SLACK
    AGENDA --- SLACK
```

---

## 4) Plazos (lo que diferencia la velocidad)

```mermaid
gantt
    title Plan de arranque — primeras 4 semanas
    dateFormat  YYYY-MM-DD
    axisFormat  Sem %V
    section Embudo (Sebastián)
    Landing + BSL + automatización (GoHighLevel + Make)   :a1, 2026-06-08, 7d
    section Orgánico (Pato)
    Base de 6 primeras publicaciones                       :b1, 2026-06-08, 7d
    Periodicidad 2–3 reels + 2–3 carruseles                :b2, after b1, 14d
    section Campañas (Sebastián + Rodrigo)
    Primera campaña + creativos                            :c1, 2026-06-12, 7d
    Primeros leads / agendas                               :c2, after c1, 10d
    section Continuo (Rodrigo)
    Reporte semanal + optimización                         :d1, 2026-06-15, 14d
```

| Hito | Plazo | Responsable |
|---|---|---|
| Landing + BSL + automatización montadas | **~1 semana** | Sebastián |
| Cuenta IG con 6 publicaciones base | **~1 semana** | Pato |
| Primera campaña al aire | **2 semanas** | Sebastián + Rodrigo |
| Primeros leads / agendas | **2–3 semanas** | Equipo |
| Todo el sistema operativo | **máx. 1 mes** | Equipo |

---

## 5) Modelo de trabajo y notas para la propuesta formal

- **Modelo de cobro:** porcentual según ticket y facturación actual (similar a la otra agencia,
  pero con **entrega comprobable** primero). → *Confirmar números finales con Rodrigo y Pato.*
- **Ticket nuevo programa:** ~**USD 800** (a validar mercado; los autoinmunes son menos pero
  con **altísima intención de compra** vs. diabetes/hipertensión, que son muchos pero "ruidosos").
- **Sociedad de Ezequiel:** él es la cabeza + un **médico especialista en autoinmunes** (aval del título).
- **Posible 2ª cuenta:** "Una Vida Sin Medicamentos" (diabetes/hipertensión, ~8–9k seguidores, hoy parada)
  → se puede reactivar más adelante con el mismo sistema.
- **Garantía implícita:** "si te entrego una planificación, la respeto". Velocidad + cercanía es el diferencial.

### Pendientes antes de presentar (action items de la reunión)
- [ ] Consultar a **Rodrigo y Pato** el caso de Ezequiel.
- [ ] Cerrar **scope, plazos y pricing** de la propuesta formal.
- [ ] Llamar a Ezequiel para coordinar el follow-up (jueves/viernes) y mostrar este mapa.
