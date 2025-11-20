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

  return <div>Hello</div>;
}
