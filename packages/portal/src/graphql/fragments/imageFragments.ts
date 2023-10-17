import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const IMAGE_FRAGMENT = graphql(/* GraphQL */ `
  fragment FullImage on ImageResource {
    url
    imageData
    height
    width
    thumbHash
    alt
  }
`);

export const IMAGE_METADATA_FRAGMENT = graphql(/* GraphQL */ `
  fragment ImageMetadata on ImageResource {
    height
    width
    mimeType
    alt
  }
`);

export const IMAGE_THUMBHASH_FRAGMENT = graphql(/* GraphQL */ `
  fragment ImageThumbHash on ImageResource {
    thumbHash
    height
    width
    alt
  }
`);
