import { Subscription } from "../../reactive/observable";
import { dispatchTouchEvent } from "../../tests/mock-touch-event";
import { Vector2 } from "../../vector/vector2";
import { Pannable } from "../pannable";

describe("pannable", () => {
  let subscription: Subscription | null = null;

  it("should send mouse pan events", (done) => {
    const panEl = mockPanElement();

    subscription = Pannable.enablePanning(panEl).subscribe((pan) => {
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

    subscription = Pannable.enablePanning(panEl).subscribe((pan) => {
      expect(pan).toEqual({ x: -50, y: 50 });
      done();
    });

    dispatchTouchEvent(panEl, "touchstart", [{ x: 0, y: 0 }]);

    dispatchTouchEvent(document, "touchmove", [{ x: 100, y: 100 }]);

    dispatchTouchEvent(document, "touchmove", [{ x: 50, y: 150 }]);
  });

  it("should set document as not selectable", () => {
    const panEl = mockPanElement();

    subscription = Pannable.enablePanning(panEl).subscribe();

    panEl.dispatchEvent(new MouseEvent("mousedown"));
    document.dispatchEvent(new MouseEvent("mousemove"));

    expect(document.body.style.userSelect).toBe("none");

    document.dispatchEvent(new MouseEvent("mouseup"));

    expect(document.body.style.userSelect).toBeFalsy();
  });

  it("should stop after unsubscribe", () => {
    const panEl = mockPanElement();

    const completeSpy = jasmine.createSpy();

    subscription = Pannable.enablePanning(panEl).subscribe({
      next: () => {
        fail("Panning not stopped");
      },
      error: () => {},
      complete: completeSpy,
    });

    dispatchTouchEvent(panEl, "touchstart", [{ x: 0, y: 0 }]);

    subscription.unsubscribe();

    dispatchTouchEvent(panEl, "touchstart", [{ x: 100, y: 100 }]);
    dispatchTouchEvent(panEl, "touchstart", [{ x: 50, y: 150 }]);

    expect(completeSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    subscription?.unsubscribe();
  });

  function mockMouseEvent(type: string, v: Vector2) {
    const event = new MouseEvent(type, {
      clientX: v.x,
      clientY: v.y,
      pageX: v.x,
      pageY: v.y,
    } as any);

    return event;
  }

  function mockPanElement() {
    const div = document.createElement("div");
    return div;
  }
});
