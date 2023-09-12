import { render } from "@testing-library/react-native";

import CustomCalendar from "./Calendar";

describe("<Calendar />", () => {
  it("renders correctly", () => {
    const tree = render(<CustomCalendar initialDate="2000-01" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
