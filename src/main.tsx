import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <App />
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)
