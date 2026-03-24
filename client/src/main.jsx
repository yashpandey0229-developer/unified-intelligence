import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// 1. PASTE YOUR KEY HERE (Starts with pk_test_...)
const PUBLISHABLE_KEY = "pk_test_bGVuaWVudC1tb25pdG9yLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ"; 

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)