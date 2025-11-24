import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { FetchBlog } from "@/lib/server-functions";

type Props = {
  blog: FetchBlog;
  handleNav: () => void;
};

export function BlogPost({ blog, handleNav }: Props) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAuthorName = (): string => {
    if (blog.authorName?.toLowerCase() === "mohammed ziyad") {
      return "Ziyad";
    }
    return blog.authorName || "Anonymous";
  };
  return (
    <>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto p-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-card/50 transition-colors"
            onClick={() => {
              handleNav();
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <article className="bg-card/30 backdrop-blur-sm border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Article Header */}
          <header className="px-6 py-8 md:px-10 md:py-12 border-b border-border/50">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Author and Date Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                {blog.authorImage ? (
                  <img
                    src={blog.authorImage}
                    alt={blog.authorName || "Author"}
                    className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {blog.authorName?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-base font-medium text-muted-foreground">
                    {getAuthorName()}
                  </span>
                  <span className="text-sm text-muted-foreground/70">
                    Author
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-12 bg-border" />

              {/* Published Date */}
              {blog.publishedAt && (
                <div className="flex flex-col">
                  <span className="text-base font-medium text-muted-foreground">
                    {formatDate(blog.publishedAt)}
                  </span>
                  <span className="text-sm text-muted-foreground/70">
                    Published
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div className="px-6 py-8 md:px-10 md:py-12">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-card-foreground prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80 hover:prose-a:underline
                prose-strong:text-card-foreground prose-strong:font-semibold
                prose-code:text-accent prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80
                prose-ul:text-foreground/90 prose-ul:list-disc prose-ul:ml-6
                prose-ol:text-foreground/90 prose-ol:list-decimal prose-ol:ml-6
                prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border
                prose-hr:border-border prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: blog.content || "" }}
            />
          </div>
        </article>

        {/* Footer spacing */}
        <div className="h-16" />
      </main>
    </>
  );
}
