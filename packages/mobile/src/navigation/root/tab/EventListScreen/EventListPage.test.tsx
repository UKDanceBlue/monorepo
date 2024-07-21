import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { renderWithNativeBase } from "../../../../../test-helpers/NativeBase";

import { EventListPage } from "./EventListPage";

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
