import { JSX, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";

export function useCanvasEvents() {
  const { app } = useContext(appContext);

  function getPoint(e: PointerEvent) {
    return [e.clientX, e.clientY];
  }

  const events = () => {
    const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerMove", { targetType: "canvas", point: getPoint(e), order, event: e });
    };

    const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.setPointerCapture(e.pointerId);
      app.send("onPointerDown", { targetType: "canvas", point: getPoint(e), order, event: e });
    };

    const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.releasePointerCapture(e.pointerId);
      app.send("onPointerUp", { targetType: "canvas", point: getPoint(e), order, event: e });
    };

    const onPointerEnter: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerEnter", { targetType: "canvas", point: getPoint(e), order, event: e });
    };

    const onPointerLeave: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerLeave", { targetType: "canvas", point: getPoint(e), order, event: e });
    };

    const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent & { order?: number }> = e => {
      app.send("onKeyDown", { targetType: "canvas", order: -1, event: e });
    };

    const onKeyUp: JSX.EventHandler<HTMLElement, KeyboardEvent & { order?: number }> = e => {
      app.send("onKeyUp", { targetType: "canvas", order: -1, event: e });
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown,
      onKeyUp,
      onPointerEnter,
      onPointerLeave
    };
  };

  return events();
}
