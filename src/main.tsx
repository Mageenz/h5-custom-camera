import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Camera from './Camera.tsx'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "lib-flexible";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/camera" element={<Camera />} />
      </Routes>
    </Router>
  </StrictMode>
)
