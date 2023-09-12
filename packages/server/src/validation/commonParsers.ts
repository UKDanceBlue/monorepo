import type { EditArray } from "@ukdanceblue/db-app-common";
import { EditType } from "@ukdanceblue/db-app-common";

/**
 * Map an EditArray
 *
 * @param value EditArray
 * @param replacer Function to replace the value
 * @return EditArray
 */
export function mapEditArray<I, O>(
  value: EditArray<I[]>,
  replacer: (value: I) => O
): EditArray<O[]> {
  let newArray: EditArray<O[]>;

  switch (value.type) {
    case EditType.MODIFY: {
      const itemsToAdd = value.add.map((item) => replacer(item));
      const itemsToRemove = value.remove.map((item) => replacer(item));

      newArray = {
        type: EditType.MODIFY,
        add: itemsToAdd,
        remove: itemsToRemove,
      };
      break;
    }
    case EditType.REPLACE: {
      const items = value.set.map((item) => replacer(item));

      newArray = {
        type: EditType.REPLACE,
        set: items,
      };
      break;
    }
  }

  return newArray;
}
