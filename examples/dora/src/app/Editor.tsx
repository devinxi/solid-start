import { Editor } from "bytemd";
import gfm from "@bytemd/plugin-gfm";
import type { BytemdPlugin } from "bytemd";
import type H from "highlight.js";
import "github-markdown-css/github-markdown.css";
export interface BytemdPluginHighlightOptions {
  init?(hljs: typeof H): void | Promise<void>;
}

export function highlight({ init }: BytemdPluginHighlightOptions = {}): BytemdPlugin {
  let hljs: typeof H;
  return {
    viewerEffect({ markdownBody }) {
      (async () => {
        const els = markdownBody.querySelectorAll<HTMLElement>("pre>code");
        if (els.length === 0) return;
        console.log(hljs);

        if (!hljs) {
          hljs = (await import("highlight.js")).default;
          console.log(hljs);
          if (init) await init(hljs);
          console.log(hljs);
        }

        els.forEach(el => {
          hljs.highlightElement(el);
        });
      })();
    }
  };
}
import frontmatter from "@bytemd/plugin-frontmatter";
import mermaid from "@bytemd/plugin-mermaid";
import "bytemd/dist/index.min.css";
const plugins = [
  highlight(),
  frontmatter(),
  gfm(),
  mermaid()
  // Add more plugins here
];

import { createEffect } from "solid-js";

// export default props => {
//   let ref;

//   createEffect(async () => {
//     const editor = new Editor({
//       target: ref, // DOM to render
//       props: {
//         value: props.value ?? "Hello world",
//         plugins
//       }
//     });

//     editor.$on("change", e => {
//       editor.$set({ value: e.detail.value });
//     });
//   });
//   return <div onClick={e => {}} ref={ref!}></div>;
// };

import * as bytemd from "bytemd";

export interface ViewerProps extends bytemd.ViewerProps {}

export default function Viewer({ value = "# Hello World\n ### World", sanitize }: ViewerProps) {
  const elRef = { current: null as HTMLDivElement | null };
  const file = () => {
    try {
      return bytemd.getProcessor({ sanitize, plugins }).processSync(value);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const markdownBody = elRef.current;
  //   if (!markdownBody || !file) return;

  //   const cbs = plugins?.map(({ viewerEffect }) => viewerEffect?.({ markdownBody, file }));
  //   return () => {
  //     cbs?.forEach(cb => cb && cb());
  //   };
  // }, [file, plugins]);

  return (
    <div
      class="h-20 overflow-scroll"
      onWheel={e => {
        e.stopPropagation();
      }}
      onPointerDown={e => {
        e.stopPropagation();
      }}
      onClick={e => {
        const $ = e.target as HTMLElement;
        if ($.tagName !== "A") return;

        const href = $.getAttribute("href");
        if (!href?.startsWith("#")) return;

        elRef.current?.querySelector("#user-content-" + href.slice(1))?.scrollIntoView();
      }}
      ref={el => (elRef.current = el)}
      className="markdown-body"
      innerHTML={file()?.toString() ?? ""}
    ></div>
  );
}
