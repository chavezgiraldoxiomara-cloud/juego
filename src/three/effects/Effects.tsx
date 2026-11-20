import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

/** Posprocesado de calidad alta: bloom moderado, viñeta y tonemapping de cine. */
export default function Effects() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    // Con posprocesado, el tonemapping se aplica al final de la cadena.
    const previous = gl.toneMapping;
    gl.toneMapping = THREE.NoToneMapping;
    return () => {
      gl.toneMapping = previous;
    };
  }, [gl]);

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.72} luminanceSmoothing={0.25} radius={0.75} />
      <Vignette offset={0.28} darkness={0.72} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
