import { z } from "zod";

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
});

export const FetchBlogBySlugDto = z.object({
  slug: z.string().min(1),
});

export const DeleteBlogDto = z.object({
  id: z.number(),
});
