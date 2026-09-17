# Cliente: TERAXCEL

Carpeta del cliente **TeraXcel — Fisioterapeutas y equipo médico** (Puerto Varas,
Región de Los Lagos). Tratamiento dirigido al **origen del dolor lumbar**, con
consulta médica presencial como puerta de entrada.

## La estrategia en una línea

No se vende el tratamiento en línea. Se califica al paciente con un **formulario
corto de 2 minutos** en la landing, y el bot **Nexor** lo lleva a una de dos
agendas —*Consulta Médica* o *Diseño de Tratamiento*— según si trae un examen de
imagen vigente.

```
Anuncio → Landing → Formulario corto (7 preguntas) → Nexor (WhatsApp) → Agenda
                          ╷                              ╷
                          │                              └── venta presencial
                          └── scoring: perfil clínico × urgencia × cuadrante de dinero
```

## Contenido

- [`docs/Formulario-Corto-Landing.md`](./docs/Formulario-Corto-Landing.md) —
  el formulario v2 completo, criterios de decisión, scoring y campos de CRM.
- [`docs/Coberturas-Salud-Chile.md`](./docs/Coberturas-Salud-Chile.md) —
  base de conocimiento de Fonasa, isapres y seguros complementarios para Nexor.

## Estado

**Formulario v2 en diseño.** Cambio principal respecto de v1: se eliminó la
pregunta "¿cómo pagarías el tratamiento?" —incontestable sin conocer el precio— y
el dinero se mide ahora en dos ejes: **gasto ya ejecutado** (P4) y **capacidad de
reembolso** (P5, nueva).

Bloqueador principal: falta confirmar con el equipo médico **qué prestaciones del
ciclo tienen código de arancel**. De eso depende si el reembolso es real o
marginal, y por tanto qué puede prometer Nexor.
