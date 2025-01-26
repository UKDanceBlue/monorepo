import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { Flex, Spin } from "antd";

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
  if (initialMarkdown === undefined) {
    return (
      <Flex justify="center" align="center">
        <Spin />
      </Flex>
    );
  } else {
    return (
      <MDXEditor
        markdown={initialMarkdown === null ? "" : initialMarkdown}
        onChange={(text) => onChange(text)}
        plugins={[
          headingsPlugin(),
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
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    );
  }
}
