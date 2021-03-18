import { merge } from "../reactive/creators/merge";
import { Observable } from "../reactive/observable";
import { map } from "../reactive/operators/map";
import { tap } from "../reactive/operators/tap";
import {
  divide,
  fromElementScale,
  subtract,
  sum,
  Vector2,
  ZERO,
} from "../vector/vector2";
import { enablePanning } from "./pannable";
import { enableZoom } from "./zoomable";

export interface PanZoom {
  pan: Vector2;
  zoom: number;
}

export function panzoom(
  wrapper: HTMLElement,
  content: HTMLElement,
  options: PanZoom
): Observable<PanZoom> {
  let currentPan = options.pan;
  let currentZoom = options.zoom;
  let needRAF = true;
  applyPanZoom(wrapper, content, currentPan, currentZoom);

  return merge<void>([
    enablePanning(wrapper).pipe(
      tap((delta) => {
        const deltaAdj = divide(delta || ZERO, currentZoom);

        currentPan = sum(currentPan, deltaAdj);
      })
    ),
    enableZoom(wrapper, {
      sensibility: 1,
    }).pipe(tap((zoom) => (currentZoom = zoom || 1))),
  ]).pipe(
    map(() => {
      if (needRAF) {
        needRAF = false;
        requestAnimationFrame(() => {
          needRAF = true;
          applyPanZoom(wrapper, content, currentPan, currentZoom);
        });
      }

      return { pan: currentPan, zoom: currentZoom };
    })
  );
}

function applyPanZoom(
  wrapper: HTMLElement,
  element: HTMLElement,
  pan: Vector2,
  zoom: number
): void {
  const center = divide(fromElementScale(wrapper), 2);
  const origin = subtract(center, pan);
  element.style.transformOrigin = `${origin.x}px ${origin.y}px 0`;
  element.style.transform = panzoomToTransform(pan, zoom);
}

function panzoomToTransform(pan: Vector2, zoom: number): string {
  return (
    "matrix(" + zoom + ", 0, 0, " + zoom + ", " + pan.x + ", " + pan.y + ")"
  );
}
