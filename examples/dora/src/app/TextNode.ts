import { Node } from "~/app/app";
import { observable } from "~/state/mobx";
import { TextNode as TextRenderNode } from "~/app/Node";
import { generateJSON } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
export class TextNode extends Node {
  @observable text = "";

  constructor() {
    super();
    this.Component = TextRenderNode;
  }

  get json() {
    return generateJSON(this.text, [StarterKit]);
  }

  get title() {
    let firstContent = this.json.content[0];
    if (firstContent.content?.[0].text) {
      return firstContent.content[0].text;
    }
    return "";
  }
}
