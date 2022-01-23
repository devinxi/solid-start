import { defineConfig } from "vite";
import solid from "solid-start";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
  plugins: [WindiCSS(), solid()],
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true
  }
});
