import { a, Interpolation, useSpring } from "@react-spring/three";
import React, {createRef, memo, RefObject, useEffect, useMemo, useRef} from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { starfieldPosYAtom } from "./StarfieldAtom";

type StarRefsAndIncrementors = [
  React.MutableRefObject<React.RefObject<THREE.Object3D>[]>,
  number
][];

type StarfieldProps = {
  introStarfieldVisible: boolean;
  mainStarfieldVisible: boolean;
};

type StarfieldObjectData = {
  starPoses: number[][];
  ref: React.MutableRefObject<React.RefObject<THREE.Object3D>[]>;
  rotation: number[];
  positionSpecifier: number[];
  uniform?:
    | { color1: { value: THREE.Color }; color2: { value: THREE.Color } }
    | undefined;
};

type IntroStarfieldObjectData = {
  starPoses: number[][];
  ref: React.MutableRefObject<React.RefObject<THREE.Object3D>[]>;
  uniform?:
    | { color1: { value: THREE.Color }; color2: { value: THREE.Color } }
    | undefined;
};

const Starfield = memo((props: StarfieldProps) => {
  const introStarfieldGroupRef = useRef<THREE.Object3D>();

  const starfieldState = useSpring({
    starfieldPosY: starfieldPosYAtom,
    config: { duration: 1200 },
  });

  const uniformConstructor = (col: string) => {
    return {
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color(col),
      },
    };
  };

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float alpha;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.0, 1.0, vUv.y);
        float colorMix = smoothstep(1.0, 2.0, 1.8);

        gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);
    }
      `;

  const LCG = (a: number, c: number, m: number, s: number) => () =>
    (s = (s * a + c) % m);

  const lcgInstance = LCG(1664525, 1013904223, 2 ** 32, 2);

  const [blueUniforms, cyanUniforms, whiteUniforms] = [
    "blue",
    "cyan",
    "gray",
  ].map((color: string) => useMemo(() => uniformConstructor(color), [color]));

  const [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromLeft,
  ] = [30, 30, 20, 20, 5].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 1000000000,
      lcgInstance() / 1000000000,
    ])
  );

  const [
    blueFromRightRef,
    blueFromLeftRef,
    cyanFromRightRef,
    cyanFromLeftRef,
    whiteFromLeftRef,
  ] = [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromLeft,
  ].map((poses) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  const [introPosesBlue, introPosesCyan, introPosesWhite] = [
    80,
    80,
    60,
  ].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000050,
      lcgInstance() / 100000099,
      lcgInstance() / 1000000050,
    ])
  );

  const [introBlueRef, introCyanRef, introWhiteRef] = [
    introPosesBlue,
    introPosesCyan,
    introPosesWhite,
  ].map((poses) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  // these arrays contain refs to the 3d planes and the increment values that they should move with across
  // the screen
  const fromRightStarRefsAndIncrementors: StarRefsAndIncrementors = [
    [blueFromRightRef, 7.3],
    [cyanFromRightRef, 4.3],
  ];

  const fromLeftStarRefsAndIncrementors: StarRefsAndIncrementors = [
    [blueFromLeftRef, 8.3],
    [cyanFromLeftRef, 3.7],
    [whiteFromLeftRef, 3.3],
  ];

  useFrame(() => {
    if (props.introStarfieldVisible) {
      introStarfieldGroupRef.current!.position.y += 0.2;
    }
    if (props.mainStarfieldVisible) {
      // planes (stars) coming from right move to positive X and negative Z direction
      fromRightStarRefsAndIncrementors.forEach((el) => {
        el[0].current.forEach((posRef: RefObject<THREE.Object3D>) => {
          if (posRef.current!.position.x < -1) {
            posRef.current!.position.x += el[1];
            posRef.current!.position.z -= el[1];
          } else {
            posRef.current!.position.x -= 0.03;
            posRef.current!.position.z += 0.03;
          }
        });
      });

      // the ones that are coming from left move to negative X and Z
      fromLeftStarRefsAndIncrementors.forEach((el) => {
        el[0].current.forEach((posRef: RefObject<THREE.Object3D>) => {
          if (posRef.current!.position.x > 3) {
            posRef.current!.position.x -= el[1];
            posRef.current!.position.z -= el[1];
          } else {
            posRef.current!.position.x += 0.03;
            posRef.current!.position.z += 0.03;
          }
        });
      });
    }
  });

  const mainStarfieldObjects = [
    {
      starPoses: posesBlueFromRight,
      ref: blueFromRightRef,
      rotation: [1.7, 0, 0.9],
      positionSpecifier: [0, 0, 0],
      uniform: blueUniforms,
    },
    {
      starPoses: posesBlueFromLeft,
      ref: blueFromLeftRef,
      rotation: [1.7, 0, -0.9],
      positionSpecifier: [-2.4, -0.5, 2],
      uniform: blueUniforms,
    },
    {
      starPoses: posesCyanFromRight,
      ref: cyanFromRightRef,
      rotation: [1.7, 0, 0.9],
      positionSpecifier: [-1.3, 0, 1.5],
      uniform: cyanUniforms,
    },
    {
      starPoses: posesCyanFromLeft,
      ref: cyanFromLeftRef,
      rotation: [1.7, 0, -0.9],
      positionSpecifier: [-1.3, 0, 2.5],
      uniform: cyanUniforms,
    },
    {
      starPoses: posesWhiteFromLeft,
      ref: whiteFromLeftRef,
      rotation: [1.7, 0, -0.9],
      positionSpecifier: [-1.3, 0.5, 1.5],
      uniform: whiteUniforms,
    },
  ];

  const introStarfieldObjects = [
    {
      starPoses: introPosesBlue,
      ref: introBlueRef,
      uniform: blueUniforms,
    },
    {
      starPoses: introPosesCyan,
      ref: introCyanRef,
      uniform: cyanUniforms,
    },
    {
      starPoses: introPosesWhite,
      ref: introWhiteRef,
      uniform: whiteUniforms,
    },
  ];

  useEffect(() => {
    console.log('ssd')
  }, [])

  return (
    <>
      <a.group
        ref={introStarfieldGroupRef}
        position={[-2, -20, -2]}
        rotation={[0, 0, 0]}
        visible={props.introStarfieldVisible}
      >
        {introStarfieldObjects.map((obj: IntroStarfieldObjectData) =>
          obj.starPoses.map((pos: number[], idx: number) => {
            return (
              <mesh
                ref={obj.ref.current[idx]}
                scale={[0.01, 2, -0.5]}
                position={[pos[0], pos[1], pos[2]]}
                key={pos[0]}
                renderOrder={-1}
              >
                <planeGeometry attach="geometry" />
                <shaderMaterial
                  attach="material"
                  uniforms={obj.uniform}
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  side={THREE.DoubleSide}
                  transparent={true}
                  depthWrite={false}
                />
              </mesh>
            );
          })
        )}
      </a.group>
      <a.group
        position={[-0.7, 0, -5]}
        rotation={[0, 0, 0]}
        position-y={starfieldPosYAtom}
        visible={props.mainStarfieldVisible}
      >
        {mainStarfieldObjects.map((obj: StarfieldObjectData) =>
          obj.starPoses.map((pos: number[], idx: number) => {
            return (
              <mesh
                ref={obj.ref.current[idx]}
                position={[
                  pos[0] + obj.positionSpecifier[0],
                  pos[1] + obj.positionSpecifier[1],
                  pos[2] + obj.positionSpecifier[2],
                ]}
                rotation={obj.rotation as [number, number, number]}
                scale={[0.01, 2, -0.5]}
                renderOrder={-1}
                key={pos[0]}
              >
                <planeGeometry attach="geometry" />
                <a.shaderMaterial
                  attach="material"
                  uniforms={obj.uniform}
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  side={THREE.DoubleSide}
                  transparent={true}
                  depthWrite={false}
                  opacity={0.1}
                />
              </mesh>
            );
          })
        )}
      </a.group>
    </>
  );
});

export default Starfield;