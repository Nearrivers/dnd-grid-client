import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { LevelsRoutes } from "@/routes/levels";

interface EditorHeaderProps {
  onSaveLevel: FormEventHandler;
}

function EditorHeader({ onSaveLevel }: EditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="color-picker absolute left-0 top-0 z-50 flex w-full justify-between border-b bg-background p-4 pt-6">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl font-extrabold">Grille de jeu</h1>

      </div>
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          onClick={() => {
            navigate(LevelsRoutes.HOME);
          }}
        >
          Annuler
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>OK</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nom du niveau</DialogTitle>
              <DialogDescription>
                Donnez un nom à votre niveau
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex items-center gap-4"
              id="level-form"
              onSubmit={onSaveLevel}
            >
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="levelName"
                className="col-span-3"
                required
              />
            </form>
            <DialogFooter className="flex gap-2">
              <DialogClose className="text-sm" asChild>
                <Button variant={"ghost"}>Annuler</Button>
              </DialogClose>
              <Button type="submit" form="level-form">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

export default EditorHeader;
