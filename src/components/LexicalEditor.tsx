import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection, EditorState } from "lexical";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

const theme = {};

function onError(error: any) {
  console.error(error);
}

const onChange = (editorState: EditorState) => {
    editorState.read(() => {
        const root = $getRoot()
        const selection = $getSelection()

        console.log(root, selection)
    })
}

export const LexicalEditor = () => {
  const initialConfig = {
    namespace: "Blog Editor",
    theme,
    onError,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={"Enter some text..."}
            placeholder={<div></div>}
            className="border-white rounded-md border-2 min-h-[500px] p-4"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange}/>
      <HistoryPlugin />
    </LexicalComposer>
  );
};
