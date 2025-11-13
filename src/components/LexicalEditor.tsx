import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { Button } from "./ui/button";
import { removeList } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useState } from "react";

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
    qoute: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic",
  },
  onError: (error: Error) => {
    console.error("Lexical Editor Error: ", error);
  },
  nodes: [
    //TODO - Image Node
  ],
};

const onChange = (editorState: EditorState) => {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
};

const ToolbarPlugin = () => {
  //editor instance with context
  const [editor] = useLexicalComposerContext();
  // const [isBold, setIsBold] = useState(false)
  // const [isItalic, setIsItalic] = useState(false)
  // const [isUnderline, setIsUnderline] = useState(false)
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

  function formatItalic(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function formatUnderline(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function formatHeading(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  function formatBulletList(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function formatNumberedList(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function handleImageUpload(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex rounded-lg flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
        H1
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading("h2")}
        aria-label="Heading 2"
      >
        H2
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading("h3")}
        aria-label="Heading 3"
      >
        H3
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
        onClick={handleImageUpload}
        aria-label="Upload Image"
      >
        📷 Image
      </Button>
    </div>
  );
};

export const LexicalEditor = () => {
  const initialConfig = {
    ...editorConfig,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border-2 border-white rounded-lg mb-2">
        <ToolbarPlugin />
      </div>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={"Enter some text..."}
            placeholder={<div></div>}
            className="border-gray-400 rounded-md border-2 min-h-[500px] p-4"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
