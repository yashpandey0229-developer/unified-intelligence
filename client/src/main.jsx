import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Paste your key from Clerk Dashboard here
const PUBLISHABLE_KEY = "pk_test_bGVuaWVudC1tb25pdG9yLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ"; 

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === "pk_test_bGVuaWVudC1tb25pdG9yLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ") {
  console.error("CRITICAL: You must paste your real Clerk Publishable Key in main.jsx");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)