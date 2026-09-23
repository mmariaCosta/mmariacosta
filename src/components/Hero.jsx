import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import Arcade from '../components/Arcade';

const TYPING_LINES = [
  'Hi!! I AM Maria Costa',
  'Dev Cloud Security',
  'From Brazil 🇧🇷',
  'Apaixonada por Cloud!!',
];

function useTyping(lines) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[idx];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % lines.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, lines]);

  return text;
}

export default function Home() {
  const typed = useTyping(TYPING_LINES);

  return (
    <div>
      {/* HERO */}
      <section className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 font-mono text-sm mb-3"
          >
            Olá, eu sou
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
          >
            Maria Costa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-purple-300 font-mono min-h-[1.75em]"
          >
            {typed}
            <span className="inline-block w-[2px] h-[1.1em] bg-purple-400 ml-1 align-middle
                             animate-[blink_1s_steps(2)_infinite]" />
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-purple-200/80 max-w-xl leading-relaxed"
          >
            Desenvolvedora apaixonada por Cloud, segurança e automação.
            Transformo ideias em infraestrutura resiliente — e adoro
            estudar vulnerabilidades com um bom café. 
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-purple-400/80 italic font-mono text-sm"
          >
            &gt; "Eating bugs is my favorite pastime!" 🍒
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
                         bg-purple-600 hover:bg-purple-500 text-white font-medium
                         shadow-[0_0_20px_rgba(168,85,247,0.4)]
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]
                         transition-all"
            >
              Ver projetos <FaArrowRight size={12} />
            </Link>

            <a
              href="https://github.com/mmariacosta"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         border border-purple-700/60 text-purple-200
                         hover:bg-purple-900/30 hover:border-purple-500/80
                         transition-all"
            >
              <FaGithub size={14} /> GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mx-auto"
        >
          <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full" />
          <img
            src="https://i.pinimg.com/736x/db/ae/13/dbae1315863572eac42a6ee6284479c3.jpg"
            alt="cat"
            className="relative w-48 md:w-64 rounded-2xl border border-purple-700/50
                       shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          />
        </motion.div>
      </section>

      {/* ARCADE */}
      <Arcade />

    </div>
  );
}