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
    registerEnumType.mockClear();
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
    const expectedCalls = [
      [
        {
          bool: "bool",
          date: "date",
          num: "num",
          oneOf: "oneOf",
          str: "str",
        },
        {
          name: "TestAllKeys",
        },
      ],
      [
        {
          str: "str",
        },
        {
          name: "TestStringFilterKeys",
        },
      ],
      [
        {
          oneOf: "oneOf",
        },
        {
          name: "TestOneOfFilterKeys",
        },
      ],
      [
        {
          num: "num",
        },
        {
          name: "TestNumericFilterKeys",
        },
      ],
      [
        {
          date: "date",
        },
        {
          name: "TestDateFilterKeys",
        },
      ],
      [
        {
          bool: "bool",
        },
        {
          name: "TestBooleanFilterKeys",
        },
      ],
    ];
    expect(registerEnumType.mock.calls).toStrictEqual(expectedCalls);
    registerEnumType.mockClear();
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

    const expectedCalls = [
      [
        {
          bool: "bool",
          date: "date",
          num: "num",
          oneOf: "oneOf",
          str: "str",
        },
        {
          name: "TestAllKeys",
        },
      ],
      [
        {
          oneOf: "oneOf",
        },
        {
          name: "TestOneOfFilterKeys",
        },
      ],
      [
        {
          date: "date",
        },
        {
          name: "TestDateFilterKeys",
        },
      ],
    ];

    expect(registerEnumType.mock.calls).toStrictEqual(expectedCalls);
    registerEnumType.mockClear();
  });
});
