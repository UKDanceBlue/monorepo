import { MembershipPositionType } from "@ukdanceblue/common";
import type { FormInstance } from "antd";
import { Button, Form, Modal, Select, Typography } from "antd";
import { useRef } from "react";

export function AssignToTeamPopup({
  person,
  teamName,
  onClose,
  onSubmit,
}: {
  person: {
    uuid: string;
    name: string | undefined;
    linkblue: string | undefined;
  } | null;
  teamName: string;
  onClose: () => void;
  onSubmit: (type: MembershipPositionType) => void;
}) {
  const formRef = useRef<FormInstance>(null);
  return (
    <Modal
      title="Assign to Team"
      open={person != null}
      onCancel={onClose}
      footer={null}
      afterOpenChange={(open) => {
        if (!open) {
          formRef.current?.resetFields();
        }
      }}
    >
      <Typography.Paragraph>
        Are you sure you want to assign{" "}
        {person?.name ?? person?.linkblue ?? "this person"} to {teamName}? If
        so, please select their position.
      </Typography.Paragraph>
      <Form
        onFinish={({ position }: { position: MembershipPositionType }) => {
          onSubmit(position);
        }}
        ref={formRef}
      >
        <Form.Item
          label="Position"
          name="position"
          rules={[{ required: true, message: "Please select a position" }]}
        >
          <Select>
            <Select.Option value={MembershipPositionType.Captain}>
              Captain
            </Select.Option>
            <Select.Option value={MembershipPositionType.Member}>
              Member
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", gap: "1em", justifyContent: "end" }}>
            <Button type="primary" htmlType="submit">
              Assign
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
