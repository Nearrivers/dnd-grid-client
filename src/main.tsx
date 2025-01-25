import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import LevelPage from './views/LevelPage.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Routes>
          <Route path='/' element={<App />} />

          <Route path='levels' element={<LevelPage />}/>
        </Routes>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)
