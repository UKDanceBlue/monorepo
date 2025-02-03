import { describe, expect, it } from "vitest";

import { getCrudOperationNames } from "./standardResolver.js";

describe("getCrudOperationNames", () => {
  it("should return correct CRUD operation names for given node names", () => {
    const nodeName = "item";
    const pluralNodeName = "items";

    const result = getCrudOperationNames(nodeName, pluralNodeName);

    expect(result).toEqual({
      getOne: "item",
      setOne: "setItem",
      createOne: "createItem",
      deleteOne: "deleteItem",
      getList: "items",
      getAll: "allItems",
      getMultiple: "getMultipleItems",
      createMultiple: "createItems",
      deleteMultiple: "deleteItems",
      setMultiple: "setItems",
    });
  });

  it("should handle capitalized node names correctly", () => {
    const nodeName = "User";
    const pluralNodeName = "Users";

    const result = getCrudOperationNames(nodeName, pluralNodeName);

    expect(result).toEqual({
      getOne: "User",
      setOne: "setUser",
      createOne: "createUser",
      deleteOne: "deleteUser",
      getList: "Users",
      getAll: "allUsers",
      getMultiple: "getMultipleUsers",
      createMultiple: "createUsers",
      deleteMultiple: "deleteUsers",
      setMultiple: "setUsers",
    });
  });

  it("should handle single character node names correctly", () => {
    const nodeName = "a";
    const pluralNodeName = "as";

    const result = getCrudOperationNames(nodeName, pluralNodeName);

    expect(result).toEqual({
      getOne: "a",
      setOne: "setA",
      createOne: "createA",
      deleteOne: "deleteA",
      getList: "as",
      getAll: "allAs",
      getMultiple: "getMultipleAs",
      createMultiple: "createAs",
      deleteMultiple: "deleteAs",
      setMultiple: "setAs",
    });
  });
});
