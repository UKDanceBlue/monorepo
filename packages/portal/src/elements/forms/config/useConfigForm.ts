import { useForm } from "@tanstack/react-form";
import { useCallback, useEffect, useMemo } from "react";

import { useCommitChanges } from "./useCommitChanges.js";
import type { ConfigValue } from "./useConfig.js";
import { useConfig } from "./useConfig.js";

export function useConfigForm() {
  const {
    configs: existingConfig,
    loading: existingConfigLoading,
    activeValues,
  } = useConfig();

  const defaultValues = useMemo(() => {
    const values: Record<
      string,
      {
        new?: ConfigValue | undefined;
        old: [string, ConfigValue | undefined][];
      }
    > = {};
    existingConfig.forEach(({ key, values: existingValues }) => {
      Object.entries(existingValues).forEach(([uuid, value]) => {
        values[key] = {
          old: [...(values[key]?.old ?? []), [uuid, value]],
        };
      });
    });
    return values;
  }, [existingConfig]);

  const commitChanges = useCommitChanges();

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
    onSubmit: async ({ value: values }) => {
      const newValues: Record<string, ConfigValue> = {};
      Object.entries(values).forEach(([key, { new: value }]) => {
        if (value !== undefined) {
          newValues[key] = value;
        }
      });
      return commitChanges(newValues, activeValues);
    },
    defaultValues,
  });

  useEffect(() => {
    if (!existingConfigLoading) {
      formApi.reset();
    }
  }, [existingConfigLoading, formApi]);

  const addConfigKey = useCallback(
    (key: string) => {
      formApi.setFieldValue(key, { old: [] });
    },
    [formApi]
  );

  const setConfigValue = useCallback(
    (key: string, value: ConfigValue) => {
      formApi.setFieldValue(`${key}.new`, value);
    },
    [formApi]
  );

  return {
    formApi,
    addConfigKey,
    setConfigValue,
    activeValues,
  };
}
