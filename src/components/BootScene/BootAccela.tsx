import React, { useState } from "react";
import accelaBootSpriteSheet from "../../static/sprites/boot/login_intro_accela_spritesheet.png";
import makeMeSad from "../../static/sprites/boot/make_me_sad.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";

type BootAccelaProps = {
  visible: boolean;
};

const BootAccela = (props: BootAccelaProps) => {
  const accelaBootTex: any = useLoader(
    THREE.TextureLoader,
    accelaBootSpriteSheet
  );
  const makeMeSadTex = useLoader(THREE.TextureLoader, makeMeSad);

  const [animator] = useState(() => {
    const anim = new PlainAnimator(accelaBootTex, 10, 3, 29, 60);
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    animator.animate();
  });

  return (
    <>
      <sprite
        scale={[0.35, 0.6, 0.35]}
        position={[0, 0.2, 0]}
        visible={props.visible}
      >
        <spriteMaterial attach="material" map={accelaBootTex} />
      </sprite>
      <sprite
        scale={[0.4, 0.6, 0.4]}
        position={[0, -0.5, 0]}
        visible={props.visible}
      >
        <spriteMaterial attach="material" map={makeMeSadTex} />
      </sprite>
    </>
  );
};

export default BootAccela;
