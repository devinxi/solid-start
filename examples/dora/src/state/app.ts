import { action, computed, makeObservable, observable } from "./mobx";
import { EventHandlers, EventHandlerTypes, GameState } from "./types";
import { Inputs } from "./input";
import { Viewport } from "./Viewport";
import { BaseState } from "./statechart/BaseState";
import { State } from "./statechart/RootState";
import Vec from "@tldraw/vec";
import { batch } from "solid-js";
// import * as states from "./states";

export class PointingCanvas extends State {
  static id = "pointingCanvas";

  onPointerUp: EventHandlers["pointer"] = info => {
    // const { hoveredBlock } = this.app
    // if (hoveredBlock?.canSelect) {
    //   transaction(() => {
    //     this.app.setSelectedBlocks([hoveredBlock])
    this.parent.transition(Idle.id);
    //   })
    // } else {
    //   this.app.setSelectedBlocks([])
    // }
  };

  onPointerMove: EventHandlers["pointer"] = info => {
    console.log(info.event);
    let prevCamera = this.app.viewport.camera;
    // this.app.viewport.camera = {
    //   point:
  };
}

export class Idle extends State {
  static id = "idle";

  // onEnter = () => {
  //   this.app.transition("selecting");
  // };

  onPointerDown: EventHandlers["pointer"] = info => {
    // const { hoveredBlock } = this.app
    // if (hoveredBlock?.canSelect) {
    //   transaction(() => {
    //     this.app.setSelectedBlocks([hoveredBlock])
    //     this.app.transition('selectedCharacters')
    //   })
    // } else {
    //   this.app.setSelectedBlocks([])
    // }
    this.parent.transition(PointingCanvas.id);
  };
}

class SelectTool extends State {
  static id = "select";

  static states = [PointingCanvas, Idle];

  static initial = Idle.id;

  onPointerDown: EventHandlers["pointer"] = info => {
    this.transition(PointingCanvas.id);
  };
}

// events dispatched to the app,
// executed parent first all the way down the tree of states
export class App extends BaseState {
  constructor() {
    super();
    // @ts-ignore
    const { states = [], initial } = this.constructor;
    states.forEach((state: typeof State & { id: string }) => this.registerState(state));
    this.initial = initial;
    makeObservable(this);
    this.enter();
  }

  static states = [SelectTool];

  static initial = SelectTool.id;

  id = "app";

  viewport = new Viewport(this);
  // pathfinder = new PathFinder(this);
  inputs = new Inputs(this);
  // level = new Level(this, Level.DefaultMap);

  @observable state: GameState = {
    selectedIds: new Set<string>([]),
    paths: []
  };

  isPinching = false;

  registerState = (ChildState: typeof State & { id: string }) => {
    this.states.set(ChildState.id, new ChildState(this, this));
    return this;
  };

  send(event: `on${any}`, payload: any) {
    batch(() => {
      this.handleEvent(event, payload);
    });
  }

  // @computed get hoveredBlock() {
  //   const { level } = this;
  //   const { currentPoint } = this.inputs;
  //   return level.getBlockBy(block => block.canHover && block.hitTestPoint(currentPoint));
  // }

  // @computed get selectedBlocks() {
  //   return Array.from(this.state.selectedIds.values()).map(id => this.level.getBlockById(id)!);
  // }

  // @action setSelectedBlocks = (blocks: Block[] | string[]) => {
  //   const { selectedIds } = this.state;
  //   selectedIds.clear();
  //   if (typeof blocks[0] === "string") {
  //     (blocks as string[]).forEach(id => selectedIds.add(id));
  //   } else {
  //     (blocks as Block[]).forEach(block => selectedIds.add(block.id));
  //   }
  // };

  // @action setPaths = (paths: number[][][]) => {
  //   this.state.paths = paths;
  // };

  /* --------------------- Events --------------------- */

  prevPointerMoveInfo?: any & {
    point: number[];
    event: EventHandlerTypes["pointer"] | EventHandlerTypes["wheel"];
  };

  updatePointer = () => {
    if (this.prevPointerMoveInfo) {
      this.send("onPointerMove", this.prevPointerMoveInfo);
    }
  };

  // app level event handlers, run before state chart event handlers
  readonly onWheel: EventHandlers["wheel"] = info => {
    if (this.isPinching) return;
    console.log(info.delta);
    this.viewport.panCamera(info.delta);
    this.inputs.onWheel(info.event);
    this.onPointerMove(info);
  };

  readonly onPointerDown: EventHandlers["pointer"] = info => {
    if ("clientX" in info.event) {
      this.inputs.onPointerDown(info.point, info.event as PointerEvent);
    }
  };

  readonly onPointerUp: EventHandlers["pointer"] = info => {
    if ("clientX" in info.event) {
      this.inputs.onPointerUp(info.point, info.event as PointerEvent);
    }
  };

  readonly onPointerMove: EventHandlers["pointer"] = info => {
    this.prevPointerMoveInfo = info;
    if ("clientX" in info.event) {
      this.inputs.onPointerMove(info.point, info.event);
    }
  };

  readonly onKeyDown: EventHandlers["keyboard"] = info => {
    this.inputs.onKeyDown(info.event);
  };

  readonly onKeyUp: EventHandlers["keyboard"] = info => {
    this.inputs.onKeyUp(info.event);
  };

  readonly onPinchStart: EventHandlers["pinch"] = info => {
    this.isPinching = true;
    this.inputs.onPinchStart(info.event);
  };

  readonly onPinch: EventHandlers["pinch"] = info => {
    this.isPinching = true;
    this.inputs.onPinch(info.event);
    this.viewport.pinchCamera(info.point, [0, 0], info.offset[0]);
  };

  readonly onPinchEnd: EventHandlers["pinch"] = info => {
    this.isPinching = false;
    this.inputs.onPinchEnd(info.event);
  };
}
