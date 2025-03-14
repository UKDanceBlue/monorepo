import { PictureOutlined } from "@ant-design/icons";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { Button, Card, Flex, Modal, Spin } from "antd";
import { useRef, useState } from "react";

import { ImagePicker } from "./image/ImagePicker";

/**
 *
 * @param param0 React props
 * @param param0.initialMarkdown Initial markdown content; undefined indicates a loading state, null indicates no default content
 * @param param0.onChange Callback to be called when the markdown content changes
 */
export function MarkdownEditor({
  initialMarkdown,
  onChange,
}: {
  initialMarkdown: string | undefined | null;
  onChange: (text: string) => void;
}) {
  const editor = useRef<MDXEditorMethods | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  if (initialMarkdown === undefined) {
    return (
      <Flex justify="center" align="center">
        <Spin />
      </Flex>
    );
  } else {
    return (
      <>
        <Card styles={{ body: { padding: 0, borderRadius: ".375rem" } }}>
          <MDXEditor
            ref={editor}
            markdown={initialMarkdown === null ? "" : initialMarkdown}
            onChange={(text) => onChange(text)}
            suppressHtmlProcessing
            plugins={[
              diffSourcePlugin(),
              headingsPlugin(),
              imagePlugin(),
              quotePlugin(),
              listsPlugin(),
              linkPlugin({
                validateUrl(url) {
                  try {
                    new URL(url);
                    return true;
                  } catch {
                    return false;
                  }
                },
              }),
              linkDialogPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <DiffSourceToggleWrapper options={["rich-text", "source"]}>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <ListsToggle />
                    <CreateLink />
                    <Button
                      type="text"
                      title="Insert image"
                      onClick={() => setImagePickerOpen(true)}
                      icon={<PictureOutlined />}
                    />
                  </DiffSourceToggleWrapper>
                ),
              }),
            ]}
          />
        </Card>
        <Modal
          open={imagePickerOpen}
          onCancel={() => setImagePickerOpen(false)}
          footer={null}
          maskClosable={false}
        >
          <ImagePicker
            onSelect={(_, url, alt) => {
              editor.current?.insertMarkdown(`![${alt ?? ""}](${url})`);
              setImagePickerOpen(false);
            }}
          />
        </Modal>
      </>
    );
  }
}
