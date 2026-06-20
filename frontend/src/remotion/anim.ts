/* ============================================================
   Helpers de animación para el hero "El mundo que dibujan".
   Todo es frame-driven (Remotion) — nada de CSS transitions.
   ============================================================ */
import { interpolate, spring, Easing } from 'remotion';

export const INK = '#34424E';

/** Trazo que se "dibuja" entre dos frames. Devuelve 0→1 (clamp). */
export const drawOn = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

/** Aparición suave con rebote (pop). Devuelve {scale, opacity}. */
export const pop = (frame: number, fps: number, delay: number) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.7 },
  });
  return {
    scale: 0.84 + 0.16 * s,
    opacity: interpolate(s, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }),
  };
};

/** Crecer desde el suelo (niños, flores). Devuelve {grow, opacity}. */
export const rise = (frame: number, fps: number, delay: number) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 13, stiffness: 95, mass: 0.8 },
  });
  return {
    grow: s, // 0→1
    opacity: interpolate(s, [0, 0.45], [0, 1], { extrapolateRight: 'clamp' }),
  };
};

/** Oscilación senoidal continua (ambiente). Periódica → loop sin cortes. */
export const wave = (frame: number, fps: number, periodS: number, phase = 0) =>
  Math.sin((frame / (periodS * fps)) * Math.PI * 2 + phase);

/** Valor 0→1 que se repite cada `periodS` segundos (para corazones, etc). */
export const cycle = (frame: number, fps: number, periodS: number, phase = 0) =>
  (((frame / (periodS * fps)) + phase) % 1 + 1) % 1;
