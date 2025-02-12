import create from "zustand";
import { combine } from "zustand/middleware";
import { AudioAnalyser } from "three";
import game_progress from "./resources/initial_progress.json";
import { getNodeById } from "./helpers/node-helpers";
import site_a from "./resources/site_a.json";
import {
  ActiveSite,
  AuthorizeUserMatrixIndices,
  BootSceneContext,
  BootSubscene,
  EndComponent,
  EndSceneContext,
  GameProgress,
  GameScene,
  LeftMediaComponent,
  MainMenuComponent,
  MainSceneContext,
  MainSubscene,
  MediaComponent,
  MediaSceneContext,
  MediaSide,
  NodeAttributes,
  NodeData,
  PauseComponent,
  PromptComponent,
  RightMediaComponent,
  SiteSaveState,
  SsknComponent,
  SsknSceneContext,
  UserSaveState,
} from "./types/types";

type State = {
  currentScene: GameScene;

  gameProgress: GameProgress;

  mainSubscene: MainSubscene;

  intro: boolean;

  activeNode: NodeData;
  activeNodePos: number[];
  activeNodeRot: number[];
  activeNodeAttributes: NodeAttributes;

  protocolLinesEnabled: boolean;

  lainMoveState: string;
  canLainMove: boolean;

  lastCameraTiltValue: number;
  cameraTiltValue: number;

  activeSite: ActiveSite;
  siteRot: number[];
  oldSiteRot: number[];

  activeLevel: string;
  oldLevel: string;

  selectedLevel: number;

  activeEndComponent: EndComponent;
  endSceneSelectionVisible: boolean;

  activePauseComponent: PauseComponent;
  showingAbout: boolean;
  permissionDenied: boolean;

  audioAnalyser: AudioAnalyser | undefined;
  mediaPercentageElapsed: number;
  currentMediaSide: MediaSide;
  activeMediaComponent: MediaComponent;
  lastActiveMediaComponents: {
    left: LeftMediaComponent;
    right: RightMediaComponent;
  };

  mediaWordPosStateIdx: number;
  wordSelected: boolean;

  idleStarting: boolean;
  idleMedia: string;
  idleImages: { "1": string; "2": string; "3": string } | undefined;
  idleNodeName: string | undefined;

  activeSsknComponent: SsknComponent;
  ssknLoading: boolean;

  playerName: string;

  activeMainMenuComponent: MainMenuComponent;
  authorizeUserMatrixIndices: AuthorizeUserMatrixIndices;
  bootSubscene: BootSubscene;

  promptVisible: boolean;
  activePromptComponent: PromptComponent;

  loadSuccessful: boolean | undefined;
  saveSuccessful: boolean | undefined;

  wordNotFound: boolean;

  siteSaveState: SiteSaveState;

  keybindings: Record<string, string>;

  language: string;

  inputCooldown: number;
};

export const useStore = create(
  combine(
    {
      // scene data
      currentScene: "boot",

      // game progress
      gameProgress: game_progress,

      // main subscene
      mainSubscene: "site",

      // whether or not to play the intro anim on main scene
      intro: true,

      // nodes
      activeNode: {
        ...site_a["04"]["0414"],
        matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
      },
      activeNodePos: [0, 0, 0],
      activeNodeRot: [0, 0, 0],
      activeNodeAttributes: {
        interactedWith: false,
        exploding: false,
        shrinking: false,
        visible: true,
      },

      // lain
      lainMoveState: "standing",
      canLainMove: true,

      // extra node data display
      protocolLinesEnabled: false,

      // camera tilt
      lastCameraTiltValue: -0.08,
      cameraTiltValue: 0,

      // site
      activeSite: "a",
      siteRot: [0, 0, 0],
      // this is used for word selection animation to start from the correct point
      oldSiteRot: [0, 0, 0],

      // level
      activeLevel: "04",
      // this is used for word selection animation to start from the correct point
      oldLevel: "04",

      // level selection
      selectedLevel: 4,

      // end scene
      activeEndComponent: "end",
      endSceneSelectionVisible: false,

      // pause
      activePauseComponent: "change",
      showingAbout: false,
      permissionDenied: false,

      // media scene
      audioAnalyser: undefined,
      mediaPercentageElapsed: 0,

      currentMediaSide: "left",
      activeMediaComponent: "play",
      lastActiveMediaComponents: {
        left: "play",
        right: "fstWord",
      },
      mediaWordPosStateIdx: 1,
      wordSelected: false,

      // idle scene
      idleStarting: false,
      idleMedia: site_a["00"]["0000"].media_file,
      idleNodeName: site_a["00"]["0000"].node_name,
      // this may be undefined depending on whether or not the media is audio only or not
      idleImages: site_a["00"]["0000"].image_table_indices,

      // sskn scene
      activeSsknComponent: "ok",
      ssknLoading: false,

      // player name
      playerName: "",

      // boot scene
      activeMainMenuComponent: "authorize_user",
      authorizeUserMatrixIndices: {
        rowIdx: 1,
        colIdx: 7,
      },
      bootSubscene: "main_menu",

      // prompt
      promptVisible: false,
      activePromptComponent: "no",

      // status notifiers
      loadSuccessful: undefined,
      saveSuccessful: undefined,

      // word not found notification thing
      wordNotFound: false,

      // save states for loading the game/changing sites
      siteSaveState: {
        a: {
          activeNode: {
            ...getNodeById("0414", "a"),
            matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
          },
          siteRot: [0, 0, 0],
          activeLevel: "04",
        },
        b: {
          activeNode: {
            ...getNodeById("0105", "b"),
            matrixIndices: { matrixIdx: 6, rowIdx: 2, colIdx: 0 },
          },
          siteRot: [0, 0 - Math.PI / 4, 0],
          activeLevel: "01",
        },
      },

      // keybindings
      keybindings: {
        DOWN: "ArrowDown",
        LEFT: "ArrowLeft",
        UP: "ArrowUp",
        RIGHT: "ArrowRight",
        CIRCLE: "x",
        CROSS: "z",
        TRIANGLE: "d",
        SQUARE: "s",
        R2: "t",
        L2: "e",
        L1: "w",
        R1: "r",
        START: "v",
        SELECT: "c",
      },

      language: "en",

      inputCooldown: -1,
    } as State,
    (set) => ({
      setScene: (to: GameScene) => set(() => ({ currentScene: to })),

      setNodePos: (to: number[]) => set(() => ({ activeNodePos: to })),
      setNodeRot: (to: number[]) => set(() => ({ activeNodeRot: to })),
      setNodeAttributes: (
        to: boolean,
        at: "interactedWith" | "visible" | "exploding" | "shrinking"
      ) =>
        set((state) => ({
          activeNodeAttributes: { ...state.activeNodeAttributes, [at]: to },
        })),

      setNodeViewed: (nodeName: string) =>
        set((state) => {
          const nodes = {
            ...state.gameProgress.nodes,
            [nodeName]: { is_viewed: 1 },
          };
          return {
            gameProgress: {
              ...state.gameProgress,
              nodes: nodes,
            },
          };
        }),

      resetMediaScene: () =>
        set(() => ({
          activeMediaComponent: "play",
          currentMediaSide: "left",
          mediaWordPosStateIdx: 1,
          lastActiveMediaComponents: {
            left: "play",
            right: "fstWord",
          },
        })),

      incrementFinalVideoViewCount: () =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            final_video_viewcount: state.gameProgress.final_video_viewcount + 1,
          },
        })),

      setLainMoveState: (to: string) => set(() => ({ lainMoveState: to })),

      setEndSceneSelectionVisible: (to: boolean) =>
        set(() => ({ endSceneSelectionVisible: to })),

      setShowingAbout: (to: boolean) => set(() => ({ showingAbout: to })),

      setAudioAnalyser: (to: AudioAnalyser) =>
        set(() => ({ audioAnalyser: to })),
      setPercentageElapsed: (to: number) =>
        set(() => ({ mediaPercentageElapsed: to })),
      setWordSelected: (to: boolean) => set(() => ({ wordSelected: to })),

      setPolytanPartUnlocked: (bodyPart: string) =>
        set((state) => {
          const polytanParts = {
            ...state.gameProgress.polytan_unlocked_parts,
            [bodyPart]: true,
          };
          return {
            gameProgress: {
              ...state.gameProgress,
              polytan_unlocked_parts: polytanParts,
            },
          };
        }),

      setInputCooldown: (to: number) => set(() => ({ inputCooldown: to })),

      incrementGateLvl: () =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            gate_level: state.gameProgress.gate_level + 1,
          },
        })),
      incrementSsknLvl: () =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            sskn_level: state.gameProgress.sskn_level + 1,
          },
        })),

      loadUserSaveState: (userState: UserSaveState) =>
        set(() => ({
          siteSaveState: userState.siteSaveState,
          activeNode: userState.activeNode,
          siteRot: userState.siteRot,
          activeLevel: userState.activeLevel,
          activeSite: userState.activeSite,
          gameProgress: userState.gameProgress,
          playerName: userState.playerName,
        })),

      setKeybindings: (to: Record<string, string>) =>
        set(() => ({ keybindings: to })),

      setLanguage: (to: string) => set(() => ({ language: to })),

      restartGameState: () =>
        set(() => ({
          siteSaveState: {
            a: {
              activeNode: {
                ...getNodeById("0414", "a"),
                matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
              },
              siteRot: [0, 0, 0],
              activeLevel: "04",
            },
            b: {
              activeNode: {
                ...getNodeById("0105", "b"),
                matrixIndices: { matrixIdx: 6, rowIdx: 2, colIdx: 0 },
              },
              siteRot: [0, 0 - Math.PI / 4, 0],
              activeLevel: "01",
            },
          },
          activeNode: {
            ...site_a["04"]["0414"],
            matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
          },
          siteRot: [0, 0, 0],
          activeLevel: "04",
          activeSite: "a",
          gameProgress: game_progress,
        })),
    })
  )
);

const getPromptContext = () => {
  const state = useStore.getState();

  return {
    promptVisible: state.promptVisible,
    activePromptComponent: state.activePromptComponent,
  };
};

export const getMainSceneContext = (): MainSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    subscene: state.mainSubscene,
    selectedLevel: state.selectedLevel,
    activePauseComponent: state.activePauseComponent,
    gameProgress: state.gameProgress,
    activeSite: state.activeSite,
    siteRotY: state.siteRot[1],
    activeNode: state.activeNode,
    level: parseInt(state.activeLevel),
    showingAbout: state.showingAbout,
    siteSaveState: state.siteSaveState,
    wordNotFound: state.wordNotFound,
    canLainMove: state.canLainMove,
    protocolLinesEnabled: state.protocolLinesEnabled,
    cameraTiltValue: state.cameraTiltValue,
    lastCameraTiltValue: state.lastCameraTiltValue,
  };
};

export const getSsknSceneContext = (): SsknSceneContext => {
  const state = useStore.getState();
  return {
    activeSsknComponent: state.activeSsknComponent,
    activeNode: state.activeNode,
  };
};

export const getMediaSceneContext = (): MediaSceneContext => {
  const state = useStore.getState();

  return {
    lastActiveMediaComponents: state.lastActiveMediaComponents,
    currentMediaSide: state.currentMediaSide,
    activeMediaComponent: state.activeMediaComponent,
    wordPosStateIdx: state.mediaWordPosStateIdx,
    activeNode: state.activeNode,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
  };
};

export const getBootSceneContext = (): BootSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    playerName: state.playerName,
    subscene: state.bootSubscene,
    activeMainMenuComponent: state.activeMainMenuComponent,
    authorizeUserMatrixIndices: state.authorizeUserMatrixIndices,
  };
};

export const getEndSceneContext = (): EndSceneContext => {
  const state = useStore.getState();

  return {
    activeEndComponent: state.activeEndComponent,
    selectionVisible: state.endSceneSelectionVisible,
    siteSaveState: state.siteSaveState,
    activeNode: state.activeNode,
    siteRot: state.siteRot,
    activeLevel: state.activeLevel,
  };
};

export const getCurrentUserState = (): UserSaveState => {
  const state = useStore.getState();

  return {
    siteSaveState: state.siteSaveState,
    activeNode: state.activeNode,
    siteRot: [0, state.siteRot[1], 0],
    activeLevel: state.activeLevel,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
    playerName: state.playerName,
  };
};

export const saveUserProgress = (state: UserSaveState) =>
  localStorage.setItem("lainSaveState", JSON.stringify(state));

export const isPolytanFullyUnlocked = () => {
  const polytanProgress =
    useStore.getState().gameProgress.polytan_unlocked_parts;

  for (const key in polytanProgress)
    if (!polytanProgress[key as keyof typeof polytanProgress]) return false;

  return true;
};
