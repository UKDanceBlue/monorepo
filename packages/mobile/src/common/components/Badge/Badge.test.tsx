import Badge from "./Badge";

import { renderWithNativeBase } from "../../../../test-helpers/NativeBase";

import { describe, expect, it } from "vitest";



describe("<Badge />", () => {
  it("renders correctly", () => {
    const tree = renderWithNativeBase(
      <Badge imageURL="www.example.com" name="Test" />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
  it("renders correctly with no name", () => {
    const tree = renderWithNativeBase(
      <Badge imageURL="www.example.com" />
    ).toJSON() as unknown;

    expect(tree).toMatchSnapshot();
  });
});
