import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FetchBlog, toggleBlogStatus } from "@/lib/server-functions";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { BLOG_STATUS, UpdateBlogStatusDto } from "@/lib/zod-schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  blog: FetchBlog | undefined;
  isPublished?: boolean;
};

type UpdateBlogStatusType = z.infer<typeof UpdateBlogStatusDto>;

export const EditDialog = ({
  isOpen,
  setIsOpen,
  blog,
  isPublished = false,
}: Props) => {
  const navigate = useNavigate();
  const router = useRouter();
  const publishButtonText = isPublished ? "Unpublish" : "Publish";

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: UpdateBlogStatusType) => {
      await toggleBlogStatus({
        data: {
          ...data,
        },
      });
    },
    onSuccess: () => {
      toast.success(
        `Blog post ${isPublished ? "unpublished" : "published"} successfully!`
      );
      setIsOpen(!isOpen);
      router.invalidate();
    },
    onError: (error) => {
      toast.error(
        `Failed to ${isPublished ? "unpublish" : "publish"} blog post. Please try again.`
      );
      console.error("Error updating blog post:", error);
    },
  });

  if (!blog) return null;

  const handleEditClick = () => {
    setIsOpen(false);
    navigate({ to: `/admin/edit/${blog.slug}` });
  };

  const handleStatusChange = () => {
    toggleStatusMutation.mutate({
      id: blog.id,
      status: isPublished ? BLOG_STATUS.DRAFT : BLOG_STATUS.PUBLISHED,
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl!">
          <DialogHeader>
            <DialogTitle>{blog.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto ">
            {blog.content && (
              <div
                className="text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 500) }}
              />
            )}
          </div>
          <DialogFooter className="flex-row! justify-between! items-center">
            <div className="flex flex-row gap-4">
              <Button
                onClick={handleStatusChange}
                className={clsx(
                  "flex justify-center items-center",
                  isPublished
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-700"
                )}
              >
                {toggleStatusMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span>{publishButtonText}</span>
                )}
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => {
                  navigate({ to: `/admin/preview/${blog.slug}` });
                }}
              >
                Preview
              </Button>
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditClick}>Edit Blog</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
