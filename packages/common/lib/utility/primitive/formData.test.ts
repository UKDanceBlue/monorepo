import { describe, expect, it } from "vitest";

import { formDataToJson } from "./formData.js";

describe("formDataToJson", () => {
  it("should convert FormData to JSON object", () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("age", "30");

    const result = formDataToJson(formData);

    expect(result).toEqual({
      name: "John",
      age: "30",
    });
  });

  it("should omit empty values if omitEmptyValues is true", () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("emptyField", "");

    const result = formDataToJson(formData, true);

    expect(result).toEqual({
      name: "John",
    });
  });

  it("should include empty values if omitEmptyValues is false", () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("emptyField", "");

    const result = formDataToJson(formData, false);

    expect(result).toEqual({
      name: "John",
      emptyField: "",
    });
  });

  it("should throw an error if a file is included in FormData", () => {
    const formData = new FormData();
    formData.append("file", new Blob(["file content"], { type: "text/plain" }));

    expect(() => formDataToJson(formData)).toThrow(TypeError);
  });

  it("should handle multiple values for the same key", () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("name", "Doe");

    const result = formDataToJson(formData);

    expect(result).toEqual({
      name: ["John", "Doe"],
    });
  });
});
