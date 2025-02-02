import { FormEvent, useRef, useState } from "react";
import LevelImageUploadForm from "@/components/levels/LevelImageUploadForm";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/ui/color-picker";
import EditorHeader from "@/components/levels/editor/EditorHeader";
import Editor from "@/components/levels/editor/Editor";
import { useMutation } from "@tanstack/react-query";
import { Level } from "@/types/Level";
import { CreateLevel } from "@/services/levels";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { LevelsRoutes } from "@/routes/levels";

function LevelsForm() {
  const [selected, setSelected] = useState("#ffffff40");
  const [bgImage, setBgImage] = useState<HTMLImageElement | undefined>(
    undefined,
  );
  const [cellWidth, setCellWidth] = useState(20);
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileName = useRef("");

  const mutation = useMutation({
    mutationFn: (newLevel: Level) => CreateLevel(newLevel),
    onSuccess: () => {
      toast({
        description: "Niveau créé avec succès",
      });
      navigate(LevelsRoutes.HOME);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  function onUploadSuccess(file: File) {
    const img = new window.Image();
    fileName.current = file.name;
    img.src = URL.createObjectURL(file);
    img.addEventListener("load", () => {
      setBgImage(img);
    });
  }

  function onSaveLevel(evt: FormEvent) {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;

    const levelName = new FormData(form).get("levelName");
    if (!levelName) {
      return;
    }

    mutation.mutate({
      id: 0,
      grid_color: selected,
      grid_spacing: 2,
      grid_width: cellWidth,
      image_path: fileName.current,
      name: levelName.toString(),
    });
  }

  if (bgImage) {
    URL.revokeObjectURL(bgImage.src);
  }

  return (
    <>
      <EditorHeader onSaveLevel={onSaveLevel} />
      <Editor selected={selected} bgImage={bgImage} cellWidth={cellWidth} />
      <LevelImageUploadForm onUploadSuccess={onUploadSuccess} />
      <footer className="absolute bottom-0 left-0 z-50 w-full justify-between p-6">
        <div className="flex items-center justify-between rounded-xl border bg-background p-4">
          <div className="grid w-1/3 gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="grid-size">Taille de la grille</Label>{" "}
              <p className="text-xs opacity-65">Une case représente 1.5m</p>
              <p className="w-12 rounded-full ml-auto bg-secondary px-2 py-1 text-right text-xs opacity-65">
                {cellWidth}px
              </p>
            </div>
            <Slider
              step={1}
              id="grid-size"
              defaultValue={[cellWidth]}
              min={1}
              max={150}
              onValueChange={(value) => {
                setCellWidth(value[0]);
              }}
            />
          </div>
          <ColorPicker value={selected} onChange={setSelected} />
        </div>
      </footer>
    </>
  );
}

export default LevelsForm;
