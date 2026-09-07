# TeraXcel · Formulario Calificador — Dolor Lumbar

Formulario previo a la agenda que califica al prospecto antes de dejarlo reservar.
Destino previsto: subdominio propio (ej. `lumbar.teraxcel.cl`) o embebido en la landing.

## Objetivo

No vender la consulta: vender el ciclo de tratamiento. El formulario filtra por
tres ejes: **perfil clínico** (candidato ideal según levantamiento), **capacidad
de inversión** (medida de forma indirecta) y **criterios de exclusión médica**.

## Reglas de copy respetadas (levantamiento ago-2026)

- Nunca: "sesiones", "kinesiología", "kinesiólogo", "cura definitiva", comparación directa con cirugía.
- Siempre: "ciclo de tratamiento", "diseño de tratamiento", "consulta médica", "fisioterapeutas y equipo médico".
- El precio del ciclo (~$700.000) **no se publica**; solo los valores de entrada ($25.000 / $35.000).
- Tasa de éxito 85–90% citada con asterisco: "según seguimiento interno de pacientes que cumplen criterios".

## Lógica de calificación

Puntaje máximo: **21**.

| Pregunta | Puntos |
|---|---|
| Tiempo con dolor | <3m: 1 · 3-12m: 2 · 1-3a: 3 · +3a: 3 |
| Impacto en vida diaria | leve: 0 · limita: 2 · condiciona todo: 3 |
| Tratamientos previos (multi, tope 4) | fármacos: 1 · terapias convencionales: 1 · infiltraciones/bloqueos: 2 · cirugía: 2 · nada: 0 |
| Inversión previa (proxy indirecto de capacidad) | <$100k: 0 · $100-500k: 1 · $500k-1,5M: 2 · +$1,5M: 3 |
| Diagnóstico por imagen <8 meses | vigente: 1 · antiguo/sin examen: 0 |
| Urgencia de inicio | ya: 3 · 2-4 semanas: 2 · averiguando: 0 |
| Forma de pago del ciclo | directo: 3 · Isapre/seguro: 2 · financiamiento: 1 · no podría: 0 + **descalifica** |
| Ubicación | Los Lagos: 2 · otra región viaja: 1 · no viaja: 0 + **descalifica** |

### Categorías y rutas

1. **Bandera médica** (cáncer activo, fiebre, pérdida de fuerza progresiva,
   condición psiquiátrica no estabilizada) → `derivacion_medica`, sin agenda,
   mensaje de derivación a médico tratante.
2. **Descalificador directo** ("no podría costear" / "no puede viajar") o
   score < 8 → `no_calificado`, mensaje cortés sin agenda.
3. **Score ≥ 13** → `calificado`:
   - con resonancia <8 meses → agenda **Diseño de Tratamiento** ($25.000).
   - sin diagnóstico vigente → agenda **Consulta Médica** ($35.000).
4. **Score 8–12** → `potencial`: lo toma Nexor por WhatsApp (CTA wa.me incluido).

Umbrales ajustables en el objeto `CONFIG` del HTML (`UMBRAL_CALIFICADO`, `UMBRAL_POTENCIAL`).

## Pendientes antes de publicar (objeto CONFIG en el HTML)

- `WEBHOOK_URL`: webhook entrante de GoHighLevel que recibe el lead (payload
  incluye respuestas, `score`, `categoria`, `ruta` y UTMs).
- `URL_AGENDA_DISENO` y `URL_AGENDA_CONSULTA`: los dos calendarios GHL.
- `WHATSAPP`: número definitivo que operará Nexor.
- Validar con Joaquín los umbrales y el texto de cada pantalla de resultado.
