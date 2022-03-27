// @refresh reload
import { Routes } from "solid-start/root";

import "./code.css";
import "virtual:windi.css";

import { MDXProvider } from "solid-mdx";
import Nav from "./components/Nav";
import md from "./md";
import { createEffect } from "solid-js";
import tippy from "tippy.js";
import { Main } from "./components/Main";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
  darkMode: false
});
export default function Root() {
  createEffect(() => {
    tippy("[data-template]", {
      content(reference) {
        const id = reference.getAttribute("data-template");
        const template = document.getElementById(id);
        return template.innerHTML;
      },
      allowHTML: true
    });

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setStore("darkMode", true);
    } else {
      document.documentElement.classList.add("light");
      setStore("darkMode", false);
    }
  });
  return (
    <>
      <MDXProvider
        components={{
          ...md
        }}
      >
        <Nav />
        <Main>
          <Routes />
        </Main>
      </MDXProvider>
    </>
  );
}
