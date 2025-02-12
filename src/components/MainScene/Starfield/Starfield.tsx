import React, { memo, useMemo } from "react";
import Star from "./Star";
import IntroStar from "./IntroStar";

type StarfieldProps = {
  shouldIntro: boolean;
  mainVisible: boolean;
};

const Starfield = memo((props: StarfieldProps) => {
  const LCG = (a: number, c: number, m: number, s: number) => () =>
    (s = (s * a + c) % m);

  const lcgInstance = useMemo(() => LCG(1664525, 1013904223, 2 ** 32, 2), []);

  const [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromRight,
    posesWhiteFromLeft,
  ] = [5, 5, 5, 5, 5, 5].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 10000000000 - 10,
      lcgInstance() / 1000000000,
    ])
  );

  const [posesBlueFromBottom, posesCyanFromBottom, posesWhiteFromBottom] = [
    80,
    80,
    80,
  ].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000050,
      lcgInstance() / 100000059 + 5,
      lcgInstance() / 1000000050,
    ])
  );

  return (
    <>
      <group position={[0, -1, 2]} visible={props.mainVisible}>
        <group rotation={[0, 0.75, Math.PI / 2]} position={[-0.7, -1, -5]}>
          {posesBlueFromLeft.map((poses, idx) => (
            <Star
              position={poses}
              color={"blue"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
          {posesWhiteFromLeft.map((poses, idx) => (
            <Star
              position={poses}
              color={"white"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
          {posesCyanFromLeft.map((poses, idx) => (
            <Star
              position={poses}
              color={"cyan"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
        </group>
        <group rotation={[0, 2.5, Math.PI / 2]} position={[-0.7, -1, -1]}>
          {posesBlueFromRight.map((poses, idx) => (
            <Star
              position={poses}
              color={"blue"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
          {posesWhiteFromRight.map((poses, idx) => (
            <Star
              position={poses}
              color={"white"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
          {posesCyanFromRight.map((poses, idx) => (
            <Star
              position={poses}
              color={"cyan"}
              key={idx}
              shouldIntro={props.shouldIntro}
            />
          ))}
        </group>
      </group>
      {props.shouldIntro && (
        <group position={[-2, -15, -30]} rotation={[Math.PI / 3, 0, 0]}>
          {posesBlueFromBottom.map((poses, idx) => (
            <IntroStar position={poses} color={"blue"} key={idx} />
          ))}
          {posesWhiteFromBottom.map((poses, idx) => (
            <IntroStar position={poses} color={"white"} key={idx} />
          ))}
          {posesCyanFromBottom.map((poses, idx) => (
            <IntroStar position={poses} color={"cyan"} key={idx} />
          ))}
        </group>
      )}
    </>
  );
});

export default Starfield;
