import { Subject } from "../../reactive/subject";
import { ObservableExpectation } from "../../tests/expectObservable";
import { Vector2, ZERO } from "../../vector/vector2";
import { Pannable } from "../pannable";
import { PanZoom, panzoom } from "../panzoom";
import { Zoomable } from "../zoomable";

describe("panzoom", () => {
  let spies: jasmine.Spy<any>[] = [];

  it("should apply initial panzoom", async () => {
    const [wrapper, content] = mockPanzoomEnv();
    panzoom(wrapper, content, {
      pan: { x: 50, y: 10 },
      zoom: 0.5,
    });

    expectMatrix(content, { x: 50, y: 10 }, 0.5);
  });

  it("should change panzoom", async () => {
    const [wrapper, content] = mockPanzoomEnv();
    const [pan, zoom] = mockPanZoom();
    const panzoom$ = panzoom(wrapper, content, {
      pan: ZERO,
      zoom: 1,
    });

    const matcher = (expected: PanZoom, value: PanZoom) => {
      expect(expected).toEqual(value);
      expectMatrix(content, expected.pan, expected.zoom);
    };

    await new ObservableExpectation(panzoom$, matcher)
      .withActions(() => {
        pan.next({ x: 10, y: 50 });
        zoom.next(0.5);
      })
      .toEmitValues(
        {
          pan: { x: 10, y: 50 },
          zoom: 1,
        },
        {
          pan: { x: 10, y: 50 },
          zoom: 0.5,
        }
      );
  });

  afterEach(() => {
    spies.forEach((s) => s.calls.reset());
    spies = [];
  });

  function expectMatrix(el: HTMLElement, pan: Vector2, zoom: number) {
    expect(el.style.transform).toEqual(
      `matrix(${zoom}, 0, 0, ${zoom}, ${pan.x}, ${pan.y})`
    );
  }

  function mockPanZoom() {
    const rafSpy = spyOn(window, "requestAnimationFrame").and.callFake((c) => {
      c(0);
      return 0;
    });
    const panSubject = new Subject<Vector2>();
    const panSpy = spyOn(Pannable, "enablePanning").and.callFake(
      () => panSubject
    );

    const zoomSubject = new Subject<number>();
    const zoomSpy = spyOn(Zoomable, "enableZoom").and.callFake(
      () => zoomSubject
    );

    spies.push(rafSpy, panSpy, zoomSpy);
    return [panSubject, zoomSubject] as const;
  }

  function mockPanzoomEnv() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "512px";
    wrapper.style.height = "512px";

    const content = document.createElement("div");
    content.style.position = "absolute";
    content.style.width = "1024px";
    content.style.height = "1024px";

    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    return [wrapper, content];
  }
});
