import type { PrimitiveObject } from "./TypeUtils.js";
import { getReact } from "./reactLib.js";

type FormMap = Map<string | number | symbol, PrimitiveObject>;

export type UpdatePayload<T> = T extends Map<infer k, infer V> ? [k, V] : never;

export type FormErrors<T extends FormMap> = Partial<
  Record<keyof T | "%STRUCTURE%", boolean | string>
>;

/**
 * Allowed action names:
 * - "reset": Resets the form to the initial state
 * - "update": Updates the form with a new value
 * - "remove-field": Removes a field from the form (ONLY USE FOR OPTIONAL FIELDS)
 * - "set": Sets the entire form to a new value
 *
 * @param initialState The initial state of the form
 * @param validator A function that validates the form and returns an object with errors
 * @return A tuple with the reducer and the errors
 */
export const useFormReducer = <T extends FormMap>(
  initialState: T,
  validator?: (state: T) => FormErrors<T>
) => {
  const { useState, useReducer } = getReact();

  const [errors, setErrors] = useState<FormErrors<T>>({});
  const reducer = useReducer(
    (
      state: T,
      [keyword, payload]:
        | ["reset"]
        | ["update", UpdatePayload<T>]
        | ["remove-field", keyof T]
        | ["set", T]
    ): T => {
      const updatedState = state;
      switch (keyword) {
        case "reset": {
          return initialState;
        }
        case "update": {
          const [key, newValue] = payload;
          updatedState.set(key, newValue);
          if (validator) {
            setErrors(validator(updatedState));
          }
          return updatedState;
        }
        case "remove-field": {
          const updatedState = {
            ...state,
          };
          updatedState.delete(payload);
          if (validator) {
            setErrors(validator(updatedState));
          }
          return updatedState;
        }
        case "set": {
          if (validator) {
            setErrors(validator(payload));
          }
          return payload;
        }
        default: {
          throw new Error("Invalid action");
        }
      }
    },
    initialState
  );

  return [reducer, errors] as const;
};
