import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import takIntro from "../static/sprites/lain/lain_speak_intro.png";
import takOutro from "../static/sprites/lain/lain_speak_outro.png";
import mouth1 from "../static/sprites/lain/mouth_1.png";
import mouth2 from "../static/sprites/lain/mouth_2.png";
import mouth3 from "../static/sprites/lain/mouth_3.png";
import mouth4 from "../static/sprites/lain/mouth_4.png";
import { useStore } from "../store";
import { LainConstructor } from "./MainScene/Lain";

type LainTaKProps = {
  intro: boolean;
  outro: boolean;
};

const LainSpeak = (props: LainTaKProps) => {
  const mouth1Tex = useLoader(THREE.TextureLoader, mouth1);
  const mouth2Tex = useLoader(THREE.TextureLoader, mouth2);
  const mouth3Tex = useLoader(THREE.TextureLoader, mouth3);
  const mouth4Tex = useLoader(THREE.TextureLoader, mouth4);

  const Intro = () => (
    <LainConstructor
      sprite={takIntro}
      frameCount={31}
      framesHorizontal={6}
      framesVertical={6}
    />
  );

  const Outro = () => (
    <LainConstructor
      sprite={takOutro}
      frameCount={39}
      framesHorizontal={7}
      framesVertical={6}
    />
  );

  const mouthRef = useRef<THREE.SpriteMaterial>();
  const audioAnalyser = useStore((state) => state.audioAnalyser);

  useFrame(() => {
    if (audioAnalyser) {
      const buffer = new Uint8Array(audioAnalyser.analyser.fftSize / 2);
      audioAnalyser.analyser.getByteTimeDomainData(buffer);

      let rms = 0;
      for (let i = 0; i < buffer.length; i++) {
        rms += buffer[i] * buffer[i];
      }

      rms = Math.sqrt(rms / buffer.length);

      if (mouthRef.current) {
        if (rms >= 130) {
          mouthRef.current.map = mouth4Tex;
        } else if (rms >= 129 && rms <= 130) {
          mouthRef.current.map = mouth3Tex;
        } else if (rms > 128 && rms <= 129) {
          mouthRef.current.map = mouth2Tex;
        } else {
          mouthRef.current.map = mouth1Tex;
        }
      }
    }
  });

  const animationDispatch = useMemo(() => {
    if (props.intro) return <Intro />;
    else if (props.outro) return <Outro />;
  }, [props.intro, props.outro]);

  return (
    <>
      <sprite scale={[11, 7.7, 0]} visible={props.intro || props.outro}>
        {animationDispatch}
      </sprite>
      <sprite
        scale={[11, 7.7, 0]}
        renderOrder={2}
        visible={!props.intro && !props.outro}
      >
        <spriteMaterial
          attach="material"
          map={mouth4Tex}
          alphaTest={0.01}
          ref={mouthRef}
          depthTest={false}
        />
      </sprite>
    </>
  );
};

export default LainSpeak;
