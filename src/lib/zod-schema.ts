import { z } from "zod";

export const BlogsSchema = z.object({
  slug: z.string().nonempty(),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  status: z.string().default("DRAFT"),
  author_id: z.string().min(1),
});
