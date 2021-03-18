export type NextOrSubscriber<T> = Subscriber<T>["next"] | Subscriber<T>;

export interface Subscriber<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}

export interface Teardown {
  (): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Operator<A, B> {
  (observable: Observable<A>): Observable<B>;
}

export class Observable<T> {
  constructor(
    protected readonly executor: (subscriber: Subscriber<T>) => Teardown | void
  ) {}

  subscribe(nextOrSubscriber?: NextOrSubscriber<T>): Subscription {
    const subscriber: Subscriber<T> = this.asSubscriber(nextOrSubscriber);

    const teardown = this.executor(subscriber) || null;

    return {
      unsubscribe: () => {
        subscriber.complete();
        teardown?.();
      },
    };
  }

  protected asSubscriber(nextOrSubscriber?: NextOrSubscriber<T>) {
    return typeof nextOrSubscriber === "function"
      ? {
          next: nextOrSubscriber,
          error: () => {},
          complete: () => {},
        }
      : typeof nextOrSubscriber === "undefined"
      ? {
          next: () => {},
          error: () => {},
          complete: () => {},
        }
      : nextOrSubscriber;
  }

  pipe<B1>(o1: Operator<T, B1>): Observable<B1>;
  pipe<B1, B2>(o1: Operator<T, B1>, o2: Operator<B1, B2>): Observable<B2>;
  pipe<B1, B2, B3>(
    o1: Operator<T, B1>,
    o2: Operator<B1, B2>,
    o3: Operator<B2, B3>
  ): Observable<B3>;
  pipe<B1, B2, B3, B4>(
    o1: Operator<T, B1>,
    o2: Operator<B1, B2>,
    o3: Operator<B2, B3>,
    o4: Operator<B3, B4>
  ): Observable<B4>;
  pipe<B1, B2, B3, B4, B5>(
    o1: Operator<T, B1>,
    o2: Operator<B1, B2>,
    o3: Operator<B2, B3>,
    o4: Operator<B3, B4>,
    o5: Operator<B4, B5>
  ): Observable<B5>;
  pipe(...operators: Operator<any, any>[]): Observable<any> {
    return operators.reduce(
      (obs: Observable<any>, operator) => operator(obs),
      this
    );
  }
}

export const EMPTY = new Observable<void>(() => {});
