import { Observable, Operator, Subscription } from "../observable";

export function switchMap<A, B>(
  project: (next: A) => Observable<B>
): Operator<A, B> {
  return (observable) =>
    new Observable((subscriber) => {
      let projectSubscription: Subscription | null = null;

      const subscription = observable.subscribe({
        next: (value) => {
          projectSubscription?.unsubscribe();
          projectSubscription = project(value).subscribe(subscriber);
        },
        error: () => {},
        complete: () => projectSubscription?.unsubscribe(),
      });

      return () => {
        subscription.unsubscribe();
      };
    });
}

export function switchMapTo<A, B>(project: Observable<B>): Operator<A, B> {
  return (observable) =>
    new Observable((subscriber) => {
      let projectSubscription: Subscription | null = null;

      const subscription = observable.subscribe({
        next: () => {
          projectSubscription?.unsubscribe();
          projectSubscription = project.subscribe(subscriber);
        },
        error: () => {},
        complete: () => projectSubscription?.unsubscribe(),
      });

      return () => {
        subscription.unsubscribe();
      };
    });
}
