import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { applyA11yPreferences } from './components/AccessibilitySettingsModal'

// Apply any saved a11y preferences BEFORE first paint so users see the prototype
// in their preferred state immediately, no flash of default styling.
applyA11yPreferences()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
