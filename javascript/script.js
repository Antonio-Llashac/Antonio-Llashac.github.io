/* script.js
   Enlazar al final del <head> de cada página:
   <script src="script.js" defer></script>
*/
(function () {
  'use strict';

  /* ===== 1. Los cuadros crecen y proyectan sombra al pasar el cursor ===== */

  // Cambia ESCALA para crecer más o menos (1.08 = 8 % más grande)
  var ESCALA = 1.08;

  // Sombra que aparece al pasar el cursor (formato CSS box-shadow:
  // desplazamiento-x desplazamiento-y desenfoque color)
  var SOMBRA = '0 10px 24px rgba(0, 0, 0, 0.30)';

  // Qué elementos cuentan como "cuadros":
  // cláusulas y pilares (article), pasos de certificación (ol > li),
  // botones de "Explora la norma" y preguntas frecuentes (details)
  var CUADROS = 'article, ol > li, main aside nav a, details';

  function iniciarCuadros() {
    var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll(CUADROS).forEach(function (cuadro) {
      // Si el sistema pide reducir movimiento, el cuadro crece igual pero sin animación
      cuadro.style.transition = sinMovimiento ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease';

      function crecer() {
        // El cuadro se dibuja por encima de sus vecinos mientras crece
        if (getComputedStyle(cuadro).position === 'static') {
          cuadro.style.position = 'relative';
        }
        cuadro.style.zIndex = '10';
        cuadro.style.transform = 'scale(' + ESCALA + ')';
        cuadro.style.boxShadow = SOMBRA;
      }

      function normal() {
        cuadro.style.transform = '';
        cuadro.style.boxShadow = '';
        cuadro.style.zIndex = '';
      }

      cuadro.addEventListener('mouseenter', crecer);
      cuadro.addEventListener('mouseleave', normal);
      // Lo mismo al navegar con el teclado
      cuadro.addEventListener('focusin', crecer);
      cuadro.addEventListener('focusout', normal);
    });
  }

  /* ===== 2. Mostrar / ocultar contraseña ===== */

  function iniciarContrasenas() {
    document.querySelectorAll('input[type="password"]').forEach(function (campo) {
      var boton = document.createElement('button');
      boton.type = 'button'; // no envía el formulario
      boton.textContent = 'Mostrar';
      boton.setAttribute('aria-label', 'Mostrar contraseña');
      boton.setAttribute('aria-pressed', 'false');

      // Estilo mínimo en línea para que sea un solo archivo JS
      boton.style.cssText = [
        'position:absolute', 'display:block', 'margin:0', 'padding:2px 6px',
        'width:auto', 'height:auto', 'min-width:0', 'overflow:visible',
        'clip:auto', 'white-space:nowrap', 'z-index:5',
        'background:transparent', 'color:#000', 'border:0', 'border-radius:4px',
        'font:inherit', 'font-size:14px', 'line-height:1.2',
        'text-decoration:underline', 'cursor:pointer'
      ].join(';');

      campo.insertAdjacentElement('afterend', boton);
      campo.style.paddingRight = '76px'; // el texto no pasa por debajo del botón

      // Coloca el botón dentro del campo, a la derecha
      function colocar() {
        boton.style.left = (campo.offsetLeft + campo.offsetWidth - boton.offsetWidth - 10) + 'px';
        boton.style.top = (campo.offsetTop + (campo.offsetHeight - boton.offsetHeight) / 2) + 'px';
      }

      boton.addEventListener('click', function () {
        var estabaVisible = campo.type === 'text';
        var inicio = campo.selectionStart;
        var fin = campo.selectionEnd;

        campo.type = estabaVisible ? 'password' : 'text';
        boton.textContent = estabaVisible ? 'Mostrar' : 'Ocultar';
        boton.setAttribute('aria-pressed', String(!estabaVisible));
        boton.setAttribute('aria-label', estabaVisible ? 'Mostrar contraseña' : 'Ocultar contraseña');

        // Devuelve el foco y el cursor al campo
        campo.focus();
        try { campo.setSelectionRange(inicio, fin); } catch (e) { /* sin acción */ }
        colocar();
      });

      colocar();
      window.addEventListener('resize', colocar);
      window.addEventListener('load', colocar);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(colocar);
      if (window.ResizeObserver) new ResizeObserver(colocar).observe(campo);
    });
  }

  /* ===== Inicio ===== */
  function iniciar() {
    iniciarCuadros();
    iniciarContrasenas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
