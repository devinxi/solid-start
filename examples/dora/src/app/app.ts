import { action, computed, makeObservable, observable } from "~/state/mobx";
import { EventHandlers, EventHandlerTypes, GameState } from "~/state/types";
import { Inputs } from "~/state/input";
import { Viewport } from "./Viewport";
import { BaseState } from "~/state/statechart/BaseState";
import { State } from "~/state/statechart/RootState";
import Vec from "@tldraw/vec";
import { batch } from "solid-js";
import { nanoid } from "nanoid";
import { isServer } from "solid-js/web";
import { SelectTool } from "./selectTool";

import { Client } from "./solid-query/client";

const client = new Client({
  url: "/graphql"
});

console.log(client);

export class Node {
  id: string;

  @observable type: string = "component";
  // static initial = SelectTool.id;
  constructor(pins: Pin[]) {
    this.id = nanoid(4);
    this.pins = pins;
    makeObservable(this);
  }

  @observable Component = () => {
    return null;
  };
  @observable position = [Math.random() * 100, Math.random() * 100];

  @observable size = [0, 0];

  @observable pins: Pin[] = [];
  @observable collapsed = false;

  @computed get box() {
    return {
      position: this.position,
      size: this.size,
      id: this.id
    };
  }
}

export class Connection {
  constructor(_from: Pin, _to: Pin) {
    this.from = _from;
    this.to = _to;
    makeObservable(this);
  }

  @observable from: Pin;
  @observable to: Pin;

  @computed position() {
    return {
      start: this.from.position,
      end: this.to.position
    };
  }
}

export class Graph {
  id = "";
  constructor(public app: App) {
    makeObservable(this);
  }

  @observable nodes: Node[] = [];
  @observable connections: Connection[] = [];

  addNode() {
    let node = new Node([new Pin(), new Pin()]);
    this.nodes = [...this.nodes, node];
    return node;
  }
}

export class Pin {
  constructor() {
    makeObservable(this);
  }

  @observable parentNode?: Node;

  @observable metadata = {};

  @observable offset = [0, 0];

  @observable type = "output";

  @computed get position() {
    return Vec.add(this.parentNode?.position ?? [0, 0], this.offset);
  }
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

    if (!isServer) {
      // @ts-ignore
      window.app = this;
    }
  }

  static states = [SelectTool];

  static initial = SelectTool.id;

  id = "app";

  viewport = new Viewport(this);
  // pathfinder = new PathFinder(this);
  inputs = new Inputs(this);
  graph = new Graph(this);

  @observable selectedIds: string[] = [];

  @observable hoveredNode?: Node;
  @observable editingNode?: Node;

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

  @computed get selectedNodes() {
    return this.selectedIds.map(id => this.graph.nodes.find(node => node.id === id));
  }

  @action setSelectedNodes = (blocks: Node[] | string[]) => {
    const { selectedIds } = this;
    let newIds: string[] = [];
    if (typeof blocks[0] === "string") {
      (blocks as string[]).forEach(id => newIds.push(id));
    } else {
      (blocks as Node[]).forEach(block => newIds.push(block.id));
    }
    console.log(newIds);
    this.selectedIds = newIds;
  };

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
    this.onPointerMove(info as any);
  };

  readonly onPointerDown: EventHandlers["pointer"] = info => {
    if ("clientX" in info.event) {
      this.inputs.onPointerDown(info.point, info.event);
    }
  };

  readonly onPointerUp: EventHandlers["pointer"] = info => {
    if ("clientX" in info.event) {
      this.inputs.onPointerUp(info.point, info.event);
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
