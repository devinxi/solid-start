import { ComponentProps, createEffect, For, lazy, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { useShapeEvents } from "~/app/useShapeEvents";
import * as a from "~/app/app";
import { isServer } from "solid-js/web";
const Editor = isServer ? () => null : lazy(() => import("./Editor"));

export function Node(props: { node: a.Node }) {
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
      class="bg-gradient-to-r to-blue-500 rounded-md relative"
      classList={{
        "color-red": Boolean(selected()),
        "color-white": !Boolean(selected()),
        "from-blue-100": hovered(),
        "from-blue-400": !hovered()
      }}
      style={{
        width: "600px",
        position: "absolute",
        top: `${props.node.position[1]}px`,
        left: `${props.node.position[0]}px`
      }}
    >
      <div class="relative p-1">
        <Editor />
        {props.node.type}
        <input class="w-full" />
        <For each={props.node.pins}>{pin => <Pin pin={pin} />}</For>
      </div>
    </div>
  );
}

function PinSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx={12} cy={12} r={9} stroke-width={3} fill="transparent" class="stroke-current" />
      <circle cx={12} cy={12} r={6} class="fill-current" />
    </svg>
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
