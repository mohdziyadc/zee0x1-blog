import { fetchBlogs } from "@/lib/server-functions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/view")({
  component: RouteComponent,
  loader: async () => {
    const blogPosts = await fetchBlogs({ data: {} });
    return { blogPosts };
  },
});

function RouteComponent() {
  const { blogPosts } = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((blog) => (
          <div
            key={blog.id}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/70 transition-all duration-200 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-card-foreground mb-3">
              {blog.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
