import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Leves from './pages/Leves'
import Pesados from './pages/Pesados'
import Orcamento from './pages/Orcamento'
import FloatingWhatsApp from './components/shared/FloatingWhatsApp'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/leves" element={<Leves />} />
        <Route path="/pesados" element={<Pesados />} />
        <Route path="/orcamento" element={<Orcamento />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <FloatingWhatsApp />
    </BrowserRouter>
  )
}
