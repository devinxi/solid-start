import { ComponentProps, createEffect, For, JSX, lazy, Show, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { useShapeEvents } from "~/app/useShapeEvents";
import * as a from "~/app/app";
import { isServer } from "solid-js/web";
import ContentEditable from "./Card";

export function useNode(props: { node: a.Node }) {
  const { app } = useContext(appContext);

  let ref: HTMLDivElement;
  createEffect(() => {
    const rect = ref.getBoundingClientRect();
    props.node.size = [rect.width, rect.height];
  });

  return {
    set ref(value: HTMLDivElement) {
      ref = value;
    },
    get ref() {
      return ref;
    },
    get selected() {
      return app.selectedNodes.find(n => n!.id === props.node.id);
    },
    get hovered() {
      return app.hoveredNode?.id === props.node.id;
    },
    get node() {
      return props.node;
    },
    get style() {
      return {
        position: "absolute" as const,
        top: `${props.node.position[1]}px`,
        left: `${props.node.position[0]}px`
      };
    },
    get events() {
      return useShapeEvents(props.node);
    }
  };
}

function PinSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx={12} cy={12} r={9} stroke-width={3} fill="transparent" class="stroke-current" />
      <circle cx={12} cy={12} r={6} class="fill-current" />
    </svg>
  );
}

import CaretRight from "~icons/radix-icons/caret-right";

export function TextNode(props: { node: any }) {
  const node = useNode(props);

  createEffect(() => {
    let firstContent = props.node.json.content[0];
    if (firstContent.content?.[0].text) {
      console.log(firstContent.content[0].text);
    }
  });

  return (
    <div
      {...node.events}
      ref={node.ref!}
      style={{
        ...node.style,
        width: props.node.renderedSize[0] + "px",
        height: props.node.collapsed ? "67px" : props.node.renderedSize[1] + "px"
      }}
    >
      <div
        class="border-3 cursor-pointer border-gray-200 relative rounded-xl h-full"
        classList={{
          "border-gray-200": !node.hovered,
          "border-gray-900": node.hovered,
          "border-black": !!node.selected
        }}
      >
        <Show
          when={!props.node.collapsed}
          fallback={
            <div
              class="bg-white h-full rounded-xl relative"
              style={{ width: props.node.renderedSize[0] + "px" }}
            >
              <div class="absolute h-full flex items-center px-4">
                <div
                  class="hover:bg-gray-200 rounded-md"
                  onPointerDown={e => {
                    e.stopPropagation();
                  }}
                  onClick={e => {
                    console.log("heree");
                    node.node.collapsed = false;
                    e.stopPropagation();
                  }}
                >
                  <CaretRight class="w-8 h-8" />
                </div>
              </div>
              <div class="flex w-full h-full font-normal items-center justify-center">
                {props.node.title}
              </div>
            </div>
          }
        >
          <ContentEditable
            onEditorMount={e => {}}
            content={props.node.text}
            editable={props.node.state === "editing"}
          />
          <div
            class="absolute h-full w-full top-0 left-0"
            onPointerDown={e => {
              e.stopPropagation();
            }}
            onPointerUp={e => {
              e.stopPropagation();
            }}
          ></div>
        </Show>
      </div>
    </div>
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
