import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="bg-void min-h-screen flex flex-col"
    >
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-32 pb-20">
        <p className="text-text-3 text-xs tracking-[0.3em] uppercase mb-4">Erro 404</p>
        <h1 className="text-text-1 text-3xl md:text-5xl mb-4">Página não encontrada</h1>
        <p className="text-text-2 max-w-md mb-8">
          O endereço que você acessou não existe ou foi movido.
        </p>
        <Link to="/" className="text-text-1 underline underline-offset-4">
          Voltar para a página inicial
        </Link>
      </main>
      <Footer />
    </motion.div>
  )
}
