import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LevelsPage from "./views/LevelsPage";
import { LevelsRoutes } from "./routes/levels";
import LevelsForm from "./views/LevelsForm";

function App() {
  const queryClient = new QueryClient();

  return (
    <main className="px-4 pt-6">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path={LevelsRoutes.HOME} element={<LevelsPage />} />
          <Route path={LevelsRoutes.CREATE} element={<LevelsForm />} />
          <Route path={LevelsRoutes.EDIT} element={<LevelsForm />} />
        </Routes>
      </QueryClientProvider>
    </main>
  );
}

export default App;
