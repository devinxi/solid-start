// @refresh reload
import { Suspense, useTransition } from "solid-js";
import { Links, Meta, Outlet, Scripts } from "solid-start/components";
import "./index.css";
import { useIsRouting } from "solid-app-router";

export const [isPending, startTransition] = useTransition();

export default function Root() {
  const isRouting = useIsRouting();
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <style>{`
        .global-loader {
          height: 8px;
          width: 100%;
          display: flex;
          flex-shrink: 0;
          position: absolute;
          overflow: hidden;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        
        .global-loader-fill {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 200%;
          transform: translateX(0);
          opacity: 0;
          transition: transform 2s ease, opacity 1s ease;
          background: linear-gradient(
            to right,
            rgba(52, 82, 255, 0.93) 0%,
            rgba(255, 16, 83, 0.92) 99%,
            rgba(255, 255, 255, 1) 100%
          );
        }
        
        .global-loader.is-loading .global-loader-fill {
          transition: none;
          opacity: 1;
          animation: Indeterminate 10s ease-out;
          animation-fill-mode: forwards;
        }
        
        @keyframes Indeterminate {
          0% {
            transform: translateX(-100%);
          }
          20% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
      `}</style>
        <div class="global-loader" classList={{ "is-loading": isRouting() || isPending() }}>
          <div class="global-loader-fill" />
        </div>
        <Suspense fallback={"Loading"}>
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
