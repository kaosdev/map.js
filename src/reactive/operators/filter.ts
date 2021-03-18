import { Observable, Operator } from "../observable";

export function filter<A, B extends A>(
  predicate: ((next: A) => next is B) | ((next: A) => boolean)
): Operator<A, B> {
  return (observable) =>
    new Observable((subscriber) => {
      const subscription = observable.subscribe((value) => {
        if (predicate(value)) {
          subscriber.next(value);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    });
}
