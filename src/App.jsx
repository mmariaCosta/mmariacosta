import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import VideoBackground from './components/VideoBackground';
import Nav from './components/Nav';
import SocialIcons from './components/SocialIcons';
import PacManIcon from './components/PacManIcon';
import Home from './pages/Home';
import SoftSkills from './pages/SoftSkills';
import HardSkills from './pages/HardSkills';
import Projects from './pages/Projects';
import Education from './pages/Education';
import { useLanguage } from './contexts/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen">
      <VideoBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Nav />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"            element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/soft-skills" element={<PageWrapper><SoftSkills /></PageWrapper>} />
              <Route path="/hard-skills" element={<PageWrapper><HardSkills /></PageWrapper>} />
              <Route path="/projetos"    element={<PageWrapper><Projects /></PageWrapper>} />
              <Route path="/formacao"    element={<PageWrapper><Education /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="border-t border-app py-10">
          <SocialIcons />
          <div className="flex items-center justify-center gap-2 mt-6">
            <PacManIcon size={18} />
            <p className="text-app-muted text-xs font-mono">
              © {new Date().getFullYear()} Maria Costa · {t.footer.tagline}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}