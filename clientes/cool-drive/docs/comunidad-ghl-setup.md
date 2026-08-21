# Comunidad Cool Drive en GoHighLevel — vista minimalista y gamificada

Objetivo: que la comunidad de **Escuela Cool Drive | Maipú** se vea como
*Comando High Level* (pantalla completa, oscura, con canales, niveles y tabla de
clasificación) y **no** dentro del Client Portal con la barra lateral de
Facturas / Estimaciones / Contratos / Afiliados.

---

## 1. El diagnóstico: dos "envoltorios" distintos

Hoy la comunidad se está abriendo **dentro del Client Portal** (se nota por el
breadcrumb `Inicio > Comunidades > Escuela Cool Drive | Maipú` y por el menú
lateral con Tablero, Facturas, Estimaciones, Contratos, Citas, Afiliados).

*Comando High Level* no usa ese envoltorio: es la **app de Communities standalone**
(GoKollab), que ocupa toda la pantalla y solo muestra los canales del grupo.

Son dos URLs distintas del mismo grupo:

| Envoltorio | Qué se ve | Cómo se llega |
|---|---|---|
| Client Portal | Sidebar de negocio + comunidad embebida | dominio del portal → *Comunidades* |
| Communities standalone | Solo la comunidad, full screen, sidebar de canales | URL directa del grupo / dominio whitelabel |

**Regla práctica:** comparte a los alumnos la **URL directa del grupo**, no la del
portal. Ese solo cambio elimina toda la barra de finanzas.

---

## 2. Quitar el sidebar de Facturas / Finanzas (si igual usas el portal)

`Sub-cuenta → Sites → Client Portal → Settings → App Permissions`
(también accesible desde `Memberships → Client Portal`).

Cada app tiene su toggle. Para Cool Drive:

- ✅ **Communities** — ON
- ✅ **Courses / Memberships** — ON
- ❌ **Invoices (Facturas)** — OFF
- ❌ **Estimates (Estimaciones)** — OFF
- ❌ **Contracts / Documents** — OFF
- ❌ **Affiliates (Afiliados)** — OFF
- ❌ **Appointments (Citas)** — OFF *(déjalo ON solo si agendan la clase práctica ahí)*
- ❌ **Shared files / Archivos compartidos** — OFF

Guarda. El cambio es inmediato para todos los contactos y **no borra datos**: solo
oculta la app de la navegación, se puede revertir cuando quieras.

Con esto el portal queda con dos ítems (Comunidades y Cursos) en vez de nueve, y
el dashboard deja de mostrar las tarjetas de "Facturas pendientes".

> Nota: desactivar Invoices/Estimates/Contracts también apaga sus notificaciones
> por correo (`Client Portal → Settings → Email Settings`).

---

## 3. Tema oscuro y look minimalista del grupo

`Memberships → Communities → Groups → [abrir el grupo] → Settings → Themes`

- Botones **Light Mode / Dark Mode** arriba: elige **Dark**.
- Usa un tema predefinido o crea uno propio con los colores de Cool Drive
  (rojo `#E11B22` + amarillo `#FDC300` sobre fondo oscuro funcionan igual que el
  azul/negro de Comando High Level).
- Sube banner y logo del grupo (ya tienes el arte "Formamos Conductores").

**CSS/JS personalizado:** `Settings → Custom CSS/JS` dentro del grupo.
Para estilos que solo apliquen en modo noche, usa el selector `.dark`, que GHL
agrega automáticamente al root cuando el tema oscuro está activo.

Ejemplo para apretar el look (opcional):

```css
/* Ocultar ruido y dar aire a las tarjetas */
.dark { --radius: 14px; }
.dark .post-card { border: 1px solid rgba(255,255,255,.06); box-shadow: none; }
```

---

## 4. Tabs de navegación (esto controla qué pestañas ve el alumno)

`Grupo → Settings → Navigation Tabs (Show/Hide)`

Tabs soportados: **Discussion** (obligatorio), **Learning**, **Events**,
**Leaderboard**, **Members**, **About** (obligatorio).

Configuración recomendada para Cool Drive:

| Tab | Estado | Por qué |
|---|---|---|
| Conversación (Discussion) | ON (fijo) | Núcleo de la comunidad |
| Aprendizaje (Learning) | ON | Ahí viven los 2 cursos teóricos |
| **Tabla de clasificación (Leaderboard)** | **ON** | Es lo que falta hoy — activa el look gamificado |
| **Miembros (Members)** | **ON** | Prueba social, hoy tampoco aparece |
| Eventos (Events) | ON si haces clases en vivo / simulacros de examen |
| Acerca de (About) | ON (fijo) | — |

Es **por grupo**, no global. Guarda para aplicar.

En tus capturas el grupo Cool Drive solo muestra *Conversación / Aprendizaje /
Acerca de* — por eso se ve más pobre que Comando High Level, que tiene las seis.

---

## 5. Gamificación: puntos, niveles y badges

`Grupo → Settings → Gamification & Rewards → Gamification`

- Actívala. Máximo **9 niveles**; edita el nombre de cada uno haciendo clic sobre él.
- Nombres sugeridos para escuela de conducción (en vez de "Level 1…9"):

  1. Peatón
  2. Copiloto
  3. Alumno en ruta
  4. Clase B en práctica
  5. Manos a las 10 y 2
  6. Estacionamiento perfecto
  7. Examen teórico aprobado
  8. Licencia en mano
  9. Instructor honorario

- El **Leaderboard** ordena por puntos de 7 días, 30 días y global (igual que la
  "Tabla de clasificación (30 días)" de Comando High Level).
- Hay **triggers y acciones de workflow** por cambio de nivel: úsalos para enviar
  el WhatsApp/email de felicitación o desbloquear un beneficio (ej.: al llegar a
  "Examen teórico aprobado", enviar cupón de clase práctica).

---

## 6. Canales

`Grupo → canales` — cada canal tiene visibilidad propia (todos los miembros,
grupos de usuarios específicos, o solo admins/moderadores) y **emoji** en el nombre.

Los que ya tienes (👋 Bienvenida, ❓ Dudas de teoría, 🚗 Preparando el examen,
🎓 Lo logré) están bien. Sugerencias:

- Marca **📣 Anuncios** como canal de solo-admin (los miembros leen, no publican).
- Usa **canal privado** para alumnos que ya pagaron el pack práctico.
- Fija (pin) posts en "Destacado" como hace Franco: ahí es donde se ven las
  publicaciones grandes en la parte superior del feed.

---

## 7. Dominio propio (whitelabel) — opcional pero es el paso final del look

Para que la comunidad viva en `comunidad.escuelacooldrive.cl` en vez de una URL
de GHL:

1. En tu DNS crea un **CNAME** con el host que quieras (ej. `comunidad`) apuntando
   al target que GHL te indique.
2. Verificación típica: 5–15 min (si pasa de 30, revisa con el registrador).
3. En la agencia: `Settings → White Label / Company Settings` para logo, colores
   y nombre; y en `Client Portal → Domain Setup` el dominio del portal.

Requiere plan con whitelabel habilitado.

---

## Checklist de ejecución

- [ ] App Permissions: apagar Invoices, Estimates, Contracts, Documents, Affiliates, (Appointments)
- [ ] Compartir la **URL directa del grupo**, no la del portal
- [ ] Theme → Dark Mode + colores Cool Drive + banner/logo
- [ ] Navigation Tabs → activar Leaderboard y Members (y Events si aplica)
- [ ] Gamification → ON + renombrar los 9 niveles
- [ ] Canal de anuncios solo-admin + posts fijados en Destacado
- [ ] (Opcional) CNAME para dominio propio de la comunidad

---

## Fuentes

- [App Permissions in Client Portal: Enabling/Disabling a child app](https://help.gohighlevel.com/support/solutions/articles/155000002136-app-permissions-in-client-portal-enabling-disabling-a-child-app)
- [How to set up the Client Portal?](https://help.gohighlevel.com/support/solutions/articles/155000000193-how-to-set-up-the-client-portal-)
- [Communities - Customizeable Navigation Tabs In Groups](https://help.gohighlevel.com/support/solutions/articles/155000007364-communities-customizeable-navigation-tabs-in-groups)
- [Communities - Change your group theme](https://help.gohighlevel.com/support/solutions/articles/155000002455-communities-change-your-group-theme)
- [Communities - How to add Custom CSS/JS to groups](https://help.gohighlevel.com/support/solutions/articles/155000002165-communities-how-to-add-custom-css-js-to-groups)
- [Gamification - Points, Badges and Leaderboard](https://help.gohighlevel.com/support/solutions/articles/155000002487-gamification-points-badges-and-leaderboard)
- [Gamification/Leaderboard triggers and actions for Community groups](https://help.gohighlevel.com/support/solutions/articles/155000004080-gamification-leaderboard-triggers-and-actions-for-community-groups)
- [Communities - Private Channels and Channel Emojis](https://help.gohighlevel.com/support/solutions/articles/155000002849-communities-private-channels-and-channel-emojis)
- [How to create your Whitelabel Community](https://help.gohighlevel.com/support/solutions/articles/155000004156-how-to-create-your-whitelabel-community)
- [Notifications for Invoices, Estimates, and Contracts in Client Portal](https://help.gohighlevel.com/support/solutions/articles/155000005706-notifications-for-invoices-estimates-and-contracts-in-client-portal)
