import { Subscription } from "../../reactive/observable";
import { Vector2 } from "../../vector/vector2";
import { enablePanning } from "../pannable";

describe("pannable", () => {
  let subscription: Subscription | null = null;

  it("should send mouse pan events", (done) => {
    const panEl = mockPanElement();

    subscription = enablePanning(panEl).subscribe((pan) => {
      expect(pan).toEqual({ x: -50, y: 50 });
      done();
    });

    panEl.dispatchEvent(new MouseEvent("mousedown"));

    document.dispatchEvent(
      mockMouseEvent("mousemove", {
        x: 100,
        y: 100,
      })
    );
    document.dispatchEvent(
      mockMouseEvent("mousemove", {
        x: 50,
        y: 150,
      })
    );
  });

  it("should send touch pan events", (done) => {
    const panEl = mockPanElement();

    subscription = enablePanning(panEl).subscribe((pan) => {
      expect(pan).toEqual({ x: -50, y: 50 });
      done();
    });

    panEl.dispatchEvent(new TouchEvent("touchstart"));

    document.dispatchEvent(
      mockTouchEvent("touchmove", {
        x: 100,
        y: 100,
      })
    );
    document.dispatchEvent(
      mockTouchEvent("touchmove", {
        x: 50,
        y: 150,
      })
    );
  });

  it("should set document as not selectable", () => {
    const panEl = mockPanElement();

    subscription = enablePanning(panEl).subscribe();

    panEl.dispatchEvent(new MouseEvent("mousedown"));

    expect(document.body.style.userSelect).toBe("none");

    document.dispatchEvent(new MouseEvent("mouseup"));

    expect(document.body.style.userSelect).toBeFalsy();
  });

  it("should stop after unsubscribe", () => {
    const panEl = mockPanElement();

    subscription = enablePanning(panEl).subscribe(() => {
      fail("Panning not stopped");
    });

    panEl.dispatchEvent(new TouchEvent("touchstart"));

    subscription.unsubscribe();

    document.dispatchEvent(
      mockTouchEvent("touchmove", {
        x: 100,
        y: 100,
      })
    );
    document.dispatchEvent(
      mockTouchEvent("touchmove", {
        x: 50,
        y: 150,
      })
    );
  });

  afterEach(() => {
    subscription?.unsubscribe();
  });

  function mockMouseEvent(type: string, v: Vector2) {
    const event = new MouseEvent(type, {
      clientX: v.x,
      clientY: v.y,
    });

    (event as any).pageX = v.x;
    (event as any).pageY = v.y;
    return event;
  }

  function mockTouchEvent(type: string, v: Vector2) {
    const event = new TouchEvent(type, {
      touches: [{} as Touch],
    });

    (event.touches[0] as any).pageX = v.x;
    (event.touches[0] as any).pageY = v.y;
    return event;
  }

  function mockPanElement() {
    const div = document.createElement("div");
    return div;
  }
});
