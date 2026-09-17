# Formulario Calificador — Versión corta de landing (v2)

> **Qué cambió respecto de v1:** se incorpora la **pregunta de cobertura** (nueva
> P5). El formulario ahora mide el dinero en dos ejes separados —**lo que el
> paciente ya gastó** y **lo que podría recuperar**— sin preguntar nunca cuánto
> estaría dispuesto a pagar por el tratamiento.
>
> **Por qué:** la P3 original ("¿cómo pagarías?") era incontestable. Nadie sabe
> qué responder sobre un precio que no conoce, y la sola pregunta instala una
> cifra imaginaria —normalmente demasiado alta— en la cabeza del paciente. Se
> reemplazó por el gasto histórico (P4) y ahora se completa con la cobertura (P5),
> que es un dato objetivo, fácil de responder y mejor predictor.

**Estructura:** 7 preguntas en el paso 1 · datos de contacto en el paso 2.
Tiempo estimado: menos de 2 minutos.

---

## Paso 1 de 2 — Tu caso

### 1 · TU HISTORIAL
**¿Cuál de estas situaciones describe tu caso?**
*Marca todas las que apliquen.*

- [ ] Ya me hicieron un procedimiento en pabellón por este dolor
      *(bloqueo facetario o cirugía de columna)*
- [ ] Ya probé tratamientos sin el resultado esperado
      *(terapias, fármacos, infiltraciones)*
- [ ] Convivo con este dolor hace más de 3 meses
- [ ] Ninguna de las anteriores

---

### 2 · TU DIAGNÓSTICO
**¿Tienes una resonancia magnética u otro examen de imagen de tu columna, relacionado con este dolor, de los últimos 8 meses?**
*Si no la tienes, no te preocupes: nuestro equipo médico puede gestionarla.*

- ( ) Sí, tengo un examen de los últimos 8 meses
- ( ) Tengo exámenes, pero son más antiguos
- ( ) No me he hecho exámenes

---

### 3 · TU DECISIÓN
**Si en la consulta se confirma que eres candidato, ¿cuándo te gustaría iniciar tu ciclo de tratamiento?**

- ( ) Lo antes posible, quiero resolver esto ya
- ( ) Dentro de las próximas 2 a 4 semanas
- ( ) Más adelante, por ahora solo estoy averiguando

---

### 4 · TU HISTORIAL
**Sumando consultas, exámenes, terapias y medicamentos, ¿cuánto has invertido aproximadamente hasta hoy en buscar una solución?**
*Una estimación sirve. Nos ayuda a entender tu recorrido.*

- ( ) Menos de $100.000
- ( ) Entre $100.000 y $350.000
- ( ) Entre $350.000 y $700.000
- ( ) Más de $700.000

---

### 5 · TU COBERTURA  ⬅ **NUEVA**
**¿Con qué cuentas hoy para financiar tu atención de salud?**
*No necesitas saber los detalles de tu plan. Esto nos permite estimar cuánto de tu tratamiento podrías recuperar vía reembolso.*

- ( ) **Isapre** y además tengo un **seguro complementario**
- ( ) **Solo Isapre**
- ( ) **Fonasa** y además tengo un **seguro complementario**
- ( ) **Solo Fonasa**
- ( ) Capredena, Dipreca u otro sistema de FF.AA. y Orden
- ( ) Prefiero no responder / no estoy seguro de lo que tengo

### 5b · condicional
> Aparece **solo** si en la P5 marcó una de las dos opciones con seguro
> complementario. Para el resto del formulario no existe: cero fricción añadida.

**Ese seguro complementario, ¿lo tienes...?**

- ( ) Por mi trabajo o el de mi pareja *(seguro colectivo de la empresa)*
- ( ) Contratado por mí *(seguro individual)*
- ( ) No lo tengo claro

---

### 6 · TU UBICACIÓN
**¿Dónde te encuentras?**
*Nuestra clínica está en Puerto Varas y atendemos de lunes a viernes.*

- ( ) En Puerto Varas o alrededores *(Puerto Montt, Llanquihue, Frutillar)*
- ( ) En otra ciudad de la Región de Los Lagos
- ( ) En otra región, y puedo viajar a Puerto Varas
- ( ) En otra región, y no podría viajar

---

### 7 · TU SALUD
**¿Alguna de estas situaciones aplica a ti actualmente?**
*Es importante para tu seguridad. Marca todas las que apliquen.*

- [ ] Cáncer activo en tratamiento
- [ ] Fiebre en los últimos días
- [ ] Pérdida de fuerza progresiva en brazos o piernas
- [ ] Condición psiquiátrica en tratamiento no estabilizado
- [ ] Ninguna de las anteriores

**[ Continuar → ]**

---

## Paso 2 de 2 — Datos de contacto

- Nombre y apellido
- WhatsApp
- Correo electrónico

---

## Por qué la pregunta está redactada así

| Decisión | Razón |
|---|---|
| **"¿Con qué cuentas?"** y no "¿tienes seguro complementario?" | La segunda se responde "no" por defecto cuando la persona duda. La primera obliga a mirar lo que sí tiene. |
| Previsión y seguro **en la misma opción**, no en dos preguntas | Una pregunta menos. El paciente piensa "Isapre con seguro" como una sola cosa, no como dos. |
| La palabra **"reembolso"** en el texto de ayuda | Es el único momento del formulario donde se insinúa que el tratamiento tiene un costo *recuperable*. Instala la idea de inversión sin decir un precio. |
| **Colectivo vs. individual** en pregunta condicional | Es la variable que más mueve el reembolso real (§4.1 de `Coberturas-Salud-Chile.md`), pero solo importa para quien ya dijo que sí. |
| **Capredena/Dipreca** como opción propia | En regiones tiene peso real. Sin esta opción, ese paciente marca cualquier cosa y ensucia el dato. |
| **"Prefiero no responder"** y no un campo obligatorio | Una pregunta de plata sin salida es donde se abandona un formulario. La no-respuesta también es información. |

---

## Criterios de decisión (v2)

| Pregunta | Califica | No califica |
|---|---|---|
| **1 · Perfil clínico** | Procedimiento en pabellón previo → **C1** · Ya probó tratamientos → **C2** · Dolor > 3 meses → **C3** | "Ninguna de las anteriores" **no descarta**: baja a C4, revisión |
| **2 · Diagnóstico vigente** | Examen < 8 meses → agenda **Diseño de Tratamiento** | Sin examen vigente → agenda **Consulta Médica**. *(No descarta: define la puerta de entrada.)* |
| **3 · Inicio del tratamiento** | Lo antes posible · Dentro de 2 a 4 semanas | Más adelante, solo estoy averiguando |
| **4 · Inversión realizada** | Cualquier tramo. Sobre $350.000 → prioridad alta | **No descarta nunca** |
| **5 · Cobertura** | Cualquier respuesta → asigna código **R1–R4 / R0** | **No descarta nunca** — ver abajo |
| **6 · Ubicación** | Puerto Varas y alrededores · Otra ciudad de Los Lagos · Otra región con posibilidad de viajar | Otra región, sin posibilidad de viajar |
| **7 · Situación médica** | Ninguna de las anteriores | Cualquier alternativa marcada: **no descarta**, pasa a revisión clínica humana |

**Resultado:** rechazan el formulario únicamente las respuestas "No califica" de
las preguntas **3** y **6**. La 7 deriva a revisión clínica. La 2 define agenda.
Las 4 y 5 priorizan, no filtran.

### Por qué la cobertura no descalifica

1. **Un paciente Fonasa no es un paciente sin plata.** Fonasa D con tres cargas,
   o un independiente que cotiza el mínimo, pueden pagar perfectamente un ciclo.
   El tramo mide ingreso imponible, no patrimonio ni decisión.
2. **La financia la familia, no el paciente.** En dolor crónico la decisión y el
   pago frecuentemente vienen de un hijo o una pareja con otra previsión.
3. **Descartar por previsión es un problema reputacional en salud.** Un
   formulario médico que rechaza por Fonasa es una captura de pantalla esperando
   ocurrir.
4. **El dato vale aunque no filtre.** R4 no se descarta: se trabaja distinto —
   otro guion, otro ritmo, contenido antes que agenda.

---

## Campos que el formulario debe enviar al CRM

| Campo | Valores |
|---|---|
| `perfil_clinico` | `C1` · `C2` · `C3` · `C4` |
| `diagnostico_vigente` | `si` · `antiguo` · `no` |
| `urgencia` | `alta` · `media` · `baja` |
| `inversion_previa` | `<100k` · `100-350k` · `350-700k` · `>700k` |
| `prevision` | `isapre` · `fonasa` · `ffaa` · `no_responde` |
| `seguro_complementario` | `si` · `no` · `no_sabe` |
| `tipo_seguro` | `colectivo` · `individual` · `no_sabe` · `n/a` |
| `score_reembolso` | `R1` · `R2` · `R3` · `R4` · `R0` |
| `cuadrante` | `verde` · `azul` · `amarillo` · `gris` |
| `ubicacion` | `pv` · `los_lagos` · `otra_viaja` · `otra_no_viaja` |
| `banderas_clinicas` | lista de marcadas |

### Cálculo de `score_reembolso`

```
Isapre + complementario colectivo ........... R1
Isapre + complementario (individual/no sabe)  R2
Isapre sola ................................. R3
Fonasa + complementario (cualquiera) ........ R3
Fonasa sola ................................. R4
FF.AA. / Orden .............................. R3  (revisión caso a caso)
No responde / no sabe ....................... R0
```

### Cálculo de `cuadrante`

```
inversion >= 350k  y  score in (R1,R2) → verde     (prioridad 1)
inversion >= 350k  y  score in (R3,R4) → azul      (prioridad 2)
inversion <  350k  y  score in (R1,R2) → amarillo  (prioridad 3)
inversion <  350k  y  score in (R3,R4) → gris      (prioridad 4)
R0 hereda el cuadrante por inversión y queda marcado para que Nexor lo resuelva.
```

---

## Qué hace Nexor con esto

| Cuadrante | Apertura del bot |
|---|---|
| 🟢 **Verde** | "Por lo que me cuentas, una parte relevante de este tratamiento podría volver a ti vía reembolso de tu seguro. Te reservo la hora más cercana." |
| 🔵 **Azul** | "Ya has recorrido bastante camino con esto. Lo que cambia acá es el enfoque: vamos al origen del dolor, no al síntoma." |
| 🟡 **Amarillo** | "Con la cobertura que tienes, esto es más accesible de lo que la gente supone. En la consulta te entregamos el detalle con códigos para tu reembolso." |
| ⚪ **Gris** | Nutrición antes que agenda: contenido, caso real, y recién después la invitación. |
| **R0** | "¿Te atiendes por Fonasa o por Isapre? ¿Y tienes algún seguro por tu trabajo? Muchos lo tienen y no lo usan." |

**Restricciones duras para Nexor:** nunca prometer un porcentaje de reembolso,
nunca afirmar "tu Isapre lo cubre", nunca nombrar un precio antes de la consulta.
Siempre condicional. El detalle está en
[`Coberturas-Salud-Chile.md`](./Coberturas-Salud-Chile.md) §5.3.

---

## Pendientes antes de publicar

- [ ] Confirmar con el equipo médico qué prestaciones del ciclo tienen **código
      de arancel** (define si el reembolso es real o marginal) — §5.1 del doc de
      coberturas.
- [ ] Definir el texto de convenios para la FAQ "¿tienen convenio con mi Isapre?".
- [ ] Implementar la condicional 5b en la herramienta de formularios.
- [ ] Crear los campos del CRM y la automatización de `score_reembolso` /
      `cuadrante`.
- [ ] Validar los umbrales de cuadrante ($350k) con los primeros 50 leads reales.
