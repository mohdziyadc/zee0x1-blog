import { BlogCard } from "@/components/BlogCard";
import { fetchBlogs } from "@/lib/server-functions";
import { BLOG_STATUS, TIME_SORT } from "@/lib/zod-schema";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
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

function HomePage() {
  const router = useRouter();

  const { publishedBlogs } = Route.useLoaderData();

  const handleCardClick = (blogSlug: string | null) => {
    if (!blogSlug) {
      return;
    }
    router.navigate({
      to: `/view/${blogSlug}`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)]">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="bg-linear-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              This little part of internet is mine.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Some stuff I've been upto lately
          </p>
        </div>

        <section>
          <h1 className="text-2xl font-bold mb-4">Blogs</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                handleCardClick={() => handleCardClick(blog.slug)}
                isPublished
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
