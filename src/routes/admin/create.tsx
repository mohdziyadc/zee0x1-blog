import { LexicalEditor } from "@/components/LexicalEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addBlogHandler = () => {
    console.log(title);
    console.log(content);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Write ahead</h2>
      <main className="flex flex-col gap-6 mt-8">
        <div>
          <div className="text-xl mb-2 font-bold">Title</div>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="max-w-2xl border-primary-foreground bg-input!"
          />
        </div>
        <div>
          <LexicalEditor onChange={(html) => setContent(html)} />
        </div>
        <div className="ml-auto mr-2">
          <Button size={"lg"} onClick={addBlogHandler}>
            Save
          </Button>
        </div>
      </main>
    </div>
  );
}
