import { copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { rollup } from "rollup";
import vite from "vite";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";

export default function () {
  return {
    start(config) {
      import(pathToFileURL(join(config.root, "dist", "index.js")));
    },
    async build(config) {
      const { preferStreaming } = config.solidOptions;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      await vite.build({
        build: {
          outDir: "./dist/",
          minify: "terser",
          rollupOptions: {
            input: `node_modules/solid-start/runtime/entries/client.tsx`
          }
        }
      });
      await vite.build({
        build: {
          ssr: true,
          outDir: "./.solid/server",
          rollupOptions: {
            input: `node_modules/solid-start/runtime/entries/server.tsx`,
            output: {
              format: "esm"
            }
          }
        }
      });
      copyFileSync(
        join(config.root, ".solid", "server", `server.js`),
        join(config.root, ".solid", "server", "app.js")
      );
      copyFileSync(
        join(__dirname, preferStreaming ? "entry-stream.js" : "entry-async.js"),
        join(config.root, ".solid", "server", "index.js")
      );
      const bundle = await rollup({
        input: join(config.root, ".solid", "server", "index.js"),
        plugins: [
          json(),
          nodeResolve({
            preferBuiltins: true,
            exportConditions: ["node", "solid"]
          }),
          common()
        ]
      });
      // or write the bundle to disk
      await bundle.write({ format: "esm", dir: join(config.root, "dist") });

      // closes the bundle
      await bundle.close();
    }
  };
}
