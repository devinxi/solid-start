import { EventHandlers } from "~/state/types";
import { State } from "~/state/statechart/RootState";
import Vec from "@tldraw/vec";

export class PointingCanvas extends State {
  static id = "pointingCanvas";

  onEnter = () => {
    this.app.selectedIds = [];
  };

  onPointerUp: EventHandlers["pointer"] = info => {
    this.parent.transition(Idle.id, info);
  };
}

export class Idle extends State {
  static id = "idle";

  onPointerDown: EventHandlers["pointer"] = info => {
    if (info.order) {
      return;
    }

    switch (info.targetType) {
      case "node": {
        this.parent.transition(PointingNode.id, info);
        return;
      }
      case "canvas": {
        this.parent.transition(PointingCanvas.id, info);
        return;
      }
    }
  };

  onExit = () => {
    this.app.hoveredNode = undefined;
  };

  onPointerEnter: EventHandlers["pointer"] = info => {
    if (info.order) return;

    switch (info.targetType) {
      case "node": {
        this.app.hoveredNode = info.node;
        break;
      }
      // case TLTargetType.Selection: {
      //   if (!(info.handle === "background" || info.handle === "center")) {
      //     this.tool.transition("hoveringSelectionHandle", info);
      //   }
      //   break;
      // }
    }
  };

  onPointerLeave: EventHandlers["pointer"] = info => {
    if (info.order) return;

    switch (info.targetType) {
      case "node": {
        this.app.hoveredNode = undefined;
        break;
      }
      // case TLTargetType.Selection: {
      //   if (!(info.handle === "background" || info.handle === "center")) {
      //     this.tool.transition("hoveringSelectionHandle", info);
      //   }
      //   break;
      // }
    }
  };
}

export class PointingNode extends State {
  static id = "pointingNode";

  onEnter = (info: any) => {
    if (this.app.inputs.shiftKey) {
      this.app.setSelectedNodes([...this.app.selectedIds, info.node.id]);
    } else {
      this.app.setSelectedNodes([info.node]);
    }
  };

  onPointerUp: EventHandlers["pointer"] = info => {
    this.parent.transition(Idle.id, info);
  };

  onPointerMove: EventHandlers["pointer"] = info => {
    const { currentPoint, originPoint } = this.app.inputs;
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.parent.transition(Translating.id, info);
    }
  };
}

export class Translating extends State {
  static id = "translating";
  private initialPoints: Record<string, number[]> = {};
  private initialShapePoints: Record<string, number[]> = {};
  onPointerUp: EventHandlers["pointer"] = info => {
    this.parent.transition(Idle.id, info);
  };

  onEnter = () => {
    // Pause the history when we enter
    // this.app.history.pause()
    // Set initial data
    const { selectedNodes, inputs } = this.app;

    this.initialShapePoints = Object.fromEntries(
      selectedNodes.map(node => [node!.id, node!.position.slice()])
    );
    this.initialPoints = this.initialShapePoints;
    this.moveSelectedNodesToPointer();

    // if (inputs.altKey) {
    //   this.startCloning();
    // } else {
    //   this.moveSelectedShapesToPointer();
    // }
  };

  onPointerMove: EventHandlers["pointer"] = info => {
    this.moveSelectedNodesToPointer();
  };

  moveSelectedNodesToPointer = () => {
    const { initialPoints } = this;

    const delta = Vec.sub(this.app.inputs.currentPoint, this.app.inputs.originPoint);

    if (this.app.inputs.shiftKey) {
      if (Math.abs(delta[0]) < Math.abs(delta[1])) {
        delta[0] = 0;
      } else {
        delta[1] = 0;
      }
    }

    this.app.selectedNodes.forEach(node => {
      node!.position = Vec.add(initialPoints[node!.id], delta);
    });
  };
}

export class SelectTool extends State {
  static id = "select";

  static states = [PointingCanvas, Idle, PointingNode, Translating];

  static initial = Idle.id;
}
