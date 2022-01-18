import { useContext } from "solid-js";
import { appContext } from "~/components/AppContext";
import { useScreenEvents } from "~/hooks/useScreenEvents";
import { useGestureEvents } from "~/hooks/useGestureEvents";
import { useResizeObserver } from "~/hooks/useResizeObserver";

export function Canvas() {
  const { app } = useContext(appContext);
  const rContainer = { current: null as any };

  useGestureEvents(rContainer);

  useResizeObserver(rContainer);

  const events = useScreenEvents();

  return (
    <div>
      <div style={{ height: "500px", width: "500px", "background-color": "#e8e8eb" }}>
        <div class="container" ref={el => (rContainer.current = el)} {...events}>
          <div tabindex={-1} class="absolute canvas" {...events}>
            <div
              class="layer absolute"
              style={{
                transform: `scale(${app.viewport.cameraZoom}) translate(${app.viewport.cameraPosition[0]}px, ${app.viewport.cameraPosition[1]}px)`
              }}
            >
              <div
                
                style={{
                  padding: "10px",
                  "background-color": "red",
                  width: "fit-content"
                }}
              >
                Hello world
              </div>
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
