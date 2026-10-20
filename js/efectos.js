/* efectos.js -> preloader, menú a pantalla completa y aparición al hacer scroll.
   Sin librerías externas. Respeta "reducir movimiento" del sistema. */
(function () {
  var d = document, h = d.documentElement;
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  h.classList.add('js');

  /* Preloader: solo la primera vez por sesión */
  var p = d.querySelector('.precarga');
  if (p) {
    var visto = false;
    try { visto = sessionStorage.getItem('nye-precarga'); } catch (e) {}
    if (visto || quieto) {
      p.remove();
    } else {
      window.addEventListener('load', function () {
        setTimeout(function () {
          p.classList.add('fuera');
          setTimeout(function () { p.remove(); }, 600);
          try { sessionStorage.setItem('nye-precarga', '1'); } catch (e) {}
        }, 500);
      });
    }
  }

  /* Menú a pantalla completa */
  var b = d.querySelector('.menu-btn'), m = d.getElementById('menu');
  function abrir(o) {
    h.classList.toggle('menu-abierto', o);
    b.setAttribute('aria-expanded', o);
    b.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
    m.setAttribute('aria-hidden', !o);
  }
  if (b && m) {
    b.addEventListener('click', function () { abrir(!h.classList.contains('menu-abierto')); });
    m.addEventListener('click', function (e) { if (e.target.closest('a')) abrir(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });
  }

  /* Aparición al hacer scroll */
  var sel = '.portada-texto,.bloque>h2,.bloque>.intro,.tarjeta,.pilar,.pasos>li,.cifras>div,.cierre>*,' +
            'main>h1,main>p,.sec>h2,.sec>p,.sec li,details,.pilar-card,.tarjeta-info,.content-box,.cta,.ilustracion';
  var items = d.querySelectorAll(sel);
  if (!('IntersectionObserver' in window) || quieto) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
      (function (t) { setTimeout(function () { t.style.transitionDelay = ''; }, 900); })(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  Array.prototype.forEach.call(items, function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });
})();
