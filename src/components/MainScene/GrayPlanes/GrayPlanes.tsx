import React, { useMemo, useRef, memo } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import GrayPlane from "./GrayPlane";

const GrayPlanes = memo(() => {
  const grayPlaneGroupRef = useRef<THREE.Object3D>();

  const grayPlanePoses = useMemo(
    () => [
      [1.2, 0, -1.2],
      [1.2, 0, 1.2],
      [1.2, 0, -0.5],
      [-1.2, 0, -1.2],
      [-1.2, 0, 1.2],
      [-1.2, 0, 1],
      [0.5, 0, 1],
    ],
    []
  );

  useFrame((state, delta) => {
    grayPlaneGroupRef.current!.rotation.y -= delta / 1.5;
  });

  return (
    <group position={[0.1, 0, -2]} ref={grayPlaneGroupRef}>
      {grayPlanePoses.map((pos, idx: number) => (
        <GrayPlane position={pos as [number, number, number]} key={idx} />
      ))}
    </group>
  );
});

export default GrayPlanes;
