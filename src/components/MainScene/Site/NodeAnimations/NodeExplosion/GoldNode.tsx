import React, { useEffect, useMemo, useRef } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import Cou from "../../../../../static/sprites/nodes/Cou.png";
import CouGold from "../../../../../static/sprites/nodes/Cou_gold.png";
import Dc from "../../../../../static/sprites/nodes/Dc.png";
import DcGold from "../../../../../static/sprites/nodes/Dc_gold.png";
import Sskn from "../../../../../static/sprites/nodes/SSkn.png";
import SsknGold from "../../../../../static/sprites/nodes/SSkn_gold.png";
import Tda from "../../../../../static/sprites/nodes/Tda.png";
import TdaGold from "../../../../../static/sprites/nodes/Tda_gold.png";
import Dia from "../../../../../static/sprites/nodes/Dia.png";
import DiaGold from "../../../../../static/sprites/nodes/Dia_gold.png";
import Lda from "../../../../../static/sprites/nodes/Lda.png";
import LdaGold from "../../../../../static/sprites/nodes/Lda_gold.png";
import MULTI from "../../../../../static/sprites/nodes/MULTI.png";
import MULTIGold from "../../../../../static/sprites/nodes/MULTI_gold.png";
import { useStore } from "../../../../../store";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

type GoldNodeProps = {
  visible: boolean;
  goldTexture: boolean;
};

const GoldNode = (props: GoldNodeProps) => {
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/gold_node.glb");

  const activeNodeName = useStore((state) => state.activeNode.node_name);

  const tex = useMemo(() => {
    if (activeNodeName.includes("S")) {
      return [Sskn, SsknGold];
    } else if (
      activeNodeName.startsWith("P") ||
      activeNodeName.startsWith("G") ||
      activeNodeName.includes("?")
    ) {
      return [MULTI, MULTIGold];
    } else if (activeNodeName.includes("Dc")) {
      return [Dc, DcGold];
    } else {
      switch (activeNodeName.substr(0, 3)) {
        case "Tda":
          return [Tda, TdaGold];
        case "Cou":
          return [Cou, CouGold];
        case "Dia":
          return [Dia, DiaGold];
        case "Lda":
          return [Lda, LdaGold];
        case "Ere":
        case "Ekm":
        case "Eda":
        case "TaK":
        case "Env":
          return [MULTI, MULTIGold];
      }
    }
  }, [activeNodeName]);

  const goldNodeRef = useRef<THREE.Object3D>();

  const regularTex = useLoader(THREE.TextureLoader, tex![0]);
  const goldTex = useLoader(THREE.TextureLoader, tex![1]);

  useEffect(() => {
    if (goldNodeRef.current && !props.visible) {
      goldNodeRef.current.rotation.x = Math.PI / 2;
      goldNodeRef.current.rotation.y = 0;
      goldNodeRef.current.rotation.z = Math.PI / 2 - 0.3;
    }
  }, [props.visible]);

  useFrame((state, delta) => {
    if (goldNodeRef.current && props.visible) {
      goldNodeRef.current.rotation.y -= delta * 2;
      goldNodeRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <mesh
      geometry={nodes.Cube.geometry}
      position={[-0.155, -0.45, 0]}
      rotation={[Math.PI / 2, 0, Math.PI / 2 - 0.3]}
      scale={[-0.1 / 1.15, 0.2 / 1.35, 0.1 / 1.15]}
      ref={goldNodeRef}
    >
      <meshBasicMaterial
        attach="material"
        map={props.goldTexture ? goldTex : regularTex}
        transparent={true}
      />
    </mesh>
  );
};

export default GoldNode;
