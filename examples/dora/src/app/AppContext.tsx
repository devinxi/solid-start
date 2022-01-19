import { createContext, PropsWithChildren } from "solid-js";
import { App } from "~/app/app";

export const appContext = createContext({} as { app: App });

export function AppContext(props: PropsWithChildren<{}>) {
  const app = new App();
  return <appContext.Provider value={{ app }}>{props.children}</appContext.Provider>;
}
