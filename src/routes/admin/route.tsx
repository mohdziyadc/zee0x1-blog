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
      <div className="flex justify-center items-center w-full min-h-[calc(100vh-4.5rem)] px-4">
        <Button
          onClick={handleLogIn}
          className="w-full max-w-md px-4 py-5 md:py-6 cursor-pointer"
        >
          <div className="flex flex-row justify-center items-center gap-2 md:gap-3">
            <img
              width={20}
              height={20}
              className="rounded-[999999px] md:w-6 md:h-6"
              src="https://toppng.com/uploads/preview/google-g-logo-icon-11609362962anodywxeaz.png"
            />
            <div className="text-base md:text-xl">Log In with Google</div>
          </div>
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-4 md:gap-6 justify-center items-center w-full min-h-[calc(100vh-4.5rem)] px-4">
        <div className="max-w-sm md:max-w-md text-center text-sm md:text-base">
          Welcome {session.user.name}, hope ur doing well. Thanks for checking
          this out!
        </div>

        <p className="text-sm md:text-base text-center max-w-sm">
          You are not authorized to do actions here. Pls contact admin!
        </p>

        <div>
          <Button
            onClick={handleLogOut}
            className="px-6 py-5 md:px-8 md:py-6 text-base md:text-lg cursor-pointer"
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
        <div className="p-4 lg:py-6 lg:px-4 lg:sticky lg:top-18">
          {/* Navigation */}
          <nav className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible items-center lg:items-stretch">
            <h2 className="px-4 py-2.5 text-lg lg:text-xl font-bold whitespace-nowrap lg:mb-3">
              <Link
                to="/admin"
                className="hover:text-primary transition-colors"
              >
                Admin Panel
              </Link>
            </h2>
            <Link
              to="/admin/view"
              className="px-4 py-2.5 rounded-lg hover:bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink text-sm font-medium"
              activeProps={{
                className:
                  "px-4 py-2.5 rounded-lg bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink text-sm font-medium",
              }}
            >
              View & Publish
            </Link>
            <Link
              to="/admin/create"
              className="px-4 py-2.5 rounded-lg hover:bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink text-sm font-medium"
              activeProps={{
                className:
                  "px-4 py-2.5 rounded-lg bg-accent transition-colors whitespace-nowrap shrink-0 lg:shrink text-sm font-medium",
              }}
            >
              Create
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
