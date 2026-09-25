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
import CyberDetail from './pages/CyberDetail';
import Services from './pages/Services';
import Admin from './pages/Admin';
import { useLanguage } from './contexts/useLanguage';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: 'var(--accent)',
              borderTopColor: 'transparent',
            }} />
        <p className="text-app-muted font-mono text-xs tracking-widest uppercase animate-pulse">
          carregando...
        </p>
      </div>
    );
  }

  if (error && !t?.nav) {
    return (
      <div className="min-h-screen bg-app flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-400 font-mono text-sm text-center">
          erro: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg border border-app-strong text-app text-xs
                    hover:bg-surface-soft transition-colors"
        >
          recarregar
        </button>
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
              <Route path="/cyber/:slug"    element={<PageWrapper><CyberDetail /></PageWrapper>} />
              <Route path="/servicos"       element={<PageWrapper><Services /></PageWrapper>} />
              <Route path="/admin"          element={<PageWrapper><Admin /></PageWrapper>} />
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