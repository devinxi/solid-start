import { JSX, useContext } from "solid-js";
import { appContext } from "~/components/AppContext";


export function useScreenEvents() {
  const { app } = useContext(appContext);

  const events = () => {
    function getPoint(e: PointerEvent) {
      return [e.clientX, e.clientY];
    }

    const onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = e => {
      app.send("onPointerMove", { point: getPoint(e), event: e });
    };

    const onPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = e => {
      app.send("onPointerDown", { point: getPoint(e), event: e });
    };

    const onPointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = e => {
      app.send("onPointerUp", { point: getPoint(e), event: e });
    };

    return {
      onPointerMove,
      onPointerDown,
      onPointerUp
    };
  };

  return events;
}
