import { copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { rollup } from "rollup";
import vite from "vite";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import { spawn } from "child_process";

export default function () {
  return {
    start() {
      const proc = spawn("vercel");
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
    },
    async build(config) {
      const { preferStreaming } = config.solidOptions;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      await vite.build({
        build: {
          outDir: "./.output/static/",
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
        join(config.root, ".solid", "server", "server.js"),
        join(config.root, ".solid", "server", "app.js")
      );
      copyFileSync(
        join(__dirname, preferStreaming ? "entry-stream.js" : "entry-async.js"),
        join(config.root, ".solid", "server", "index.js")
      );
      copyFileSync(
        join(__dirname, "functions-manifest.json"),
        join(config.root, ".output", "functions-manifest.json")
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
      await bundle.write({
        format: "esm",
        file: join(config.root, ".output", "server", "pages", "_middleware.js")
      });

      // closes the bundle
      await bundle.close();
    }
  };
}
