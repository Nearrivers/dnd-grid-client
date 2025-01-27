import { GetLevels } from "@/services/levels";
import { useQuery } from "@tanstack/react-query";
import LevelsLoader from "./LevelsLoader";

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

export default LevelsList;
