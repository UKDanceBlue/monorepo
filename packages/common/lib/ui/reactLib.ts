import type {
  useReducer as useReducerType,
  useState as useStateType,
} from "react";

let reactLib: {
  useReducer: typeof useReducerType;
  useState: typeof useStateType;
} | null = null;

export const initializeReact = (lib: typeof reactLib) => {
  reactLib = lib;
};

export const getReact = () => {
  if (!reactLib) {
    throw new Error(
      "You must call initializeReact before using db-app-commons's react functionality!"
    );
  }
  return reactLib;
};
