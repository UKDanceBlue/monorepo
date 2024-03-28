/* eslint-disable @typescript-eslint/no-explicit-any */

// From @tanstack/react-form

/*
MIT License

Copyright (c) 2021-present Tanner Linsley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldOptions,
} from "@tanstack/react-form";

type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> = FieldOptions<TParentData, TName, TData> & {
  mode?: "value" | "array";
};

export type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> = {
  children: (fieldApi: FieldApi<TParentData, TName, TData>) => any;
} & (TParentData extends any[]
  ? {
      name?: TName;
      index: number;
    }
  : {
      name: TName;
      index?: never;
    }) &
  Omit<UseFieldOptions<TParentData, TName>, "name" | "index">;
