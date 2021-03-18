import { Observable, Operator, Subscription } from "../observable";

export function throttle<A>(
  duration$: (next: A) => Observable<any>, 
): Operator<A, A> {
  return (observable) =>
    new Observable((subscriber) => {
      let durationSubscription: Subscription | undefined;
      let lastValue: A;

      const subscription = observable.subscribe((value) => {
        lastValue = value;

        if (durationSubscription) {
          return;
        }

        durationSubscription = duration$(value).subscribe(
          () => {
            durationSubscription = undefined;
            subscriber.next(lastValue)
          }
        );
      });

      return () => {
        durationSubscription?.unsubscribe();
        subscription.unsubscribe();
      };
    });
}
