import { renderWithNativeBase } from "../../../../test-helpers/NativeBase";

import TimeUnit from ".";

describe("<TimeUnit />", () => {
  test("renders 0 with a negative value", () => {
    const tree = renderWithNativeBase(<TimeUnit value={-1} unit={"sec"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("sec");
    expect(unitElement).toHaveLength(1);
  });

  test("renders 0 with a nullish value", () => {
    // @ts-expect-error Testing nullish values
    const tree = renderWithNativeBase(<TimeUnit value={null} unit={"sec"} />);

    const valueElement = tree.queryAllByText("0");
    expect(valueElement).toHaveLength(1);

    const unitElement = tree.queryAllByText("sec");
    expect(unitElement).toHaveLength(1);
  });

  test("throws when passed an invalid type", () => {
    const mockedConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const invalidUnit = "an invalid unit";
    // @ts-expect-error Testing an invalid unit
    expect(() =>
      renderWithNativeBase(<TimeUnit value={1} unit={invalidUnit} />)
    ).toThrow(`Invalid unit: ${invalidUnit}`);

    mockedConsoleError.mockRestore();
  });

  test("renders correctly with a singular unit", () => {
    const tree = renderWithNativeBase(
      <TimeUnit value={1} unit={"sec"} />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
  test("renders correctly with a plural unit", () => {
    const tree = renderWithNativeBase(
      <TimeUnit value={10} unit={"sec"} />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
});
