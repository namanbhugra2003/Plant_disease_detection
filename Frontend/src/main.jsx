import axios from 'axios'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import './index.css'

try {
  const userString = localStorage.getItem("user");

  if (userString) {
    const user = JSON.parse(userString);
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${user.token}`;
    }
  }
} catch (error) {
  console.error("Invalid user data in localStorage", error);
  localStorage.removeItem("user");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </BrowserRouter>
  </StrictMode>
);

