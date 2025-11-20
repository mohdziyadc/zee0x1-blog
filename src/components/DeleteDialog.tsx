import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type Props = {
  isDelete: boolean;
  setIsDelete: (open: boolean) => void;
  onDelete: () => void;
};

export const DeleteDialog = ({ isDelete, setIsDelete, onDelete }: Props) => {
  const handleDelete = () => {
    onDelete();
  };
  return (
    <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this blog
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={handleDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
