CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"content" text,
	"excerpt" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"author_id" text NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
