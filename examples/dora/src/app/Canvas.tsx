import { For, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { useCanvasEvents } from "~/app/useCanvasEvents";
import { useGestureEvents } from "~/app/useGestureEvents";
import { useResizeObserver } from "~/app/useResizeObserver";
import { Node } from "./Node";

export function Canvas() {
  const { app } = useContext(appContext);
  const rContainer = { current: null as any };

  useGestureEvents(rContainer);

  useResizeObserver(rContainer);

  const events = useCanvasEvents();

  return (
    <div style={{ height: "100%", width: "100%", "background-color": "#e8e8eb" }}>
      <div class="dr-container" ref={el => (rContainer.current = el)}>
        <div tabindex={-1} class="dr-absolute dr-canvas" {...events}>
          <div
            class="layer dr-absolute"
            style={{
              transform: `scale(${app.viewport.cameraZoom}) translate(${app.viewport.cameraPosition[0]}px, ${app.viewport.cameraPosition[1]}px)`
            }}
          >
            <For each={app.graph.nodes}>{(node, index) => <Node node={node} />}</For>
            {/* <div
                style={{
                  padding: "10px",
                  "background-color": "red",
                  width: "fit-content"
                }}
              >
                Hello world
              </div> */}
          </div>
        </div>
      </div>
      <DebugApp />
    </div>
    // <DebugApp />
    // </div>
  );
}
function DebugApp() {
  const { app } = useContext(appContext);
  return (
    <div class="fixed left-0 top-0">
      <div class="controls flex-1">
        <pre>{`Screen Point: [${app.inputs.currentScreenPoint.map(p => Math.floor(p)).join(", ")}] 
World Point: [${app.inputs.currentPoint.map(p => Math.floor(p)).join(", ")}] 
Current State: [${app.currentPath}]
Bounds: [${app.viewport.bounds.width}, ${app.viewport.bounds.height}]
Camera: [${app.viewport.cameraPosition[0]}, ${app.viewport.cameraPosition[1]}, ${
          app.viewport.camera.zoom
        }]
Selected Nodes: ${JSON.stringify(app.selectedNodes, null, 2)}
Hovered node: ${JSON.stringify(app.hoveredNode, null, 2)}
`}</pre>
        <button onClick={() => app.graph.addNode()}>New node</button>
      </div>
    </div>
  );
}
