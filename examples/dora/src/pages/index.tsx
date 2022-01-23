import { AppContext } from "~/app/AppContext";
import { Canvas } from "~/app/Canvas";
import "virtual:windi.css";
import "~/app/index.css";
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
