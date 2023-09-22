import type { Primitive } from "./TypeUtils.js";

export function formDataToJson(
  formData: FormData,
  omitEmptyValues = true
): Record<string, Primitive | Primitive[]> {
  const json: Record<string, Primitive | Primitive[]> = {};

  for (const [key, value] of (formData as unknown as { entries: () => [string, string | Blob][] }).entries()) {
    if (omitEmptyValues && value === "") {
      continue;
    }

    if (value instanceof Blob) {
      throw new TypeError("Files are not supported by JSON.");
    }

    if (!Reflect.has(json, key)) {
      json[key] = value;
      continue;
    }

    if (!Array.isArray(json[key])) {
      json[key] = [json[key] as Primitive];
    }
    (json[key] as Primitive[]).push(value);
  }

  return json;
}
