import { renderWithNativeBase } from "../../../../test-helpers/NativeBase";

import Badge from "./Badge";

describe("<Badge />", () => {
  test("renders correctly", () => {
    const tree = renderWithNativeBase(
      <Badge imageURL="www.example.com" name="Test" />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
  test("renders correctly with no name", () => {
    const tree = renderWithNativeBase(
      <Badge imageURL="www.example.com" />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
});
