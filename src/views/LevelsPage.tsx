import { Button } from "@/components/ui/button"
import { LevelsRoutes } from "@/routes/levels"
import { GetLevels } from "@/services/levels";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router"

function LevelsLoader() {
  return (
    <ul className="flex gap-4 items-center w-full">
      <li className="flex-1 animate-pulse h-40 w-4 bg-muted rounded-md"></li>
      <li className="flex-1 animate-pulse h-40 w-4 bg-muted rounded-md"></li>
      <li className="flex-1 animate-pulse h-40 w-4 bg-muted rounded-md"></li>
    </ul>
  );
}

function LevelsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["levels"],
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
    <ul>
      {data?.map((level) => (
        <li key={level.id}>{level.name}</li>
      ))}
    </ul>
  );
}

function LevelsPage() {
  let navigate = useNavigate()

  return (
    <main>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Niveaux</h1>
        <Button variant={"outline"} onClick={() => {navigate(LevelsRoutes.CREATE)}}>Créer un niveau</Button>
      </div>
      <LevelsList />
    </main>
  )
}

export default LevelsPage