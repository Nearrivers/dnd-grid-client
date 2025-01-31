import { UploadLevelImage } from "@/services/levels";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

interface LevelImageUploadFormProps {
  onUploadSuccess: (file: File) => void;
}

function LevelImageUploadForm(props: LevelImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(true);
  const [err, setErr] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: UploadLevelImage,
    onSuccess: () => {
      setOpen(false);
      if (!file) {
        return;
      }
      props.onUploadSuccess(file);
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive"
      });
      setErr(error.message);
    },
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    setFile(event.target.files[0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open && !mutation.isSuccess}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Image de fond</DialogTitle>
          <DialogDescription>
            Importez une image qui servira de fond à la grille
          </DialogDescription>
        </DialogHeader>
        <form className="group space-x-2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-1 items-center gap-2">
            <Label htmlFor="image" className="sr-only">
              Chemin
            </Label>
            <Input
              required
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Upload</span>
              <Check />
            </Button>
          </div>
          {mutation.isPending && (
            <p className="hidden text-sm text-red-500 group-invalid:block">
              Uploading...
            </p>
          )}
          {mutation.isError && (
            <p className="hidden text-sm text-red-500 group-invalid:block">
              Une erreur est survenue {mutation.error.message}
            </p>
          )}
          <p className="hidden text-sm text-red-500 group-invalid:block">
            Un fichier est obligatoire {err}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LevelImageUploadForm;
