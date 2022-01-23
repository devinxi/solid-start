import { AppContext } from "~/app/AppContext";
import { Canvas } from "~/app/Canvas";

export default function Map() {
  console.log("heeeree");
  return (
    <AppContext>
      <div class="relative h-screen w-screen">
        <Canvas />
      </div>
    </AppContext>
  );
}
