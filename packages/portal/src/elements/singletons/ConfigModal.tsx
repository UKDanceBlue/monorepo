import { Action } from "@ukdanceblue/common";
import { Button, Modal, Select } from "antd";
import { useContext } from "react";

import { marathonContext } from "#config/marathonContext.js";
import { SessionStorageKeys } from "#config/storage.js";
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

  const { setMarathon, marathon, loading, marathons } =
    useContext(marathonContext);

  return (
    <Modal open={open} onClose={onClose}>
      <p>Select Marathon</p>
      <Select
        defaultValue={""}
        onChange={(value) => setMarathon(value)}
        loading={loading}
        value={marathon?.id}
        variant="borderless"
        title="Set Marathon"
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
      <p>Masquerade</p>
      {sessionStorage.getItem(SessionStorageKeys.Masquerade)?.trim() ? (
        <Button
          onClick={() => {
            sessionStorage.removeItem(SessionStorageKeys.Masquerade);
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
    </Modal>
  );
};
