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
          <div
            key={blog.id}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/70 transition-all duration-200 shadow-lg cursor-pointer flex flex-col h-56"
            onClick={() => {
              setEditDialog(!editDialog);
              setSelectedBlog(blog);
            }}
          >
            <h2 className="text-2xl font-semibold text-card-foreground mb-3 line-clamp-2">
              {blog.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed flex-1 overflow-hidden text-ellipsis">
              {blog.excerpt}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              {new Date(blog.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
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
