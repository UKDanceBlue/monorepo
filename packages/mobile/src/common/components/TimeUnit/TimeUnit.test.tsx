import TimeUnit from ".";

import { renderWithNativeBase } from "../../../../test-helpers/NativeBase";

import { describe, expect, it, vitest } from "vitest";

describe("<TimeUnit />", () => {
  it("renders 0 with a negative value", () => {
    const tree = renderWithNativeBase(<TimeUnit value={-1} unit={"sec"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("sec");
    expect(unitElement).toHaveLength(1);
  });

  it("renders 0 with a nullish value", () => {
    // @ts-expect-error Testing nullish values
    const tree = renderWithNativeBase(<TimeUnit value={null} unit={"sec"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("sec");
    expect(unitElement).toHaveLength(1);
  });

  it("throws when passed an invalid type", () => {
    const mockedConsoleError = vitest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const invalidUnit = "an invalid unit";
    expect(() =>
      // @ts-expect-error Testing an invalid unit
      renderWithNativeBase(<TimeUnit value={1} unit={invalidUnit} />)
    ).toThrow(`Invalid unit: ${invalidUnit}`);

    mockedConsoleError.mockRestore();
  });

  it("renders correctly with a singular unit", () => {
    const tree = renderWithNativeBase(
      <TimeUnit value={1} unit={"sec"} />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
  it("renders correctly with a plural unit", () => {
    const tree = renderWithNativeBase(
      <TimeUnit value={10} unit={"sec"} />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
});
