import { Observable, Operator } from "../observable";

export function takeUntil<A>(notifier: Observable<unknown>): Operator<A, A> {
  return (observable) =>
    new Observable((subsriber) => {
      const sub = observable.subscribe(subsriber);

      const notifierSub = notifier.subscribe(() => {
        sub.unsubscribe();
        notifierSub.unsubscribe();
      });

      return () => {
        sub.unsubscribe();
        notifierSub.unsubscribe();
      };
    });
}
