export function arrayIntersperse<T>(array: T[], insertedElement: T): T[] {
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
    if (i !== array.length - 1) {
      result.push(insertedElement);
    }
  }

  return result;
}
