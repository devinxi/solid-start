import { createContext, createResource, PropsWithChildren } from "solid-js";
import { App } from "~/app/app";
import json from "./All-Data.json";
import { TextNode } from "./TextNode";
export const appContext = createContext({} as { app: App });
// @ts-ignore
import showdown from "showdown";
export function AppContext(props: PropsWithChildren<{}>) {
  console.log();
  const app = new App();

  const [data] = createResource(async () => {
    try {
      let converter = new showdown.Converter();
      json.whiteBoardList[0].cardInstances.forEach(e => {
        let node = new TextNode();
        node.position = [e.pos.x, e.pos.y];
        node.collapsed = e.showTitleOnly;
        node.size = [e.rect.width, e.rect.height];
        node.text = converter.makeHtml(
          json.cardList.find(c => c.cardId === e.cardId)?.content ?? ""
        );
        app.graph.nodes = [...app.graph.nodes, node];
      });
    } catch (e) {
      console.log(e);
    }
  });

  return <appContext.Provider value={{ app }}>{props.children}</appContext.Provider>;
}
