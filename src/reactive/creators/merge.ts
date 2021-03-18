import { Observable } from "../observable";

export function merge<T>(observables: Observable<T>[]): Observable<T> {
  return new Observable((subscriber) => {
    const subscriptions = observables.map((obs) => obs.subscribe(subscriber));
    return () => subscriptions.forEach((s) => s.unsubscribe());
  });
}
