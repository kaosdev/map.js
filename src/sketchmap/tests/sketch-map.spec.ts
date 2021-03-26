import { SketchMap } from "../sketch-map";
describe("SketchMap", () => {
  it("should create base elements", () => {
    const wrapper = mockWrapper();

    new SketchMap(wrapper, {
      labels: [],
      arrows: [],
      width: 512,
    });

    expect(wrapper.childElementCount).toBe(2);
  });

  it("should create a label", () => {
    const wrapper = mockWrapper();

    new SketchMap(wrapper, {
      labels: [
        {
          id: "label1",
          content: "Label 1",
          top: 10,
          left: 20,
          width: 30,
          height: 40,
        },
      ],
      arrows: [],
      width: 512,
    });

    const label1 = wrapper.querySelector<HTMLElement>("#label-label1")!!;
    expect(label1).toBeTruthy();
    expect(label1.style.top).toBe("10px");
    expect(label1.style.left).toBe("20px");
    expect(label1.style.width).toBe("30px");
    expect(label1.style.height).toBe("40px");
  });

  it("should create an arrow between 2 labels", () => {
    const wrapper = mockWrapper();

    new SketchMap(wrapper, {
      labels: [
        {
          id: "label1",
          content: "Label 1",
          top: 10,
          left: 20,
          width: 30,
          height: 40,
        },
        {
          id: "label2",
          content: "Label 2",
          top: 40,
          left: 20,
          width: 30,
          height: 40,
        },
      ],
      arrows: [
        {
          from: "label1",
          fromDir: "bottom",
          to: "label2",
          toDir: "top",
        },
      ],
      width: 512,
    });

    const arrow = wrapper.querySelector("#arrow-label1__label2")!!;
    expect(arrow).toBeTruthy();
  });

  function mockWrapper() {
    return document.createElement("div");
  }
});
