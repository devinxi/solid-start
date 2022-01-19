import { createEffect, untrack, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { Handler, Gesture, WebKitGestureEvent } from "@use-gesture/vanilla";

export function useGestureEvents(ref: { current: HTMLElement }) {
  const { app } = useContext(appContext);

  const events: GestureEvents = {
    onWheel: ({ delta, event }) => {
      event.preventDefault();
      app.send("onWheel", { delta, point: app.inputs.currentScreenPoint, event });
    },
    onPinch: ({ delta, offset, origin: point, event }) => {
      app.send("onPinch", { delta, offset, point, event });
    },
    onPinchStart: ({ delta, offset, origin: point, event }) => {
      app.send("onPinchStart", { delta, offset, point, event });
    },
    onPinchEnd: ({ delta, offset, origin: point, event }) => {
      app.send("onPinchEnd", { delta, offset, point, event });
    }
  };

  createEffect(() => {
    new Gesture(ref.current, events as any, {
      eventOptions: { passive: false },
      pinch: {
        scaleBounds: { from: untrack(() => app.viewport.cameraZoom), max: 8, min: 0.1 }
      }
    });
  });
}
type GestureEvents = {
  onWheel: Handler<"wheel", WheelEvent>;
  onPinchStart: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
  onPinch: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
  onPinchEnd: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
};
