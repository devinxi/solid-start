import { JSX, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";

export function useShapeEvents(node: any) {
  const { app } = useContext(appContext);

  function getPoint(e: PointerEvent) {
    return [e.clientX, e.clientY];
  }

  const events = () => {
    const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerMove", { targetType: "node", node, point: getPoint(e), order, event: e });
      e.order = order + 1;
    };

    const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.setPointerCapture(e.pointerId);
      app.send("onPointerDown", { targetType: "node", node, point: getPoint(e), order, event: e });
      e.order = order + 1;
    };

    const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.releasePointerCapture(e.pointerId);
      app.send("onPointerUp", { targetType: "node", node, point: getPoint(e), order, event: e });
      e.order = order + 1;
    };

    const onPointerEnter: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerEnter", { targetType: "node", node, point: getPoint(e), order, event: e });
      e.order = order + 1;
    };

    const onPointerLeave: JSX.EventHandler<HTMLElement, PointerEvent & { order?: number }> = e => {
      const { order = 0 } = e;
      app.send("onPointerLeave", { targetType: "node", node, point: getPoint(e), order, event: e });
      e.order = order + 1;
    };

    const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent & { order?: number }> = e => {
      app.send("onKeyDown", { targetType: "node", node, order: -1, event: e });
    };

    const onKeyUp: JSX.EventHandler<HTMLElement, KeyboardEvent & { order?: number }> = e => {
      app.send("onKeyUp", { targetType: "node", node, order: -1, event: e });
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
