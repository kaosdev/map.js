import { ObservableExpectation } from "../../tests/expectObservable";
import { dispatchTouchEvent } from "../../tests/mock-touch-event";
import { Zoomable } from "../zoomable";

describe("zoomable", () => {
  it("should zoom with wheel", async () => {
    const zoomEl = mockZoomElement();

    console.log("STARt");
    await new ObservableExpectation<number>(
      Zoomable.enableZoom(zoomEl),
      (e, v) => expect(e).toBeCloseTo(v)
    )
      .withActions(() => {
        zoomEl.dispatchEvent(
          new WheelEvent("wheel", { ctrlKey: true, deltaY: 1 })
        );

        zoomEl.dispatchEvent(
          new WheelEvent("wheel", { ctrlKey: true, deltaY: -1 })
        );
      })
      .toEmitValues(0.9, 0.99);
  });

  it("should zoom with pinch", async () => {
    const zoomEl = mockZoomElement();

    await new ObservableExpectation<number>(
      Zoomable.enableZoom(zoomEl),
      (e, v) => expect(e).toBeCloseTo(v, 1)
    )
      .withActions(() => {
        dispatchTouchEvent(zoomEl, "touchstart", [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ]);

        dispatchTouchEvent(zoomEl, "touchmove", [
          { x: 100, y: 50 },
          { x: 50, y: 100 },
        ]);

        dispatchTouchEvent(zoomEl, "touchmove", [
          { x: 50, y: 100 },
          { x: 50, y: 100 },
        ]);
      })
      .toEmitValues(0.64);
  });

  function mockZoomElement() {
    const div = document.createElement("div");
    return div;
  }
});
