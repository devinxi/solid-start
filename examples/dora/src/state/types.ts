import { WebKitGestureEvent } from "@use-gesture/vanilla";
import { JSX } from "solid-js";
export interface GameState {
  selectedIds: Set<string>;
  paths: number[][][];
}

export interface Bounds {
  minX: number;
  minY: number;
  midX: number;
  midY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface Bounds3d {
  minX: number;
  minY: number;
  minZ: number;
  midX: number;
  midY: number;
  midZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  width: number;
  height: number;
  depth: number;
}

export interface Camera {
  point: number[];
  zoom: number;
}

export type Verts = {
  centerDown: number[];
  backDown: number[];
  rightDown: number[];
  frontDown: number[];
  leftDown: number[];
  centerUp: number[];
  backUp: number[];
  rightUp: number[];
  frontUp: number[];
  leftUp: number[];
};

export type EventHandlerTypes = {
  pointer: PointerEvent & { order?: number };
  touch: TouchEvent;
  keyboard: KeyboardEvent;
  gesture: WebKitGestureEvent;
  wheel: WheelEvent;
  pinch: (PointerEvent & { order?: number }) | WebKitGestureEvent | WheelEvent | TouchEvent;
};

export type EventHandlers = {
  wheel: (info: { delta: number[]; point: number[]; event: EventHandlerTypes["wheel"] }) => void;
  pinch: (info: {
    delta: number[];
    point: number[];
    offset: number[];
    order: number;
    targetType: string;
    node?: any;
    event: EventHandlerTypes["pinch"];
  }) => void;
  pointer: (info: {
    point: number[];
    order: number;
    targetType: string;
    node?: any;
    event: EventHandlerTypes["pointer"];
  }) => void;
  keyboard: (info: { event: EventHandlerTypes["keyboard"] }) => void;
};

export interface StateEvents {
  onEnter: () => void;
  onExit: () => void;
  onWheel: EventHandlers["wheel"];
  onPointerDown: EventHandlers["pointer"];
  onPointerUp: EventHandlers["pointer"];
  onPointerMove: EventHandlers["pointer"];
  onKeyDown: EventHandlers["keyboard"];
  onKeyUp: EventHandlers["keyboard"];
  onPinchStart: EventHandlers["pinch"];
  onPinch: EventHandlers["pinch"];
  onPinchEnd: EventHandlers["pinch"];
}