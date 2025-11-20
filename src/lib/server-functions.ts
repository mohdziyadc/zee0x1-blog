import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { db } from "@/db";
import { blogs, user } from "@/db/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { BlogsSchema, FetchBlogDto } from "./zod-schema";

export const getSessionAndAdminFromServer = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
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
  } catch (error) {
    console.error("Error fetching session and admin status:", error);
    throw new Error("Failed to authenticate user");
  }
});

export const createDraftBlogPost = createServerFn({ method: "POST" })
  .inputValidator(BlogsSchema)
  .handler(async ({ data }) => {
    try {
      await db.insert(blogs).values({
        title: data.title,
        slug: data.slug,
        status: data.status,
        author_id: data.author_id,
        content: data.content,
        excerpt: data.excerpt,
      });
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw new Error("Failed to create blog post");
    }
  });

export const fetchBlogs = createServerFn({ method: "GET" })
  .inputValidator(FetchBlogDto)
  .handler(async ({ data }) => {
    try {
      const blogPosts = await db
        .select({
          authorName: user.name,
          authorImage: user.image,
          ...getTableColumns(blogs),
        })
        .from(blogs)
        .leftJoin(user, eq(user.id, blogs.author_id))
        .where(eq(blogs.status, data.blogStatus))
        .orderBy(desc(blogs.createdAt));
      return blogPosts;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blog posts");
    }
  });

type SessionAndAdmin = Awaited<ReturnType<typeof getSessionAndAdminFromServer>>;
export type Session = SessionAndAdmin["session"];
