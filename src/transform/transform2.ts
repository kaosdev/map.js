import { divide, subtract, Vector2 } from "../vector/vector2";

export interface Transform2 {
  position: Vector2;
  scale: Vector2;
}

export function getElementTransform(element: Element): Transform2 {
  const rect = element.getBoundingClientRect();

  const position = { x: rect.left, y: rect.top };
  const scale = { x: rect.width, y: rect.height };

  return { position, scale };
}

export function deltaTransform(t1: Transform2, t2: Transform2): Transform2 {
  return {
    position: subtract(t1.position, t2.position),
    scale: divide(t1.scale, t2.scale),
  };
}

export function toCSSTransform(t: Transform2): string {
  return `translate(${t.position.x}px, ${t.position.y}px) scale(${t.scale.x}, ${t.scale.y})`;
}
