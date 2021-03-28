import { fromEvent } from "../reactive/creators/from-event";
import { Observable } from "../reactive/observable";
import { filter } from "../reactive/operators/filter";
import { map } from "../reactive/operators/map";
import { switchMapTo } from "../reactive/operators/switch-map";
import { takeUntil } from "../reactive/operators/take-until";
import { tap } from "../reactive/operators/tap";
import {
  fromMouseEvent,
  fromTouchEvent,
  multiply,
  subtract,
  Vector2,
} from "../vector/vector2";

export interface PanningOptions {
  sensibility?: number | Vector2;
}

export class Pannable {
  static enablePanning(
    element: HTMLElement,
    optionsPartial?: PanningOptions
  ): Observable<Vector2> {
    const options: Required<PanningOptions> = {
      sensibility: 1,
      ...(optionsPartial || {}),
    };

    let prevMove: MouseEvent | null = null;
    let prevTouch: TouchEvent | null = null;

    let deltaStrategy: DeltaStrategy | null = null;

    const end$ = fromEvent(document, ["mouseup", "touchend"]).pipe(
      tap(() => {
        document.body.style.userSelect = "";
        prevTouch = null;
        prevMove = null;
      })
    );

    const move$ = fromEvent(document, ["mousemove", "touchmove"]).pipe(
      filter(
        (ev) =>
          !(
            window.TouchEvent &&
            ev instanceof TouchEvent &&
            ev.touches.length > 1
          )
      ),
      tap(() => {
        document.body.style.userSelect = "none";
      }),
      takeUntil(end$)
    );

    return fromEvent(element, ["mousedown", "touchstart"]).pipe(
      tap((event) => {
        if (event instanceof MouseEvent) {
          deltaStrategy = new MouseDeltaStrategy();
        } else {
          deltaStrategy = new TouchDeltaStrategy();
        }
      }),
      switchMapTo(move$),
      map((move) => deltaStrategy?.getDelta(move)),
      filter((delta): delta is Vector2 => delta !== null),
      map((delta) => multiply(delta, options.sensibility))
    );
  }
}

interface DeltaStrategy {
  getDelta(event: Event): Vector2 | null;
}

class MouseDeltaStrategy implements DeltaStrategy {
  prevPos?: Vector2;

  getDelta(event: Event): Vector2 | null {
    if (!(event instanceof MouseEvent)) {
      return null;
    }

    if (!this.prevPos) {
      this.prevPos = fromMouseEvent(event);
      return null;
    }

    const currentPos = fromMouseEvent(event);
    const delta = subtract(currentPos, this.prevPos);
    this.prevPos = currentPos;
    return delta;
  }
}

class TouchDeltaStrategy implements DeltaStrategy {
  prevPos?: Vector2;

  getDelta(event: Event): Vector2 | null {
    if (!(event instanceof TouchEvent)) {
      return null;
    }

    if (!this.prevPos) {
      this.prevPos = fromTouchEvent(event);
      return null;
    }

    const currentPos = fromTouchEvent(event);
    const delta = subtract(currentPos, this.prevPos);
    this.prevPos = currentPos;
    return delta;
  }
}
