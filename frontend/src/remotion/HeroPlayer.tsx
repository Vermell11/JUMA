/* ============================================================
   Isla React: incrusta la composición Remotion "HeroWorld" como
   reproductor en vivo (loop) que sirve de fondo del hero.
   Arranca la reproducción de forma imperativa (autoPlay solo no
   basta de forma fiable) y respeta prefers-reduced-motion
   mostrando un frame fijo, sin movimiento.
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { HeroWorld } from './HeroWorld';

const FPS = 30;
// Duración larga: el dibujo se traza una vez al cargar y el
// ambiente continúa; el bucle no se reinicia durante una visita.
const DURATION = FPS * 60 * 2; // 2 min

export default function HeroPlayer() {
  const [reduced, setReduced] = useState(false);
  const ref = useRef<PlayerRef>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // El reloj interno del Player (autoPlay/play) no avanza de forma
  // fiable en este entorno, así que conducimos el frame nosotros
  // mismos con requestAnimationFrame + seekTo basado en el tiempo
  // real transcurrido. Esto garantiza una reproducción fluida.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const p = ref.current;
      if (p) {
        const elapsedFrames = Math.floor(((performance.now() - t0) / 1000) * FPS);
        p.seekTo(elapsedFrames % DURATION);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <Player
      ref={ref}
      component={HeroWorld}
      durationInFrames={DURATION}
      compositionWidth={1600}
      compositionHeight={1000}
      fps={FPS}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initialFrame={reduced ? 90 : 0}
      numberOfSharedAudioTags={0}
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}
