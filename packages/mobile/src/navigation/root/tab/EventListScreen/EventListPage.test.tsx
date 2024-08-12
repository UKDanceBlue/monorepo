import { EventListPage } from "./EventListPage";

import { renderWithNativeBase } from "../../../../../test-helpers/NativeBase";

import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";



describe("<EventListPage />", () => {
  it("renders correctly", () => {
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
