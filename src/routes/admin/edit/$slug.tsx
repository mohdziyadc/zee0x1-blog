import { BlogForm } from "@/components/BlogForm";
import {
  fetchBlogBySlug,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/server-functions";
import { generateExcerpt } from "@/lib/utils";
import {
  createFileRoute,
  useLoaderData,
  notFound,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateBlogSchema, DeleteBlogDto } from "@/lib/zod-schema";
import { z } from "zod";
import { useState } from "react";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/edit/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      const blog = await fetchBlogBySlug({ data: { slug: params.slug } });
      return { blog };
    } catch (error) {
      throw notFound();
    }
  },
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-3xl font-bold text-muted-foreground">
          Blog Post Not Found
        </h2>
        <p className="text-lg text-muted-foreground">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  },
});

type UpdateBlogSchemaType = z.infer<typeof UpdateBlogSchema>;
type DeleteBlogDtoType = z.infer<typeof DeleteBlogDto>;

function RouteComponent() {
  const { blog } = Route.useLoaderData();
  const { session, isAdmin } = useLoaderData({
    from: "/admin",
  });
  const navigate = useNavigate();
  const router = useRouter();

  const [deleteDialog, setDeleteDialog] = useState(false);

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
    mutationFn: async (data: UpdateBlogSchemaType) => {
      await updateBlogPost({
        data: {
          id: data.id,
          slug: data.slug,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author_id: data.author_id,
          status: data.status,
        },
      });
    },
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update blog post. Please try again.");
      console.error("Error updating blog post:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: DeleteBlogDtoType) => {
      await deleteBlogPost({
        data: {
          id: data.id,
        },
      });
    },
    onSuccess: () => {
      toast.success("Blog post deleted successfully!");
      setDeleteDialog(false);
      navigate({ to: "/admin/view" });
    },
    onError: (error) => {
      toast.error("Failed to delete blog post. Please try again.");
      console.error("Error deleting blog post:", error);
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
      id: blog.id,
      slug: extractSlug(title),
      title: title,
      content: content,
      excerpt: generateExcerpt(content),
      author_id: session.user.id,
      status: blog.status || "DRAFT",
    });
  };

  const handleDelete = () => {
    if (!isAdmin || !session?.user) {
      toast.error("Error in authentication");
      return;
    }
    deleteMutation.mutate({ id: blog.id });
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-10 w-10" />
          </Button>
          <h2 className="text-xl font-bold">Edit Blog Post</h2>
        </div>
        <BlogForm
          initialTitle={blog.title}
          initialContent={blog.content || ""}
          onSubmit={handleSubmit}
          submitButtonText="Update"
          isSubmitting={mutation.isPending}
          isEdit={true}
          triggerDelete={() => {
            setDeleteDialog(!deleteDialog);
          }}
        />
      </div>
      <DeleteDialog
        isDelete={deleteDialog}
        setIsDelete={setDeleteDialog}
        onDelete={handleDelete}
      />
    </>
  );
}
