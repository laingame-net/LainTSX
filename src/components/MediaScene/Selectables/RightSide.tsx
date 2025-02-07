import React, { memo, useMemo } from "react";
import { useStore } from "../../../store";
import Word from "./RightSide/Word";
import { a, useSpring } from "@react-spring/three";
import word_position_states from "../../../resources/word_position_states.json";
import * as THREE from "three";
import Lof from "../Lof";
import { useUpdate } from "react-three-fiber";

const RightSide = memo(() => {
  const words = useStore((state) => state.activeNode.words);

  const wordPositionState = useStore(
    (state) =>
      word_position_states[
        state.mediaWordPosStateIdx.toString() as keyof typeof word_position_states
      ]
  );

  const wordPositionStateSpring = useSpring({
    fstWordPosX: wordPositionState.fstWord.posX,
    fstWordPosY: wordPositionState.fstWord.posY,
    sndWordPosX: wordPositionState.sndWord.posX,
    sndWordPosY: wordPositionState.sndWord.posY,
    thirdWordPosX: wordPositionState.thirdWord.posX,
    thirdWordPosY: wordPositionState.thirdWord.posY,
    crossPosX: wordPositionState.cross.posX,
    crossPosY: wordPositionState.cross.posY,
    config: { duration: 300 },
  });

  const horizontalPoints = useMemo(
    () => [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)],
    []
  );

  const verticalPoints = useMemo(
    () => [new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, -10, 0)],
    []
  );

  const activeMediaComponent = useStore((state) => state.activeMediaComponent);

  const horizontalRef = useUpdate((geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(horizontalPoints);
  }, []);

  const verticalRef = useUpdate((geometry: THREE.BufferGeometry) => {
    geometry.setFromPoints(verticalPoints);
  }, []);

  return (
    <group position={[0, 0, -3]}>
      <Lof />
      <a.group
        position-x={wordPositionStateSpring.crossPosX}
        position-y={wordPositionStateSpring.crossPosY}
      >
        <line>
          <bufferGeometry attach="geometry" ref={horizontalRef} />
          <lineBasicMaterial
            attach="material"
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
        <line>
          <bufferGeometry attach="geometry" ref={verticalRef} />
          <lineBasicMaterial
            attach="material"
            color={0xc9d6d5}
            transparent={true}
            opacity={0.8}
          />
        </line>
      </a.group>
      <Word
        word={words[1]}
        posX={wordPositionStateSpring.fstWordPosX}
        posY={wordPositionStateSpring.fstWordPosY}
        active={activeMediaComponent === "fstWord"}
      />
      <Word
        word={words[2]}
        posX={wordPositionStateSpring.sndWordPosX}
        posY={wordPositionStateSpring.sndWordPosY}
        active={activeMediaComponent === "sndWord"}
      />
      <Word
        word={words[3]}
        posX={wordPositionStateSpring.thirdWordPosX}
        posY={wordPositionStateSpring.thirdWordPosY}
        active={activeMediaComponent === "thirdWord"}
      />
    </group>
  );
});

export default RightSide;
