export function keyBy<T, K extends string | number | symbol>(
  collection: T[],
  iteratee: (value: T) => K
): Record<K, T> {
  return collection.reduce(
    (acc, value) => ({
      ...acc,
      [iteratee(value)]: value,
    }),
    {} as Record<K, T>
  );
}

export function getOrThrow<T>(value: T | null | undefined, error: Error): T {
  if (!value) {
    throw error;
  }

  return value;
}

export function tryQuerySelector<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T {
  return getOrThrow(
    parent.querySelector<T>(selector),
    Error(`Cannot find ${selector}`)
  );
}
