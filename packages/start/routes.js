// // This file is used a virtual module to load the data and pages using glob imports,
// // then processing them into a format that is compatible with the solid-app-router
// // useRoutes hook
// import { createResource, lazy } from "solid-js";

// import dataModules from "virtual:solid-start/data";
// import pages from "virtual:solid-start/pages";

// function toIdentifier(source) {
//   // $EXTENSIONS will be replaced by the extensions list
//   // by the solid-start vite plugin
//   return source.slice(10).replace(/(index)?($EXTENSIONS|.data.js|.data.ts)/, "");
// }

// function toPath(id) {
//   return id.replace(/\[(.+)\]/, (_, m) => (m.startsWith("...") ? `*${m.slice(3)}` : `:${m}`));
// }

// const data = Object.entries(dataModules).reduce((memo, [key, value]) => {
//   memo[toIdentifier(key)] = value;
//   return memo;
// }, {});

// console.log(data);
// function findNestedPath(list, id, full, importer) {
//   let temp = list.find(o => o._id && o._id !== "/" && id.startsWith(o._id + "/"));
//   if (!temp)
//     list.push({
//       _id: id,
//       path: toPath(id) || "/",
//       component: lazy(importer),
//       data: data[full]
//         ? data[full].default
//         : function fileData(params) {
//             const [data] = createResource(async () => {
//               console.log("data 1", params, importer);
//               let mod = await importer();
//               console.log("data 2", mod);
//               const result = await mod.data?.(params);
//               console.log("result", result);
//               return await result;
//             });
//             return data;
//           }
//     });
//   else
//     findNestedPath(
//       temp.children || (temp.children = []),
//       id.slice(temp._id.length),
//       full,
//       importer
//     );
// }

// const routes = Object.entries(pages).reduce((r, [key, fn]) => {
//   let id = toIdentifier(key);
//   findNestedPath(r, id, id, fn);
//   return r;
// }, []);

// console.log(routes);

// export default routes;

import fg from "fast-glob";
import fs from "fs";
import { init, parse } from "es-module-lexer";
import esbuild from "esbuild";
import chalk from "chalk";

export async function getRoutes() {
  await init;
  const pageRoutes = fg.sync("src/routes/**/*.(tsx|jsx)", { cwd: process.cwd() });
  const dataRoutes = fg.sync("src/routes/**/*.data.(ts|js)", { cwd: process.cwd() });
  const apiRoutes = fg.sync(["src/routes/**/*.(ts|js)", "!src/routes/**/*.data.(ts|js)"], {
    cwd: process.cwd()
  });

  function toIdentifier(source) {
    // $EXTENSIONS will be replaced by the extensions list
    // by the solid-start vite plugin
    return source
      .slice(`src/routes`.length)
      .replace(/(index)?(.(tsx|jsx|mdx|ts|js)|.data.js|.data.ts)/, "");
  }
  function toPath(id) {
    return id.replace(/\[(.+)\]/, (_, m) => (m.startsWith("...") ? `*${m.slice(3)}` : `:${m}`));
  }

  const data = dataRoutes.reduce((memo, file) => {
    memo[toIdentifier(file)] = file;
    return memo;
  }, {});

  // console.log(data);
  function findNestedPath(list, f, id, full) {
    let temp = list.find(o => o._id && o._id !== "/" && id.startsWith(o._id + "/"));

    let [imports, exports] = parse(
      esbuild.transformSync(fs.readFileSync(process.cwd() + "/" + f).toString(), {
        jsx: "transform",
        format: "esm",
        loader: "tsx"
      }).code
    );
    if (!temp)
      list.push({
        src: f,
        _id: id,
        path: toPath(id) || "/",
        componentSrc: f,
        type: "PAGE",
        dataSrc: data[full] ? data[full] : exports.includes("data") ? f + "?data" : undefined,
        methods: ["GET", ...(exports.includes("action") ? ["POST", "PATCH", "DELETE"] : [])],
        actionSrc: exports.includes("action") ? f + "?action" : undefined,
        loaderSrc: exports.includes("loader") ? f + "?loader" : undefined

        // : function fileData(params) {
        //     const [data] = createResource(async () => {
        //       console.log("data 1", params, importer);
        //       let mod = await importer();
        //       console.log("data 2", mod);
        //       const result = await mod.data?.(params);
        //       console.log("result", result);
        //       return await result;
        //     });
        //     return data;
        //   }
      });
    else findNestedPath(temp.children || (temp.children = []), f, id.slice(temp._id.length), full);
  }

  function findNestedApiPath(list, f, id, full) {
    let temp = list.find(o => o._id && o._id !== "/" && id.startsWith(o._id + "/"));

    let [imports, exports] = parse(
      esbuild.transformSync(fs.readFileSync(process.cwd() + "/" + f).toString(), {
        jsx: "transform",
        format: "esm",
        loader: "tsx"
      }).code
    );
    if ((!temp && exports.includes("action")) || exports.includes("loader"))
      list.push({
        src: f,
        _id: id,
        path: toPath(id) || "/",
        apiSrc: f,
        type: "API ",
        actionSrc: exports.includes("action") ? f + "?action" : undefined,
        loaderSrc: exports.includes("loader") ? f + "?loader" : undefined,
        methods: [
          ...(exports.includes("loader") ? ["GET"] : []),
          ...(exports.includes("action") ? ["POST", "PATCH", "DELETE"] : [])
        ]
      });
  }

  const routes = pageRoutes.reduce((r, file) => {
    let id = toIdentifier(file);
    findNestedPath(r, file, id, id);
    return r;
  }, []);

  const apiRoute = apiRoutes.reduce((r, file) => {
    let id = toIdentifier(file);
    findNestedApiPath(r, file, id, id);
    return r;
  }, []);

  return {
    pageRoutes: routes,
    apiRoutes: apiRoute
  };
}
