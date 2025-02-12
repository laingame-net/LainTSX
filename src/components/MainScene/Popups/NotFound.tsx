import React, { memo } from "react";
import notFound from "../../../static/sprites/main/not_found.png";
import notFoundLof from "../../../static/sprites/main/not_found_lof.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../../../store";

const NotFound = memo(() => {
  const notFoundTex = useLoader(THREE.TextureLoader, notFound);
  const notFoundLofTex = useLoader(THREE.TextureLoader, notFoundLof);

  const wordNotFound = useStore((state) => state.wordNotFound);

  return (
    <group visible={wordNotFound}>
      <sprite scale={[1, 0.25, 0]} renderOrder={106} position={[-1, -0.05, 0]}>
        <spriteMaterial
          attach="material"
          map={notFoundLofTex}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[4.1, 0.6, 0]} renderOrder={105} position={[0, -0.15, 0]}>
        <spriteMaterial attach="material" map={notFoundTex} depthTest={false} />
      </sprite>
    </group>
  );
});

export default NotFound;
