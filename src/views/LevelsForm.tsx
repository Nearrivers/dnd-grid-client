import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UploadLevelImage } from "@/services/levels";

function LevelsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(true);
  const mutation = useMutation({
    mutationFn: UploadLevelImage,
    onSuccess: () => {
      setOpen(false);
    },
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
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
    <>
      <h1 className="text-xl font-bold">Nouveau niveau</h1>
      <Dialog open={open && !mutation.isSuccess}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Image de fond</DialogTitle>
            <DialogDescription>
              Importez une image qui servira de fond à la grille
            </DialogDescription>
          </DialogHeader>
          <form className="space-x-2 group" onSubmit={handleSubmit}>
            <div className="flex flex-1 mb-1 items-center gap-2">
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
              <p className="text-sm opacity-65">Uploading...</p>
            )}
            {mutation.isError && (
              <p className="text-sm group-invalid:block hidden text-red-500">
                Une erreur est survenue
              </p>
            )}
            <p className="text-sm group-invalid:block hidden text-red-500">
              Un fichier est obligatoire
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LevelsForm;
