import { Observable } from "src/reactive/observable";

interface Matcher<T> {
  (expected: T, value: T): void;
}

export const EQUALITY_MATCHER: Matcher<any> = (expected, value) =>
  expect(expected).toEqual(value);

export class ObservableExpectation<T> {
  constructor(
    private readonly obs: Observable<T>,
    private readonly matchers: Matcher<T> | Matcher<T>[] = EQUALITY_MATCHER
  ) {}

  private actions: () => void | Promise<void> = () => {};

  withActions(actions: () => void | Promise<void>) {
    this.actions = actions;

    return this;
  }

  async toEmitValues(...values: T[]) {
    let index = 0;
    const finished = new Promise<void>((resolve) => {
      const sub = this.obs.subscribe((value) => {
        const expected = values[index];

        const matcher = this.getMatcher(index);
        matcher(expected, value);

        if (index >= values.length - 1) {
          sub.unsubscribe();
          resolve();
        }

        index++;
      });
    });

    const actionRes = this.actions();

    if (actionRes) {
      await actionRes;
    }

    await finished;
  }

  private getMatcher(index: number): Matcher<T> {
    if (typeof this.matchers === "function") {
      return this.matchers;
    }

    return this.matchers[index];
  }
}
