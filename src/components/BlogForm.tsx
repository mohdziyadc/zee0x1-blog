import { LexicalEditor } from "@/components/LexicalEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type BlogFormProps = {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
  isEdit?: boolean;
  triggerDelete?: () => void;
};

export function BlogForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  submitButtonText = "Save",
  isSubmitting = false,
  isEdit = false,
  triggerDelete,
}: BlogFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // Update state when initial values change (for edit mode)
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    onSubmit(title, content);
  };

  const handleDelete = () => {
    if (triggerDelete) {
      triggerDelete();
    }
  };

  return (
    <main className="flex flex-col gap-6 mt-8">
      <div>
        <div className="text-xl mb-2 font-bold">Title</div>
        <Input
          value={title}
          placeholder="Enter blog title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="max-w-2xl py-4 px-2 text-lg! border-primary-foreground bg-input!"
        />
      </div>
      <div>
        <LexicalEditor
          onChange={(html) => setContent(html)}
          initialContent={initialContent}
        />
      </div>
      <div className="flex gap-4 ml-auto mr-2">
        {isEdit && (
          <Button size={"lg"} variant={"outline"} onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button size={"lg"} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </main>
  );
}
