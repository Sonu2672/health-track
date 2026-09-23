import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,

  onOfflineReady() {
    console.log('✅ HealthTrack is ready to work offline')
  },

  onNeedRefresh() {
    console.log('🔄 New HealthTrack version available')
  },

  onRegisterError(error) {
    console.error('❌ PWA registration error:', error)
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
