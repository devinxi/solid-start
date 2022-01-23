import { ComponentProps, createEffect, For, JSX, lazy, Show, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { useShapeEvents } from "~/app/useShapeEvents";
import * as a from "~/app/app";
import { isServer } from "solid-js/web";
import Card from "./Card";
const Editor = isServer ? () => null : lazy(() => import("./Editor"));

export function Node(props: { node: a.Node; children: any }) {
  const { app } = useContext(appContext);
  const selected = () => app.selectedNodes.find(n => n!.id === props.node.id);
  const hovered = () => app.hoveredNode?.id === props.node.id;

  let ref: HTMLDivElement;
  createEffect(() => {
    const rect = ref.getBoundingClientRect();
    props.node.size = [rect.width, rect.height];
  });

  return (
    <div
      {...useShapeEvents(props.node)}
      onPointerDown={e => {}}
      ref={ref!}
      class="relative"
      style={{
        width: props.node.size[0] + "px",
        height: props.node.collapsed ? "60px" : props.node.size[1] + "px",
        position: "absolute",
        top: `${props.node.position[1]}px`,
        left: `${props.node.position[0]}px`
      }}
    >
      {props.children}
    </div>
  );
}

//  {/* <div class="relative p-1">
//       {/* <Editor /> */}
//       {/* {props.node.type}
//       <input class="w-full" /> */}
//       <For each={props.node.pins}>{pin => <Pin pin={pin} />}</For>
//     </div> */}

function PinSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx={12} cy={12} r={9} stroke-width={3} fill="transparent" class="stroke-current" />
      <circle cx={12} cy={12} r={6} class="fill-current" />
    </svg>
  );
}

export function TextNode(props: { node: any }) {
  createEffect(() => {
    let firstContent = props.node.json.content[0];
    if (firstContent.content?.[0].text) {
      console.log(firstContent.content[0].text);
    }
  });
  const { app } = useContext(appContext);
  const selected = () => app.selectedNodes.find(n => n!.id === props.node.id);
  const hovered = () => app.hoveredNode?.id === props.node.id;

  return (
    <Node node={props.node}>
      <div
        class="border-3 border-gray-200 rounded-xl h-full"
        classList={{
          "border-gray-200": !hovered(),
          "border-gray-900": hovered(),
          "border-blue-600": !!selected()
        }}
      >
        <Show
          when={!props.node.collapsed}
          fallback={
            <div class="bg-white h-full rounded-xl" style={{ width: props.node.width + "px" }}>
              {/* {props.node.title} */}
            </div>
          }
        >
          <Card content={props.node.text} />
        </Show>
      </div>
    </Node>
  );
}

function Pin(props: { pin: a.Pin }) {
  let ref2: HTMLDivElement;
  createEffect(() => {
    props.pin.offset = [
      ref2.offsetLeft + ref2.offsetWidth / 2,
      ref2.offsetTop + ref2.offsetHeight / 2
    ];
  });

  return (
    <div
      style={{
        width: "fit-content"
      }}
      ref={ref2!}
    >
      <PinSvg class="w-3 -translate-x-2" />
      {/* {props.pin.type} */}
    </div>
  );
}
