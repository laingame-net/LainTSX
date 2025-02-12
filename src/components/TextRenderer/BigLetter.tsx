import orangeFont from "../../static/sprites/fonts/orange_font_texture.png";
import yellowFont from "../../static/sprites/fonts/yellow_font_texture.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import orange_font_json from "../../resources/fonts/big_font.json";
import { a, useSpring } from "@react-spring/three";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useStore } from "../../store";
import usePrevious from "../../hooks/usePrevious";

const BigLetter = memo((props: { letter: string; letterIdx: number }) => {
  const [color, setColor] = useState("yellow");

  const tex = useMemo(
    () =>
      color === "orange" || props.letterIdx === 0 ? orangeFont : yellowFont,
    [color, props.letterIdx]
  );

  const colorTexture: THREE.Texture = useLoader(THREE.TextureLoader, tex);

  const lineYOffset = useMemo(() => {
    const lineOne = "ABCDEFGHIJKLMNOPQ";
    const lineTwo = "RSTUVWXYZ01234567";
    const lineThree = "89abcdefghijklmnopqrs";

    let lineNum: number;
    if (props.letter === " ") {
      lineNum = 5;
    } else {
      if (lineOne.includes(props.letter)) {
        lineNum = 1;
      } else if (lineTwo.includes(props.letter)) {
        lineNum = 2;
      } else if (lineThree.includes(props.letter)) {
        lineNum = 3;
      } else {
        lineNum = 4;
      }
    }

    const offsets = {
      1: 0.884,
      2: 0.765,
      3: 0.648,
      4: 0.47,
      5: 1,
    };
    return offsets[lineNum as keyof typeof offsets];
  }, [props.letter]);

  const letterData = useMemo(
    () =>
      orange_font_json.glyphs[
        props.letter as keyof typeof orange_font_json.glyphs
      ],
    [props.letter]
  );

  const geom = useMemo(() => {
    const geometry = new THREE.PlaneBufferGeometry();

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < uvAttribute.count; i++) {
      let u = uvAttribute.getX(i);
      let v = uvAttribute.getY(i);

      u = (u * letterData[2]) / 256 + letterData[0] / 256;

      v = (v * letterData[3]) / 136 + lineYOffset - letterData[4] / 136;

      uvAttribute.setXY(i, u, v);
    }
    return geometry;
  }, [letterData, lineYOffset]);

  const activeNode = useStore((state) => state.activeNode);
  const activeMediaComponent = useStore((state) => state.activeMediaComponent);

  const subscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.currentScene);
  const prevData = usePrevious({ scene, subscene, activeNode });
  const [lastMediaLeftComponent, setLastMediaLeftComponent] = useState("play");

  const [shrinkState, set] = useSpring(() => ({
    x: props.letterIdx + 0.3,
    config: { duration: 200 },
  }));

  useEffect(() => {
    if (
      subscene === "pause" ||
      (subscene === "site" && prevData?.subscene === "pause") ||
      (activeNode === prevData?.activeNode &&
        !(
          subscene === "level_selection" ||
          color === "orange" ||
          scene === "media"
        ))
    )
      return;
    if (scene === "main" && prevData?.scene === "main") {
      set({ x: 0 });

      if (subscene === "level_selection") setColor("orange");
      else if (color === "orange") setColor("yellow");

      setTimeout(() => set({ x: props.letterIdx + 0.3 }), 1200);
    } else if (scene === "media") {
      if (
        (activeMediaComponent === "play" || activeMediaComponent === "exit") &&
        activeMediaComponent !== lastMediaLeftComponent
      ) {
        setLastMediaLeftComponent(activeMediaComponent);
        set({ x: 0 });

        setTimeout(() => set({ x: props.letterIdx + 0.3 }), 1200);
      }
    }
  }, [
    activeNode,
    props.letterIdx,
    subscene,
    set,
    color,
    scene,
    activeMediaComponent,
    lastMediaLeftComponent,
    prevData?.scene,
    prevData?.subscene,
    prevData?.activeNode,
  ]);

  return (
    <a.mesh
      position-x={shrinkState.x}
      position-y={-letterData[4] / 12.5}
      scale={[1, 1, 0]}
      geometry={geom}
      renderOrder={props.letterIdx === 0 ? 11 : 10}
    >
      <meshBasicMaterial
        map={colorTexture}
        attach="material"
        transparent={true}
      />
    </a.mesh>
  );
});

export default BigLetter;
