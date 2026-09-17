# Coberturas de salud en Chile — base de conocimiento para Nexor

> **La pregunta que responde:** cuando un paciente dice "tengo Isapre", "tengo
> Fonasa" o "tengo seguro complementario", ¿cuánta plata puede efectivamente
> recuperar de un tratamiento médico particular, y de qué depende?
>
> **Respuesta corta:** la previsión (Fonasa / Isapre) define el piso, el seguro
> complementario define el techo, y **la codificación de la prestación define si
> existe reembolso o no**. Dos pacientes con la misma Isapre pueden recuperar
> 0% y 80% del mismo tratamiento.

**Fecha de corte:** septiembre 2026. Los montos en pesos y los porcentajes de
alza se reajustan cada año — ver §9 (qué revalidar y cuándo).

---

## 1. El mapa completo en una tabla

Todo chileno está en una de estas cinco situaciones. No hay una sexta.

| Sistema | Quién está ahí | Cómo paga lo privado | Capacidad de reembolso |
|---|---|---|---|
| **Fonasa** (A, B, C, D) | ~80% de la población | Modalidad Libre Elección (MLE), con bono | **Baja** para prestaciones no aranceladas |
| **Isapre** (7 abiertas + cerradas) | ~15% | Bonificación según plan, sobre arancel de referencia | **Media**, con topes duros |
| **Isapre + seguro complementario** | subconjunto del anterior | Isapre bonifica, el seguro reembolsa el copago | **Alta** — el perfil que más recupera |
| **FF.AA. y Orden** (Capredena, Dipreca) | ~3% | Sistema propio, convenios distintos | **Variable**, caso a caso |
| **Sin previsión / particular puro** | minoría (extranjeros recién llegados, independientes sin cotizar) | Paga todo | **Nula** |

> **Regla operativa para Nexor:** el seguro complementario, no la Isapre, es lo
> que convierte un tratamiento particular en algo financieramente liviano. Un
> paciente de Isapre *sin* complementario y uno de Fonasa D están más cerca entre
> sí de lo que la gente cree.

---

## 2. FONASA

### 2.1 Tramos (referencial 2026)

| Tramo | Quién | Ingreso imponible mensual |
|---|---|---|
| **A** | Carentes de recursos, PBS, PGU | — |
| **B** | Ingreso bajo | hasta ~$539.000 |
| **C** | Ingreso medio | ~$539.001 a ~$786.940 |
| **D** | Ingreso mayor | sobre ~$786.940 |

Con **tres o más cargas familiares**, el afiliado baja un tramo (C→B, D→C). Es la
causa #1 de que un paciente declare mal su tramo.

### 2.2 Las dos modalidades

- **MAI (Modalidad Atención Institucional)** — red pública. Desde *Copago Cero*
  (2022), **los tramos B, C y D no pagan copago en la red pública**. Todo el
  mundo, en la red estatal, tiene costo cero. Lo que se paga es la espera.
- **MLE (Modalidad Libre Elección)** — prestadores privados en convenio, vía
  **bono**. Solo tramos **B, C y D** (el A no tiene MLE). Fonasa aporta un monto
  fijo por arancel y el paciente paga la diferencia.

En MLE los prestadores están inscritos en **Nivel 1, 2 o 3**. A mayor nivel,
mayor honorario del prestador y **mayor copago del paciente** — el aporte de
Fonasa no sube, sube el precio. La mayoría de las clínicas privadas de calidad
están en Nivel 3.

### 2.3 Lo que un paciente Fonasa debe entender

- **Si la prestación no está en el arancel MLE, no hay bono. Y sin bono, no hay
  aporte.** Esto es lo que ocurre con buena parte de la medicina intervencionista
  y regenerativa: no existe código, entonces el paciente paga 100%.
- **PAD (Pago Asociado a Diagnóstico, "bono PAD")** — paquete a precio fijo para
  intervenciones cerradas y estandarizadas (hernias, cataratas, parto). Es un
  producto acotado: si el tratamiento no está en la lista PAD, no aplica.
- **MCC (Modalidad de Cobertura Complementaria)** — el "seguro complementario de
  Fonasa" prometido por ley. **A septiembre de 2026 no está operativo**: Fonasa
  declaró desierta la licitación por segunda vez (mayo 2026, solo Zurich ofertó y
  solo por una de siete fracciones de riesgo) y el Minsal instruyó rediseñar el
  modelo. ⚠️ **Nexor no debe mencionarlo como opción disponible.**

---

## 3. ISAPRES

### 3.1 Quiénes son (2026)

**Abiertas (7):**

| Isapre | Controlador | Ancla con prestador |
|---|---|---|
| **Banmédica** | Empresas Banmédica — vendida por UnitedHealth a **Patria Investments** (con Linzor), acuerdo firmado a fines de 2025 por ~US$1.000M | Clínica Santa María, Clínica Dávila, Vidaintegra, Help |
| **Vida Tres** | Mismo grupo Banmédica (marca premium) | La misma red de Banmédica |
| **Cruz Blanca** | **Bupa** (Reino Unido) | Bupa Santiago (ex Integramédica), red Bupa |
| **Consalud** | **ILC** (Cámara Chilena de la Construcción), 100% | **RedSalud** (30+ centros a lo largo del país) |
| **Colmena Golden Cross** | Grupo **Bethia**. Su venta a Nexus (Nueva Masvida) fue **bloqueada por la FNE y el TDLC en 2022** | Sin red propia relevante |
| **Nueva Masvida** | **Nexus Chile Health** (Nexus Partners, EE.UU.) | Red con peso en el sur del país |
| **Esencial** | **Corporación Chileno Alemana de Beneficencia** — los dueños de **Clínica Alemana** (nació en 2022) | Clínica Alemana |

**Cerradas** (solo para trabajadores de una empresa): **Isalud** de Codelco —
que consolidó Fusat, San Lorenzo, Chuquicamata y Río Blanco—, **Fundación
BancoEstado** y **Cruz del Norte**.

> **Por qué importa el ancla.** La integración vertical isapre↔clínica explica el
> descuento: un afiliado de Consalud atendido en RedSalud, o de Esencial en
> Clínica Alemana, obtiene bonificación preferente. **Fuera de su red, la misma
> persona cae a cobertura de libre elección, que suele ser la mitad.** Para una
> clínica particular en Puerto Varas esto significa: *casi ningún paciente nos va
> a llegar con su cobertura preferente activa*. Hay que trabajar sobre el
> reembolso, no sobre la bonificación.

### 3.2 Los tres tipos de plan

| Tipo | Cómo funciona | Qué significa para nosotros |
|---|---|---|
| **Libre elección** | Bonifica en cualquier prestador en convenio, con un único % | El más favorable para un prestador fuera de red |
| **Cerrado** | Solo bonifica en una red determinada | **Fuera de esa red la cobertura puede ser 0%** |
| **Preferente** | Dos columnas: alta en la red preferente, baja fuera | Nos aplica la columna baja |

### 3.3 Los cuatro frenos que la gente no ve

1. **Arancel de referencia.** La Isapre bonifica un % **de su propio arancel**, no
   de lo que cobró la clínica. Si el plan bonifica 80% de un arancel de $30.000 y
   la consulta costó $80.000, el paciente recibe $24.000 y paga $56.000 — o sea,
   el copago real fue 70%, no 20%.
2. **Topes.** Por prestación (en UF o en número de eventos al año) y anuales. Se
   agotan.
3. **Cobertura legal mínima.** Ningún plan puede bonificar menos del 25% de lo que
   cubre el plan en libre elección — pero ese piso es bajísimo.
4. **Prestación no arancelada / sin código.** Si la prestación no existe en el
   arancel de la Isapre, no hay % que aplicar. **Cobertura 0.**

### 3.4 Coberturas especiales

- **GES/AUGE** — 85 problemas de salud garantizados, con red cerrada designada y
  copago tope. No cubre dolor lumbar crónico como tal.
- **CAEC** (Cobertura Adicional para Enfermedades Catastróficas) — solo Isapre,
  solo dentro de la red CAEC designada, con deducible alto (del orden de 30
  cotizaciones mensuales). **No aplica a tratamiento ambulatorio electivo fuera de
  red.**
- **Ley de Urgencia** — solo riesgo vital certificado. No aplica.
- **Excedentes de cotización** — si el 7% legal supera el precio del plan, la
  diferencia se acumula en una cuenta del afiliado y **puede usarse para pagar
  copagos**. Es plata real y olvidada. Vale la pena que Nexor lo mencione.

### 3.5 Contexto regulatorio (para no meter la pata)

Tras el fallo de la Corte Suprema por la tabla de factores y la **Ley 21.674
("ley corta de isapres", 2024)**, el sistema está en pago de devoluciones y con
alzas de precio base topeadas por la Superintendencia (**máximo 3,5% para 2026**).
El clima emocional del afiliado promedio con su Isapre es de desconfianza.

> ⚠️ **Tono para Nexor:** nunca defender ni atacar a las isapres. El paciente ya
> tiene una opinión formada y es mala. Se habla de *su* plan y *su* reembolso, no
> del sistema.

---

## 4. SEGUROS COMPLEMENTARIOS — el verdadero diferenciador

### 4.1 Los dos tipos

| | **Colectivo** (vía empleador) | **Individual** (contratado por la persona) |
|---|---|---|
| Quién lo paga | Empresa, total o parcialmente | La persona |
| Deducible | Bajo o inexistente | Más alto (UF 0,5 a UF 200 según producto) |
| % de reembolso del copago | **Típicamente 70%–100%** | Típicamente 50%–80% |
| Preexistencias | Habitualmente sin exclusión al ingresar | **Declaración Personal de Salud (DPS)**, con exclusiones |
| Carencias | Cortas o ninguna | Frecuentes |
| Quién lo tiene | Empleados de empresas medianas y grandes | Independientes, profesionales |

> **Este es el eje que faltaba medir en el formulario.** El paciente **Isapre +
> complementario colectivo** es el perfil de mayor capacidad de pago efectiva del
> embudo, y suele no saberlo: vive su plan como "algo que me descuentan" y nunca
> ha calculado cuánto recupera.

### 4.2 Cómo funciona el reembolso (orden estricto)

```
Precio de la prestación
   └─ (1) bonifica Fonasa o Isapre  ──────────►  queda el COPAGO
          └─ (2) el seguro complementario reembolsa un % del COPAGO
                 └─ descontado el deducible, hasta el tope anual
                        └─ lo que queda es el costo real del paciente
```

Tres detalles que deciden todo:

1. **Primero la previsión, después el seguro.** Sin bono o sin liquidación de la
   Isapre, la aseguradora rechaza. El paciente debe **bonificar primero**.
2. **La columna "sin bonificación previsional".** Muchas pólizas contemplan un %
   —menor— aplicado sobre el **monto total** cuando Fonasa o la Isapre cubren 0.
   **Aquí es donde se salva un tratamiento no codificado.** Es la cláusula más
   importante de este documento y casi nadie la conoce.
3. **El deducible no se paga por adelantado**: se descuenta de los primeros
   reembolsos del año. Por eso conviene concentrar el tratamiento en un mismo
   año-póliza.

### 4.3 Quiénes venden estos seguros

Vida Security · BICE Vida · MetLife · Consorcio · Chilena Consolidada (Zurich) ·
EuroAmerica · Confuturo · Mapfre · SURA · BCI Seguros · Vida Cámara (ILC, el
mismo grupo de Consalud) · Seguros Bupa (mismo grupo de Cruz Blanca) · Cardif ·
HDI · Renta Nacional. La banca (Banco de Chile, Scotiabank, Santander) los
distribuye como corredor, no como aseguradora.

> **Ancla útil:** el grupo suele repetirse. Cruz Blanca ↔ Seguros Bupa. Consalud
> ↔ Vida Cámara ↔ RedSalud. Cuando el paciente dice "tengo Cruz Blanca y un
> seguro de Bupa", está en un circuito integrado y su reembolso tiende a ser
> ágil — pero optimizado para la red propia.

### 4.4 Exclusiones que nos afectan directamente

Prácticamente todas las pólizas excluyen o limitan: tratamientos **experimentales
o no reconocidos por la práctica médica habitual**, medicamentos ambulatorios
(salvo GES), estética, y prestaciones sin respaldo de programa médico. Varias
exigen una **bonificación previsional mínima** para siquiera procesar el
reembolso.

---

## 5. Lo que esto significa para TERAXCEL

### 5.1 El riesgo real

Un tratamiento intervencionista o regenerativo para dolor lumbar, realizado de
forma particular, **puede caer en cualquiera de estos tres escenarios**:

| Escenario | Qué pasa | Reembolso esperable |
|---|---|---|
| **A · Prestaciones codificadas** (consulta, imagenología, procedimiento con código en arancel) | Se bonifica normalmente y el complementario reembolsa el copago | **Alto** |
| **B · Mixto** — parte codificada, parte no | Se recupera la parte codificada; insumos y honorarios especiales quedan fuera | **Parcial** |
| **C · Íntegramente no codificado** | Sin bonificación previsional. Solo aplica si la póliza tiene columna "sin bonificación" | **Bajo o nulo** |

**Acción pendiente con el equipo médico:** determinar en cuál de los tres
escenarios cae cada componente del ciclo de tratamiento. Sin eso, ninguna promesa
de reembolso es responsable.

### 5.2 Lo que la clínica debe emitir para maximizar el reembolso

- Boleta o factura **desglosada por prestación**, con **código y nombre de arancel
  Fonasa** cuando exista (no un total global tipo "tratamiento").
- **Programa médico / indicación médica** firmada, con diagnóstico y CIE-10.
- **Informe del procedimiento** y respaldo del examen de imagen que lo justifica.
- Bono o liquidación previsional **antes** de presentar al seguro.

Esto es trabajo administrativo de la clínica y **vale más que cualquier
descuento**: convierte un escenario C en un escenario B.

### 5.3 Cómo hablar de plata sin decir el precio

El formulario **no pregunta cuánto pagaría** el paciente. Pregunta **cuánto ya
gastó** (capacidad demostrada) y **con qué cobertura cuenta** (capacidad de
recuperación). Con esas dos respuestas, Nexor puede decir algo verdadero y
poderoso sin nombrar una cifra:

> "Por lo que me cuentas, una parte relevante de este tratamiento podría volver a
> tu bolsillo vía reembolso de tu seguro. En la consulta te entregamos el detalle
> con los códigos para que lo presentes. Antes de eso, lo importante es saber si
> eres candidato."

Y para quien no tiene cobertura:

> "En tu caso el tratamiento sería particular. Lo que sí podemos hacer es
> ordenarte el costo del ciclo completo por adelantado, para que no haya
> sorpresas, y ver alternativas de pago en la consulta."

⚠️ **Prohibido para Nexor:** prometer un porcentaje, decir "tu Isapre lo cubre",
o afirmar que el seguro reembolsa. Siempre condicional: *podría*, *depende de tu
póliza*, *en la consulta lo revisamos*.

---

## 6. Preguntas frecuentes del paciente (respuestas listas)

**"¿Lo cubre mi Isapre?"**
> Depende de tu plan y de qué prestaciones incluye tu ciclo. Lo que sí te
> aseguramos es que emitimos toda la documentación desglosada para que puedas
> presentarla a tu Isapre y a tu seguro, si tienes uno.

**"¿Cuánto me van a reembolsar?"**
> No podemos darte un número sin ver tu póliza — sería irresponsable. Lo que sí
> sabemos es qué documentos necesitas y te los entregamos.

**"Tengo Fonasa, ¿puedo atenderme?"**
> Sí. Lo que cambia es el financiamiento, no el acceso. Lo conversamos en la
> consulta.

**"Tengo seguro por mi trabajo pero no sé qué cubre."**
> Es el caso más común. Pídele a RR.HH. la póliza o el certificado de cobertura;
> normalmente está en el portal del seguro. Los seguros colectivos suelen tener
> los mejores reembolsos del mercado.

**"¿Tienen convenio con mi Isapre?"**
> *(Responder con la verdad operativa de la clínica — completar cuando esté
> definido.)*

---

## 7. Segmentación de reembolso (para scoring)

| Código | Perfil | Capacidad de recuperación | Ángulo comercial |
|---|---|---|---|
| **R1** | Isapre + complementario **colectivo** | Alta | "Una parte importante vuelve" |
| **R2** | Isapre + complementario **individual** o no sabe cuál | Media-alta | Igual que R1, más cauto |
| **R3** | Isapre sola · o Fonasa + complementario | Media | Documentación + valor del resultado |
| **R4** | Fonasa sola | Baja | Costo del ciclo claro, sin sorpresas |
| **R0** | No sabe qué tiene | Por determinar | Nexor lo ayuda a averiguarlo |

**R4 y R0 no descalifican.** Ver la justificación en
[`Formulario-Corto-Landing.md`](./Formulario-Corto-Landing.md) §4.

---

## 8. Cruce con el gasto ya ejecutado

El formulario mide dos ejes distintos. Juntos dan cuatro cuadrantes:

|  | **Cobertura alta (R1–R2)** | **Cobertura baja (R3–R4)** |
|---|---|---|
| **Ya invirtió > $350.000** | 🟢 **Prioridad 1.** Capacidad demostrada + recupera. Agenda rápida. | 🔵 **Prioridad 2.** Paga sin ayuda y ya lo hizo. Ángulo: resultado, no precio. |
| **Ya invirtió < $350.000** | 🟡 **Prioridad 3.** Poco recorrido, mucha cobertura. Ángulo: educar sobre reembolso. | ⚪ **Prioridad 4.** Nutrir con contenido, no forzar agenda. |

> Un paciente que ya lleva $700.000 gastados en terapias que no funcionaron **no
> es un paciente caro: es un paciente convencido**. El gasto histórico es el mejor
> predictor de disposición que tenemos.

---

## 9. Qué revalidar y cuándo

| Dato | Frecuencia | Dónde |
|---|---|---|
| Tramos Fonasa (montos en $) | Anual, ~mayo | fonasa.gob.cl/tramos |
| Arancel MLE y niveles | Anual | Fonasa, prestadores |
| Alza de precio base isapres (APB) | Anual, ~marzo | superdesalud.gob.cl |
| Nómina de isapres abiertas/cerradas | Semestral | Superintendencia de Salud |
| Estado de la MCC de Fonasa | Trimestral (está en rediseño) | fonasa.gob.cl |
| Controladores / fusiones | Anual | FNE, prensa económica |

---

## Fuentes

- [Superintendencia de Salud](https://www.superdesalud.gob.cl/) — APB 2026, nómina de isapres, normativa
- [Fonasa — Tramos](https://www.fonasa.gob.cl/tramos/) y [Aranceles MLE](https://adjuntos.fonasa.gob.cl/sites/fonasa/prestadores/modalidad-libre-eleccion)
- [Fonasa — Declaración pública sobre la MCC](https://www.fonasa.gob.cl/noticias/declaracion-publica-sobre-modalidad-de-cobertura-complementaria-mcc/)
- [Pauta — Fonasa declara desierta la segunda licitación de la MCC (mayo 2026)](https://www.pauta.cl/actualidad/2026/05/12/fonasa-declara-desierta-segunda-licitacion-de-la-mcc-tras-falta-de-interes-de-las-aseguradoras.html)
- [Ley 21.674 — ley corta de isapres](https://www.bcn.cl/leychile/navegar?idNorma=1203779)
- [Ex-Ante — Isapres: distribución de mercado y grupos controladores](https://www.ex-ante.cl/isapres-distribucion-mercado-grupos-controladores-balances-financieros-anuncios-solucion-disputas-tlc/)
- [CeCo — Bloqueo de la FNE a la fusión Nueva Masvida/Colmena](https://centrocompetencia.com/nueva-mas-vida-colmena-bloqueo-fne-fusion-isapres/)
- [CNBC — UnitedHealth vende Banmédica a Patria (nov. 2025)](https://www.cnbc.com/2025/11/30/unitedhealth-to-sell-south-american-business-for-1-billion-sources-say.html)
- [CMF — Condiciones generales de seguro complementario de salud](https://www.cmfchile.cl/sitio/seil/pagina/rgpol/muestra_documento.php?ABH89548=37G70IE7IX10663S8IYM4ABCIV864AJ35MN6BERYV864A4ABCIS8IYMABPRX)
- [BICE Vida — qué ocurre si el reembolso de Isapre o Fonasa es cero](https://www.bicevida.cl/centro-de-ayuda/preguntas-frecuentes/seguros-para-personas/que-ocurre-con-la-cobertura-si-el-reembolso-de-mi-isapre-o-fonasa-es-cero-complementario-de-salud-individual)
- [Consorcio — cómo funciona un seguro complementario](https://sitio.consorcio.cl/en-tu-idioma/blog/salud-y-bienestar/como-funciona-un-seguro-complementario-de-salud)
- [Clínica Puerto Varas — convenios](https://www.clinicapv.cl/centros/isapres/) · [Andes Salud Puerto Montt](https://www.andessaludpuertomontt.cl/)
