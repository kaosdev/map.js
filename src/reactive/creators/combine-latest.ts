/* import { keysOf } from "@scripts/utils";
import { Observable } from "../observable";

export type ToObservableMap<Map extends Record<string, any>> = {
  [K in keyof Map]: Observable<Map[K]>;
};

export function combineLatest<Map extends Record<string, any>>(
  map: ToObservableMap<Map>
): Observable<Partial<Map>> {
  return new Observable((subscriber) => {
    let cache: Partial<Map> = {};

    const subscriptions = keysOf(map).map((key) => {
      return map[key].subscribe((value) => {
        cache = {
          ...cache,
          [key]: value,
        };

        subscriber.next(cache);
      });
    });

    return () => subscriptions.forEach((s) => s.unsubscribe());
  });
}
 */
