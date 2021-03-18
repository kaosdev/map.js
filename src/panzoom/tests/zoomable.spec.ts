import { ObservableExpectation } from "../../tests/expectObservable";
import { enableZoom } from "../zoomable";

describe("zoomable", () => {
  it("should zoom with wheel", async () => {
    const zoomEl = mockZoomElement();

    await new ObservableExpectation<number>(enableZoom(zoomEl), (e, v) =>
      expect(e).toBeCloseTo(v)
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

    await new ObservableExpectation<number>(enableZoom(zoomEl), (e, v) =>
      expect(e).toBeCloseTo(v, 1)
    )
      .withActions(() => {
        zoomEl.dispatchEvent(
          new TouchEvent("touchstart", { touches: [{}, {}] } as any)
        );

        zoomEl.dispatchEvent(
          new TouchEvent("touchmove", {
            touches: [
              {
                pageX: 100,
                pageY: 50,
              } as any,
              {
                pageX: 50,
                pageY: 100,
              } as any,
            ],
          })
        );

        zoomEl.dispatchEvent(
          new TouchEvent("touchmove", {
            touches: [
              {
                pageX: 50,
                pageY: 100,
              } as any,
              {
                pageX: 50,
                pageY: 100,
              } as any,
            ],
          })
        );
      })
      .toEmitValues(0.64);
  });

  function mockZoomElement() {
    const div = document.createElement("div");
    return div;
  }
});
