import { SingleTargetOperators } from "@ukdanceblue/common";
import { Button, Flex, Image, Input } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const imagePickerDocument = graphql(/* GraphQL */ `
  query ImagePicker($filters: ImageResolverFilterGroup) {
    images(filters: $filters, pageSize: 9) {
      data {
        id
        alt
        url
      }
    }
  }
`);

export function ImagePicker({
  onSelect,
}: {
  onSelect: (
    imageUuid: string,
    imageUrl: string | URL | null | undefined
  ) => void;
}) {
  const [search, setSearch] = useState("");
  const [result] = useQuery({
    query: imagePickerDocument,
    variables: {
      filters: search
        ? {
            operator: "AND",
            filters: [
              {
                field: "alt",
                filter: {
                  singleStringFilter: {
                    value: search,
                    comparison: SingleTargetOperators.INSENSITIVE_CONTAINS,
                  },
                },
              },
            ],
          }
        : undefined,
    },
  });

  useQueryStatusWatcher({ ...result, loadingMessage: "Loading images..." });

  // Group images by 3
  type ImageData = Exclude<
    typeof result.data,
    undefined | null
  >["images"]["data"][number];
  type ImageGroup = [
    ImageData | undefined,
    ImageData | undefined,
    ImageData | undefined,
  ];
  const imageGroups: ImageGroup[] = [];
  if (result.data) {
    for (let i = 0; i < result.data.images.data.length; i += 3) {
      imageGroups.push([
        result.data.images.data[i],
        result.data.images.data[i + 1],
        result.data.images.data[i + 2],
      ]);
    }
  }

  return (
    <Flex
      gap="small"
      vertical
      style={{
        border: "2px solid #ddd",
        padding: "10px",
        borderRadius: "5px",
        width: 100 * 4,
      }}
      align="center"
    >
      <Input
        placeholder="Search images..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Flex gap="small" vertical>
        {imageGroups.map((group, index) => (
          <Flex key={index} gap="small">
            {group.map((image) =>
              image ? (
                <Image
                  key={image.id}
                  src={image.url?.toString()}
                  width={100}
                  height={100}
                  preview={{
                    toolbarRender: (node) => (
                      <Flex gap="small" vertical align="center">
                        <Button
                          type="primary"
                          onClick={() => onSelect(image.id, image.url)}
                        >
                          Select
                        </Button>
                        <p style={{ textAlign: "center" }}>
                          {}
                          {}
                          Alt text: {image.alt || "N/A"}
                        </p>
                        {node}
                      </Flex>
                    ),
                  }}
                />
              ) : (
                <div key={Math.random()} />
              )
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
