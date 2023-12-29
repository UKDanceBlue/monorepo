import { useForm } from "@tanstack/react-form";
import { useCallback, useEffect } from "react";

import type { ConfigValue } from "./useConfig";
import { useConfig } from "./useConfig";

const NEW_CONFIG_VALUE_SENTINEL = "new";
export function useConfigForm() {
  const {
    configs: existingConfig,
    loading: existingConfigLoading,
    activeValues,
  } = useConfig();

  // Form holds { [key: string]: { [uuid: string]: ConfigValue } }
  const formApi =
    useForm<Record<string, Record<string, ConfigValue | undefined>>>();

  const addConfigKey = useCallback(
    (key: string) => {
      formApi.setFieldValue(key, {});
    },
    [formApi]
  );
  [];

  const setConfigValue = useCallback(
    (
      key: string,
      value: ConfigValue,
      uuid: string = NEW_CONFIG_VALUE_SENTINEL
    ) => {
      formApi.setFieldValue(`${key}.${uuid}`, value);
    },
    [formApi]
  );

  useEffect(() => {
    if (
      !existingConfigLoading &&
      existingConfig.length > 0 &&
      Object.keys(formApi.state.values).length === 0
    ) {
      formApi.reset();
      existingConfig.forEach(({ key, values }) => {
        addConfigKey(key);
        Object.entries(values).forEach(([uuid, value]) => {
          setConfigValue(key, value, uuid);
        });
      });
    }
  }, [
    addConfigKey,
    setConfigValue,
    existingConfig,
    existingConfigLoading,
    formApi,
  ]);

  return {
    formApi,
    addConfigKey,
    setConfigValue,
    activeValues,
  };
}
