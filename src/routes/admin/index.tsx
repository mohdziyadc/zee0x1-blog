import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session, isAdmin } = useLoaderData({ from: "/admin" });
  //   const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for future blog posts */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/70 transition-all duration-200 shadow-lg">
          <h2 className="text-2xl font-semibold text-card-foreground mb-3">
            Coming Soon
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Blog posts will appear here soon. Stay tuned for exciting content!
          </p>
        </div>
      </div>
    </div>
  );
}
