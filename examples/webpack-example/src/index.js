import { Roadmap } from "map-js";
import "map-js/css/styles.css";

const wrapper = document.querySelector(".roadmap__wrapper");

const labels = [
  {
    id: "label1",
    content: "Label 1",
    top: 100,
    left: 100,
    width: 100,
    height: 35,
  },
  {
    id: "label2",
    content: `Label 2`,
    top: 150,
    left: 100,
    width: 100,
    height: 35,
    style: "secondary",
  },
];

const arrows = [
  {
    from: "label1",
    fromDir: "bottom",
    to: "label2",
    toDir: "top",
    style: "dotted",
  },
];

new Roadmap(wrapper, { labels, arrows, width: 512 });
