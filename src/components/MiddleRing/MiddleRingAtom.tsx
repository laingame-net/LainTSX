import { atom } from "recoil";

export const middleRingWobbleStrengthAtom = atom({
  key: "middleRingWobbleStrengthAtom",
  default: 0.0,
});

export const middleRingRotatingAtom = atom({
  key: "middleRingRotatingAtom",
  default: true,
});

export const middleRingNoiseAtom = atom({
  key: "middleRingNoiseAtom",
  default: true,
});

export const middleRingPosYAtom = atom({
  key: "middleRingPosYAtom",
  default: -0.15,
});

export const middleRingRotXAtom = atom({
  key: "middleRingRotXAtom",
  default: 0,
});