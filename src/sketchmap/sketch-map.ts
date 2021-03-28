import { html, render, TemplateResult } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { until } from "lit-html/directives/until";
import { panzoom, PanZoom } from "../panzoom/panzoom";
import { Observable, Subscription } from "../reactive/observable";
import { Subject } from "../reactive/subject";
import {
  deltaTransform,
  getElementTransform,
  toCSSTransform,
  Transform2,
} from "../transform/transform2";
import { keyBy, tryQuerySelector } from "../utils";
import { Vector2 } from "../vector/vector2";

const TEMPLATE = `
<div class="roadmap__graph"></div>

<div class="roadmap__card">
  <button class="roadmap__card__close" aria-label="Close Card">
    <span class="fa fa-times fa-2x"></span>
  </button>

  <div class="roadmap__card__content"></div>
</div>
`;

export class SketchMap {
  constructor(
    private readonly wrapper: HTMLElement,
    private readonly data: RoadmapData
  ) {
    this.wrapper.innerHTML = TEMPLATE;
    this.card = tryQuerySelector(".roadmap__card", this.wrapper);
    this.container = tryQuerySelector(".roadmap__graph", this.wrapper);

    this.labelsById = keyBy(data.labels, (l) => l.id);

    this.arrows = data.arrows.map((a) => {
      const fromEl = this.labelsById[a.from];
      const toEl = this.labelsById[a.to];

      if (!fromEl) {
        throw Error(`Cannot find fromEl: ${a.from}`);
      }
      if (!toEl) {
        throw Error(`Cannot find toEl: ${a.to}`);
      }

      return {
        ...a,
        fromEl,
        toEl,
        active: false,
      };
    });

    this.labels = [...data.labels];

    this.render();

    this.enablePanZoom();
  }

  private readonly card: HTMLElement;
  private readonly container: HTMLElement;

  private labelsById: Record<string, RoadmapLabel> = {};
  private labels: RoadmapLabel[] = [];
  private arrows: RoadmapArrow[] = [];

  private panzoomSub: Subscription | null = null;
  private currentPanZoom: PanZoom | null = null;

  private clickLabelSubject = new Subject<RoadmapLabel>();
  private closeCardSubject = new Subject<RoadmapLabel>();

  render() {
    const templateRes = html`
      ${this.arrows.map((a) => this.renderArrow(a))}
      ${this.labels.map((label) => this.renderLabel(label))}
    `;

    render(templateRes, this.container);
  }

  private highlightConnections(label: RoadmapLabel, active = true) {
    let changed = false;
    this.arrows = this.arrows.map((arrow) => {
      if (arrow.from !== label.id) {
        return arrow;
      }

      changed = true;

      return {
        ...arrow,
        active,
      };
    });

    if (changed) {
      this.render();
    }
  }

  private renderLabel(label: RoadmapLabel): TemplateResult {
    const { width, height, top, left } = label;

    const onClick: () => void = () => {
      this.clickLabelSubject.next(label);
    };

    return html`
      <button
        id="label-${label.id}"
        class="${classMap({
          roadmap__label: true,
          "roadmap__label--primary": label.style === "primary",
          "roadmap__label--secondary": label.style === "secondary",
          "roadmap__label--outline": label.style === "outline",
        })}"
        style="${styleMap({
          top: top + "px",
          left: left + "px",
          width: width + "px",
          height: height + "px",
        })}"
        @focusin=${() => this.highlightConnections(label)}
        @focusout=${() => this.highlightConnections(label, false)}
        @click=${onClick}
      >
        ${label.content}
      </button>
    `;
  }

  labelClick(): Observable<RoadmapLabel> {
    return this.clickLabelSubject;
  }

  closeCard(): Observable<RoadmapLabel> {
    return this.closeCardSubject;
  }

  openLabel(id: string) {
    const label = this.labelsById[id];

    if (!label) {
      throw Error("Cannot find label with id " + id);
    }

    const labelElement = tryQuerySelector<HTMLElement>(
      `#label-${id}`,
      this.container
    );

    if (!label.fullContent) {
      throw Error(`Label with id ${id} does not have full content`);
    }

    this.container.childNodes.forEach(
      (e) => e instanceof HTMLElement && e.setAttribute("tabindex", "-1")
    );
    this.disablePanZoom();

    const animation = new RoadmapCardAnimation(labelElement, label, this.card);
    animation.play();
    const close = tryQuerySelector(".roadmap__card__close", this.card);
    close.addEventListener(
      "click",
      () => {
        this.enablePanZoom();
        this.container.childNodes.forEach(
          (e) => e instanceof HTMLElement && e.removeAttribute("tabindex")
        );
        animation.reverse();
        this.closeCardSubject.next(label);
      },
      { once: true }
    );
  }

  closeCurrentLabel() {
    const close = tryQuerySelector<HTMLElement>(
      ".roadmap__card__close",
      this.card
    );
    close.click();
  }

  private renderArrow(arrow: RoadmapArrow): TemplateResult {
    const v1 = this.getConnectionPoint(arrow.fromDir, arrow.fromEl);
    const v2 = this.getConnectionPoint(arrow.toDir, arrow.toEl);
    const h = Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    const rot = this.getRotation(v1, v2);

    return html`
      <div
        id="arrow-${arrow.from}__${arrow.to}"
        class=${classMap({
          roadmap__arrow: true,
          "roadmap__arrow--dotted": arrow.style === "dotted",
          "roadmap__arrow--secondary": arrow.style === "secondary",
          "roadmap__arrow--active": arrow.active,
        })}
        style="top: ${v1.y}px; left: ${v1.x}px; height: ${h}px; transform: rotate(${rot}rad)"
      ></div>
    `;
  }

  private getConnectionPoint(
    dir: ConnectionDir,
    { top, left, width, height }: RoadmapLabel
  ): Vector2 {
    switch (dir) {
      case "left":
        return { x: left, y: top + height / 2 };
      case "right":
        return { x: left + width, y: top + height / 2 };
      case "top":
        return { x: left + width / 2, y: top };
      case "bottom":
        return { x: left + width / 2, y: top + height };
    }
  }

  private getRotation(v1: Vector2, v2: Vector2): number {
    const dx = v1.x - v2.x;
    const dy = v2.y - v1.y;
    const rads = Math.atan2(dx, dy);
    return rads;
  }

  private enablePanZoom() {
    const WRAPPER_WIDTH = this.wrapper.offsetWidth;

    const options: PanZoom = this.currentPanZoom || {
      pan: { x: -(this.data.width - WRAPPER_WIDTH) * 0.5, y: 0 },
      zoom: 1,
    };

    this.panzoomSub = panzoom(this.wrapper, this.container, options).subscribe(
      (panzoom) => {
        this.currentPanZoom = panzoom;
      }
    );
  }

  private disablePanZoom() {
    this.panzoomSub?.unsubscribe();
  }
}

export interface RoadmapData {
  labels: RoadmapLabelDef[];
  arrows: RoadmapArrowDef[];
  width: number;
}

export interface RoadmapLabelDef {
  id: string;
  content: unknown;
  top: number;
  left: number;
  width: number;
  height: number;
  fullContent?: () => Promise<TemplateResult>;
  style?: "primary" | "secondary" | "outline";
}

export type ConnectionDir = "left" | "right" | "top" | "bottom";

export interface RoadmapArrowDef {
  fromDir: ConnectionDir;
  from: string;
  toDir: ConnectionDir;
  to: string;
  style?: "dotted" | "secondary";
}

interface RoadmapLabel extends RoadmapLabelDef {}

interface RoadmapArrow extends RoadmapArrowDef {
  fromEl: RoadmapLabel;
  toEl: RoadmapLabel;
  active: boolean;
}

const ROADMAP_CARD_VISIBLE = "roadmap__card--visible";

class RoadmapCardAnimation {
  constructor(
    private readonly labelEl: HTMLElement,
    private readonly label: RoadmapLabel,
    private readonly card: HTMLElement
  ) {
    this.content = tryQuerySelector(".roadmap__card__content", this.card);
    this.makeVisible();
    this.first = getElementTransform(this.labelEl);
    this.last = getElementTransform(this.card);
    this.delta = deltaTransform(this.first, this.last);
    this.makeInvisible();
  }

  private readonly first: Transform2;
  private readonly last: Transform2;
  private readonly delta: Transform2;

  private readonly content: HTMLElement;

  makeVisible() {
    this.card.classList.add(ROADMAP_CARD_VISIBLE);
  }

  makeInvisible() {
    this.card.classList.remove(ROADMAP_CARD_VISIBLE);
  }

  play() {
    this.makeVisible();
    this.content.style.opacity = "1";
    this.card.scrollTop = 0;

    this.renderCardContent();

    this.content.animate(
      [
        {
          transform: `translate(0, ${this.last.scale.y}px)`,
          opacity: 0,
        },
        {
          offset: 0.5,
        },
        {
          transform: `none`,
          opacity: 1,
        },
      ],
      { duration: 420, easing: "ease-in" }
    );

    this.card.animate(
      [
        {
          transformOrigin: "0 0",
          transform: toCSSTransform(this.delta),
        },
        {
          transformOrigin: "0 0",
          transform: "none",
        },
      ],
      { duration: 220, easing: "ease-in" }
    );
  }

  reverse() {
    this.content.style.opacity = "0";
    this.content.animate(
      [
        {
          transform: `none`,
          opacity: 1,
        },
        {
          transform: `translate(0, ${this.last.scale.y}px)`,
          opacity: 0,
        },
      ],
      { duration: 220, easing: "ease-out" }
    );

    this.card
      .animate(
        [
          {
            transformOrigin: "0 0",
            transform: "none",
          },
          {
            transformOrigin: "0 0",
            transform: toCSSTransform(this.delta),
          },
        ],
        { duration: 220, easing: "ease-out", delay: 120 }
      )
      .finished.then(() => this.makeInvisible());
  }

  private renderCardContent() {
    render(this.cardTemplate(), this.content);
  }

  private cardTemplate() {
    return html` ${until(this.label.fullContent?.())} `;
  }
}
