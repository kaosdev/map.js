import { Observable } from "../observable";

type EventNameMap<T> = T extends HTMLElement
  ? HTMLElementEventMap
  : T extends Document
  ? DocumentEventMap
  : any;

export function fromEvent<
  T extends EventTarget,
  K extends keyof EventNameMap<T>
>(element: T, eventName: K | K[]): Observable<EventNameMap<T>[K]> {
  return new Observable((sub) => {
    const callback = (ev: EventNameMap<T>[K]) => sub.next(ev);

    const events = Array.isArray(eventName) ? eventName : [eventName];

    events.forEach((name) =>
      element.addEventListener(name as string, callback)
    );

    return () =>
      events.forEach((name) =>
        element.removeEventListener(name as string, callback)
      );
  });
}
