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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem)]">
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r bg-background">
        <div className="p-4 lg:sticky lg:top-18">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
            <h2 className=" px-4 py-2 text-xl font-bold lg:block">
              <Link to="/admin">Admin Panel</Link>
            </h2>
            <Link
              to="/admin/view"
              className="px-4 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink"
              activeProps={{
                className:
                  "px-4 py-2 rounded-md bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink",
              }}
            >
              View & Publish
            </Link>
            <Link
              to="/admin/create"
              className="px-4 py-2 rounded-md hover:bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink"
              activeProps={{
                className:
                  "px-4 py-2 rounded-md bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink",
              }}
            >
              Create
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
