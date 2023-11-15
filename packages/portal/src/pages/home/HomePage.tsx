import { PointEntryCreator } from "@elements/forms/point-entry/create/PointEntryCreator";
import { Typography } from "antd";

export function HomePage() {
  return (
    <>
      <Typography.Title>
        Welcome to the DanceBlue online portal!
      </Typography.Title>
      <Typography.Paragraph>
        If you do not recognize this page, you may be looking for the{" "}
        <a href="https://www.danceblue.org">DanceBlue website</a> instead. This
        page is used for online access and entry to the DanceBlue database.
      </Typography.Paragraph>
      <PointEntryCreator teamUuid="cc48f134-a5f9-4bd1-b276-09c43364aa31" />
    </>
  );
}
