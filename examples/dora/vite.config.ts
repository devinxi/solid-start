import { defineConfig } from "vite";
import solid from "solid-start";
import Unocss from "unocss/vite";
import presetWind from "@unocss/preset-wind";
export default defineConfig({
  plugins: [
    Unocss({
      presets: [presetWind()]
    }),
    solid({
      routesDir: "routes"
    })
  ]
});
