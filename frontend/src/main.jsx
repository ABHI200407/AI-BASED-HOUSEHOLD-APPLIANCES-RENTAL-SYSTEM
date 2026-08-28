import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './rentova.css'
import './components/CreativeEffects.css'
import CommandCenter from './components/CommandCenter.jsx'
import App from './App.jsx'
import AmbientOrbs from './components/AmbientOrbs.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
