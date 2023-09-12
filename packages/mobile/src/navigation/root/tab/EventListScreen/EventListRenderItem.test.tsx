import { fireEvent } from "@testing-library/react-native";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";

import { renderWithNativeBase } from "../../../../../test-helpers/NativeBase";

import { EventListRenderItem } from "./EventListRenderItem";

describe("<EventListRenderItem />", () => {
  const testEvent = new FirestoreEvent(
    "test",
    "test",
    "test"
  );
  const tryToNavigate = jest.fn();

  const tree = renderWithNativeBase(<EventListRenderItem
    dayIndexesRef={{ current: {} }}
    index={0}
    item={testEvent}
    tryToNavigate={tryToNavigate}
  />);

  it("calls tryToNavigate when pressed", () => {
    expect(tree.queryByTestId("event-list-row-0-touchable")).not.toBeNull();
    fireEvent.press(tree.queryByTestId("event-list-row-0-touchable"));
    expect(tryToNavigate).toHaveBeenCalledWith(testEvent);
  });

  it("renders correctly", () => {
    expect(tree).toMatchSnapshot();
  });
});
