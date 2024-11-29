import { QuestionOutlined } from "@ant-design/icons";
import type { InputRef, TourProps } from "antd";
import {
  App,
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  InputNumber,
  Tour,
} from "antd";
import { useReducer, useRef, useState } from "react";

import type { FragmentOf } from "#graphql/index.js";
import { readFragment } from "#graphql/index.js";

import { PointEntryCreatorFragment } from "../../../../documents/pointEntry.js";
import { PointEntryOpportunityLookup } from "./PointEntryOpportunityLookup.js";
import { PointEntryPersonLookup } from "./PointEntryPersonLookup.js";
import { usePointEntryCreatorForm } from "./usePointEntryCreatorForm.js";

export function PointEntryCreator({
  team,
  refetch,
}: {
  team?: FragmentOf<typeof PointEntryCreatorFragment>;
  refetch: () => void;
}) {
  const { message } = App.useApp();

  const [tourVisible, setTourVisible] = useState(false);

  const commentFieldRef = useRef<InputRef>(null);
  const pointsFieldRef = useRef<HTMLInputElement>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const linkblueFieldRef = useRef<InputRef>(null);
  const selectedPersonRef = useRef<HTMLSpanElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps["steps"] = [
    {
      title: "Comment",
      description:
        "Enter a comment for the point entry, the comment is not shown anywhere outside of this page and is just for your reference.",
      target: commentFieldRef.current?.input ?? null,
    },
    {
      title: "Points",
      description: "Enter the number of points to give for the point entry.",
      target: pointsFieldRef.current ?? null,
    },
    {
      title: "Name",
      description:
        "If you know the name of the person that the point entry is for, you can search for them here. If they have signed in before their name will appear in the list. Click on their name to select them.",
      target: nameFieldRef.current,
    },
    {
      title: "Linkblue",
      description:
        "If you know the linkblue of the person that the point entry is for, you can enter it here. Click lookup to check for the person. If they have already been added to the system they will be selected automatically. Otherwise, a create button will appear that will allow you to create a new person with that linkblue.",
      target: linkblueFieldRef.current?.input ?? null,
    },
    {
      title: "Clear",
      description: "Click the clear button to clear the person selection.",
      target: clearButtonRef.current ?? null,
    },
    {
      title: "Selected person",
      description:
        "Once you have selected a person, their info will appear here.",
      target: selectedPersonRef.current ?? null,
    },
    {
      title: "Submit",
      description:
        "Once you have filled out the form, click the submit button to create the point entry.",
      target: submitButtonRef.current ?? null,
    },
  ];

  const teamData = readFragment(PointEntryCreatorFragment, team);

  const [personLookupKey, resetLookup] = useReducer(
    (prev: number) => prev + 1,
    0
  );
  const { formApi } = usePointEntryCreatorForm({
    teamUuid: teamData?.id ?? "",
    onReset: () => {
      resetLookup();
      // Delay refetching a bit to allow the form to reset
      setTimeout(() => {
        refetch();
      }, 75);
    },
  });

  return (
    <>
      <Tour
        steps={steps}
        placement="top"
        mask
        open={tourVisible}
        onClose={() => setTourVisible(false)}
      />
      <Form
        onFinish={() => {
          formApi.handleSubmit().catch((error: unknown) => {
            if (error instanceof Error) {
              void message.error(error.message);
            } else {
              void message.error("An unknown error occurred");
            }
          });
        }}
        wrapperCol={{ flex: 1 }}
        labelWrap
      >
        <formApi.Field
          name="comment"
          children={(field) => (
            <Form.Item
              label="Comment"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Input
                status={field.state.meta.errors.length > 0 ? "error" : ""}
                name={field.name}
                value={field.state.value ?? undefined}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                ref={commentFieldRef}
              />
            </Form.Item>
          )}
        />
        <Flex wrap="wrap" gap="10px">
          <formApi.Field
            name="points"
            validators={{
              onChange: ({ value }) =>
                !value ? "A point value is required" : undefined,
            }}
            children={(field) => (
              <Form.Item
                label="Points*"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <InputNumber
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(num) => field.handleChange(num ?? 0)}
                  ref={pointsFieldRef}
                />
              </Form.Item>
            )}
          />
          <PointEntryOpportunityLookup formApi={formApi} />
        </Flex>
        <PointEntryPersonLookup
          formApi={formApi}
          key={personLookupKey}
          nameFieldRef={nameFieldRef}
          linkblueFieldRef={linkblueFieldRef}
          selectedPersonRef={selectedPersonRef}
          clearButtonRef={clearButtonRef}
        />
        <formApi.Field name="shouldAddToTeam">
          {(field) => (
            <>
              <Form.Item label="Add this person to team">
                <formApi.Subscribe
                  selector={({ values }) => values.personFromUuid}
                >
                  {(personFromUuid) => (
                    <Checkbox
                      name={field.name}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val.target.checked)}
                      disabled={
                        !personFromUuid ||
                        !teamData?.members ||
                        teamData.members.some(
                          ({ person: { id } }) => id === personFromUuid
                        )
                      }
                    />
                  )}
                </formApi.Subscribe>
              </Form.Item>
            </>
          )}
        </formApi.Field>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Button type="primary" htmlType="submit" ref={submitButtonRef}>
            Submit
          </Button>
          <Button
            icon={<QuestionOutlined />}
            onClick={() => setTourVisible(true)}
          >
            Help
          </Button>
        </Flex>
      </Form>
    </>
  );
}
