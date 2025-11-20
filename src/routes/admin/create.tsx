import { BlogForm } from "@/components/BlogForm";
import { createDraftBlogPost } from "@/lib/server-functions";
import { generateExcerpt } from "@/lib/utils";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BlogsSchema } from "@/lib/zod-schema";
import { z } from "zod";

export const Route = createFileRoute("/admin/create")({
  component: RouteComponent,
});

type BlogsSchemaType = z.infer<typeof BlogsSchema>;

function RouteComponent() {
  const { session, isAdmin } = useLoaderData({
    from: "/admin",
  });

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

  const handleSubmit = (title: string, content: string) => {
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
      <BlogForm
        onSubmit={handleSubmit}
        submitButtonText="Save"
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
