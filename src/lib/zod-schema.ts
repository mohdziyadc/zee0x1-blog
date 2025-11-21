import { z } from "zod";

export enum BLOG_STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum TIME_SORT {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
  PUBLISHED_AT = "PUBLISHED_AT",
}

export const BlogsSchema = z.object({
  slug: z.string().nonempty(),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  status: z.string().default("DRAFT"),
  author_id: z.string().min(1),
});

export const UpdateBlogSchema = z.object({
  id: z.number(),
  slug: z.string().nonempty(),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  status: z.string().default("DRAFT"),
  author_id: z.string().min(1),
});

export const FetchBlogDto = z.object({
  blogStatus: z.string().optional().default("DRAFT"),
  orderBy: z.nativeEnum(TIME_SORT).optional().default(TIME_SORT.CREATED_AT),
});

export const FetchBlogBySlugDto = z.object({
  slug: z.string().min(1),
});

export const DeleteBlogDto = z.object({
  id: z.number(),
});

export const UpdateBlogStatusDto = z.object({
  id: z.number(),
  status: z.enum([BLOG_STATUS.DRAFT, BLOG_STATUS.PUBLISHED]),
});
