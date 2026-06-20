/* ============================================================
   Hero · "El mundo que dibujan"
   Mundo infantil a crayón recreado en Remotion: el paisaje se
   traza, el sol sale, las casas brotan, los niños crecen desde
   el suelo tomados de la mano y los corazones flotan.
   Todo frame-driven (useCurrentFrame) para una animación fluida
   y determinista. Pensado como fondo en bucle del hero.
   ============================================================ */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { INK, drawOn, pop, rise, wave, cycle } from './anim';

const W = 1600;
const H = 1000;

// ---- Sol ------------------------------------------------------
const Sun: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 1342;
  const cy = 224;
  const r = 92;

  const riseK = drawOn(frame, 6, 48); // sale de detrás de la colina
  const y = (1 - riseK) * 90;
  const bob = wave(frame, fps, 6) * -7;
  const rayPulse = 1 + wave(frame, fps, 4.5) * 0.05;
  const rayRot = wave(frame, fps, 40) * 6;

  const rays: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    const x1 = cx + Math.cos(a) * (r + 18);
    const y1 = cy + Math.sin(a) * (r + 18);
    const x2 = cx + Math.cos(a) * (r + 52);
    const y2 = cy + Math.sin(a) * (r + 52);
    rays.push(`M${x1.toFixed(0)},${y1.toFixed(0)} L${x2.toFixed(0)},${y2.toFixed(0)}`);
  }

  return (
    <g transform={`translate(0 ${y + bob})`} opacity={riseK}>
      <g
        transform={`rotate(${rayRot} ${cx} ${cy}) scale(${rayPulse})`}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <path d={rays.join(' ')} fill="none" stroke="#F2A91E" strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="#FFC84D" stroke={INK} strokeWidth={5} />
      <path d={`M${cx - 30},${cy - 8} h0.1 M${cx + 30},${cy - 8} h0.1`} stroke="#A9690A" strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d={`M${cx - 30},${cy + 22} q30,30 60,0`} stroke="#A9690A" strokeWidth={6} strokeLinecap="round" fill="none" />
    </g>
  );
};

// ---- Nube (deriva continua, envuelve sin cortes) --------------
const Cloud: React.FC<{ x: number; y: number; s: number; speed: number; range: number; delay: number }> = ({
  x, y, s, speed, range, delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity } = pop(frame, fps, delay);
  const dx = wave(frame, fps, speed) * range;
  const parts = [[0, 8, 42], [-44, 16, 30], [44, 16, 32], [-20, -14, 30], [24, -12, 28]];
  return (
    <g transform={`translate(${dx} 0)`} opacity={opacity}>
      <rect x={x - 78 * s} y={y + 2 * s} width={156 * s} height={24 * s} fill="#FFFFFF" />
      {parts.map((p, i) => (
        <ellipse key={i} cx={x + p[0] * s} cy={y + p[1] * s} rx={p[2] * s} ry={p[2] * s * 0.8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      ))}
    </g>
  );
};

// ---- Pájaros (bob suave) --------------------------------------
const Birds: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = drawOn(frame, 28, 64);
  const dy = wave(frame, fps, 5.5) * -8;
  const dx = wave(frame, fps, 11) * 14;
  return (
    <g transform={`translate(${dx} ${dy})`} opacity={k}>
      <path
        d="M740,214 q15,-15 30,0 q15,-15 30,0 M838,184 q13,-13 26,0 q13,-13 26,0 M690,256 q12,-12 24,0 q12,-12 24,0"
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  );
};

// ---- Casa / Iglesia (pop con rebote) --------------------------
type HouseProps = { x: number; y: number; bw: number; bh: number; rh: number; wall: string; roof: string; door: string; delay: number };
const House: React.FC<HouseProps> = ({ x, y, bw, bh, rh, wall, roof, door, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = pop(frame, fps, delay);
  return (
    <g opacity={opacity} transform={`scale(${scale})`} style={{ transformOrigin: `${x + bw / 2}px ${y + bh}px` }}>
      <rect x={x} y={y} width={bw} height={bh} rx={4} fill={wall} stroke={INK} strokeWidth={5} />
      <polygon points={`${x - 12},${y} ${x + bw / 2},${y - rh} ${x + bw + 12},${y}`} fill={roof} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={x + bw / 2 - 19} y={y + bh - 52} width={38} height={52} rx={3} fill={door} stroke={INK} strokeWidth={4} />
      <rect x={x + 14} y={y + 18} width={26} height={26} rx={3} fill="#FBF7EF" stroke={INK} strokeWidth={4} />
    </g>
  );
};

const Church: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scale, opacity } = pop(frame, fps, delay);
  const x = 1010, y = 470, bw = 150, bh = 140;
  return (
    <g opacity={opacity} transform={`scale(${scale})`} style={{ transformOrigin: `${x + bw / 2}px ${y + bh}px` }}>
      <rect x={x} y={y} width={bw} height={bh} rx={4} fill="#FCFAF4" stroke={INK} strokeWidth={5} />
      <polygon points={`${x - 12},${y} ${x + bw / 2},${y - 70} ${x + bw + 12},${y}`} fill="#2E6DA6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${x + bw / 2},${y - 70} L${x + bw / 2},${y - 118} M${x + bw / 2 - 16},${y - 100} L${x + bw / 2 + 16},${y - 100}`} stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
      <path d={`M${x + bw / 2 - 24},${y + bh} L${x + bw / 2 - 24},${y + bh - 58} a24,24 0 0 1 48,0 L${x + bw / 2 + 24},${y + bh} Z`} fill="#2E6DA6" stroke={INK} strokeWidth={4} />
      <circle cx={x + bw / 2} cy={y + 34} r={15} fill="#9FCBEC" stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ---- Flor (crece desde el suelo + se mece) --------------------
const Flower: React.FC<{ x: number; yBase: number; col: string; delay: number; swayPhase: number }> = ({ x, yBase, col, delay, swayPhase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { grow, opacity } = rise(frame, fps, delay);
  const sway = wave(frame, fps, 5, swayPhase) * 3.5;
  const py = yBase - 66;
  const petals = [[0, -16], [15, -5], [9, 13], [-9, 13], [-15, -5]];
  return (
    <g opacity={opacity} style={{ transformOrigin: `${x}px ${yBase}px` }} transform={`rotate(${sway} ${x} ${yBase}) scale(${grow})`}>
      <path d={`M${x},${yBase} L${x},${yBase - 58}`} stroke="#3E7D3A" strokeWidth={5} strokeLinecap="round" fill="none" />
      {petals.map((p, i) => (
        <circle key={i} cx={x + p[0]} cy={py + p[1]} r={11} fill={col} stroke={INK} strokeWidth={3.5} />
      ))}
      <circle cx={x} cy={py} r={8} fill="#FBD24D" stroke={INK} strokeWidth={3.5} />
    </g>
  );
};

// ---- Niños tomados de la mano (crecen + respiran) -------------
type Kid = { x: number; skin: string; shirt: string };
const KIDS: Kid[] = [
  { x: 602, skin: '#E7B488', shirt: '#E53935' },
  { x: 754, skin: '#C98A57', shirt: '#0077C8' },
  { x: 906, skin: '#8F5E38', shirt: '#F2B705' },
  { x: 1058, skin: '#DDA46F', shirt: '#22A39A' },
];

const Child: React.FC<{ k: Kid; i: number; delay: number }> = ({ k, i, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { grow, opacity } = rise(frame, fps, delay);
  const x = k.x;
  const breathe = wave(frame, fps, 4, i * 0.7) * -5;
  const groundY = 892;
  return (
    <g opacity={opacity} style={{ transformOrigin: `${x}px ${groundY}px` }} transform={`translate(0 ${breathe}) scale(${grow})`}>
      {/* piernas */}
      <path d={`M${x - 12},862 L${x - 16},${groundY} M${x + 12},862 L${x + 16},${groundY}`} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
      {/* brazos tomados de la mano */}
      <path d={`M${x - 76},812 L${x},782 L${x + 76},812`} stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={x - 76} cy={812} r={7} fill={k.skin} stroke={INK} strokeWidth={3.5} />
      <circle cx={x + 76} cy={812} r={7} fill={k.skin} stroke={INK} strokeWidth={3.5} />
      {/* cuerpo */}
      <polygon points={`${x - 34},864 ${x},760 ${x + 34},864`} fill={k.shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* cabeza + carita */}
      <circle cx={x} cy={724} r={34} fill={k.skin} stroke={INK} strokeWidth={5} />
      <path d={`M${x - 12},718 h0.1 M${x + 12},718 h0.1`} stroke={INK} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d={`M${x - 13},734 q13,12 26,0`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" />
    </g>
  );
};

// ---- Corazón que flota y se desvanece (bucle continuo) --------
const Heart: React.FC<{ x: number; y: number; s: number; periodS: number; phase: number }> = ({ x, y, s, periodS, phase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = drawOn(frame, 40, 70); // no aparece hasta que están los niños
  const t = cycle(frame, fps, periodS, phase);
  const floatY = -t * 90;
  const drift = Math.sin(t * Math.PI * 2) * 10;
  const op = Math.sin(t * Math.PI) * appear; // sube y se desvanece
  const sc = s * (0.7 + t * 0.4);
  return (
    <g opacity={op} transform={`translate(${x + drift} ${y + floatY}) scale(${sc})`}>
      <path
        d="M0,9 C0,-5 -20,-6 -20,8 C-20,19 -6,26 0,33 C6,26 20,19 20,8 C20,-6 0,-5 0,9 Z"
        fill="#E5556B"
        stroke={INK}
        strokeWidth={4}
      />
    </g>
  );
};

// ---- Trazo del paisaje que se dibuja --------------------------
const InkStroke: React.FC<{ d: string; start: number; end: number; width?: number; stroke?: string }> = ({ d, start, end, width = 5, stroke = INK }) => {
  const frame = useCurrentFrame();
  const k = drawOn(frame, start, end);
  return (
    <path d={d} pathLength={1} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - k} />
  );
};

const backHillD = 'M0,602 Q420,540 820,576 T1600,556 L1600,1000 L0,1000 Z';
const frontHillD = 'M0,716 Q540,656 1040,700 T1600,684 L1600,1000 L0,1000 Z';

export const HeroWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const backFill = drawOn(frame, 0, 30);
  const frontFill = drawOn(frame, 18, 54);

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#EAF4FC 0%,#F4F1E8 58%,#F4F1E8 100%)' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ display: 'block' }}>
        {/* cielo: sol, nubes, pájaros */}
        <Sun />
        <Cloud x={1010} y={150} s={1} speed={26} range={26} delay={6} />
        <Cloud x={1240} y={250} s={0.7} speed={20} range={-20} delay={10} />
        <Birds />

        {/* colina trasera */}
        <path d={backHillD} fill="#A9D08A" opacity={backFill} />
        <InkStroke d="M0,602 Q420,540 820,576 T1600,556" start={2} end={32} />

        {/* casas + iglesia */}
        <House x={556} y={500} bw={140} bh={108} rh={62} wall="#F2906F" roof="#D9694B" door="#7A4A36" delay={24} />
        <Church delay={30} />
        <House x={1296} y={516} bw={124} bh={96} rh={56} wall="#FBD24D" roof="#E0A92E" door="#7A4A36" delay={36} />

        {/* colina frontal */}
        <path d={frontHillD} fill="#83BD5C" opacity={frontFill} />
        <InkStroke d="M0,716 Q540,656 1040,700 T1600,684" start={18} end={50} />

        {/* flores */}
        <Flower x={316} yBase={968} col="#E86A8E" delay={52} swayPhase={0} />
        <Flower x={1196} yBase={980} col="#7C9BE0" delay={60} swayPhase={1.2} />
        <Flower x={1452} yBase={966} col="#F2906F" delay={56} swayPhase={2.4} />

        {/* niños */}
        {KIDS.map((k, i) => (
          <Child key={i} k={k} i={i} delay={40 + i * 6} />
        ))}

        {/* corazones */}
        <Heart x={812} y={604} s={1} periodS={4.5} phase={0} />
        <Heart x={1006} y={560} s={0.7} periodS={5.2} phase={0.5} />
        <Heart x={700} y={620} s={0.55} periodS={6} phase={0.25} />
      </svg>
    </AbsoluteFill>
  );
};
