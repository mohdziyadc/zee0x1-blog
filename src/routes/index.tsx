import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuthClient } from "better-auth/react";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const session = await getSessionFromServer();
    return { session };
  },
});
const authClient = createAuthClient();

const getSessionFromServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequestHeaders();
    const session = await auth.api.getSession({
      headers: request,
    });
    return session;
  }
);

function HomePage() {
  // const authClient =
  const { session } = Route.useLoaderData();
  const router = useRouter();

  const handleSignUp = async () => {
    console.log("Sign Up clicked");
    await authClient.signIn.social({
      provider: "google",
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
  };

  // const { data: session } = authClient.useSession();

  return (
    <div className="min-h-[calc(100vh-4.5rem)]">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
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
            {/* Placeholder for future blog posts */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/70 transition-all duration-200 shadow-lg">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                Coming Soon
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Blog posts will appear here soon. Stay tuned for exciting
                content!
              </p>
            </div>
          </div>

          {session ? (
            <>
              <p>Welcome {session.user.name || session.user.email}</p>
              <div>
                <Button onClick={handleLogOut}>Log Out</Button>
              </div>
            </>
          ) : (
            <div>
              <Button onClick={handleSignUp}>Sign Up</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
