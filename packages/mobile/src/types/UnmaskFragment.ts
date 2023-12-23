import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";

export type UnmaskFragment<Unmasked> = Omit<
  Unmasked extends DocumentTypeDecoration<infer TType, never> ? TType : never,
  "__typename" | " $fragmentName"
>;
