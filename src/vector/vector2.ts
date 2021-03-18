export interface Vector2 {
  readonly x: number;
  readonly y: number;
}

export const ZERO: Vector2 = { x: 0, y: 0 };

export type Vector2Like = number | Vector2;

export const sum = parallel((x1, x2) => x1 + x2);
export const subtract = parallel((x1, x2) => x1 - x2);
export const multiply = parallel((x1, x2) => x1 * x2);
export const divide = parallel((x1, x2) => x1 / x2);

function parallel(operation: (x1: number, x2: number) => number) {
  return (v1: Vector2Like, v2: Vector2Like): Vector2 => {
    v1 = fromVectorLike(v1);
    v2 = fromVectorLike(v2);
    return {
      x: operation(v1.x, v2.x),
      y: operation(v1.y, v2.y),
    };
  };
}

function fromVectorLike(v: Vector2Like): Vector2 {
  return typeof v === "number" ? { x: v, y: v } : v;
}

export function fromMouseEvent(event: MouseEvent): Vector2 {
  return { x: event.pageX, y: event.pageY };
}

export function fromTouchEvent(event: TouchEvent): Vector2 {
  return { x: event.touches[0].pageX, y: event.touches[0].pageY };
}

export function fromElementScale(element: Element): Vector2 {
  const rect = element.getBoundingClientRect();
  return { x: rect.width, y: rect.height };
}
