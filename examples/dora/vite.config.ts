import { defineConfig } from "vite";
import solid from "solid-start";
import WindiCSS from "vite-plugin-windicss";
import typo from "windicss/plugin/typography";

export default defineConfig({
  plugins: [
    WindiCSS({
      config: {
        theme: {
          fontFamily: {
            sans: ["Inter", "sans-serif"]
          }
        },
        plugins: [typo()]
      }
    }),
    solid()
  ],
  optimizeDeps: {
    exclude: [
      "@tiptap/core",
      "@tiptap/starter-kit",
      "@tiptap/extension-bubble-menu",
      "solid-headless"
    ]
  },
  // @ts-ignore
  ssr: {
    noExternal: ["solid-headless"]
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true
  }
});
