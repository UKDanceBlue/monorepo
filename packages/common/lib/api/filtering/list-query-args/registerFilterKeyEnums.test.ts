import { describe, vi } from "vitest";

const registerEnumType = vi.fn();

vi.doMock("type-graphql", () => ({
  registerEnumType,
}));

const { registerFilterKeyEnums } = await import("./registerFilterKeyEnums.js");

describe("registerFilterKeyEnums", (test) => {
  test("registers nothing when called empty", ({ expect }) => {
    registerFilterKeyEnums([], "Empty", [], [], [], [], []);
    expect(registerEnumType.mock.calls.length).toBe(0);
  });

  test("to register the correct names", ({ expect }) => {
    registerFilterKeyEnums(
      ["str", "oneOf", "num", "date", "bool"],
      "Test",
      ["str"],
      ["oneOf"],
      ["num"],
      ["date"],
      ["bool"]
    );
    expect(registerEnumType.mock.calls);
  });

  test("to register the correct names when only some are empty", ({
    expect,
  }) => {
    registerFilterKeyEnums(
      ["str", "oneOf", "num", "date", "bool"],
      "Test",
      [],
      ["oneOf"],
      [],
      ["date"],
      []
    );
    expect(registerEnumType.mock.calls).toMatchSnapshot();
  });
});
