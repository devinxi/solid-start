import * as React from "react";
import { model, useMachine } from "../../api";
import { SvgCanvas } from "./SvgCanvas";
import { SelectionBrush } from "./SelectionBrush";
import { useAtom } from "../../api";
import { Connection } from "./Connection";
import { scene, selector } from "../../api";
import { Node } from "../../api";
import { InsertingConnectortGhost } from "./InsertingConnectortGhost";
import { InsertingNodeGhost } from "./InsertingNodeGhost";

function ViewBox({ children, width, height, onMouseDown = e => {}, onMouseUp = e => {} }) {
  const handleWheel = useWheel();
  const machine = useMachine();
  return (
    <div
      className="relative bg-grid overflow-x-hidden overflow-y-hidden"
      style={{
        height,
        width,
        // @ts-ignore
        "--grid-color": "#e9ecf1",
        "--grid-size": "40px",
        userSelect: "none"
      }}
      onMouseDown={e => {
        machine.send("POINTER_DOWN_ON_CANVAS", {
          x: e.clientX,
          y: e.clientY
        });
        onMouseDown?.(e);
      }}
      onMouseUp={e => {
        machine.send("POINTER_UP", { x: e.clientX, y: e.clientY });
        onMouseUp?.(e);
      }}
      onWheel={handleWheel}
    >
      {children}
    </div>
  );
}

export function Canvas() {
  const [{ width, height }] = useAtom(scene.viewBoxSize);

  return (
    <ViewBox width={width} height={height}>
      <SvgCanvas height={height} width={width}>
        <SelectionBrush />
        <InsertingNodeGhost />
        <InsertingConnectortGhost />
        <Connections />
      </SvgCanvas>
      <CanvasBackground height={height} width={width}>
        <Nodes />
      </CanvasBackground>
    </ViewBox>
  );
}
