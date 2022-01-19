import { AppContext } from "~/components/AppContext";
import { Canvas } from "~/components/Canvas";

export default function Map() {
  return (
    <AppContext>
      <Canvas />
    </AppContext>
  );
}
