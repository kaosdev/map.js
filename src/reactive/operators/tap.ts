import { Observable, Operator } from "../observable";

export function tap<A>(callback: (next: A) => void): Operator<A, A> {
  return (observable) =>
    new Observable((subscriber) => {
      const subscription = observable.subscribe({
        next: (value) => {
          callback(value);
          subscriber.next(value);
        },
        error: (e) => subscriber.error(e),
        complete: () => subscriber.complete(),
      });
      return () => subscription.unsubscribe();
    });
}
