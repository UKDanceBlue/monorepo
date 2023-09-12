// Seems like this file may be unnecessary and can probably be deleted, but leaving it here for now

export type BodyArrayKey<
  T extends string,
  Suffix extends string = ""
> = `${T}[${number}]${Suffix extends "" ? "" : `.${Suffix}`}`;

/**
 * Checks if a key is a body array key.
 *
 * @param key The key to check (i.e. "value[0]")
 * @param keyText The key's base text (i.e. "value" for "value[0]")
 * @return True if the key is a body array key
 */
export function isBodyArrayKey<T extends string>(
  key: string,
  keyText: T
): key is BodyArrayKey<T> {
  return /^\w+\[\d+]$/.test(key) && key.startsWith(`${keyText}[`);
}

/**
 * Gets the index of a body array key.
 *
 * @param key The key to get the index of (i.e. "value[241]")
 * @return The index of the key (i.e. 241), or null if the key is invalid
 */
export function getBodyArrayIndex<T extends string>(
  key: BodyArrayKey<T>
): number | null {
  const index = Number.parseInt(key.slice(key.indexOf("[") + 1, -1), 10);
  return Number.isNaN(index) ? null : index;
}

/**
 *
 * @param keyText The key's base text (i.e. "value" for "value[0]")
 * @param body The body to check
 * @param callback The callback to call for each value
 */
export function doForEachBodyArrayKey<
  const KeyType extends string,
  const ValueType,
  const BodyType extends Record<BodyArrayKey<KeyType>, ValueType>
>(
  keyText: KeyType,
  body: BodyType,
  callback: (value: ValueType) => void
): void {
  for (const key of Object.keys(body)) {
    if (!key.startsWith("eventOccurrence[")) {
      continue;
    }

    const eventOccurrenceIndex = Number.parseInt(key.slice(16, -1), 10);

    const eventOccurrence = body[`${keyText}[${eventOccurrenceIndex}]`];
    if (!eventOccurrence) {
      throw new Error("Invalid key for event occurrence");
    }

    callback(eventOccurrence);
  }
}

/**
 * Converts a body array to an array.
 *
 * @param keyText The key's base text (i.e. "value" for "value[0]")
 * @param body The body to convert
 * @param conversionFunction The function to convert each value
 * @return The converted array
 */
export function bodyArrayToArray<
  const KeyType extends string,
  const ValueType,
  const BodyType extends Record<BodyArrayKey<KeyType>, ValueType>,
  const ReturnType
>(
  keyText: KeyType,
  body: BodyType,
  conversionFunction: (value: ValueType) => ReturnType
): ReturnType[] {
  const result: ReturnType[] = [];

  doForEachBodyArrayKey<KeyType, ValueType, BodyType>(
    keyText,
    body,
    (value) => {
      result.push(conversionFunction(value));
    }
  );

  return result;
}
