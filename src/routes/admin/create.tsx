import { LexicalEditor } from "@/components/LexicalEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDraftBlogPost } from "@/lib/server-functions";
import { generateExcerpt } from "@/lib/utils";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BlogsSchema } from "@/lib/zod-schema";
import { z } from "zod";

export const Route = createFileRoute("/admin/create")({
  component: RouteComponent,
});

type BlogsSchemaType = z.infer<typeof BlogsSchema>;

function RouteComponent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { session, isAdmin } = useLoaderData({
    from: "/admin",
  });

  // const createDraftBlog = useServerFn(createDraftBlogPost);

  const extractSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters (keep alphanumeric, spaces, hyphens)
      .replace(/\s+/g, "-") // Replace one or more spaces with a single hyphen
      .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, "");
  };

  const mutation = useMutation({
    mutationFn: async (data: BlogsSchemaType) => {
      await createDraftBlogPost({
        data: {
          slug: data.slug,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author_id: data.author_id,
        },
      });
    },
    onSuccess: () => {
      toast.success("Blog post saved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to save blog post. Please try again.");
      console.error("Error creating blog post:", error);
    },
  });

  const addBlogHandler = () => {
    if (!isAdmin || !session?.user) {
      toast.error("Error in authentication");
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }
    mutation.mutate({
      slug: extractSlug(title),
      title: title,
      content: content,
      excerpt: generateExcerpt(content),
      author_id: session.user.id,
      status: "DRAFT",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Write ahead</h2>
      <main className="flex flex-col gap-6 mt-8">
        <div>
          <div className="text-xl mb-2 font-bold">Title</div>
          <Input
            value={title}
            placeholder="Enter blog title"
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
          <Button
            size={"lg"}
            onClick={addBlogHandler}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
