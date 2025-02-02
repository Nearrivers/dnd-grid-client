import { Button } from "@/components/ui/button";
import { LevelsRoutes } from "@/routes/levels";
import { DeleteLevel, GetLevels } from "@/services/levels";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { API_URL } from "@/constants/API_URL";
import { useToast } from "@/hooks/use-toast";

function LevelsLoader() {
  return (
    <ul className="flex w-full items-center gap-4">
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
    </ul>
  );
}

interface DeleteLevelDialogProps {
  levelName: string;
  levelId: number;
  onLevelDeleted: () => void;
}

function DeleteLevelDialog({
  levelName,
  levelId,
  onLevelDeleted,
}: DeleteLevelDialogProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => DeleteLevel(levelId),
    onSuccess: () => {
      toast({
        description: `Niveau "${levelName}" supprimé`,
      });
      onLevelDeleted();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"outline"}>Supprimer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer "{levelName}" ?</AlertDialogTitle>
          <AlertDialogDescription>
            Une fois le niveau supprimé, il ne sera pas possible de le
            récupérer. Vous perdrez les paramètres de la grille ainsi que les
            entités que vous avez ajouté.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              className="hover: bg-destructive"
              onClick={() => mutation.mutate()}
            >
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function LevelsList() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["getAllLevels"],
    queryFn: GetLevels,
    retry: 0,
  });

  function onLevelDeleted() {
    refetch()
  }

  if (isPending) {
    return <LevelsLoader />;
  }

  if (isError) {
    return <span>Impossible de récupérer les niveaux</span>;
  }

  return (
    <ul className="grid grid-cols-3 gap-4">
      {data?.map((level) => (
        <li key={level.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{level.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img
                src={API_URL + "/" + level.image_path}
                className="h-80 object-contain"
              />
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button variant={"outline"}>Jouer</Button>
              <Button variant={"outline"}>Editer</Button>
              <DeleteLevelDialog levelName={level.name} levelId={level.id} onLevelDeleted={onLevelDeleted} />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function LevelsPage() {
  let navigate = useNavigate();

  return (
    <main>
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-extrabold">Niveaux</h1>
        <Button
          variant={"outline"}
          onClick={() => {
            navigate(LevelsRoutes.CREATE);
          }}
        >
          Créer un niveau
        </Button>
      </div>
      <LevelsList />
    </main>
  );
}

export default LevelsPage;
