import { defineConfig } from "vite";
import solid from "solid-start";
import WindiCSS from "vite-plugin-windicss";
import typo from "windicss/plugin/typography";
import colors from "windicss/colors";

export default defineConfig({
  plugins: [
    WindiCSS({
      config: {
        theme: {
          extend: {
            typography: {
              DEFAULT: {
                css: {
                  "font-weight": "400",
                  color: colors.black,
                  "ul > li > *:last-child": {
                    "margin-bottom": "0rem"
                  },
                  "ul > li::before": {
                    "background-color": colors.black
                  },
                  "ul > li > *:first-child": {
                    "margin-top": "0rem"
                  },
                  ul: {
                    margin: "0rem"
                  },
                  li: {
                    margin: "0rem"
                  },
                  "ul ul": {
                    margin: "0rem"
                  },
                  a: {
                    cursor: "pointer",
                    color: colors.blue["500"],
                    "&:hover": {
                      color: colors.blue["500"]
                    }
                  },
                  "ul > li p": {
                    marginBottom: "0rem",
                    marginTop: "0rem"
                  },
                  p: {
                    margin: "0"
                  }
                }
              }
            }
          },
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
