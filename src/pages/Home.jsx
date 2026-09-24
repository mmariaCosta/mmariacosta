import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaEnvelope } from 'react-icons/fa';
import CyberTerminal from '../components/CyberTerminal';
import { useLanguage } from '../contexts/useLanguage';

function useTyping(lines = []) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setText('');
    setDeleting(false);
    setIdx(0);
  }, [lines]);

  useEffect(() => {
    if (!lines || lines.length === 0) return;

    const current = lines[idx % lines.length];
    if (!current) return;

    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 1500);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % lines.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, lines]);

  return text;
}

export default function Home() {
  const { t } = useLanguage();
  const typed = useTyping(t?.home?.typing);

  return (
    <div>
      {/* HERO */}
      <section className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-app-accent font-mono text-sm mb-3"
          >
            {t.home.intro}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-app leading-tight"
          >
            {t.home.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-app-muted font-mono min-h-[1.75em]"
          >
            {typed}
            <span
              className="inline-block w-[2px] h-[1.1em] ml-1 align-middle
                         animate-[blink_1s_steps(2)_infinite]"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-app/85 max-w-xl leading-relaxed"
          >
            {t.home.bio}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-app-dim italic font-mono text-sm"
          >
            {t.home.bugQuote}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/projetos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         text-white font-medium transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 20px var(--glow)',
              }}
            >
              {t.home.ctaProjects} <FaArrowRight size={12} />
            </Link>

            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         border border-app-strong text-app
                         hover:bg-surface-soft hover:-translate-y-0.5 transition-all"
            >
              <FaEnvelope size={14} /> {t.home.ctaContact}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mx-auto group"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl
                       transition-opacity duration-500
                       group-hover:opacity-100 opacity-70"
            style={{ backgroundColor: 'var(--glow)' }}
          />
          {/* 🐱 trocar a URL aqui pela foto nova */}
          <img
            src="https://i.pinimg.com/736x/db/ae/13/dbae1315863572eac42a6ee6284479c3.jpg"
            alt="cat"
            className="relative w-48 md:w-64 rounded-2xl border border-app-strong shadow-app
                       transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </motion.div>
      </section>

      {/* TERMINAL INTERATIVO */}
      <CyberTerminal />

      {/* Contato */}
      <section id="contato" className="mt-20 pt-12 border-t border-app">
        <header className="text-center mb-8">
          <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
            {t.home.contactEyebrow}
          </p>
          <h2 className="text-3xl font-bold text-app">{t.home.contactTitle}</h2>
          <p className="text-app-muted mt-2 text-sm max-w-xl mx-auto">
            {t.home.contactSubtitle}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href="mailto:mmaria.costa@outlook.com"
            className="group p-5 rounded-xl border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app hover:-translate-y-0.5
                       transition-all"
          >
            <p className="font-mono text-xs text-app-muted uppercase tracking-widest mb-2">
              email
            </p>
            <p className="text-app font-medium group-hover:text-app-accent transition-colors break-all">
              mmaria.costa@outlook.com
            </p>
          </a>

          <a
            href="https://wa.me/5519993786188"
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-xl border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app hover:-translate-y-0.5
                       transition-all"
          >
            <p className="font-mono text-xs text-app-muted uppercase tracking-widest mb-2">
              whatsapp
            </p>
            <p className="text-app font-medium group-hover:text-app-accent transition-colors">
              +55 19 99378-6188
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}