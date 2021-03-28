import { fromEvent } from "../reactive/creators/from-event";
import { merge } from "../reactive/creators/merge";
import { Observable } from "../reactive/observable";
import { filter } from "../reactive/operators/filter";
import { map } from "../reactive/operators/map";
import { pair } from "../reactive/operators/pair";
import { switchMap } from "../reactive/operators/switch-map";
import { takeUntil } from "../reactive/operators/take-until";

export interface ZoomingOptions {
  sensibility?: number;
  max?: number;
  min?: number;
}

export class Zoomable {
  static enableZoom(
    element: HTMLElement,
    optionsPartial?: ZoomingOptions
  ): Observable<number> {
    const options: Required<ZoomingOptions> = {
      sensibility: 1,
      max: 2.5,
      min: 0.5,
      ...optionsPartial,
    };

    const sensibility = options.sensibility * 0.1;
    const touchSensibility = options.sensibility * 0.005;

    let prevScale = 1;

    const pinchDelta$ = fromEvent(element, "touchstart").pipe(
      filter((ev) => ev.touches.length === 2),
      switchMap(() =>
        fromEvent(element, "touchmove").pipe(
          filter((ev) => ev.touches.length === 2),
          map((move) => {
            move.preventDefault();
            return Math.hypot(
              move.touches[0].pageX - move.touches[1].pageX,
              move.touches[0].pageY - move.touches[1].pageY
            );
          }),
          pair(([prev, next]) => {
            const delta = next - prev;
            return delta * touchSensibility;
          }),
          takeUntil(fromEvent(element, "touchend"))
        )
      )
    );

    const wheelDelta$ = fromEvent(element, "wheel").pipe(
      filter((wheel) => wheel.ctrlKey),
      map((wheel) => {
        wheel.preventDefault();
        if (wheel.deltaY < 0) {
          return sensibility;
        } else {
          return -sensibility;
        }
      })
    );

    return merge([pinchDelta$, wheelDelta$]).pipe(
      map((delta) => {
        prevScale += delta * prevScale;
        prevScale = Math.min(prevScale, options.max);
        prevScale = Math.max(prevScale, options.min);
        return prevScale;
      })
    );
  }
}
