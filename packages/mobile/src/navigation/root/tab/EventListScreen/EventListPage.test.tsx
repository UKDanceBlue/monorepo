import { DateTime } from "luxon";

import { renderWithNativeBase } from "../../../../../test-helpers/NativeBase";

import { EventListPage } from "./EventListPage";

describe("<EventListPage />", () => {
  test("renders correctly", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tree = renderWithNativeBase(
      <EventListPage
        refreshing={false}
        refresh={() => Promise.resolve()}
        eventsByMonth={{}}
        marked={{}}
        tryToNavigate={() => undefined}
        month={DateTime.fromObject({ year: 2021, month: 1 })}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
