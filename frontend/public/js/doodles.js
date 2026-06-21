/* ============================================================
   Garabatos crayón decorativos (flores, corazón, tulipán)
   Usa los doodles reales pintados a mano en /assets/doodles/.
   Decoran los márgenes de las secciones como los dibujos que un
   niño hace en su cuaderno. Ligero, sin dependencias.

   Uso en HTML:
     <span class="doodle" data-doodle="flor01"
           style="--size:84px;right:4%;top:30%;--rot:-10deg"
           data-float="1"></span>

   - data-doodle : flor01 | flor03 | flor04 | tulipan | corazon
   - --size      : tamaño (ancho px) · --rot rotación · right/left/top/bottom posición
   - data-float  : "1" añade un leve balanceo continuo
   - clase doodle--hide-m : se oculta en móvil
   ============================================================ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const files = {
    flor01: 'flor01.png',
    flor03: 'flor03.png',
    flor04: 'flor04.png',
    tulipan: 'tulipan.webp',
    corazon: 'corazon.png',
  };
  const nodes = document.querySelectorAll('.doodle[data-doodle]');
  nodes.forEach((node) => {
    const name = node.dataset.doodle;
    if (!name || !files[name]) return;
    const img = document.createElement('img');
    img.src = `/assets/doodles/${files[name]}`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    node.appendChild(img);
    if (node.dataset.float === '1' && !reduce) node.classList.add('doodle--float');
  });
})();
