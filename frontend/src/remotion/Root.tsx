/* Entrada de Remotion Studio: permite previsualizar la composición
   (`npx remotion studio`) y, si se quiere, exportarla a video. */
import { Composition } from 'remotion';
import { HeroWorld } from './HeroWorld';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HeroWorld"
      component={HeroWorld}
      durationInFrames={30 * 14}
      fps={30}
      width={1600}
      height={1000}
    />
  );
};
