import LevelsList from "@/components/levels/LevelsList"
import { Button } from "@/components/ui/button"
import { LevelsRoutes } from "@/routes/levels"
import { useNavigate } from "react-router"

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