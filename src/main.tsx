<<<<<<< HEAD

import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithSettings from './AppWithSettings'
import './index.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <AppWithSettings />
  </React.StrictMode>,
)
=======
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> c9d6753 (Initial commit for deployment)
