import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { getSessionAndAdminFromServer } from "@/lib/server-functions";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "zee0x1",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  loader: async () => {
    const { session, isAdmin } = await getSessionAndAdminFromServer();
    return { session, isAdmin };
  },
  component: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument() {
  const { session, isAdmin } = Route.useLoaderData();
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen">
        <Header session={session} isAdmin={isAdmin} />
        <Outlet />
        <Toaster />
        {/* <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
