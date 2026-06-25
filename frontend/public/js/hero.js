/* ============================================================
   Hero V2.5 · Portada de crayón vivo
   Escena SVG artesanal: líneas irregulares, relleno por trazos y
   una intro donde primero se dibuja y luego se colorea.
   Mantiene window.__jumaHeroCamera(t) para el scroll existente.
   ============================================================ */
(function () {
  const host = document.getElementById('hero-canvas');
  if (!host) return;

  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1600;
  const H = 1000;
  const INK = '#4A3A2A';

  const el = (tag, attrs, kids) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    (kids || []).forEach((child) => node.appendChild(child));
    return node;
  };

  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`,
    width: '100%',
    height: '100%',
    preserveAspectRatio: 'xMidYMax slice',
    style: 'display:block',
  });

  svg.innerHTML = `
    <defs>
      <filter id="rough-line" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.021 0.027" numOctaves="3" seed="18" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="wax" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.74" numOctaves="2" seed="12" result="grain"/>
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .11 0"/>
        <feComposite operator="in" in2="SourceGraphic"/>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
      <clipPath id="clip-sky"><path d="M0,0 H1600 V585 C1260,535 1010,585 760,552 C472,514 248,592 0,548 Z"/></clipPath>
      <clipPath id="clip-hill-back"><path d="M0,560 C255,520 432,500 674,545 C902,586 1090,526 1320,546 C1448,558 1530,582 1600,568 V1000 H0 Z"/></clipPath>
      <clipPath id="clip-hill-front"><path d="M0,720 C262,668 512,692 720,730 C945,770 1166,690 1600,718 V1000 H0 Z"/></clipPath>
      <clipPath id="clip-church"><path d="M930,440 L1044,332 L1162,440 L1144,454 L1144,654 C1112,662 1016,666 936,654 L936,454 Z"/></clipPath>
      <clipPath id="clip-house-left"><path d="M500,518 L604,430 L712,518 L696,532 L696,660 L516,660 L516,532 Z"/></clipPath>
      <clipPath id="clip-house-right"><path d="M1244,548 L1328,474 L1420,548 L1404,560 L1404,666 L1260,666 L1260,560 Z"/></clipPath>
      <clipPath id="clip-sun"><circle cx="1320" cy="204" r="90"/></clipPath>
    </defs>
  `;

  const scene = el('g', {});
  svg.appendChild(scene);
  host.replaceChildren(svg);

  const camera = {
    full: { x: 0, y: 0, w: W, h: H },
    door: { x: 988, y: 508, w: 145, h: 92 },
  };
  const mix = (a, b, t) => a + (b - a) * t;
  let lastCamera = -1;
  window.__jumaHeroCamera = (t) => {
    const k = Math.max(0, Math.min(1, t || 0));
    if (Math.abs(k - lastCamera) < 0.002) return;
    lastCamera = k;
    svg.setAttribute(
      'viewBox',
      [
        mix(camera.full.x, camera.door.x, k),
        mix(camera.full.y, camera.door.y, k),
        mix(camera.full.w, camera.door.w, k),
        mix(camera.full.h, camera.door.h, k),
      ].map((v) => v.toFixed(2)).join(' '),
    );
  };

  const path = (d, attrs) => el('path', Object.assign({
    d,
    fill: 'none',
    stroke: INK,
    'stroke-width': 8,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    filter: 'url(#rough-line)',
    class: 'draw-line',
  }, attrs || {}));

  const fillPath = (d, attrs) => el('path', Object.assign({
    d,
    filter: 'url(#wax)',
    class: 'color-shape',
  }, attrs || {}));

  function scribble(clipId, color, y0, y1, step, tilt, width, cls) {
    const g = el('g', { 'clip-path': `url(#${clipId})`, class: `scribble-fill ${cls || ''}`.trim() });
    let i = 0;
    for (let y = y0; y <= y1; y += step) {
      const wobble = (i % 4) * 10;
      g.appendChild(path(
        `M${-80 + wobble},${y} C260,${y - 28 + wobble} 510,${y + 32 - wobble} 820,${y - 4} C1110,${y - 38 + wobble} 1320,${y + 22} 1680,${y - 10}`,
        {
          stroke: color,
          'stroke-width': width,
          opacity: 0.58,
          transform: `rotate(${tilt} 800 ${y})`,
          class: 'color-line',
          filter: 'url(#rough-line)',
        },
      ));
      i += 1;
    }
    return g;
  }

  function roughRect(x, y, w, h, r) {
    return `M${x + r},${y + 4} C${x + w * .33},${y - 4} ${x + w * .66},${y + 5} ${x + w - r},${y + 2}
      Q${x + w + 7},${y + 2} ${x + w - 1},${y + r}
      C${x + w + 2},${y + h * .38} ${x + w - 4},${y + h * .64} ${x + w + 1},${y + h - r}
      Q${x + w - 2},${y + h + 5} ${x + w - r},${y + h}
      C${x + w * .68},${y + h + 8} ${x + w * .35},${y + h - 7} ${x + r},${y + h + 1}
      Q${x - 5},${y + h - 1} ${x + 2},${y + h - r}
      C${x - 4},${y + h * .64} ${x + 4},${y + h * .34} ${x},${y + r}
      Q${x + 1},${y + 1} ${x + r},${y + 4} Z`;
  }

  const paper = el('g', { class: 'paper-base' }, [
    fillPath('M0,0 H1600 V1000 H0 Z', { fill: '#FFF7EA', opacity: 1 }),
  ]);
  scene.appendChild(paper);

  const colorLayer = el('g', { class: 'hero-color-layer' });
  colorLayer.appendChild(scribble('clip-sky', '#A7D9F7', 20, 570, 24, -1.2, 18, 'sky-color'));
  colorLayer.appendChild(scribble('clip-hill-back', '#B8DB94', 520, 930, 22, .7, 19, 'hill-color'));
  colorLayer.appendChild(scribble('clip-hill-front', '#79BD59', 666, 1040, 21, -.5, 18, 'grass-color'));
  colorLayer.appendChild(scribble('clip-church', '#F8F3E7', 366, 670, 18, -1.4, 20, 'church-wall-color'));
  colorLayer.appendChild(scribble('clip-house-left', '#F19A79', 460, 664, 17, 1.4, 18, 'house-color'));
  colorLayer.appendChild(scribble('clip-house-right', '#F7CB48', 492, 674, 17, -1.2, 18, 'house-color'));
  colorLayer.appendChild(scribble('clip-sun', '#F9BF35', 120, 292, 15, 9, 20, 'sun-color'));
  scene.appendChild(colorLayer);

  const lineLayer = el('g', { class: 'hero-line-layer' });
  lineLayer.appendChild(path('M0,552 C255,512 444,500 674,545 C902,586 1092,526 1320,546 C1452,558 1534,582 1600,568', { 'stroke-width': 7 }));
  lineLayer.appendChild(path('M0,720 C262,668 512,692 720,730 C945,770 1166,690 1600,718', { 'stroke-width': 8 }));

  lineLayer.appendChild(path('M930,440 L1044,332 L1162,440 L1144,454 L1144,654 C1112,662 1016,666 936,654 L936,454 Z', { 'stroke-width': 9 }));
  lineLayer.appendChild(path('M1044,332 C1036,294 1046,264 1042,226 M1018,258 C1032,254 1056,254 1074,258', { 'stroke-width': 8 }));
  lineLayer.appendChild(path('M1010,654 C1008,620 1012,564 1040,552 C1064,558 1074,612 1071,654 Z', { fill: '#2E6DA6', 'stroke-width': 7, class: 'draw-line door-color' }));
  lineLayer.appendChild(path('M1038,488 C1059,482 1078,496 1076,518 C1070,538 1038,544 1027,522 C1018,505 1024,492 1038,488 Z', { fill: '#BDE4FF', 'stroke-width': 6, class: 'draw-line window-color' }));

  lineLayer.appendChild(path('M500,518 L604,430 L712,518 L696,532 L696,660 L516,660 L516,532 Z', { 'stroke-width': 8 }));
  lineLayer.appendChild(path('M1244,548 L1328,474 L1420,548 L1404,560 L1404,666 L1260,666 L1260,560 Z', { 'stroke-width': 8 }));
  lineLayer.appendChild(path(roughRect(580, 596, 46, 64, 7), { fill: '#8B5C42', 'stroke-width': 6 }));
  lineLayer.appendChild(path(roughRect(1296, 604, 44, 62, 7), { fill: '#8B5C42', 'stroke-width': 6 }));

  lineLayer.appendChild(path('M1240,204 C1248,136 1308,92 1372,126 C1434,160 1428,252 1362,286 C1300,318 1232,276 1240,204 Z', { fill: 'rgba(249,191,53,.34)', stroke: '#EAA21E', 'stroke-width': 8 }));
  for (let i = 0; i < 12; i += 1) {
    const a = (Math.PI * 2 * i) / 12;
    const x1 = 1320 + Math.cos(a) * 104;
    const y1 = 204 + Math.sin(a) * 104;
    const x2 = 1320 + Math.cos(a) * 144;
    const y2 = 204 + Math.sin(a) * 144;
    lineLayer.appendChild(path(`M${x1.toFixed(1)},${y1.toFixed(1)} C${((x1 + x2) / 2 + Math.sin(a) * 10).toFixed(1)},${((y1 + y2) / 2 - Math.cos(a) * 10).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, { stroke: '#EAA21E', 'stroke-width': 7 }));
  }

  const clouds = el('g', { class: 'clouds' });
  clouds.appendChild(path('M870,190 C835,188 820,150 854,130 C868,88 930,88 954,122 C990,100 1048,116 1058,156 C1104,156 1130,194 1104,220 C1056,244 992,224 954,232 C916,238 900,194 870,190 Z', { fill: 'rgba(255,255,255,.35)', opacity: .8, 'stroke-width': 7 }));
  clouds.appendChild(path('M1240,322 C1214,316 1208,292 1230,276 C1240,244 1282,244 1298,270 C1328,256 1370,272 1374,306 C1342,328 1308,314 1280,326 C1260,332 1252,326 1240,322 Z', { fill: 'rgba(255,255,255,.26)', opacity: .68, 'stroke-width': 6 }));
  lineLayer.appendChild(clouds);

  const kids = el('g', { class: 'kids' });
  [
    [610, 780, '#E7B488', '#E53935'],
    [760, 790, '#C98A57', '#0077C8'],
    [920, 790, '#8F5E38', '#F5C84C'],
    [1080, 782, '#DDA46F', '#22A39A'],
  ].forEach(([x, y, skin, shirt], i) => {
    const kid = el('g', { class: 'kid', 'data-kid': i });
    kid.appendChild(path(`M${x - 72},${y + 84} C${x - 28},${y + 48} ${x + 22},${y + 46} ${x + 74},${y + 82}`, { 'stroke-width': 7 }));
    kid.appendChild(path(`M${x - 34},${y + 120} C${x - 22},${y + 80} ${x - 8},${y + 48} ${x},${y + 8} C${x + 10},${y + 48} ${x + 22},${y + 82} ${x + 34},${y + 120} Z`, { fill: shirt, 'stroke-width': 7 }));
    kid.appendChild(path(`M${x - 34},${y - 34} C${x - 14},${y - 66} ${x + 32},${y - 58} ${x + 40},${y - 18} C${x + 36},${y + 20} ${x - 12},${y + 38} ${x - 42},${y + 4} C${x - 48},${y - 12} ${x - 44},${y - 26} ${x - 34},${y - 34} Z`, { fill: skin, 'stroke-width': 7 }));
    kid.appendChild(path(`M${x - 13},${y - 18} h.1 M${x + 13},${y - 18} h.1`, { 'stroke-width': 8 }));
    kid.appendChild(path(`M${x - 14},${y + 2} C${x - 2},${y + 14} ${x + 14},${y + 14} ${x + 24},${y + 1}`, { 'stroke-width': 5 }));
    kid.appendChild(path(`M${x - 14},${y + 118} L${x - 18},${y + 158} M${x + 16},${y + 118} L${x + 24},${y + 158}`, { 'stroke-width': 6 }));
    kids.appendChild(kid);
  });
  lineLayer.appendChild(kids);

  const flowerDoodles = el('g', { class: 'hero-doodles' });
  [
    ['/assets/doodles/flor01.png', 300, 812, 92, -9],
    ['/assets/doodles/flor03.png', 1216, 818, 82, 8],
    ['/assets/doodles/corazon.png', 820, 612, 58, -5],
    ['/assets/doodles/tulipan.webp', 1400, 790, 70, 7],
  ].forEach(([href, x, y, size, rot]) => {
    flowerDoodles.appendChild(el('image', {
      href,
      x,
      y,
      width: size,
      height: size,
      transform: `rotate(${rot} ${x + size / 2} ${y + size / 2})`,
      opacity: .72,
      class: 'hero-png-doodle',
    }));
  });
  lineLayer.appendChild(flowerDoodles);

  scene.appendChild(lineLayer);

  const drawLines = [...svg.querySelectorAll('.draw-line')];
  const colorLines = [...svg.querySelectorAll('.color-line')];
  const pngDoodles = [...svg.querySelectorAll('.hero-png-doodle')];
  drawLines.forEach((p) => {
    if (typeof p.getTotalLength !== 'function') return;
    const len = p.getTotalLength();
    p.dataset.len = len;
    p.setAttribute('stroke-dasharray', len);
    p.setAttribute('stroke-dashoffset', len);
  });
  colorLines.forEach((p) => {
    const len = p.getTotalLength ? p.getTotalLength() : 1500;
    p.dataset.len = len;
    p.setAttribute('stroke-dasharray', len);
    p.setAttribute('stroke-dashoffset', len);
  });
  pngDoodles.forEach((img) => img.setAttribute('transform-origin', 'center'));

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const win = (k, a, b) => clamp((k - a) / (b - a));

  function applyIntro(k) {
    drawLines.forEach((p, i) => {
      const kk = ease(win(k, i * 0.012, 0.5 + i * 0.006));
      p.setAttribute('stroke-dashoffset', (+p.dataset.len) * (1 - kk));
      p.setAttribute('opacity', Math.max(.02, kk).toFixed(3));
    });
    colorLines.forEach((p, i) => {
      const kk = ease(win(k, .18 + i * 0.004, .76 + i * 0.004));
      p.setAttribute('stroke-dashoffset', (+p.dataset.len) * (1 - kk));
      p.setAttribute('opacity', (kk * .62).toFixed(3));
    });
    pngDoodles.forEach((img, i) => {
      const kk = ease(win(k, .62 + i * .05, .96));
      img.setAttribute('opacity', (kk * .72).toFixed(3));
    });
  }

  applyIntro(reduce ? 1 : 0);
  if (reduce) return;

  let start = null;
  let raf = 0;
  let introDone = false;
  function tick(ts) {
    if (!start) start = ts;
    const seconds = (ts - start) / 1000;
    if (!introDone) {
      const k = clamp(seconds / 3.1);
      applyIntro(k);
      introDone = k >= 1;
    }

    clouds.setAttribute('transform', `translate(${Math.sin(seconds * .38) * 10} ${Math.cos(seconds * .25) * 4})`);
    kids.setAttribute('transform', `translate(0 ${Math.sin(seconds * 1.15) * 2.2})`);
    flowerDoodles.setAttribute('transform', `translate(0 ${Math.sin(seconds * .8) * 5})`);
    raf = requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!raf) raf = requestAnimationFrame(tick);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  observer.observe(host);
})();
