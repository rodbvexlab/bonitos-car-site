import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Leves from './pages/Leves'
import Pesados from './pages/Pesados'
import Orcamento from './pages/Orcamento'
import NotFound from './pages/NotFound'
import { applyRouteSeo } from './lib/seo'
import FloatingWhatsApp from './components/shared/FloatingWhatsApp'

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    applyRouteSeo(location.pathname)
  }, [location.pathname])

  const handleExitComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/leves" element={<Leves />} />
        <Route path="/pesados" element={<Pesados />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="*" element={<NotFound />} />
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
