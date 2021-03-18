import {
  deltaTransform,
  getElementTransform,
  toCSSTransform,
  Transform2,
} from "../transform2";

describe("Transform2", () => {
  it("should get element transform", () => {
    const element = mockElementWithRect({
      top: 100,
      left: 50,
      width: 512,
      height: 256,
    });

    const transform = getElementTransform(element);

    expect(transform.position).toEqual({ x: 50, y: 100 });
    expect(transform.scale).toEqual({ x: 512, y: 256 });
  });

  it("should calculate delta between 2 transforms", () => {
    const t1: Transform2 = {
      scale: { x: 1, y: 0.5 },
      position: { x: 512, y: 256 },
    };
    const t2: Transform2 = {
      scale: { x: 0.5, y: 1 },
      position: { x: 256, y: 512 },
    };

    const delta = deltaTransform(t1, t2);

    expect(delta.scale).toEqual({ x: 2, y: 0.5 });
    expect(delta.position).toEqual({ x: 256, y: -256 });
  });

  it("should convert a transform to a css transform prop", () => {
    const t: Transform2 = {
      scale: { x: 1, y: 0.5 },
      position: { x: 512, y: 256 },
    };

    const css = toCSSTransform(t);

    expect(css).toBe("translate(512px, 256px) scale(1, 0.5)");
  });

  function mockElementWithRect(rect: Partial<DOMRect>): Element {
    return {
      getBoundingClientRect() {
        return rect;
      },
    } as Element;
  }
});
