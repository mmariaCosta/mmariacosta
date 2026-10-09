import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaEnvelope } from 'react-icons/fa';
import CyberTerminal from '../components/CyberTerminal';
import { useLanguage } from '../contexts/useLanguage';

/* =========================================================
   DADOS HARD-CODED
   ========================================================= */
const PERFIL = {
  name: 'Maria Costa',
  email: 'mmaria.costa@outlook.com',
  whatsapp: '+55 19 99378-6188',
  whatsappUrl: 'https://wa.me/5519993786188',
  typing: {
    pt: [
      'Desenvolvedora em transição pra Cyber',
      'Blue Team · Análise de logs',
      'Python · React · ADVPL',
    ],
    en: [
      'Developer transitioning to Cyber',
      'Blue Team · Log analysis',
      'Python · React · ADVPL',
    ],
  },
  intro: {
    pt: 'Olá, eu sou',
    en: 'Hi, I am',
  },
  role: {
    pt: 'Desenvolvedora · Estudante de Cibersegurança (FIAP 2027)',
    en: 'Developer · Cybersecurity Student (FIAP 2027)',
  },
  bioShort: {
    pt: 'Construí sistemas corporativos por dentro. Agora quero proteger eles por fora. Estagio com ADVPL no Protheus, curso Cyber em 2027, e estou montando um portfólio de projetos que mostram essa transição de verdade.',
    en: 'I built corporate systems from the inside. Now I want to protect them from the outside. I intern with ADVPL on Protheus, start Cyber at FIAP in 2027, and I am building a portfolio that shows this transition for real.',
  },
  bugQuote: {
    pt: '"Comer bugs é meu passatempo favorito!"',
    en: '"Eating bugs is my favorite hobby!"',
  },
  catImage: 'images/perfil.jpg',
};

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
    if (typeof current !== 'string') return;

    const speed = deleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        const next = current.slice(0, Math.max(0, text.length - 1));
        setText(next);
        if (next === '') {
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
  const { t, lang } = useLanguage();

  const typingLines = PERFIL.typing[lang] || PERFIL.typing.pt;
  const typed = useTyping(typingLines);

  const intro = PERFIL.intro[lang] || PERFIL.intro.pt;
  const role = PERFIL.role[lang] || PERFIL.role.pt;
  const bio = PERFIL.bioShort[lang] || PERFIL.bioShort.pt;
  const bugQuote = PERFIL.bugQuote[lang] || PERFIL.bugQuote.pt;
  const catImage = PERFIL.catImage;

  return (
    <div>
      <section className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-app-accent font-mono text-sm mb-3"
          >
            {intro}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-app leading-tight"
          >
            {PERFIL.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-app-muted font-mono min-h-[1.75em]"
          >
            {typed || role}
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
            {bio}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-app-dim italic font-mono text-sm"
          >
            {bugQuote}
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
              {t.home?.ctaProjects || 'Ver projetos'} <FaArrowRight size={12} />
            </Link>

            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         border border-app-strong text-app
                         hover:bg-surface-soft hover:-translate-y-0.5 transition-all"
            >
              <FaEnvelope size={14} /> {t.home?.ctaContact || 'Contato'}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mx-auto"
        >
          <img
            src={catImage}
            alt="Foto de Perfil"
            width="256"
            height="256"
            fetchPriority="high"
            decoding="async"
            className="w-48 md:w-64 aspect-square object-cover rounded-2xl
                      border border-app-strong shadow-app"
          />
        </motion.div>
      </section>

      <CyberTerminal />

      <section id="contato" className="mt-20 pt-12 border-t border-app">
        <header className="text-center mb-8">
          <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
            {t.home?.contactEyebrow || 'Contato'}
          </p>
          <h2 className="text-3xl font-bold text-app">{t.home?.contactTitle || 'Vamos conversar'}</h2>
          <p className="text-app-muted mt-2 text-sm max-w-xl mx-auto">
            {t.home?.contactSubtitle}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href={`mailto:${PERFIL.email}`}
            className="group p-5 rounded-xl border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app hover:-translate-y-0.5
                       transition-all"
          >
            <p className="font-mono text-xs text-app-muted uppercase tracking-widest mb-2">
              email
            </p>
            <p className="text-app font-medium group-hover:text-app-accent transition-colors break-all">
              {PERFIL.email}
            </p>
          </a>

          <a
            href={PERFIL.whatsappUrl}
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
              {PERFIL.whatsapp}
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}