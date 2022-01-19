import { createSignal, For, useContext } from "solid-js";
import { appContext } from "~/components/AppContext";
import { useCanvasEvents } from "~/hooks/useCanvasEvents";
import { useGestureEvents } from "~/hooks/useGestureEvents";
import { useResizeObserver } from "~/hooks/useResizeObserver";
import { useShapeEvents } from "~/hooks/useShapeEvents";

function Node(props: { node: any }) {
  const { app } = useContext(appContext);
  const left = Math.random() * 100;
  const top = Math.random() * 100;

  const selected = () => app.selectedNodes.find(n => n!.id === props.node.id);
  const hovered = () => app.hoveredNode?.id === props.node.id;
  return (
    <div
      {...useShapeEvents(props.node)}
      class={`bg-gradient-to-r to-blue-500 rounded-md font-bold`}
      classList={{
        "color-red": Boolean(selected()),
        "color-white": !Boolean(selected()),
        "from-blue-100": hovered(),
        "from-blue-400": !hovered()
      }}
      style={{
        padding: "10px",
        // "background-color": hovered() ? "red" : "yellow",
        width: "fit-content",
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`
      }}
    >
      {props.node.type}
    </div>
  );
}

export function Canvas() {
  const { app } = useContext(appContext);
  const rContainer = { current: null as any };

  useGestureEvents(rContainer);

  useResizeObserver(rContainer);

  const events = useCanvasEvents();

  return (
    <div>
      <div style={{ height: "200px", width: "500px", "background-color": "#e8e8eb" }}>
        <div class="container" ref={el => (rContainer.current = el)}>
          <div tabindex={-1} class="absolute canvas" {...events}>
            <div
              class="layer absolute"
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
      </div>
      <DebugApp />
    </div>
  );
}
function DebugApp() {
  const { app } = useContext(appContext);
  return (
    <div class="controls">
      <pre>{`Screen Point: [${app.inputs.currentScreenPoint.map(p => Math.floor(p)).join(", ")}] 
World Point: [${app.inputs.currentPoint.map(p => Math.floor(p)).join(", ")}] 
Current State: [${app.currentPath}]
Bounds: [${app.viewport.bounds.width}, ${app.viewport.bounds.height}]
Camera: [${app.viewport.cameraPosition[0]}, ${app.viewport.cameraPosition[1]}, ${
        app.viewport.camera.zoom
      }]
Selected IDs: ${JSON.stringify(app.selectedIds)}
Hovered node: ${app.hoveredNode?.id}
`}</pre>
      <button onClick={() => app.graph.addNode()}>New node</button>
    </div>
  );
}
