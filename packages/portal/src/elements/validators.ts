import { localDateFromJs } from "@ukdanceblue/common";
import { z } from "zod";

export const defaultStringValidator = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined);

export const defaultDateValidator = z
  .string()
  .transform((v) =>
    v ? localDateFromJs(new Date(v)).unwrapOr(undefined) : undefined
  )
  .optional();

export const defaultFloatValidator = z
  .string({ coerce: true })
  .regex(/^\d*(,\d+)*(\.\d+)?$/)
  .trim()
  .transform((v) => {
    if (v === "") {
      return 0;
    }
    v = v.replaceAll(",", "");
    const parsed = Number.parseFloat(v);
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return parsed;
  });
