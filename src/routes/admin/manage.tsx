import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuthClient } from "better-auth/react";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/admin/manage")({
  component: RouteComponent,
  loader: async () => {
    const { session, isAdmin } = await getSessionAndAdminFromServer();

    return { session, isAdmin };
  },
});

const authClient = createAuthClient();

const getSessionAndAdminFromServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const reqHeaders = getRequestHeaders();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user.email) {
      return { session: null, isAdmin: false };
    }

    const result = await db
      .select({
        isAdmin: user.isAdmin,
      })
      .from(user)
      .where(eq(user.email, session.user.email));

    return {
      session,
      isAdmin: result[0].isAdmin,
    };
  }
);

function RouteComponent() {
  const { session, isAdmin } = Route.useLoaderData();
  const router = useRouter();

  const handleLogIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/admin/manage",
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
    <div className="flex flex-col gap-4 justify-center items-center w-full min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-sm text-center">Welcome zee0x1, let's goooo 🚀</div>
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
