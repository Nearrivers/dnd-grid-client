import { useNavigate } from 'react-router'
import { Button } from './components/ui/button'

function App() {
  const navigate = useNavigate()

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <Button onClick={() => navigate('/levels')}>
          Navigation
        </Button>
      </div>
    </>
  )
}

export default App
