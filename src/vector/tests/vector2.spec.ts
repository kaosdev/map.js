import {
  divide,
  fromElementScale,
  fromMouseEvent,
  fromTouchEvent,
  multiply,
  subtract,
  sum,
  Vector2,
} from "../vector2";

describe("Vector2", () => {
  describe("subctract", () => {
    it("should subtract 2 vectors", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2: Vector2 = { x: 5, y: 10 };

      const delta = subtract(v1, v2);

      expect(delta.x).toEqual(5);
      expect(delta.y).toEqual(-5);
    });

    it("should subtract a number from a vector", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2 = 10;

      const delta = subtract(v1, v2);

      expect(delta.x).toEqual(0);
      expect(delta.y).toEqual(-5);
    });
  });

  describe("multiply", () => {
    it("should multiply 2 vectors", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2: Vector2 = { x: 5, y: 10 };

      const delta = multiply(v1, v2);

      expect(delta.x).toEqual(50);
      expect(delta.y).toEqual(50);
    });

    it("should multiply a number and a vector", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2 = 10;

      const delta = multiply(v1, v2);

      expect(delta.x).toEqual(100);
      expect(delta.y).toEqual(50);
    });
  });

  describe("sum", () => {
    it("should sum 2 vectors", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2: Vector2 = { x: 5, y: 10 };

      const delta = sum(v1, v2);

      expect(delta.x).toEqual(15);
      expect(delta.y).toEqual(15);
    });

    it("should sum a number and a vector", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2 = 10;

      const delta = sum(v1, v2);

      expect(delta.x).toEqual(20);
      expect(delta.y).toEqual(15);
    });
  });

  describe("divide", () => {
    it("should divide 2 vectors", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2: Vector2 = { x: 5, y: 10 };

      const delta = divide(v1, v2);

      expect(delta.x).toEqual(2);
      expect(delta.y).toEqual(0.5);
    });

    it("should divide a number and a vector", () => {
      const v1: Vector2 = { x: 10, y: 5 };
      const v2 = 10;

      const delta = divide(v1, v2);

      expect(delta.x).toEqual(1);
      expect(delta.y).toEqual(0.5);
    });
  });

  it("should create from MouseEvent", () => {
    const mouseEvent = { pageX: 10, pageY: 5 } as MouseEvent;

    const v = fromMouseEvent(mouseEvent);

    expect(v.x).toBe(10);
    expect(v.y).toBe(5);
  });

  it("should create from TouchEvent", () => {
    const touchEvent = {
      touches: [{ pageX: 10, pageY: 5 }],
    } as any;

    const v = fromTouchEvent(touchEvent);

    expect(v.x).toBe(10);
    expect(v.y).toBe(5);
  });

  it("should create from element dimensions", () => {
    const element = mockElementWithRect({ width: 512, height: 256 });

    const v = fromElementScale(element);

    expect(v.x).toBe(512);
    expect(v.y).toBe(256);
  });

  function mockElementWithRect(rect: Partial<DOMRect>): Element {
    return {
      getBoundingClientRect() {
        return rect;
      },
    } as Element;
  }
});
