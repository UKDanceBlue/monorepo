import { useForm } from "@tanstack/react-form";
import { useCallback, useEffect } from "react";

import type { ConfigValue } from "./useConfig";
import { useConfig } from "./useConfig";

export function useConfigForm() {
  const {
    configs: existingConfig,
    loading: existingConfigLoading,
    activeValues,
  } = useConfig();

  // Form holds [key, [uuid, value][]][]
  const formApi = useForm<
    Record<
      string,
      {
        new?: ConfigValue | undefined;
        old: [string, ConfigValue | undefined][];
      }
    >
  >({
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const addConfigKey = useCallback(
    (key: string) => {
      formApi.setFieldValue(key, { old: [] });
    },
    [formApi]
  );
  [];

  const setConfigValue = useCallback(
    (key: string, value: ConfigValue) => {
      formApi.setFieldValue(`${key}.new`, value);
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
          formApi.pushFieldValue(`${key}.old`, [uuid, value]);
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
