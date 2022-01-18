import { createEffect, createRenderEffect, JSX, onCleanup, untrack, useContext } from "solid-js";
import { appContext, AppContext } from "~/components/AppContext";
import { App } from "~/state/app";
import { Bounds } from "~/state/types";

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

import { Handler, Gesture, WebKitGestureEvent } from "@use-gesture/vanilla";

type GestureEvents = {
  onWheel: Handler<"wheel", WheelEvent>;
  onPinchStart: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
  onPinch: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
  onPinchEnd: Handler<"pinch", PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>;
};

export function useGestureEvents(ref: { current: HTMLElement }) {
  const { app } = useContext(appContext);

  const events = {
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

export function useResizeObserver<T extends Element>(
  ref: { current: T },
  onBoundsChange?: (bounds: Bounds) => void
) {
  const { app } = useContext(appContext);
  const rIsMounted = { current: false };

  // When the element resizes, update the bounds (stored in inputs)
  // and broadcast via the onBoundsChange callback prop.
  const updateBounds = () => {
    if (rIsMounted.current) {
      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        const bounds: Bounds = {
          minX: rect.left,
          midX: rect.left + rect.width / 2,
          maxX: rect.left + rect.width,
          midY: rect.top + rect.height / 2,
          minY: rect.top,
          maxY: rect.top + rect.height,
          width: rect.width,
          height: rect.height
        };

        app.viewport.updateBounds(bounds);
        onBoundsChange?.(bounds);
      }
    } else {
      // Skip the first mount
      rIsMounted.current = true;
    }
  };

  createEffect(() => {
    window.addEventListener("scroll", updateBounds);
    window.addEventListener("resize", updateBounds);
    onCleanup(() => {
      window.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    });
  });

  createEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0].contentRect) {
        updateBounds();
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  createEffect(() => {
    updateBounds();
  });
}

function Div() {
  const { app } = useContext(appContext);
  const rContainer = { current: null as any };

  useGestureEvents(rContainer);

  useResizeObserver(rContainer);

  const events = useScreenEvents();

  return (
    <div>
      <div style={{ height: "500px", width: "500px", "background-color": "red" }}>
        <div class="container" ref={el => (rContainer.current = el)} {...events}>
          <div tabindex={-1} class="absolute canvas" {...events}>
            <div
              class="layer absolute"
              style={{
                transform: `scale(${app.viewport.cameraZoom}) translate(${app.viewport.cameraPosition[0]}px, ${app.viewport.cameraPosition[1]}px)`
              }}
            >
              <div>Hello world</div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <pre>{`Screen Point: [${app.inputs.currentScreenPoint.map(p => Math.floor(p)).join(", ")}] 
World Point: [${app.inputs.currentPoint.map(p => Math.floor(p)).join(", ")}] 
Current State: [${app.currentPath}]
Bounds: [${app.viewport.bounds.width}, ${app.viewport.bounds.height}]
Camera: [${app.viewport.cameraPosition[0]}, ${app.viewport.cameraPosition[1]}, ${
          app.viewport.camera.zoom
        }]
`}</pre>
      </div>
    </div>
  );
}

// import * as React from "react";
// import { model, useMachine } from "../../api";
// import { SvgCanvas } from "./SvgCanvas";
// import { SelectionBrush } from "./SelectionBrush";
// import { useAtom } from "../../api";
// import { Connection } from "./Connection";
// import { scene, selector } from "../../api";
// import { Node } from "../../api";
// import { InsertingConnectortGhost } from "./InsertingConnectortGhost";
// import { InsertingNodeGhost } from "./InsertingNodeGhost";

// function ViewBox({ children, width, height, onMouseDown = e => {}, onMouseUp = e => {} }) {
//   const handleWheel = useWheel();
//   const machine = useMachine();
//   return (
//     <div
//       className="relative bg-grid overflow-x-hidden overflow-y-hidden"
//       style={{
//         height,
//         width,
//         // @ts-ignore
//         "--grid-color": "#e9ecf1",
//         "--grid-size": "40px",
//         userSelect: "none"
//       }}
//       onMouseDown={e => {
//         machine.send("POINTER_DOWN_ON_CANVAS", {
//           x: e.clientX,
//           y: e.clientY
//         });
//         onMouseDown?.(e);
//       }}
//       onMouseUp={e => {
//         machine.send("POINTER_UP", { x: e.clientX, y: e.clientY });
//         onMouseUp?.(e);
//       }}
//       onWheel={handleWheel}
//     >
//       {children}
//     </div>
//   );
// }

// export function Canvas() {
//   const [{ width, height }] = useAtom(scene.viewBoxSize);

//   return (
//     <ViewBox width={width} height={height}>
//       <SvgCanvas height={height} width={width}>
//         <SelectionBrush />
//         <InsertingNodeGhost />
//         <InsertingConnectortGhost />
//         <Connections />
//       </SvgCanvas>
//       <CanvasBackground height={height} width={width}>
//         <Nodes />
//       </CanvasBackground>
//     </ViewBox>
//   );
// }

// export function CanvasBackground({ children, height, width }) {
//   const [{ x, y, zoom }] = useAtom(scene.camera);
//   return (
//     <div
//       className="absolute camera"
//       style={{
//         // @ts-ignore
//         "--x": `${x}px`,
//         "--y": `${y}px`,
//         "--zoom": zoom,
//         height,
//         width
//       }}
//     >
//       <div className="relative">{children}</div>
//     </div>
//   );
// }

// export function useWheel() {
//   const state = useMachine();
//   return React.useCallback(
//     (e: React.WheelEvent) => {
//       const { deltaX, deltaY } = e;

//       if (e.ctrlKey) {
//         // Zooming
//         state.send("ZOOMED", deltaY / 100);
//         state.send("POINTER_MOVE");
//       } else {
//         // Panning
//         state.send("PANNED", {
//           x: deltaX,
//           y: deltaY
//         });
//         state.send("POINTER_MOVE");
//       }
//     },
//     [state.send]
//   );
// }

// export const Connections = React.memo(() => {
//   const [allConnectionIDs] = useAtom(model.connectionIDs);

//   return (
//     <>
//       {allConnectionIDs.map(id => {
//         return <Connection connectionID={id} key={id} />;
//       })}
//     </>
//   );
// });

// export const Nodes = React.memo(() => {
//   const [nodeIDs] = useAtom(model.nodeIDs);

//   return (
//     <>
//       {nodeIDs.map(id => {
//         return <Node nodeID={id} key={id} />;
//       })}
//     </>
//   );
// });

export default function Map() {
  return (
    <AppContext>
      <Div />
    </AppContext>
  );
}
