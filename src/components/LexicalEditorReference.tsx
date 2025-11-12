import { useCallback, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $createParagraphNode,
  $getRoot,
  EditorState,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createLinkNode, $isLinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { Button } from '@/components/ui/button';
import { ImageNode } from './LexicalImageNode'; // Assuming this exists

// Define the initial editor configuration
const editorConfig = {
  namespace: 'BlogEditor',
  theme: {
    // CSS classes for styling different text formats
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      code: 'bg-gray-200 dark:bg-gray-800 px-1 rounded',
    },
    heading: {
      h1: 'text-3xl font-bold mb-4',
      h2: 'text-2xl font-bold mb-3',
      h3: 'text-xl font-bold mb-2',
    },
    list: {
      nested: {
        listitem: 'ml-4',
      },
      ol: 'list-decimal list-inside',
      ul: 'list-disc list-inside',
    },
    link: 'text-blue-600 dark:text-blue-400 underline',
    paragraph: 'mb-2',
    quote: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic',
  },
  onError: (error: Error) => {
    console.error('Lexical Editor Error:', error);
  },
  nodes: [
    // Register custom nodes (like ImageNode) here
    ImageNode,
    // Lexical includes default nodes: ParagraphNode, TextNode, etc.
  ],
};

// Toolbar component that provides formatting buttons
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Update button states based on current selection
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  // Listen to editor updates to sync toolbar state
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });

  // Format text functions
  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  // Format block elements
  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = $createHeadingNode(headingSize);
        selection.insertNodes([headingNode]);
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        selection.insertNodes([quoteNode]);
      }
    });
  };

  // List formatting
  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const removeList = () => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  };

  // Image upload handler
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Create a unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomStr}.${fileExtension}`;

      // Create a local URL for the image (for now, using object URL)
      // In production, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);

      // Insert image into editor
      editor.update(() => {
        const imageNode = ImageNode.create({
          src: imageUrl,
          alt: file.name,
          width: '100%',
          height: 'auto',
        });
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        } else {
          const root = $getRoot();
          root.append(imageNode);
        }
      });
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Text Formatting Buttons */}
      <Button
        type="button"
        variant={isBold ? 'default' : 'outline'}
        size="sm"
        onClick={formatBold}
        aria-label="Bold"
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button"
        variant={isItalic ? 'default' : 'outline'}
        size="sm"
        onClick={formatItalic}
        aria-label="Italic"
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        variant={isUnderline ? 'default' : 'outline'}
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
        onClick={() => formatHeading('h1')}
        aria-label="Heading 1"
      >
        H1
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading('h2')}
        aria-label="Heading 2"
      >
        H2
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => formatHeading('h3')}
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
}

// Placeholder component that shows when editor is empty
function Placeholder() {
  return (
    <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
      Start writing your blog post...
    </div>
  );
}

// Main LexicalEditor component
interface LexicalEditorProps {
  onChange?: (html: string, json: string) => void;
  initialHtml?: string;
}

export const LexicalEditor = ({ onChange, initialHtml }: LexicalEditorProps) => {
  const editorStateRef = useRef<string>('');

  // Handle editor content changes
  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        
        // Generate HTML from current editor state
        const htmlString = $generateHtmlFromNodes(editor, null);
        
        // Serialize to JSON (for more advanced features)
        const jsonString = JSON.stringify(editorState.toJSON());
        
        editorStateRef.current = htmlString;
        
        // Call the onChange callback if provided
        if (onChange) {
          onChange(htmlString, jsonString);
        }
      });
    },
    [onChange]
  );

  // Initialize editor with HTML content if provided
  const initialConfig = {
    ...editorConfig,
    editorState: initialHtml
      ? () => {
          // Parse HTML and convert to Lexical nodes
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        }
      : undefined,
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[400px] p-4 outline-none prose dark:prose-invert max-w-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};