import { createEffect, onCleanup, useContext } from "solid-js";
import { appContext } from "~/app/AppContext";
import { Bounds } from "~/state/types";

export function useResizeObserver<T extends Element>(
  ref: { current: T },
  onBoundsChange?: (bounds: Bounds) => void
) {
  const { app } = useContext(appContext);
  const rIsMounted = { current: false };

  // When the element resizes, update the bounds (stored in inputs)
  // and broadcast via the onBoundsChange callback prop.
  const updateBounds = () => {
    if (rIsMounted.current) {
      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        const bounds: Bounds = {
          minX: rect.left,
          midX: rect.left + rect.width / 2,
          maxX: rect.left + rect.width,
          midY: rect.top + rect.height / 2,
          minY: rect.top,
          maxY: rect.top + rect.height,
          width: rect.width,
          height: rect.height
        };

        app.viewport.updateBounds(bounds);
        onBoundsChange?.(bounds);
      }
    } else {
      // Skip the first mount
      rIsMounted.current = true;
    }
  };

  createEffect(() => {
    window.addEventListener("scroll", updateBounds);
    window.addEventListener("resize", updateBounds);
    onCleanup(() => {
      window.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    });
  });

  createEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0].contentRect) {
        updateBounds();
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  createEffect(() => {
    updateBounds();
  });
}
