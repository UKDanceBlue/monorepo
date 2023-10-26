import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const ImageFragment = graphql(/* GraphQL */ `
  fragment FullImage on ImageResource {
    url
    imageData
    height
    width
    thumbHash
    alt
  }
`);

export const ImageMetadataFragment = graphql(/* GraphQL */ `
  fragment ImageMetadata on ImageResource {
    height
    width
    mimeType
    alt
  }
`);

export const ImageThumbhashFragment = graphql(/* GraphQL */ `
  fragment ImageThumbHash on ImageResource {
    thumbHash
    height
    width
    alt
  }
`);
