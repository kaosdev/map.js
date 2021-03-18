import { Observable, Operator } from "../observable";

export function map<A, B>(project: (next: A) => B): Operator<A, B> {
  return (observable) =>
    new Observable((subscriber) => {
      const subscription = observable.subscribe((value) =>
        subscriber.next(project(value))
      );
      return () => {
        subscription.unsubscribe();
      };
    });
}
