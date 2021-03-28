import { Vector2 } from "../vector/vector2";

export function dispatchTouchEvent(
  target: EventTarget,
  type: string,
  touches: Vector2[]
) {
  const touchObjects = touches.map(
    (touch) =>
      new Touch({
        identifier: Date.now(),
        target,
        pageX: touch.x,
        pageY: touch.y,
      })
  );

  const touchEvent = new TouchEvent(type, {
    cancelable: true,
    bubbles: true,
    touches: touchObjects,
    targetTouches: [],
    changedTouches: touchObjects,
    shiftKey: false,
  });

  target.dispatchEvent(touchEvent);
}
