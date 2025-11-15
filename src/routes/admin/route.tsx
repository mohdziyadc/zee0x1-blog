import { Button } from "@/components/ui/button";
import { getSessionAndAdminFromServer } from "@/lib/server-functions";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";

import { createAuthClient } from "better-auth/react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  loader: async () => {
    const { session, isAdmin } = await getSessionAndAdminFromServer();

    return { session, isAdmin };
  },
});

const authClient = createAuthClient();

function AdminLayout() {
  const { session, isAdmin } = Route.useLoaderData();
  const router = useRouter();

  const handleLogIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/admin/",
      errorCallbackURL: "/",
    });
  };

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.invalidate();
        },
      },
    });
    // await router.navigate({ to: "/" });
  };

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center w-full min-h-[calc(100vh-4.5rem)]">
        <Button onClick={handleLogIn} className="w-md px-4 py-6 cursor-pointer">
          <div className="flex flex-row justify-center items-center gap-2">
            <img
              width={24}
              height={24}
              className="rounded-[999999px]"
              src="https://toppng.com/uploads/preview/google-g-logo-icon-11609362962anodywxeaz.png"
            />
            <div className="text-xl">Log In</div>
          </div>
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center w-full min-h-[calc(100vh-4.5rem)]">
        <div className="max-w-sm text-center">
          Welcome {session.user.name}, hope ur doing well. Thanks for checking
          this out!
        </div>

        <p>You are not authorized to do actions here. Pls contact admin!</p>

        <div>
          <Button
            onClick={handleLogOut}
            className="px-4 py-6 text-lg cursor-pointer"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)]">
      <aside className="w-64 border-r p-4">
        <h2 className="text-xl font-bold">
          <Link to="/admin">Admin Panel</Link>
        </h2>
        <nav className="my-4">
          <Link to="/admin/view">View & Publish</Link>
        </nav>
        <nav className="my-4">
          <Link to="/admin/create">Create</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
