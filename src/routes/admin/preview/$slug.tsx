import { BlogPost } from "@/components/BlogPost";
import { fetchBlogBySlug } from "@/lib/server-functions";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/preview/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const blog = await fetchBlogBySlug({ data: { slug: params.slug } });
    return { blog };
  },
});

function RouteComponent() {
  const { blog } = Route.useLoaderData();
  const router = useRouter();
  const handleBackBtnNav = () => {
    router.history.back();
  };
  return (
    <div className="min-h-screen">
      <BlogPost blog={blog} handleNav={handleBackBtnNav} />
    </div>
  );
}
