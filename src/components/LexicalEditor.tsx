import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  EditorState,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { Button } from "./ui/button";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useState, useEffect } from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  HeadingTagType,
  QuoteNode,
} from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { Image, Link, Megaphone } from "lucide-react";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $createLinkNode, LinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

const editorConfig = {
  namespace: "zee0x1 Editor",
  theme: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
      code: "bg-gray-200 dark:bg-gray-800 px-1 rounded",
    },
    heading: {
      h1: "text-3xl font-bold mb-4",
      h2: "text-2xl font-bold mb-3",
      h3: "text-xl font-bold mb-2",
    },
    list: {
      nested: {
        listitem: "ml-4",
      },
      ol: "list-decimal list-inside",
      ul: "list-disc list-inside",
    },
    link: "text-blue-600 dark:text-blue-400 underline",
    paragraph: "mb-2",
    quote: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic",
  },
  onError: (error: Error) => {
    console.error("Lexical Editor Error: ", error);
  },
  nodes: [
    //TODO - Image Node
    HeadingNode,
    ListNode,
    ListItemNode,
    LinkNode,
    QuoteNode,
  ],
};

type LexicalEditorProps = {
  onChange?: (html: string) => void;
  initialContent?: string;
};

const OnChangePluginWrapper = ({
  onChange,
}: {
  onChange?: (html: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);

        if (onChange) {
          onChange(htmlString);
        }
      });
    },
    [editor, onChange]
  );
  return <OnChangePlugin onChange={handleChange} />;
};

const InitialContentPlugin = ({
  initialContent,
}: {
  initialContent?: string;
}) => {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!initialContent || isInitialized) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialContent, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    setIsInitialized(true);
  }, [editor, initialContent, isInitialized]);

  return null;
};

const ToolbarPlugin = () => {
  //editor instance with context
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
  });

  const { isBold, isItalic, isUnderline } = toolbarState;

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setToolbarState({
        isBold: selection.hasFormat("bold"),
        isItalic: selection.hasFormat("italic"),
        isUnderline: selection.hasFormat("underline"),
      });
    }
  }, []);

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });

  function formatBold() {
    console.log("BOLD CLICKED");
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }

  function formatItalic() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }

  function formatUnderline() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }

  function formatHeading(sizeTag: HeadingTagType) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = $createHeadingNode(sizeTag);
        selection.insertNodes([headingNode]);
      }
    });
  }

  function formatBulletList() {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }

  function formatNumberedList() {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }

  function removeList() {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }

  // TODO
  // function handleImageUpload(
  //   event: MouseEvent<HTMLButtonElement, MouseEvent>
  // ): void {
  //   throw new Error("Function not implemented.");
  // }

  function handleUrlFormat() {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        if (selectedText) {
          const url =
            selectedText.startsWith("http://") ||
            selectedText.startsWith("https://")
              ? selectedText
              : `https://${selectedText}`;

          const linkNode = $createLinkNode(url);
          const textNode = $createTextNode(selectedText);

          linkNode.append(textNode);

          selection.insertNodes([linkNode]);
          linkNode.selectNext();
        }
        //No else conditon for now
      }
    });
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div
      className="flex w-fit border-2 rounded-lg flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
    **:data-[slot='button']:transition-all **:data-[slot='button']:duration-100 **:data-[slot='button']:hover:bg-accent-foreground/20! **:data-[slot='button']:hover:backdrop-blur-sm **:data-[slot='button']:hover:scale-[1.02]"
    >
      {/* Text Formatting Buttons */}
      <Button
        type="button"
        variant={isBold ? "default" : "outline"}
        size="sm"
        onClick={formatBold}
        aria-label="Bold"
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button"
        variant={isItalic ? "default" : "outline"}
        size="sm"
        onClick={formatItalic}
        aria-label="Italic"
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        variant={isUnderline ? "default" : "outline"}
        size="sm"
        onClick={formatUnderline}
        aria-label="Underline"
      >
        <u>U</u>
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Heading Buttons */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading("h1")}
        aria-label="Heading 1"
      >
        h1
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading("h2")}
        aria-label="Heading 2"
      >
        h2
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading("h3")}
        aria-label="Heading 3"
      >
        h3
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* List Buttons */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={formatBulletList}
        aria-label="Bullet List"
      >
        •
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={formatNumberedList}
        aria-label="Numbered List"
      >
        1.
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={removeList}
        aria-label="Remove List"
      >
        No List
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Image Upload Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => console.log("TODO!!")}
        aria-label="Upload Image"
      >
        <Image />
      </Button>

      <Button
        type="button"
        variant={"outline"}
        size={"sm"}
        onClick={handleUrlFormat}
        aria-label="url"
      >
        <Link />
      </Button>

      <Button
        type="button"
        variant={"outline"}
        size={"sm"}
        onClick={formatQuote}
        aria-label="url"
      >
        <Megaphone />
      </Button>
    </div>
  );
};

export const LexicalEditor = ({
  onChange,
  initialContent,
}: LexicalEditorProps) => {
  const initialConfig = {
    ...editorConfig,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="mb-2">
        <ToolbarPlugin />
      </div>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={"Enter some text..."}
            placeholder={<div></div>}
            className="border-gray-400 rounded-md text-lg border-2 min-h-[300px] max-h-[600px] overflow-y-auto p-4"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePluginWrapper onChange={onChange} />
      <InitialContentPlugin initialContent={initialContent} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
    </LexicalComposer>
  );
};
