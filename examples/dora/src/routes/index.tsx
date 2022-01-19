import { AppContext } from "~/app/AppContext";
import { Canvas } from "~/app/Canvas";

export default function Map() {
  return (
    <AppContext>
      <Canvas />
    </AppContext>
  );
}
