import { FetchBlog } from "@/lib/server-functions";

type Props = {
  blog: FetchBlog | undefined;
  handleCardClick: () => void;
  isPublished?: boolean;
};

export const BlogCard = ({ blog, handleCardClick, isPublished }: Props) => {
  if (!blog) {
    return null;
  }

  const displayDate = isPublished ? blog.publishedAt : blog.createdAt;

  return (
    <div
      key={blog.id}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-card/70 transition-all duration-200 shadow-lg cursor-pointer flex flex-col h-56"
      onClick={() => {
        handleCardClick();
      }}
    >
      <h2 className="text-2xl font-semibold text-card-foreground mb-3 line-clamp-2">
        {blog.title}
      </h2>
      <p className="text-muted-foreground leading-relaxed flex-1 overflow-hidden text-ellipsis">
        {blog.excerpt}
      </p>
      <p className="text-xs text-muted-foreground/70 mt-2">
        {displayDate &&
          new Date(displayDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
      </p>
    </div>
  );
};
