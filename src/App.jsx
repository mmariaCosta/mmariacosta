import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import VideoBackground from './components/VideoBackground';
import Nav from './components/Nav';
import SocialIcons from './components/SocialIcons';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Cyber from './pages/Cyber';
import Services from './pages/Services';
import { useLanguage } from './contexts/useLanguage';
import Admin from './pages/Admin';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-6 py-16"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const { t, loading, error } = useLanguage();

  // Aguarda as traduções carregarem
  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <p className="text-app-muted font-mono text-sm animate-pulse">
          carregando...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <p className="text-red-400 font-mono text-sm">erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Nav />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"               element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/sobre"          element={<PageWrapper><Sobre /></PageWrapper>} />
              <Route path="/skills"         element={<PageWrapper><Skills /></PageWrapper>} />
              <Route path="/projetos"       element={<PageWrapper><Projects /></PageWrapper>} />
              <Route path="/projetos/:name" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
              <Route path="/cyber"          element={<PageWrapper><Cyber /></PageWrapper>} />
              <Route path="/servicos"       element={<PageWrapper><Services /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="border-t border-app py-10">
          <SocialIcons />
          <p className="text-center text-app-muted text-xs font-mono mt-6">
            © {new Date().getFullYear()} Maria Costa · {t.footer?.tagline}
          </p>
        </footer>
      </div>
    </div>
  );
}