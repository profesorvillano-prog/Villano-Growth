#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FIXUS · Generador de landings de campaña (Kinesiología)
--------------------------------------------------------------------
Las tres landings comparten EXACTAMENTE la misma estructura, CSS y JS.
Lo único que cambia es el copy de cada avatar.

    python3 build.py

Genera: kine-deportista.html · kine-dolor.html · kine-postoperado.html
Para editar el copy de una campaña, toca solo el diccionario CAMPANAS.
Para cambiar la estructura de las tres a la vez, toca PLANTILLA.
"""

import io
import os

RUTA = os.path.dirname(os.path.abspath(__file__))

# Logo oficial de Fixus (CDN del cliente). Si algún día cambia, se cambia acá.
LOGO = "https://assets.cdn.filesafe.space/LK0isBMjR28HLsU5VrX3/media/6a8a40b7cdd4b797a357456c.png"

# ============================================================================
# 1. COPY POR CAMPAÑA  (un anuncio = un avatar = una landing)
# ============================================================================

CAMPANAS = {

    # ------------------------------------------------------------------ #
    # Anuncio 1 · "Volver a la cancha" · Deportista lesionado (25-40)
    # ------------------------------------------------------------------ #
    "kine-deportista": {
        "slug": "deportista",
        "title": "Vuelve a jugar sin miedo a lesionarte de nuevo · Kinesiología Fixus",
        "meta": "¿Te desgarraste o te doblaste el tobillo y llevas semanas sin jugar? Evaluamos tu lesión, te decimos en cuánto vuelves y te preparamos para aguantar el partido completo. Kinesiología 1 a 1 en Providencia, a pasos del Metro Colón.",
        "kicker": "Te <span class=\"mark\">desgarraste o lesionaste</span> hace semanas y todavía no vuelves a la cancha",
        "h1": 'Vuelve a jugar sin miedo a <span class="mark">volver a lesionarte</span>.',
        "lead": "Revisamos tu lesión, te decimos en cuánto tiempo vuelves y te armamos el plan para que aguantes el partido completo. Todo parte por la evaluación.",
        "wa_msg": "Hola, me lesioné jugando y quiero saber cómo funciona la evaluación kinesiológica.",

        "ba_titulo": "Volver antes de tiempo es la razón #1 por la que <span class=\"alerta\">te vuelves a lesionar</span>",
        "ba_bajada": "Aguantar, congelar y probar suerte el domingo no es un plan de recuperación.",
        "antes_h": "Así estás hoy",
        "antes": [
            "Llevas semanas fuera y nadie te ha dado un plazo real.",
            "Volviste a jugar antes de tiempo y recaíste.",
            "Hielo, reposo y ejercicios sueltos de YouTube.",
            "Cuando entras a la cancha, juegas con miedo.",
        ],
        "despues_h": "Así sales de Fixus",
        "despues": [
            "Sabes qué te pasó exactamente y por qué pasó.",
            "Tienes un plazo estimado de vuelta a la cancha.",
            "Un plan de ejercicios hecho para tu lesión, no genérico.",
            "Vuelves más fuerte que antes de lesionarte.",
        ],

        "eval_titulo": "Todo parte por una hora: la evaluación",
        "eval_bajada": "No es un masaje ni una receta genérica. Es la hora en que entendemos tu lesión de verdad.",
        "eval_items": [
            "<b>Qué te pasó y por qué.</b> Revisamos la lesión, cómo ocurrió y qué estructura está afectada.",
            "<b>Cómo estás hoy.</b> Evaluamos movilidad, fuerza y control de la zona, comparando con el lado sano.",
            "<b>En cuánto vuelves.</b> Te damos un plazo estimado real para volver a entrenar y a competir.",
            "<b>Tu paso a paso.</b> Sales con el plan de trabajo escrito: qué hacemos, cuántas sesiones y con qué objetivo.",
        ],

        "porque_titulo": "Por qué acá y no en cualquier parte",
        "porque_items": [
            "<b>1 a 1 toda la sesión.</b> Un kinesiólogo contigo de principio a fin, no repartido entre cinco camillas.",
            "<b>Kinesiólogos que también son deportistas.</b> Entienden lo que significa querer volver a jugar.",
            "<b>No terminamos cuando deja de doler.</b> Terminamos cuando aguantas el partido completo.",
            "<b>Reembolsable en tu isapre</b> si traes orden médica. Te explicamos cómo conseguirla.",
        ],

        "faq_extra": [
            ("¿Cuándo vuelvo a jugar?",
             "Es la pregunta que más nos hacen y la respondemos en la primera sesión. Después de evaluarte te damos un plazo estimado según tu lesión, cómo estás hoy y a qué nivel quieres volver. Si algo cambia en el camino, te lo decimos: preferimos ajustar el plazo antes que devolverte a la cancha a medias."),
            ("¿Y si ya me lesioné dos veces de lo mismo?",
             "Es justamente el caso que más trabajamos. Una recaída casi nunca es mala suerte: es que la primera recuperación terminó cuando dejó de doler, no cuando la zona estaba fuerte. En la evaluación buscamos qué quedó pendiente."),
        ],

        "cierre_h": "Deja de mirar el partido desde afuera.",
        "cierre_p": "Agenda tu evaluación y empecemos a devolverte a la cancha.",
    },

    # ------------------------------------------------------------------ #
    # Anuncio 2 · "El dolor de espalda que ya no te deja tranquilo"
    # ------------------------------------------------------------------ #
    "kine-dolor": {
        "slug": "dolor-cronico",
        "title": "Que te duela todos los días no es normal · Kinesiología Fixus",
        "meta": "¿Llevas meses con dolor de espalda, lumbago o de hombro y ya te acostumbraste? No se pasa solo. Revisamos de dónde viene y te damos un plan para que deje de volver. Kinesiología 1 a 1 en Providencia, a pasos del Metro Colón.",
        "kicker": "Te levantas mal, aguantas todo el día en la silla y ya te acostumbraste",
        "h1": 'Que te duela todos los días <span class="mark">no es normal</span>.',
        "lead": "El dolor de espalda se volvió tan común que lo normalizamos. No se arregla con otra pastilla ni aguantando: primero revisamos de dónde viene y de ahí armamos un plan real para eliminarlo.",
        "wa_msg": "Hola, llevo tiempo con dolor y quiero saber cómo funciona la evaluación kinesiológica.",

        "ba_titulo": "Llevas meses diciendo que <span class=\"alerta\">se te va a pasar</span>",
        "ba_bajada": "Y no se pasa. El dolor que no se trata bien se instala y empieza a quitarte cosas del día a día.",
        "antes_h": "Así estás hoy",
        "antes": [
            "Ya no duermes de ese lado o no te puedes agachar tranquilo.",
            "Analgésicos, parches, calor. Alivio que dura poco.",
            "Hiciste kine antes, fue puro masaje y el dolor volvió.",
            "Nadie te ha explicado por qué te duele.",
        ],
        "despues_h": "Así sales de Fixus",
        "despues": [
            "Entiendes de dónde viene tu dolor, en palabras simples.",
            "Un plan con ejercicio, no solo camilla.",
            "El dolor baja y deja de mandar en tu día.",
            "Sales fuerte para que no vuelva en tres meses.",
        ],

        "eval_titulo": "Todo parte por una hora: la evaluación",
        "eval_bajada": "No es un masaje ni otra receta genérica. Es la hora en que entendemos tu dolor de verdad.",
        "eval_items": [
            "<b>Qué te está doliendo y por qué.</b> Revisamos tu historia, tu trabajo y desde cuándo lo arrastras.",
            "<b>Cómo estás hoy.</b> Evaluamos movilidad, fuerza y qué movimientos te disparan el dolor.",
            "<b>Qué tan cerca estás de estar bien.</b> Te damos un plazo estimado real, sin promesas de una sesión.",
            "<b>Tu paso a paso.</b> Sales con el plan escrito: qué hacemos, cuántas sesiones y con qué objetivo.",
        ],

        "porque_titulo": "Por qué acá y no en cualquier parte",
        "porque_items": [
            "<b>Kinesiología no es puro masaje.</b> Usamos camilla cuando hace falta, pero el trabajo real es el ejercicio: por eso el dolor no vuelve.",
            "<b>1 a 1 toda la sesión.</b> Un kinesiólogo contigo de principio a fin, no repartido entre cinco camillas.",
            "<b>Te explicamos qué tienes</b> sin tecnicismos, para que entiendas qué estamos haciendo y por qué.",
            "<b>Reembolsable en tu isapre</b> si traes orden médica. Te explicamos cómo conseguirla.",
        ],

        "faq_extra": [
            ("Ya hice kine antes y no me resultó.",
             "Es la frase que más escuchamos. Casi siempre fue puro masaje o electrodos: alivia el rato, pero no cambia la causa, así que el dolor vuelve. Acá partimos por evaluar de dónde viene y el tratamiento incluye ejercicio dirigido, que es lo que hace que el resultado se sostenga."),
            ("¿A mi edad esto ya no tiene arreglo?",
             "Tener 45, 55 o 65 no significa resignarse a vivir con dolor. La mayoría de los cuadros que atendemos mejoran a cualquier edad cuando se trabaja bien: lo que cambia es el ritmo y la dosis, no el resultado."),
        ],

        "cierre_h": "Deja de aguantar ese dolor.",
        "cierre_p": "Agenda tu evaluación y empecemos a sacártelo de encima.",
    },

    # ------------------------------------------------------------------ #
    # Anuncio 3 · "Deja de arrastrarlo" · Post-operado / lesión antigua
    # ------------------------------------------------------------------ #
    "kine-postoperado": {
        "slug": "postoperado",
        "title": "Deja de arrastrar esa lesión · Kinesiología post-operatoria Fixus",
        "meta": "¿Saliste de una operación o llevas más de un año con la misma lesión? No se arregla con reposo ni pastillas. Evaluación, ejercicios hechos para ti y acompañamiento sesión a sesión. Kinesiología 1 a 1 en Providencia, a pasos del Metro Colón.",
        "kicker": "Saliste de una operación o llevas más de un año arrastrando lo mismo",
        "h1": 'Deja de arrastrarlo. <span class="mark">Recupérate en serio.</span>',
        "lead": "Cuando algo lleva mucho tiempo mal no se arregla con reposo ni con pastillas. Se arregla con ejercicios hechos para ti y alguien al lado, sesión a sesión.",
        "wa_msg": "Hola, vengo de una operación / llevo tiempo con una lesión y quiero saber cómo funciona la evaluación kinesiológica.",

        "ba_titulo": "Lo que lleva tiempo mal <span class=\"alerta\">no se arregla solo</span>",
        "ba_bajada": "Ni con reposo, ni con pastillas, ni esperando a ver si esta vez sí.",
        "antes_h": "Así estás hoy",
        "antes": [
            "Saliste de pabellón con 10 sesiones y ninguna explicación.",
            "Llevas meses o años con la misma molestia dando vueltas.",
            "Cada vez que intentas retomar, recaes.",
            "No sabes hasta dónde puedes exigirte sin dañarte.",
        ],
        "despues_h": "Así sales de Fixus",
        "despues": [
            "Sabes cómo quedaste y qué necesitas recuperar.",
            "Progresión clara: cargas que suben cuando corresponde.",
            "Alguien al lado corrigiendo cada sesión, sin improvisar.",
            "Recuperas la función completa, no solo el alta médica.",
        ],

        "eval_titulo": "Todo parte por una hora: la evaluación",
        "eval_bajada": "Es donde entendemos cómo quedaste y qué necesitas para recuperarte de verdad, sin apuros y sin recaídas.",
        "eval_items": [
            "<b>Cómo quedaste.</b> Revisamos tu cirugía o tu lesión, el tiempo transcurrido y las indicaciones médicas.",
            "<b>Qué recuperaste y qué falta.</b> Evaluamos movilidad, fuerza y control comparando con el lado sano.",
            "<b>Hasta dónde puedes exigirte.</b> Definimos límites y progresión para que avances sin retroceder.",
            "<b>Tu paso a paso.</b> Sales con el plan escrito: qué hacemos, cuántas sesiones y con qué objetivo.",
        ],

        "porque_titulo": "Por qué acá y no en cualquier parte",
        "porque_items": [
            "<b>1 a 1 toda la sesión.</b> Un kinesiólogo contigo de principio a fin, corrigiendo cada ejercicio.",
            "<b>Trabajamos con tus indicaciones médicas</b> y respetamos los plazos de tu cirugía.",
            "<b>Camilla y ejercicio.</b> La camilla acompaña, pero lo que recupera la función es el trabajo activo.",
            "<b>Reembolsable en tu isapre</b> si traes orden médica. Te explicamos cómo conseguirla.",
        ],

        "faq_extra": [
            ("Vengo de una operación, ¿pueden atenderme?",
             "Sí, es uno de los motivos de consulta más frecuentes. Trabajamos con las indicaciones de tu médico y respetamos los plazos de tu cirugía. Trae el informe operatorio o el dato de qué te hicieron y cuándo: con eso armamos la progresión."),
            ("Ya pasó mucho tiempo, ¿sirve igual empezar ahora?",
             "Sí. Que haya pasado un año no significa que ya no tenga arreglo: significa que hay que evaluar bien qué quedó pendiente y trabajarlo de forma progresiva. Muchos de los casos que mejor responden son justamente los que llevaban tiempo dando vueltas."),
        ],

        "cierre_h": "Es tu oportunidad de resolverlo de una vez.",
        "cierre_p": "Agenda tu evaluación y empecemos tu recuperación en serio.",
    },
}

# ============================================================================
# 2. BLOQUES COMUNES A LAS TRES LANDINGS
# ============================================================================

PROCESO = [
    ("Evaluación inicial",
     "Una hora contigo: revisamos qué te pasa, desde cuándo, tu historial y qué necesitas volver a hacer."),
    ("Diagnóstico y plan",
     "Te explicamos en palabras simples qué tienes, por qué pasó y cuánto va a tomar. Sales con un paso a paso escrito."),
    ("Tratamiento sesión a sesión",
     "Camilla cuando hace falta y ejercicio siempre, con un kinesiólogo al lado corrigiendo todo el rato."),
    ("Ajustes según cómo respondes",
     "El plan se corrige semana a semana según tu avance real, no según un protocolo genérico."),
    ("Alta y que no vuelva",
     "No terminamos cuando deja de doler. Terminamos cuando estás fuerte para que no se repita."),
]

FAQ_BASE = [
    ("¿Necesito orden médica para atenderme?",
     "No. Puedes venir sin orden médica y empezar el mismo día. La orden sirve para otra cosa: <b>con ella puedes reembolsar las sesiones en tu isapre</b>. Si no la tienes, hoy existen órdenes médicas online por unos pocos miles de pesos y te explicamos cómo sacarla."),
    ("¿Cuánto cuesta el tratamiento completo?",
     "La evaluación inicial son <b>$24.990</b> y es lo único que pagas ahora. Si después necesitas tratamiento, el plan de <b>10 sesiones cuesta $300.000</b> y es reembolsable en tu isapre con orden médica. En la evaluación te decimos cuántas sesiones necesitas realmente: si son menos, son menos."),
    ("¿La kinesiología no es puro masaje?",
     "No. Usamos camilla y terapia manual cuando hace falta, pero el trabajo que resuelve el problema es el <b>ejercicio dirigido</b>: recuperar fuerza y control de la zona. Por eso el dolor no vuelve a las tres semanas."),
    ("¿Cuántas veces por semana tengo que venir?",
     "Lo definimos en la evaluación según tu caso. Lo habitual es <b>dos veces por semana</b>, y ajustamos si tu horario no da: preferimos una frecuencia que puedas sostener a un plan perfecto que abandones al mes."),
    ("¿Dónde están y cómo llego?",
     "Estamos en <b>Providencia, a pasos del Metro Colón</b>. Muchos pacientes se escapan de la pega, hacen la sesión y vuelven. <a data-cta=\"mapa\" href=\"#\">Ver en el mapa</a>."),
]

# ============================================================================
# 3. PLANTILLA (estructura idéntica para las tres)
# ============================================================================

PLANTILLA = r"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="robots" content="noindex,follow">
<meta name="description" content="{{META}}">
<title>{{TITLE}}</title>

<link rel="icon" href="{{LOGO}}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"></noscript>

<link rel="stylesheet" href="assets/fixus.css">
<script>document.documentElement.classList.add('js');</script>

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{META}}">
<meta property="og:locale" content="es_CL">
</head>

<body data-campana="{{SLUG}}" data-wa-msg="{{WA_MSG}}">

<!-- ============================ HEADER ============================ -->
<header class="hdr">
  <div class="wrap">
    <a class="logo" href="https://www.fixus.cl">
      <img src="{{LOGO}}" alt="Fixus" width="150" height="40">
    </a>
  </div>
</header>

<!-- ============================= HERO ============================= -->
<section class="hero">
  <div class="wrap">
    <p class="kicker">{{KICKER}}</p>
    <h1>{{H1}}</h1>
    <p class="lead">{{LEAD}}</p>

    <!-- VSL -->
    <div class="vsl">
      <div class="vsl-frame">
        <div class="vsl-ratio">
          <div class="vsl-poster" style="background:radial-gradient(ellipse 66% 66% at 50% 38%,#1d1d23,#09090b)"></div>
          <div class="vsl-mark"><img src="{{LOGO}}" alt="" width="64" height="17"></div>
          <button class="vsl-play" data-video="" aria-label="Ver el video">
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
            <b>Mira cómo funciona</b>
          </button>
        </div>
      </div>
      <p class="vsl-cap">Ve en menos de 3 minutos cómo te podemos ayudar.</p>
    </div>

    <!-- CTA principal -->
    <div class="actions" id="cta-hero">
      <a class="opt primary" data-cta="pago" data-pos="hero" href="#">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></span>
        <span class="txt">
          <strong>Agenda tu evaluación</strong>
          <em>Reservas y pagas tu hora ahora mismo</em>
        </span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </a>

      <a class="opt ghost" data-cta="whatsapp" data-pos="hero" href="#" target="_blank" rel="noopener">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3 20.5l1.8-5.3A8.4 8.4 0 1 1 21 11.5z"/></svg></span>
        <span class="txt">
          <strong>¿Tienes una duda antes?</strong>
          <em>Escríbenos por WhatsApp</em>
        </span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    </div>
    <p class="actions-note">Evaluación kinesiológica de 1 hora · Providencia, a pasos del Metro Colón</p>

    <div class="facts">
      <div class="fact"><b>1 a 1</b><span>Un kinesiólogo contigo toda la sesión</span></div>
      <div class="fact"><b>Isapre</b><span>Reembolsable con orden médica</span></div>
      <div class="fact"><b>Metro Colón</b><span>Providencia, a pasos</span></div>
    </div>
  </div>
</section>

<!-- ======================== ANTES / DESPUÉS ======================== -->
<section class="sec">
  <div class="wrap rv">
    <div class="center">
      <span class="eyebrow eyebrow-line">El problema</span>
      <h2>{{BA_TITULO}}</h2>
      <p class="lead" style="margin-top:12px">{{BA_BAJADA}}</p>
    </div>
    <div class="ba">
      <div class="ba-card">
        <h3>{{ANTES_H}}</h3>
        <ul>{{ANTES}}</ul>
      </div>
      <div class="ba-card now">
        <h3>{{DESPUES_H}}</h3>
        <ul>{{DESPUES}}</ul>
      </div>
    </div>
  </div>
</section>

<!-- ========================== LA EVALUACIÓN ========================== -->
<section class="sec sec-alt">
  <div class="wrap rv">
    <div class="center">
      <span class="eyebrow eyebrow-line">El primer paso</span>
      <h2>{{EVAL_TITULO}}</h2>
      <p class="lead" style="margin-top:12px">{{EVAL_BAJADA}}</p>
    </div>
    <div class="checks">{{EVAL_ITEMS}}</div>

    <div class="actions" style="margin-top:28px">
      <a class="opt primary" data-cta="pago" data-pos="evaluacion" href="#">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></span>
        <span class="txt">
          <strong>Reservar mi evaluación</strong>
          <em>Eliges día y hora, pagas y queda agendada</em>
        </span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    </div>
  </div>
</section>

<!-- ============================ PROCESO ============================ -->
<section class="sec">
  <div class="wrap-wide rv">
    <div class="flow">
      <div class="flow-intro">
        <span class="eyebrow">Cómo funciona</span>
        <h2>Un proceso claro, medible y acompañado.</h2>
        <p class="lead" style="margin-top:12px">Desde la primera hora sabes qué tienes, qué vamos a hacer y hasta cuándo.</p>
      </div>
      <div class="steps">{{PROCESO}}</div>
    </div>
  </div>
</section>

<!-- ============================ POR QUÉ ============================ -->
<section class="sec sec-alt">
  <div class="wrap rv">
    <div class="center">
      <span class="eyebrow eyebrow-line">La diferencia</span>
      <h2>{{PORQUE_TITULO}}</h2>
    </div>
    <div class="checks">{{PORQUE_ITEMS}}</div>
  </div>
</section>

<!-- ========================== TESTIMONIOS ==========================
     PENDIENTE: grabar los 2 testimonios del documento de avatar
     (deportista que volvió a jugar · paciente 40+ con dolor crónico).
     Cuando estén, borra este comentario y deja la sección visible.

<section class="sec">
  <div class="wrap rv">
    <div class="center">
      <span class="eyebrow eyebrow-line">Resultados reales</span>
      <h2>Lo que dicen los pacientes</h2>
    </div>
    <div class="quotes">
      <figure class="quote">
        <div class="stars">★★★★★</div>
        <p>"(Testimonio real aquí)"</p>
        <footer><b>Nombre</b>Motivo de consulta · Nº de sesiones</footer>
      </figure>
      <figure class="quote">
        <div class="stars">★★★★★</div>
        <p>"(Testimonio real aquí)"</p>
        <footer><b>Nombre</b>Motivo de consulta · Nº de sesiones</footer>
      </figure>
    </div>
  </div>
</section>
================================================================= -->

<!-- ============================== FAQ ============================== -->
<section class="sec">
  <div class="wrap rv">
    <div class="center">
      <span class="eyebrow eyebrow-line">Antes de agendar</span>
      <h2>Lo que todos preguntan</h2>
    </div>
    <div class="faq">{{FAQ}}</div>
  </div>
</section>

<!-- ============================= CIERRE ============================= -->
<section class="sec sec-alt">
  <div class="wrap rv close">
    <span class="eyebrow eyebrow-line">Empieza acá</span>
    <h2>{{CIERRE_H}}</h2>
    <p class="lead" style="max-width:40ch;margin:0 auto">{{CIERRE_P}}</p>

    <div class="actions">
      <a class="opt primary" data-cta="pago" data-pos="cierre" href="#">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></span>
        <span class="txt">
          <strong>Agenda tu evaluación</strong>
          <em>Reservas y pagas tu hora ahora mismo</em>
        </span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </a>
      <a class="opt ghost" data-cta="whatsapp" data-pos="cierre" href="#" target="_blank" rel="noopener">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3 20.5l1.8-5.3A8.4 8.4 0 1 1 21 11.5z"/></svg></span>
        <span class="txt">
          <strong>Prefiero preguntar primero</strong>
          <em>Escríbenos por WhatsApp</em>
        </span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    </div>

    <div class="place-card">
      <b>Providencia · a pasos del Metro Colón</b>
      <span class="small muted">Santiago, Chile</span>
      <a data-cta="mapa" href="#">Ver cómo llegar →</a>
    </div>
  </div>
</section>

<!-- ============================= FOOTER ============================= -->
<footer class="ftr">
  <div class="wrap">
    <img class="logo-ftr" src="{{LOGO}}" alt="Fixus" width="96" height="26">
    <p>
      Kinesiología y rendimiento · Providencia, Santiago<br>
      © <span id="y">2026</span> Fixus. Todos los derechos reservados. ·
      <a href="https://www.fixus.cl">fixus.cl</a>
    </p>
  </div>
</footer>

<!-- ========================= BARRA FIJA MÓVIL ========================= -->
<div class="bar">
  <a class="bar-cta" data-cta="pago" data-pos="barra" href="#">Agenda tu evaluación</a>
  <a class="bar-wa" data-cta="whatsapp" data-pos="barra" href="#" target="_blank" rel="noopener" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5 0-.9.2-3-.9s-3.4-3.6-3.5-3.8c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6 0 1z"/></svg>
  </a>
</div>

<script>document.getElementById('y').textContent=new Date().getFullYear();</script>
<script src="assets/fixus.js"></script>
</body>
</html>
"""

# ============================================================================
# 4. GENERACIÓN
# ============================================================================

def li(items):
    return "\n          ".join("<li>%s</li>" % t for t in items)


def checks(items):
    tpl = ('<div class="check">'
           '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
           '<p>%s</p></div>')
    return "\n      ".join(tpl % t for t in items)


def pasos():
    out = []
    for i, (t, d) in enumerate(PROCESO, 1):
        out.append(
            '<div class="step">'
            '<span class="step-n">%02d</span>'
            '<div class="step-c"><h3>%s</h3><p>%s</p></div>'
            '</div>' % (i, t, d)
        )
    return "\n        ".join(out)


def faq(extra):
    out = []
    for q, a in list(extra) + FAQ_BASE:
        out.append('<details><summary>%s</summary><div class="a">%s</div></details>' % (q, a))
    return "\n      ".join(out)


def construir(nombre, c):
    html = PLANTILLA
    reemplazos = {
        "LOGO": LOGO,
        "TITLE": c["title"],
        "META": c["meta"],
        "SLUG": c["slug"],
        "WA_MSG": c["wa_msg"],
        "KICKER": c["kicker"],
        "H1": c["h1"],
        "LEAD": c["lead"],
        "BA_TITULO": c["ba_titulo"],
        "BA_BAJADA": c["ba_bajada"],
        "ANTES_H": c["antes_h"],
        "ANTES": li(c["antes"]),
        "DESPUES_H": c["despues_h"],
        "DESPUES": li(c["despues"]),
        "EVAL_TITULO": c["eval_titulo"],
        "EVAL_BAJADA": c["eval_bajada"],
        "EVAL_ITEMS": checks(c["eval_items"]),
        "PROCESO": pasos(),
        "PORQUE_TITULO": c["porque_titulo"],
        "PORQUE_ITEMS": checks(c["porque_items"]),
        "FAQ": faq(c["faq_extra"]),
        "CIERRE_H": c["cierre_h"],
        "CIERRE_P": c["cierre_p"],
    }
    for k, v in reemplazos.items():
        html = html.replace("{{%s}}" % k, v)

    if "{{" in html:
        raise SystemExit("Quedó un marcador sin reemplazar en %s" % nombre)

    destino = os.path.join(RUTA, nombre + ".html")
    with io.open(destino, "w", encoding="utf-8") as f:
        f.write(html)
    return destino


# ============================================================================
# 5. VERSIÓN DE UN SOLO ARCHIVO (para revisar / enviar por correo)
# ============================================================================
# Mete el CSS, el JS y el logo DENTRO del HTML. Se abre con doble clic desde
# cualquier carpeta, sin depender de assets/. Para publicar en el hosting es
# mejor la versión normal (assets compartidos = un solo lugar que tocar).

def construir_suelto(nombre):
    origen = os.path.join(RUTA, nombre + ".html")
    with io.open(origen, encoding="utf-8") as f:
        html = f.read()

    def leer(rel):
        with io.open(os.path.join(RUTA, rel), encoding="utf-8") as f:
            return f.read()

    css = leer("assets/fixus.css")
    js = leer("assets/fixus.js")
    html = html.replace('<link rel="stylesheet" href="assets/fixus.css">',
                        "<style>\n" + css + "\n</style>")
    html = html.replace('<script src="assets/fixus.js"></script>',
                        "<script>\n" + js + "\n</script>")
    html = html.replace("<body ",
                        "<!-- Versión de un solo archivo, generada por build.py. "
                        "No editar a mano. -->\n<body ")

    carpeta = os.path.join(RUTA, "previsualizar")
    if not os.path.isdir(carpeta):
        os.makedirs(carpeta)
    destino = os.path.join(carpeta, nombre + ".html")
    with io.open(destino, "w", encoding="utf-8") as f:
        f.write(html)
    return destino



# ============================================================================
# 6. BLOQUE PARA PEGAR EN GOHIGHLEVEL
# ============================================================================
# GHL no acepta una página completa: hay que pegar un bloque dentro de su
# elemento "Custom Code / HTML". Por eso acá:
#   · todo el CSS se encierra bajo #fixus-lp para que los estilos de GHL no
#     se mezclen con los nuestros (ni al revés),
#   · el <div> se estira a ancho completo aunque GHL lo meta en su contenedor,
#   · el CSS, el JS y las fuentes van dentro del mismo bloque.

SCOPE = "#fixus-lp"


def _prefijar(selector):
    partes = []
    for sel in selector.split(","):
        sel = sel.strip()
        if not sel:
            continue
        if sel.startswith(".js "):          # la clase .js vive en <html>, fuera del bloque
            sel = sel[4:]
        if sel in (":root", "html", "body"):
            partes.append(SCOPE)
        else:
            partes.append(SCOPE + " " + sel)
    vistos = []
    for x in partes:
        if x not in vistos:
            vistos.append(x)
    return ",".join(vistos)


def escopar_css(css):
    """Encierra todas las reglas bajo #fixus-lp, respetando los @media."""
    import re
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    fuera, i, n = [], 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j == -1:
            break
        cabecera = css[i:j].strip()
        if cabecera.startswith("@"):
            profundidad, k = 1, j + 1
            while k < n and profundidad:
                if css[k] == "{":
                    profundidad += 1
                elif css[k] == "}":
                    profundidad -= 1
                k += 1
            fuera.append(cabecera + "{" + escopar_css(css[j + 1:k - 1]) + "}")
            i = k
        else:
            k = css.find("}", j)
            cuerpo = css[j + 1:k].strip()
            if cabecera and cuerpo:
                fuera.append(_prefijar(cabecera) + "{" + cuerpo + "}")
            i = k + 1
    return "\n".join(fuera)


RESET_GHL = """
/* El bloque se estira a ancho completo aunque GHL lo meta en su contenedor */
#fixus-lp{
  position:relative;width:100vw;left:50%;right:50%;
  margin-left:-50vw;margin-right:-50vw;
  overflow-x:hidden;isolation:isolate;
}
/* Blindaje contra los estilos propios de GHL */
#fixus-lp,#fixus-lp *{box-sizing:border-box}
#fixus-lp *{margin:0;padding:0}
#fixus-lp a{text-decoration:none!important;color:inherit}
#fixus-lp ul,#fixus-lp ol,#fixus-lp li{list-style:none}
#fixus-lp img{max-width:100%;display:block;border:0}
#fixus-lp button{background:none;border:0;font-family:inherit;cursor:pointer}
#fixus-lp p,#fixus-lp span,#fixus-lp li,#fixus-lp b,#fixus-lp em,
#fixus-lp strong,#fixus-lp summary,#fixus-lp small,#fixus-lp i{font-family:inherit}
#fixus-lp h1,#fixus-lp h2,#fixus-lp h3{text-transform:none}
"""


def construir_ghl(nombre):
    origen = os.path.join(RUTA, nombre + ".html")
    with io.open(origen, encoding="utf-8") as f:
        html = f.read()

    def leer(rel):
        with io.open(os.path.join(RUTA, rel), encoding="utf-8") as f:
            return f.read()

    # --- CSS aislado ---
    css = ("@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800"
           "&family=Inter:wght@400;500;600;700&display=swap');\n"
           + escopar_css(leer("assets/fixus.css")) + "\n" + RESET_GHL)

    # --- JS: la raíz pasa a ser el div, no el body ---
    js = leer("assets/fixus.js")
    js = js.replace("var d = document;",
                    "var d = document;\n  var RAIZ = d.getElementById('fixus-lp');")
    js = js.replace("d.body ? d.body.getAttribute('data-campana') : ''",
                    "RAIZ ? RAIZ.getAttribute('data-campana') : ''")
    js = js.replace("d.body.getAttribute('data-campana')", "RAIZ.getAttribute('data-campana')")
    js = js.replace("d.body.getAttribute('data-wa-msg')", "RAIZ.getAttribute('data-wa-msg')")
    js = js.replace("#cta-hero", "#fixus-cta-hero")

    # GHL mete el bloque dentro de una sección/fila/columna que traen su propio
    # relleno y su fondo blanco. Esto los anula desde dentro, sin tocar el editor.
    js += """

/* --- GHL: elimina el relleno y el fondo de los contenedores que lo envuelven --- */
(function () {
  function ajustar() {
    var n = document.getElementById('fixus-lp');
    if (!n) return;
    var p = n.parentElement;
    while (p && p !== document.body) {
      p.style.setProperty('padding', '0', 'important');
      p.style.setProperty('margin-top', '0', 'important');
      p.style.setProperty('margin-bottom', '0', 'important');
      p.style.setProperty('background', 'transparent', 'important');
      p.style.setProperty('border', '0', 'important');
      p = p.parentElement;
    }
    document.body.style.setProperty('margin', '0', 'important');
    document.body.style.setProperty('background-color', '#08080A', 'important');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ajustar);
  else ajustar();
  window.addEventListener('load', ajustar);
  setTimeout(ajustar, 400);
  setTimeout(ajustar, 1500);
})();
"""

    # --- Cuerpo de la página, sin <html>/<head>/<body> ---
    cuerpo = html[html.index("<body"):html.rindex("</body>")]
    cuerpo = cuerpo[cuerpo.index(">") + 1:]
    for basura in ('<script src="assets/fixus.js"></script>',
                   "<script>document.getElementById('y').textContent=new Date().getFullYear();</script>"):
        cuerpo = cuerpo.replace(basura, "")
    cuerpo = cuerpo.replace('id="cta-hero"', 'id="fixus-cta-hero"')
    cuerpo = cuerpo.replace('id="y"', 'id="fixus-y"')

    atributos = html[html.index("<body"):html.index(">", html.index("<body"))]
    atributos = atributos.replace("<body", "").strip()

    bloque = (
        "<!-- ===================================================================\n"
        "     FIXUS · %s\n"
        "     Pegar TAL CUAL en GoHighLevel: elemento \"Custom Code / HTML\".\n"
        "     Antes de publicar, cambia los 4 valores de FIXUS = { ... } de más\n"
        "     abajo (link de pago, WhatsApp, VSL y mapa).\n"
        "     Generado por build.py — no editar a mano.\n"
        "     =================================================================== -->\n"
        "<style>\n%s\n</style>\n\n"
        "<div id=\"fixus-lp\" %s>\n%s\n</div>\n\n"
        "<script>\n%s\n"
        "document.addEventListener('DOMContentLoaded',function(){\n"
        "  var a=document.getElementById('fixus-y');\n"
        "  if(a) a.textContent=new Date().getFullYear();\n"
        "});\n</script>\n"
    ) % (nombre, css, atributos, cuerpo.strip(), js)

    carpeta = os.path.join(RUTA, "ghl")
    if not os.path.isdir(carpeta):
        os.makedirs(carpeta)
    destino = os.path.join(carpeta, nombre + ".html")
    with io.open(destino, "w", encoding="utf-8") as f:
        f.write(bloque)
    return destino


if __name__ == "__main__":
    for nombre, c in CAMPANAS.items():
        construir(nombre, c)
        construir_suelto(nombre)
        construir_ghl(nombre)
        print("✓ %s.html  (+ previsualizar/ + ghl/)" % nombre)
