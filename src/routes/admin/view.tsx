import { BlogCard } from "@/components/BlogCard";
import { EditDialog } from "@/components/EditDialog";
import { FetchBlog, fetchBlogs } from "@/lib/server-functions";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/view")({
  component: RouteComponent,
  loader: async () => {
    const blogPosts = await fetchBlogs({ data: {} });
    return { blogPosts };
  },
});

function RouteComponent() {
  const { blogPosts } = Route.useLoaderData();
  const [editDialog, setEditDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<FetchBlog>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            handleCardClick={() => {
              setEditDialog(!editDialog);
              setSelectedBlog(blog);
            }}
          />
        ))}
        <EditDialog
          isOpen={editDialog}
          setIsOpen={setEditDialog}
          blog={selectedBlog}
        />
      </div>
    </div>
  );
}
