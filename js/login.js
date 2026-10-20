/* login.js -> mostrar u ocultar la contraseña */
(function () {
  var b = document.querySelector('.ver'), i = document.getElementById('clave');
  if (!b || !i) return;
  b.addEventListener('click', function () {
    var oculto = i.type === 'password';
    i.type = oculto ? 'text' : 'password';
    b.textContent = oculto ? 'Ocultar' : 'Mostrar';
    b.setAttribute('aria-pressed', oculto);
  });
})();
