import { Observable, Operator } from "../observable";

export function pair<A, B>(project: (values: [A, A]) => B): Operator<A, B> {
  return (observable) =>
    new Observable((subscriber) => {
      let hasPrev = false;
      let prev: A;

      const subscription = observable.subscribe((value) => {
        if (hasPrev) {
          subscriber.next(project([prev, value]));
        }

        prev = value;
        hasPrev = true;
      });
      return () => {
        subscription.unsubscribe();
      };
    });
}
