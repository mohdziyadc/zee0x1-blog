import { BlogCard } from "@/components/BlogCard";
import { EditDialog } from "@/components/EditDialog";
import { FetchBlog, fetchBlogs } from "@/lib/server-functions";
import { BLOG_STATUS, TIME_SORT } from "@/lib/zod-schema";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  loader: async () => {
    const publishedBlogs = await fetchBlogs({
      data: {
        blogStatus: BLOG_STATUS.PUBLISHED,
        orderBy: TIME_SORT.PUBLISHED_AT,
      },
    });
    return { publishedBlogs };
  },
});

function RouteComponent() {
  const [editDialog, setEditDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<FetchBlog>();
  const { publishedBlogs } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Published Blogs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publishedBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            handleCardClick={() => {
              setEditDialog(!editDialog);
              setSelectedBlog(blog);
            }}
            isPublished={true}
          />
        ))}
        <EditDialog
          isOpen={editDialog}
          setIsOpen={setEditDialog}
          blog={selectedBlog}
          isPublished={true}
        />
      </div>
    </div>
  );
}
