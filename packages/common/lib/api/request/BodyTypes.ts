export enum EditType {
  MODIFY = 0,
  REPLACE = 1,
}

export type EditArray<T extends unknown[] | (unknown[] | undefined)> =
  | {
      type: EditType.MODIFY;
      /**
       * The items to add to the array
       */
      add: T;
      /**
       * The items to remove from the array (must be strict equal to the removed item)
       */
      remove: T;
    }
  | {
      type: EditType.REPLACE;
      /**
       * Replacement for the array
       */
      set: T;
    }
  | (T extends NonNullable<T> ? never : undefined);
