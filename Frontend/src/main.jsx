
import axios from 'axios'
import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import './index.css'


const user = JSON.parse(localStorage.getItem("user"));

if (user?.token) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${user.token}`;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </BrowserRouter>
  </StrictMode>
)


