import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FetchBlog } from "@/lib/server-functions";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  blog: FetchBlog | undefined;
};

export const EditDialog = ({ isOpen, setIsOpen, blog }: Props) => {
  const navigate = useNavigate();

  if (!blog) return null;

  const handleEditClick = () => {
    setIsOpen(false);
    navigate({ to: `/admin/edit/${blog.slug}` });
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
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditClick}>Edit Blog</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
