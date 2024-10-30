import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { AccessLevel, dateTimeFromSomething } from "@ukdanceblue/common";
import { Editable, useEditor } from "@wysimark/react";
import { Button, Input } from "antd";
import type { DateTime } from "luxon";
import { useMutation, useQuery } from "urql";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents";
import { TanAntForm } from "#elements/components/form/TanAntForm";
import type { TanAntChildInputProps } from "#elements/components/form/TanAntFormItem";
import { TanAntFormItem } from "#elements/components/form/TanAntFormItem";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";
import { routerAuthCheck } from "#tools/routerAuthCheck";

const editMarathonHourDataDocument = graphql(/* GraphQL */ `
  query EditMarathonHourData($marathonHourUuid: GlobalId!) {
    marathonHour(uuid: $marathonHourUuid) {
      details
      durationInfo
      shownStartingAt
      title
    }
  }
`);

const editMarathonHourDocument = graphql(/* GraphQL */ `
  mutation EditMarathonHour($input: SetMarathonHourInput!, $uuid: GlobalId!) {
    setMarathonHour(input: $input, uuid: $uuid) {
      id
    }
  }
`);

function EditMarathonHourPage() {
  const { hourId, marathonId } = Route.useParams();

  const [{ data, fetching, error }] = useQuery({
    query: editMarathonHourDataDocument,
    variables: { marathonHourUuid: hourId },
  });

  const { resetWatcher } = useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading marathon hour...",
  });

  const [{ fetching: saving, error: saveError }, editMarathonHour] =
    useMutation(editMarathonHourDocument);

  const { resetWatcher: resetSaveWatcher } = useQueryStatusWatcher({
    error: saveError,
    fetching: saving,
    loadingMessage: "Saving marathon hour...",
  });

  const navigate = useNavigate();

  const formApi = useForm<{
    details?: string | undefined;
    durationInfo: string;
    shownStartingAt: DateTime | undefined;
    title: string;
  }>({
    defaultValues: {
      details: data?.marathonHour.details ?? undefined,
      durationInfo: data?.marathonHour.durationInfo ?? "",
      shownStartingAt: dateTimeFromSomething(
        data?.marathonHour.shownStartingAt
      ),
      title: data?.marathonHour.title ?? "",
    },
    onSubmit: async ({ value: values }) => {
      if (!values.title) {
        return;
      }

      const shownStartingAt = values.shownStartingAt?.toISO();

      if (!shownStartingAt) {
        return;
      }

      const { data } = await editMarathonHour({
        input: {
          details: values.details ?? undefined,
          durationInfo: values.durationInfo,
          shownStartingAt,
          title: values.title,
        },
        uuid: hourId,
      });

      if (data) {
        resetWatcher();
        resetSaveWatcher();
        await navigate({
          to: "/marathon/$marathonId",
          params: { marathonId },
        });
      }
    },
  });

  const editor = useEditor({});

  return (
    <div>
      <TanAntForm handleSubmit={formApi.handleSubmit}>
        <TanAntFormItem
          label="Title"
          name="title"
          formApi={formApi}
          fieldProps={{
            validate: (value) => (value ? undefined : "Title is required"),
          }}
        >
          {({
            onBlur,
            onChange,
            value,
            status,
          }: TanAntChildInputProps<string>) => (
            <Input
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
              value={value}
              status={status}
              placeholder="Learning the Line Dance"
            />
          )}
        </TanAntFormItem>
        <TanAntFormItem
          label="Details"
          name="details"
          formApi={formApi}
          fieldProps={{}}
        >
          {({
            onChange,
            value,
            status,
          }: TanAntChildInputProps<string | undefined>) => (
            <>
              <Editable
                editor={editor}
                onChange={onChange}
                value={value ?? ""}
                placeholder="Hour instructions, etc."
              />
              {status && <div>{status}</div>}
            </>
          )}
        </TanAntFormItem>
        <TanAntFormItem
          label="Duration Info"
          name="durationInfo"
          formApi={formApi}
          fieldProps={{
            validate: (value) =>
              value ? undefined : "Duration Info is required",
          }}
        >
          {({
            onBlur,
            onChange,
            value,
            status,
          }: TanAntChildInputProps<string>) => (
            <Input
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
              value={value}
              status={status}
              placeholder="8pm-10pm"
            />
          )}
        </TanAntFormItem>
        <TanAntFormItem
          label="Shown Starting At"
          name="shownStartingAt"
          formApi={formApi}
          fieldProps={{
            validate: (value) =>
              value ? undefined : "Shown Starting At is required",
          }}
        >
          {({
            onBlur,
            onChange,
            value,
            status,
          }: TanAntChildInputProps<DateTime | undefined>) => (
            <LuxonDatePicker
              showTime
              onBlur={onBlur}
              onChange={(value) => onChange(value)}
              value={value}
              status={status}
              placeholder="2024-04-06 07:00:00"
              style={{ width: "100%" }}
            />
          )}
        </TanAntFormItem>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </TanAntForm>
    </div>
  );
}

export const Route = createFileRoute("/marathon/$marathonId/hours/$hourId/")({
  component: EditMarathonHourPage,
  beforeLoad({ context, params: { hourId } }) {
    context.urqlClient.query(editMarathonHourDataDocument, {
      marathonHourUuid: hourId,
    });
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});
