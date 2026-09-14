# Prompt para la IA de GoHighLevel — `01 · Motor de Calificación`

> ⚠️ **Probado el 14-09: el resultado quedó mal.** La IA del constructor no
> arma bien una estructura de este tamaño (dos condiciones anidadas, ocho
> ramas, treinta nodos). El motor **se construye a mano**, siguiendo la guía
> paso a paso:
> https://claude.ai/code/artifact/54b39d1b-4171-4b93-aee4-4ad44693f5bf
>
> Este prompt se conserva por si sirve para workflows más chicos —una entrada,
> un flujo lineal— donde el margen de error es menor.

---

```
Crea un workflow llamado "01 · Motor de Calificación" dentro de la carpeta "ÉxiTO v2".

IMPORTANTE: este workflow NO lleva ningún trigger. Se entra desde otro workflow mediante la acción "Add to Workflow". Empieza directamente con la primera acción.

Ponle a cada acción el Action Name exacto que indico entre comillas.

──────────────────────────────
PASO 1 — Condición: "¿Profesional de salud?"
Evalúa el campo personalizado de contacto: ¿Cuál es tu profesión?
Crea TRES salidas:

Rama "SÍ SALUD" — el campo es igual a "Terapeuta Ocupacional" O es igual a "Nutricionista / Fonoaudióloga / Terapeuta del Lenguaje" O es igual a "Otro profesional de la salud que trabaja con niños".

Rama "NO SALUD" — el campo es igual a "No soy profesional de la salud".

Rama None — cuando no se cumple ninguna condición.

──────────────────────────────
DENTRO DE LA RAMA "NO SALUD", tres acciones y termina:

1. Update Contact Field, Action Name "Set Tier OUT (no salud)":
   campo "Tier Score" = tier-4-out

2. Add Contact Tag, Action Name "Tags no profesional":
   tier-out, no-profesional-salud

3. Create/Update Opportunity, Action Name "Crear en Descalificada":
   Pipeline: ② Agenda · WhatsApp [Anaís]
   Etapa: Calificada (Formulario)
   Status: Lost
   Nombre de la oportunidad: {{contact.name}}
   Source: {{contact.source}}

──────────────────────────────
DENTRO DE LA RAMA None del paso 1, dos acciones y termina:

1. Add Contact Tag, Action Name "Tag Lead Revisar": lead-revisar
2. Send Slack Message, Action Name "Slack Fuera de flujo": al canal leads-conflictos,
   con el texto: "Postulación sin profesión reconocible — revisar a mano: {{contact.first_name}} {{contact.last_name}} · {{contact.phone}}"

──────────────────────────────
PASO 2 — Dentro de la rama "SÍ SALUD", agrega una Condición: "Nivel de inversión"
Evalúa el campo personalizado de contacto: ¿Cuánto tienes pensado invertir?
Crea CINCO salidas:

Rama "No invierte" — es igual a "No puedo invertir"
Rama "Bronce"     — es igual a "Entre $200 y $500 USD"
Rama "Silver"     — es igual a "Entre $500 y $1.000 USD"
Rama "Gold"       — es igual a "Entre $1.000 y $2.000 USD"
Rama None         — cuando no se cumple ninguna

──────────────────────────────
RAMA "No invierte", tres acciones y termina:

1. Update Contact Field, "Set Tier OUT (sin presupuesto)": Tier Score = tier-4-out
2. Add Contact Tag, "Tags sin presupuesto": tier-out, sin-presupuesto
3. Create/Update Opportunity, "Crear en Descalificada":
   Pipeline ② Agenda · WhatsApp [Anaís], Etapa "Calificada (Formulario)", Status Lost,
   nombre {{contact.name}}, source {{contact.source}}

──────────────────────────────
RAMA "Bronce", cinco acciones:

1. Update Contact Field, "Set Tier Bronce":
   Tier Score = tier-3-bronce
   Producto Recomendado = exito-alimentacion
2. Add Contact Tag, "Tags Bronce": tier-bronce, prospecto-exito
3. Create/Update Opportunity, "Crear Oportunidad Bronce":
   Pipeline ② Agenda · WhatsApp [Anaís], Etapa "Calificada (Formulario)", Status Open,
   nombre {{contact.name}}, source {{contact.source}}
4. Send Slack Message, "Slack Bronce": al canal 1-leads-bronce, con este texto:
   🥕 Nueva postulación {{contact.tier_score}}
   {{contact.first_name}} {{contact.last_name}} · {{contact.phone}}
   Origen: {{contact.origen}} · Campaña: {{contact.utm_campaign}}
5. Condición, "¿Decide sola?": evalúa el campo "¿Quién debe estar contigo en la reunión?"
   Rama "Decide con otro" — es igual a "Mi pareja / esposo(a), decidimos juntos."
   O es igual a "Mis padres o familiar me apoyan en la decisión."
   O es igual a "El centro o empresa donde trabajo, ellos aprueban la inversión."
   Dentro de esa rama: Add Contact Tag, "Marcar decisor-tercero": decisor-tercero
   La rama None no hace nada.

──────────────────────────────
RAMA "Silver": exactamente igual que Bronce, cambiando:
   Tier Score = tier-2-silver
   Tags: tier-silver, prospecto-exito
   Action Names: "Set Tier Silver", "Tags Silver", "Crear Oportunidad Silver", "Slack Silver"
   Canal de Slack: 2-leads-silver

RAMA "Gold": exactamente igual que Bronce, cambiando:
   Tier Score = tier-1-gold
   Tags: tier-gold, presupuesto-alto, prospecto-exito
   Action Names: "Set Tier Gold", "Tags Gold", "Crear Oportunidad Gold", "Slack Gold"
   Canal de Slack: 3-leads-gold

──────────────────────────────
RAMA None del paso 2, dos acciones y termina:

1. Add Contact Tag, "Tag Lead Revisar": lead-revisar
2. Send Slack Message, "Slack Fuera de flujo": al canal leads-conflictos, con el texto:
   "Postulación sin nivel de inversión reconocible — revisar a mano: {{contact.first_name}} {{contact.last_name}} · {{contact.phone}}"

──────────────────────────────
Déjalo en Draft, no lo publiques.
```

---

## Qué revisar después, sí o sí

1. **Los textos de las opciones**, uno por uno. Si falta un acento o una barra,
   la condición no matchea nunca y **todas las leads caen en `None`**. Es el
   error más probable y el más silencioso.
2. **La etapa de cada oportunidad.** Tiene que decir `Calificada (Formulario)`.
   Si queda vacía se repite la falla F-10 del workflow viejo.
3. **Que exista la rama `None`** en las dos condiciones grandes. Es la que
   manda a revisión humana lo que no se entiende.
4. **Los canales de Slack.** Los nombres actuales son `1-leads-bronce`,
   `2-leads-silver`, `3-leads-gold` y `leads-conflictos`. Si la IA no los
   encuentra, seleccionarlos a mano del desplegable.
