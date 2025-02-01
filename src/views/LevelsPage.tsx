import { Button } from "@/components/ui/button";
import { LevelsRoutes } from "@/routes/levels";
import { GetLevels } from "@/services/levels";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_URL } from "@/constants/API_URL";
import { ButtonGroup } from "@/components/ui/button-group";

function LevelsLoader() {
  return (
    <ul className="flex w-full items-center gap-4">
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
      <li className="h-40 w-4 flex-1 animate-pulse rounded-md bg-muted"></li>
    </ul>
  );
}

function LevelsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["getAllLevels"],
    queryFn: GetLevels,
    retry: 0,
  });

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
            <CardFooter className="flex justify-center">
              <ButtonGroup orientation="horizontal">
                <Button variant={"outline"}>Jouer</Button>
                <Button variant={"outline"}>Editer</Button>
                <Button variant={"outline"}>Supprimer</Button>
              </ButtonGroup>
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
