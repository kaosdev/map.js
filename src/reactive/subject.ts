import { NextOrSubscriber, Observable, Subscriber } from "./observable";

export class Subject<T> extends Observable<T> implements Subscriber<T> {
  constructor() {
    super((subscriber) => {});
  }

  private observers: Subscriber<T>[] = [];

  subscribe(partial: NextOrSubscriber<T>) {
    const subscriber = this.asSubscriber(partial);
    this.observers = [...this.observers, subscriber];

    return {
      unsubscribe: () =>
        (this.observers = this.observers.filter((o) => o !== subscriber)),
    };
  }

  next(value: T): void {
    for (const o of this.observers) {
      o.next(value);
    }
  }

  error(err: any): void {
    for (const o of this.observers) {
      o.error(err);
    }
  }

  complete(): void {
    for (const o of this.observers) {
      o.complete();
    }
  }
}
