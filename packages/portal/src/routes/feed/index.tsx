import { useImagePicker } from "@hooks/useImagePicker";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import {
  AccessLevel,
  CommitteeRole,
  dateTimeFromSomething,
} from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { useClient, useQuery } from "urql";

const feedPageDocument = graphql(/* GraphQL */ `
  query FeedPage {
    feed(limit: null) {
      id
      title
      createdAt
      textContent
      image {
        url
        alt
      }
    }
  }
`);

const createFeedItemDocument = graphql(/* GraphQL */ `
  mutation CreateFeedItem($input: CreateFeedInput!) {
    createFeedItem(input: $input) {
      id
    }
  }
`);

const deleteFeedItemDocument = graphql(/* GraphQL */ `
  mutation DeleteFeedItem($uuid: GlobalId!) {
    deleteFeedItem(feedItemUuid: $uuid)
  }
`);

function FeedPage() {
  const [result, refresh] = useQuery({
    query: feedPageDocument,
  });
  const [feedItemFormData, setFeedItemFormData] = useState<{
    title: string;
    textContent: string;
    image: {
      uuid: string;
      url: string | URL | null | undefined;
    } | null;
  }>({
    title: "",
    textContent: "",
    image: null,
  });
  const client = useClient();

  useQueryStatusWatcher({ ...result, loadingMessage: "Loading feed..." });

  const { openPicker, renderMe } = useImagePicker();

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={2}>Feed</Typography.Title>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          backgroundColor: "gray",
          padding: 16,
          borderRadius: 8,
          border: "1px solid black",
        }}
        layout="horizontal"
        onFinish={async () => {
          await client
            .mutation(createFeedItemDocument, {
              input: {
                title: feedItemFormData.title,
                textContent: feedItemFormData.textContent,
                imageUuid: feedItemFormData.image?.uuid,
              },
            })
            .toPromise();
          setFeedItemFormData({
            title: "",
            textContent: "",
            image: null,
          });
          setTimeout(
            () =>
              refresh({
                requestPolicy: "network-only",
              }),
            100
          );
        }}
      >
        <Form.Item label="Title" name="title">
          <Input
            value={feedItemFormData.title}
            onChange={(e) =>
              setFeedItemFormData({
                ...feedItemFormData,
                title: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item label="Text Content" name="textContent">
          <Input.TextArea
            value={feedItemFormData.textContent}
            onChange={(e) =>
              setFeedItemFormData({
                ...feedItemFormData,
                textContent: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item>
          <Flex gap={8} align="center">
            <Image src={feedItemFormData.image?.url?.toString() ?? undefined} />
            <Button
              onClick={() =>
                openPicker((imageUuid, imageUrl) => {
                  setFeedItemFormData((prev) => ({
                    ...prev,
                    image: {
                      uuid: imageUuid,
                      url: imageUrl,
                    },
                  }));
                })
              }
            >
              Attach Image
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Create Feed Item
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={16} style={{ rowGap: 16 }}>
        {result.data?.feed.map((feedItem) => (
          <Col key={feedItem.id} span={8}>
            <Card
              title={feedItem.title}
              extra={dateTimeFromSomething(
                feedItem.createdAt
              )?.toLocaleString()}
              cover={
                feedItem.image && (
                  <Image
                    alt={feedItem.image.alt ?? undefined}
                    src={feedItem.image.url?.toString() ?? undefined}
                    style={{
                      width: "100%",
                      maxHeight: 400,
                      objectFit: "contain",
                    }}
                  />
                )
              }
              actions={[
                <Button
                  type="link"
                  danger
                  onClick={async () => {
                    await client
                      .mutation(deleteFeedItemDocument, {
                        uuid: feedItem.id,
                      })
                      .toPromise();
                    setTimeout(
                      () =>
                        refresh({
                          requestPolicy: "network-only",
                        }),
                      100
                    );
                  }}
                >
                  Delete
                </Button>,
              ]}
            >
              <p>{feedItem.textContent}</p>
            </Card>
          </Col>
        ))}
      </Row>
      {renderMe}
    </Flex>
  );
}

export const Route = createFileRoute("/feed/")({
  component: FeedPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
      {
        minCommitteeRole: CommitteeRole.Chair,
      },
    ],
  },
});
