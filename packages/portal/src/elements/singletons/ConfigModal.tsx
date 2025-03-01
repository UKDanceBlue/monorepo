import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select, Switch } from "antd";
import { DateTime } from "luxon";
import { useContext } from "react";

import { marathonContext } from "#config/marathonContext.js";
import { StorageManager, useStorageValue } from "#config/storage.js";
import { graphql } from "#gql/index.js";
import { useTypedCustomQuery } from "#hooks/refine/custom.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

import { MasqueradeSelector } from "./MasqueradeSelector.js";

export const ConfigModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const canMasquerade = useAuthorizationRequirement("manage", "all");
  const [masquerade, setMasquerade] = useStorageValue(
    StorageManager.Local,
    StorageManager.keys.masquerade
  );
  const [dark, setDark] = useStorageValue(
    StorageManager.Local,
    StorageManager.keys.darkMode
  );

  const { setMarathon, marathon, loading, marathons } =
    useContext(marathonContext);

  const { data } = useTypedCustomQuery({
    document: graphql(/* GraphQL */ `
      query GetBuildDate {
        buildTimestamp
      }
    `),
    props: {
      queryOptions: {
        enabled: open,
      },
    },
  });

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Settings">
      <Form layout="vertical">
        <Form.Item label="Select Marathon">
          <Select
            defaultValue={""}
            onChange={(value) => setMarathon(value)}
            loading={loading}
            value={marathon?.id}
            title="Set Marathon"
            allowClear
            onClear={() => setMarathon(null)}
          >
            {marathons ? (
              marathons.map((marathon) => (
                <Select.Option key={marathon.id} value={marathon.id}>
                  {marathon.year}
                </Select.Option>
              ))
            ) : (
              <Select.Option key="" value="" disabled>
                Loading...
              </Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item label="Dark Mode">
          <Switch
            checked={dark === "true"}
            onChange={(value) => setDark(value ? "true" : "false")}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Form.Item>
        <Form.Item label="Masquerade">
          {masquerade ? (
            <Button
              onClick={() => {
                setMasquerade(null);
                window.location.reload();
              }}
              type="text"
              style={{ color: "inherit" }}
            >
              Stop Masquerading
            </Button>
          ) : canMasquerade ? (
            <div style={{ padding: "0 1ch" }}>
              <MasqueradeSelector />
            </div>
          ) : null}
        </Form.Item>
      </Form>
      {data?.data.buildTimestamp && (
        <div>
          <p>
            Build Date:{" "}
            {DateTime.fromISO(data.data.buildTimestamp).toLocaleString(
              DateTime.DATETIME_SHORT
            )}
          </p>
        </div>
      )}
    </Modal>
  );
};
