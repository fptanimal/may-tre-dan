import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="231771031530-ssfch2virq7pnjue42fk5opig7kd0goh.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
