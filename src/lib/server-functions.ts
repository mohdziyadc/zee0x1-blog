import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { db } from "@/db";
import { blogs, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BlogsSchema } from "./zod-schema";

export const getSessionAndAdminFromServer = createServerFn({
  method: "GET",
}).handler(async () => {
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
});

export const createDraftBlogPost = createServerFn({ method: "POST" })
  .inputValidator(BlogsSchema)
  .handler(async ({ data }) => {
    await db.insert(blogs).values({
      title: data.title,
      slug: data.slug,
      status: data.status,
      author_id: data.author_id,
      content: data.content,
      excerpt: data.excerpt,
    });
  });

type SessionAndAdmin = Awaited<ReturnType<typeof getSessionAndAdminFromServer>>;
export type Session = SessionAndAdmin["session"];
