/* ============================================================
   Hero · "El mundo que dibujan"
   SVG puro (sin frameworks). Escena infantil dibujada a crayón:
   · Textura crayón real vía filtros SVG (feTurbulence +
     feDisplacementMap para el temblor + grano para la cera).
   · El paisaje se traza al cargar; el sol sale, las casas
     brotan, los niños crecen del suelo y los corazones flotan.
   · Ambiente continuo (sol, nubes, pájaros) con requestAnimationFrame.
   Respeta prefers-reduced-motion (escena fija, sin movimiento).
   ============================================================ */
(function () {
  const host = document.getElementById('hero-canvas');
  if (!host) return;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#3a2a1e';            // marrón "crayón" cálido (no negro plano)
  const W = 1600, H = 1000;

  const el = (tag, attrs, kids) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (kids) kids.forEach((c) => e.appendChild(c));
    return e;
  };

  // ---- SVG raíz + defs (filtros crayón) ----
  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%',
    preserveAspectRatio: 'xMidYMax slice', style: 'display:block',
  });
  svg.innerHTML = `
    <defs>
      <!-- Temblor de crayón: desplaza los trazos con ruido -->
      <filter id="crayon" x="-6%" y="-6%" width="112%" height="112%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.022" numOctaves="3" seed="7" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <!-- Crayón fuerte para rellenos (más temblor) -->
      <filter id="crayonRough" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves="3" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <!-- Grano de cera: textura sobre los rellenos -->
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="g"/>
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .08 0"/>
        <feComposite operator="in" in2="SourceGraphic"/>
        <feBlend in="SourceGraphic" mode="multiply"/>
      </filter>
    </defs>
  `;
  const root = el('g', { filter: 'url(#crayon)' });
  svg.appendChild(root);
  host.appendChild(svg);

  // trazo crayón: línea con dasharray para "dibujarse"
  const ink = (d, w, extra) =>
    el('path', Object.assign({ d, fill: 'none', stroke: INK, 'stroke-width': w || 6,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'hk-ink' }, extra || {}));
  // relleno crayón (con grano)
  const fill = (tag, attrs) => el(tag, Object.assign({ filter: 'url(#grain)' }, attrs));

  // ============ CIELO ============
  // Sol (un solo grupo: rayos + disco juntos, así nunca se separan)
  const cx = 1330, cy = 250, r = 92;
  let rayD = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    rayD += `M${(cx + Math.cos(a) * (r + 16)).toFixed(1)},${(cy + Math.sin(a) * (r + 16)).toFixed(1)} ` +
            `L${(cx + Math.cos(a) * (r + 50)).toFixed(1)},${(cy + Math.sin(a) * (r + 50)).toFixed(1)} `;
  }
  const sun = el('g', { class: 'hk-rise', 'data-rise': '70' });
  const sunSpin = el('g', { class: 'hk-sun' });
  sunSpin.appendChild(ink(rayD, 7, { stroke: '#F2A91E' }));
  sun.appendChild(sunSpin);
  sun.appendChild(fill('circle', { cx, cy, r, fill: '#FFC84D', stroke: INK, 'stroke-width': 6 }));
  sun.appendChild(ink(`M${cx - 30},${cy - 6} h0.1 M${cx + 30},${cy - 6} h0.1`, 12, { stroke: '#9A5B12' }));
  sun.appendChild(ink(`M${cx - 28},${cy + 22} q28,26 56,0`, 6, { stroke: '#9A5B12' }));
  root.appendChild(sun);

  // Nubes (deriva suave)
  const cloud = (x, y, s) => {
    const g = el('g', {});
    g.appendChild(fill('rect', { x: x - 78 * s, y: y + 2 * s, width: 156 * s, height: 24 * s, fill: '#fff' }));
    [[0, 8, 42], [-44, 16, 30], [44, 16, 32], [-20, -14, 30], [24, -12, 28]].forEach((p) =>
      g.appendChild(fill('ellipse', { cx: x + p[0] * s, cy: y + p[1] * s, rx: p[2] * s, ry: p[2] * s * 0.8, fill: '#fff', stroke: INK, 'stroke-width': 4 })));
    return g;
  };
  const cloud1 = el('g', { class: 'hk-cloud', 'data-amp': '26', 'data-spd': '0.10' }, [cloud(980, 165, 1)]);
  const cloud2 = el('g', { class: 'hk-cloud', 'data-amp': '-20', 'data-spd': '0.07' }, [cloud(1240, 270, 0.7)]);
  root.appendChild(cloud1); root.appendChild(cloud2);

  // Pájaros
  const birds = el('g', { class: 'hk-birds' }, [
    ink('M720,250 q15,-15 30,0 q15,-15 30,0 M820,220 q13,-13 26,0 q13,-13 26,0 M670,292 q12,-12 24,0 q12,-12 24,0', 5),
  ]);
  root.appendChild(birds);

  // ============ COLINAS ============
  root.appendChild(fill('path', { d: 'M0,602 Q420,540 820,576 T1600,556 L1600,1000 L0,1000 Z', fill: '#A9D08A', class: 'hk-fill' }));
  root.appendChild(ink('M0,602 Q420,540 820,576 T1600,556', 6, { class: 'hk-ink', 'data-draw': '1' }));

  // ============ CASAS + IGLESIA ============
  const house = (x, y, bw, bh, rh, wall, roof) => {
    const g = el('g', { class: 'hk-pop', 'data-o': `${x + bw / 2},${y + bh}` });
    g.appendChild(fill('rect', { x, y, width: bw, height: bh, rx: 6, fill: wall, stroke: INK, 'stroke-width': 6 }));
    g.appendChild(fill('polygon', { points: `${x - 12},${y} ${x + bw / 2},${y - rh} ${x + bw + 12},${y}`, fill: roof, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }));
    g.appendChild(fill('rect', { x: x + bw / 2 - 19, y: y + bh - 52, width: 38, height: 52, rx: 4, fill: '#7A4A36', stroke: INK, 'stroke-width': 5 }));
    g.appendChild(fill('rect', { x: x + 14, y: y + 18, width: 26, height: 26, rx: 4, fill: '#FBF7EF', stroke: INK, 'stroke-width': 5 }));
    return g;
  };
  root.appendChild(house(556, 500, 140, 108, 62, '#F2906F', '#D9694B'));
  // iglesia
  (function () {
    const x = 1010, y = 470, bw = 150, bh = 140;
    const g = el('g', { class: 'hk-pop', 'data-o': `${x + bw / 2},${y + bh}` });
    g.appendChild(fill('rect', { x, y, width: bw, height: bh, rx: 6, fill: '#FCFAF4', stroke: INK, 'stroke-width': 6 }));
    g.appendChild(fill('polygon', { points: `${x - 12},${y} ${x + bw / 2},${y - 70} ${x + bw + 12},${y}`, fill: '#2E6DA6', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }));
    g.appendChild(ink(`M${x + bw / 2},${y - 70} L${x + bw / 2},${y - 118} M${x + bw / 2 - 16},${y - 100} L${x + bw / 2 + 16},${y - 100}`, 7));
    g.appendChild(fill('path', { d: `M${x + bw / 2 - 24},${y + bh} L${x + bw / 2 - 24},${y + bh - 58} a24,24 0 0 1 48,0 L${x + bw / 2 + 24},${y + bh} Z`, fill: '#2E6DA6', stroke: INK, 'stroke-width': 5 }));
    g.appendChild(fill('circle', { cx: x + bw / 2, cy: y + 34, r: 15, fill: '#9FCBEC', stroke: INK, 'stroke-width': 5 }));
    root.appendChild(g);
  })();
  root.appendChild(house(1296, 516, 124, 96, 56, '#FBD24D', '#E0A92E'));

  // colina frontal (los niños se paran aquí)
  root.appendChild(fill('path', { d: 'M0,716 Q540,656 1040,700 T1600,684 L1600,1000 L0,1000 Z', fill: '#83BD5C', class: 'hk-fill' }));
  root.appendChild(ink('M0,716 Q540,656 1040,700 T1600,684', 6, { 'data-draw': '1' }));

  // ============ FLORES ============
  const flower = (x, yBase, col) => {
    const g = el('g', { class: 'hk-grow hk-flower', 'data-o': `${x},${yBase}` });
    g.appendChild(ink(`M${x},${yBase} L${x},${yBase - 58}`, 5, { stroke: '#3E7D3A' }));
    const py = yBase - 66;
    [[0, -16], [15, -5], [9, 13], [-9, 13], [-15, -5]].forEach((p) =>
      g.appendChild(fill('circle', { cx: x + p[0], cy: py + p[1], r: 11, fill: col, stroke: INK, 'stroke-width': 3.5 })));
    g.appendChild(fill('circle', { cx: x, cy: py, r: 8, fill: '#FBD24D', stroke: INK, 'stroke-width': 3.5 }));
    return g;
  };
  root.appendChild(flower(316, 968, '#E86A8E'));
  root.appendChild(flower(1196, 980, '#7C9BE0'));
  root.appendChild(flower(1452, 966, '#F2906F'));

  // ============ NIÑOS ============
  const KIDS = [
    [602, '#E7B488', '#E53935'], [754, '#C98A57', '#0077C8'],
    [906, '#8F5E38', '#F2B705'], [1058, '#DDA46F', '#22A39A'],
  ];
  KIDS.forEach(([x, skin, shirt]) => {
    const g = el('g', { class: 'hk-grow hk-kid', 'data-o': `${x},892` });
    g.appendChild(ink(`M${x - 12},862 L${x - 16},892 M${x + 12},862 L${x + 16},892`, 5));
    g.appendChild(ink(`M${x - 76},812 L${x},782 L${x + 76},812`, 5));
    g.appendChild(fill('circle', { cx: x - 76, cy: 812, r: 7, fill: skin, stroke: INK, 'stroke-width': 3.5 }));
    g.appendChild(fill('circle', { cx: x + 76, cy: 812, r: 7, fill: skin, stroke: INK, 'stroke-width': 3.5 }));
    g.appendChild(fill('polygon', { points: `${x - 34},864 ${x},760 ${x + 34},864`, fill: shirt, stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }));
    g.appendChild(fill('circle', { cx: x, cy: 724, r: 34, fill: skin, stroke: INK, 'stroke-width': 6 }));
    g.appendChild(ink(`M${x - 12},718 h0.1 M${x + 12},718 h0.1`, 8));
    g.appendChild(ink(`M${x - 13},734 q13,12 26,0`, 4.5));
    root.appendChild(g);
  });

  // ============ CORAZONES ============
  const heart = (x, y, s, ph) => {
    const g = el('g', { class: 'hk-heart' });
    g.dataset.ph = ph; g.dataset.hx = x; g.dataset.hy = y; g.dataset.hs = s;
    g.appendChild(fill('path', { d: 'M0,9 C0,-5 -20,-6 -20,8 C-20,19 -6,26 0,33 C6,26 20,19 20,8 C20,-6 0,-5 0,9 Z', fill: '#E5556B', stroke: INK, 'stroke-width': 4 }));
    return g;
  };
  root.appendChild(heart(812, 604, 1, 0));
  root.appendChild(heart(1006, 560, 0.7, 1.6));
  root.appendChild(heart(700, 620, 0.55, 0.8));

  // ============ WIRING: dibujo de intro + bucle de ambiente ============
  const draws = [...svg.querySelectorAll('[data-draw]')];
  const fills = [...svg.querySelectorAll('.hk-fill')];
  const pops = [...svg.querySelectorAll('.hk-pop')];
  const grows = [...svg.querySelectorAll('.hk-grow')];
  const flowers = [...svg.querySelectorAll('.hk-flower')];
  const kids = [...svg.querySelectorAll('.hk-kid')];
  const hearts = [...svg.querySelectorAll('.hk-heart')];
  const rise = svg.querySelector('.hk-rise');

  draws.forEach((p) => { const L = p.getTotalLength(); p.setAttribute('stroke-dasharray', L); p.setAttribute('stroke-dashoffset', L); p.dataset.len = L; });

  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  // Helper: setea transform como ATRIBUTO SVG (coordenadas reales, fiable
  // con filtros, a diferencia de transform-box CSS que descuadra los rayos).
  const setTr = (node, tr) => node.setAttribute('transform', tr);

  // Dibuja la escena de 0→1 (intro automática una sola vez al cargar).
  function applyDraw(k) {
    const win = (a, b) => clamp((k - a) / (b - a));
    draws.forEach((p, i) => {
      const kk = ease(win(i * 0.06, i * 0.06 + 0.45));
      p.setAttribute('stroke-dashoffset', (+p.dataset.len) * (1 - kk));
    });
    fills.forEach((f, i) => { f.setAttribute('opacity', win(0.0 + i * 0.06, 0.28 + i * 0.06)); });
    pops.forEach((g, i) => {
      const kk = ease(win(0.14 + i * 0.06, 0.5 + i * 0.06));
      g.setAttribute('opacity', kk);
      g.dataset.pop = kk;
    });
    grows.forEach((g, i) => {
      const kk = ease(win(0.28 + i * 0.04, 0.62 + i * 0.04));
      g.setAttribute('opacity', kk);
      g.dataset.grow = kk;
    });
    if (rise) { const kk = ease(win(0.04, 0.46)); rise.dataset.grow = kk; rise.setAttribute('opacity', kk); }
  }

  if (reduce) {
    applyDraw(1);
    // estado final estático, sin bucle de ambiente
    pops.forEach((g) => setTr(g, ''));
    return;
  }

  // ---- Reproducción en BUCLE continuo (no atado al scroll) ----
  // La escena se dibuja sola en ~2.6 s y luego el ambiente sigue vivo en loop.
  let t0 = null;
  const DRAW_SECS = 2.6;

  function frame(ts) {
    if (t0 == null) t0 = ts;
    const tsec = (ts - t0) / 1000;
    applyDraw(Math.min(1, tsec / DRAW_SECS));

    const w = (period, ph) => Math.sin((tsec / period) * Math.PI * 2 + (ph || 0));

    // SOL: el disco hace un bob suave; los rayos giran sobre el CENTRO REAL
    // del sol usando rotate(grados cx cy) — atributo SVG, nunca se separan.
    const riseGrow = sun.dataset.grow != null ? +sun.dataset.grow : 1;
    const riseY = (1 - riseGrow) * 70 + w(6) * -6;
    setTr(sun, `translate(0 ${riseY.toFixed(2)})`);
    setTr(sunSpin, `rotate(${(w(40) * 6).toFixed(2)} ${cx} ${cy})`);

    // nubes: deriva horizontal
    [cloud1, cloud2].forEach((c) => {
      const amp = +c.dataset.amp, spd = +c.dataset.spd;
      setTr(c, `translate(${(Math.sin(tsec * spd * Math.PI) * amp).toFixed(2)} 0)`);
    });

    // pájaros
    setTr(birds, `translate(${(w(11) * 14).toFixed(2)} ${(w(5.5) * -8).toFixed(2)})`);

    // POPS (casas/iglesia): rebote de entrada
    pops.forEach((g) => {
      const k = g.dataset.pop != null ? +g.dataset.pop : 1;
      const [ox, oy] = (g.dataset.o || '0,0').split(',').map(Number);
      const s = 0.8 + 0.2 * k;
      setTr(g, `translate(${ox} ${oy}) scale(${s}) translate(${-ox} ${-oy})`);
    });

    // flores: crecen desde su base y se mecen (rotate sobre su base real)
    flowers.forEach((g, i) => {
      const grow = g.dataset.grow != null ? +g.dataset.grow : 1;
      const [ox, oy] = g.dataset.o.split(',').map(Number);
      const rot = w(5, i * 1.2) * 3.5;
      setTr(g, `translate(${ox} ${oy}) rotate(${rot.toFixed(2)}) scale(${grow}) translate(${-ox} ${-oy})`);
    });

    // niños: crecen desde el suelo y "respiran" (translateY suave)
    kids.forEach((g, i) => {
      const grow = g.dataset.grow != null ? +g.dataset.grow : 1;
      const [ox, oy] = g.dataset.o.split(',').map(Number);
      const by = w(4, i * 0.7) * -5;
      setTr(g, `translate(${ox} ${oy}) translate(0 ${by.toFixed(2)}) scale(${grow}) translate(${-ox} ${-oy})`);
    });

    // corazones: suben y se desvanecen en bucle
    hearts.forEach((g) => {
      const ph = +g.dataset.ph, hx = +g.dataset.hx, hy = +g.dataset.hy, hs = +g.dataset.hs;
      const tt = ((tsec / 5 + ph) % 1 + 1) % 1;
      setTr(g, `translate(${(hx + Math.sin(tt * 6.28) * 10).toFixed(2)} ${(hy - tt * 90).toFixed(2)}) scale(${(hs * (0.7 + tt * 0.4)).toFixed(3)})`);
      g.setAttribute('opacity', (Math.sin(tt * Math.PI) * 0.9).toFixed(3));
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
