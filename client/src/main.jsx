import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Replace with your actual key from Clerk Dashboard
const PUBLISHABLE_KEY = "pk_test_bGVuaWVudC1tb25pdG9yLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ" 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)