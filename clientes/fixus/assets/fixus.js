/* ==========================================================================
   FIXUS · Configuración y comportamiento compartido de las landings
   --------------------------------------------------------------------------
   👉 EDITA SOLO ESTE BLOQUE. Los tres landings toman los enlaces de aquí.
   ========================================================================== */

var FIXUS = {
  // Link de PAGO/AGENDA de la evaluación kinesiológica ($24.990).
  // Pega aquí el link de Flow / Mercado Pago / calendario con pago.
  PAGO_URL: 'https://www.fixus.cl/#agenda',            // ← REEMPLAZAR

  // WhatsApp (botón secundario). Formato: 56 + número, sin + ni espacios.
  WA_NUMERO: '56900000000',                            // ← REEMPLAZAR

  // VSL de kinesiología. Pega la URL EMBED del video (no la de compartir).
  //   YouTube  → https://www.youtube.com/embed/ABC123
  //   Vimeo    → https://player.vimeo.com/video/123456789
  // Si lo dejas vacío, el botón de play lleva directo a agendar.
  VSL_EMBED: '',                                       // ← REEMPLAZAR

  // Ubicación (link de Google Maps del centro).
  MAPA_URL: 'https://maps.google.com/?q=Fixus+Providencia+Santiago', // ← REEMPLAZAR

  // Píxeles (opcional). Si los dejas vacíos no se carga nada.
  META_PIXEL_ID: '',                                   // ej. '123456789012345'
  GA4_ID: ''                                           // ej. 'G-XXXXXXXXXX'
};

(function () {
  'use strict';

  var d = document;
  var campana = d.body ? d.body.getAttribute('data-campana') : '';

  /* ---- 1. Rellena los enlaces de todos los CTA ---- */
  function enlaces() {
    campana = d.body.getAttribute('data-campana') || 'kinesiologia';

    // Pago / agenda: se le añade UTM de campaña para poder medir qué landing vende.
    // Las UTM van ANTES del #ancla, si el link trae una.
    var pago = FIXUS.PAGO_URL || '#';
    if (pago.charAt(0) !== '#') {
      var corte = pago.indexOf('#');
      var base = corte > -1 ? pago.slice(0, corte) : pago;
      var ancla = corte > -1 ? pago.slice(corte) : '';
      base += (base.indexOf('?') > -1 ? '&' : '?') +
              'utm_source=meta&utm_medium=paid&utm_campaign=kinesiologia&utm_content=' + campana;
      pago = base + ancla;
    }
    Array.prototype.forEach.call(d.querySelectorAll('[data-cta="pago"]'), function (a) {
      a.setAttribute('href', pago);
    });

    // WhatsApp: mensaje distinto según la campaña
    var msg = d.body.getAttribute('data-wa-msg') || 'Hola, quiero información sobre la evaluación kinesiológica.';
    var wa = 'https://wa.me/' + FIXUS.WA_NUMERO + '?text=' + encodeURIComponent(msg);
    Array.prototype.forEach.call(d.querySelectorAll('[data-cta="whatsapp"]'), function (a) {
      a.setAttribute('href', wa);
    });

    Array.prototype.forEach.call(d.querySelectorAll('[data-cta="mapa"]'), function (a) {
      a.setAttribute('href', FIXUS.MAPA_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  /* ---- 2. Barra fija móvil: aparece al pasar el primer CTA ---- */
  function barra() {
    var bar = d.querySelector('.bar');
    var ancla = d.querySelector('#cta-hero');
    if (!bar || !ancla) return;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          bar.classList.toggle('on', !e.isIntersecting && e.boundingClientRect.top < 0);
        });
      }, { threshold: 0 }).observe(ancla);
    } else {
      bar.classList.add('on');
    }
  }

  /* ---- 3. Animación de entrada por sección ---- */
  function revelar() {
    var items = d.querySelectorAll('.rv');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    Array.prototype.forEach.call(items, function (n) { io.observe(n); });
  }

  /* ---- 4. Reproductor del VSL: carga el iframe solo al hacer clic ---- */
  function video() {
    Array.prototype.forEach.call(d.querySelectorAll('[data-video]'), function (btn) {
      btn.addEventListener('click', function () {
        var src = FIXUS.VSL_EMBED;

        // Sin video montado todavía: el play lleva al CTA en vez de romperse.
        if (!src) {
          var cta = d.querySelector('#cta-hero');
          if (cta) cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        var cont = btn.closest('.vsl-ratio');
        var f = d.createElement('iframe');
        f.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&rel=0';
        f.setAttribute('title', 'Kinesiología Fixus — cómo funciona');
        f.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen');
        f.setAttribute('allowfullscreen', '');
        cont.innerHTML = '';
        cont.appendChild(f);
        track('VerVSL');
      });
    });
  }

  /* ---- 5. Medición de clics en los CTA ---- */
  function track(evento, extra) {
    var data = extra || {};
    data.campana = campana;
    if (window.fbq) window.fbq('trackCustom', evento, data);
    if (window.gtag) window.gtag('event', evento, data);
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: evento }, data));
  }

  function clics() {
    d.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cta]');
      if (!a) return;
      var tipo = a.getAttribute('data-cta');
      if (tipo === 'pago') track('ClicAgendarEvaluacion', { ubicacion: a.getAttribute('data-pos') || '' });
      if (tipo === 'whatsapp') track('ClicWhatsApp', { ubicacion: a.getAttribute('data-pos') || '' });
    });
  }

  /* ---- 6. Píxeles (solo si están configurados) ---- */
  function pixeles() {
    if (FIXUS.META_PIXEL_ID) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', FIXUS.META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
    if (FIXUS.GA4_ID) {
      var s = d.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + FIXUS.GA4_ID;
      d.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', FIXUS.GA4_ID);
    }
  }

  function init() { enlaces(); barra(); revelar(); video(); clics(); pixeles(); }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})();
