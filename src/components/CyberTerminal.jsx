import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';

const INITIAL_LINES = {
  pt: [
    { type: 'system', text: 'mmariacosta@sec:~$ inicializando sessão...' },
    { type: 'success', text: '[OK] conexão estabelecida' },
    { type: 'muted',  text: 'Digite "ajuda" ou clique em um comando abaixo.' },
  ],
  en: [
    { type: 'system', text: 'mmariacosta@sec:~$ initializing session...' },
    { type: 'success', text: '[OK] connection established' },
    { type: 'muted',  text: 'Type "help" or click a command below.' },
  ],
};

const COMMANDS = {
  help: {
    aliases: { pt: ['ajuda', 'help'], en: ['help', 'ajuda'] },
    out: {
      pt: [
        'Comandos disponíveis:',
        '  quem-sou / whoami ...... quem eu sou',
        '  skills ................. ferramentas e habilidades',
        '  contato / contact ...... formas de contato',
        '  scan ................... simula um port scan (demo)',
        '  ls ..................... lista as seções do site',
        '  cat manifesto.txt ...... meu manifesto pessoal',
        '  limpar / clear ......... limpa o terminal',
      ],
      en: [
        'Available commands:',
        '  whoami / quem-sou ...... who I am',
        '  skills ................. tools and skills',
        '  contact / contato ...... contact info',
        '  scan ................... simulates a port scan (demo)',
        '  ls ..................... lists site sections',
        '  cat manifesto.txt ...... my personal manifesto',
        '  clear / limpar ......... clears the terminal',
      ],
    },
  },
  whoami: {
    aliases: { pt: ['quem-sou', 'whoami'], en: ['whoami', 'quem-sou'] },
    out: {
      pt: [
        'Maria Costa',
        'Analista de Segurança em formação',
        'Campinas · Brasil 🇧🇷',
        'Foco: Cloud Security, análise de vulnerabilidades, automação',
      ],
      en: [
        'Maria Costa',
        'Security Analyst in training',
        'Campinas · Brazil 🇧🇷',
        'Focus: Cloud Security, vulnerability analysis, automation',
      ],
    },
  },
  skills: {
    aliases: { pt: ['skills'], en: ['skills'] },
    out: {
      pt: [
        'Domino ......... Python · C# · SQL Server · Git · VS Code',
        'Em evolução .... AWS · GCP · Docker · Linux',
        'Soft skills .... Pensamento Analítico · Autonomia · Comunicação Direta',
      ],
      en: [
        'Proficient ..... Python · C# · SQL Server · Git · VS Code',
        'Learning ....... AWS · GCP · Docker · Linux',
        'Soft skills .... Analytical Thinking · Autonomy · Direct Communication',
      ],
    },
  },
  contact: {
    aliases: { pt: ['contato', 'contact'], en: ['contact', 'contato'] },
    out: {
      pt: [
        'github    → github.com/mmariacosta',
        'linkedin  → linkedin.com/in/mmariacosta',
        'email     → mmaria.costa@outlook.com',
        'whatsapp  → +55 19 99378-6188',
      ],
      en: [
        'github    → github.com/mmariacosta',
        'linkedin  → linkedin.com/in/mmariacosta',
        'email     → mmaria.costa@outlook.com',
        'whatsapp  → +55 19 99378-6188',
      ],
    },
  },
  ls: {
    aliases: { pt: ['ls', 'listar'], en: ['ls', 'list'] },
    out: {
      pt: ['sobre/   skills/   projetos/   cyber/   servicos/'],
      en: ['about/   skills/   projects/   cyber/   services/'],
    },
  },
  manifesto: {
    aliases: { pt: ['cat manifesto.txt', 'manifesto'], en: ['cat manifesto.txt', 'manifesto'] },
    out: {
      pt: [
        '> Segurança é design, não remendo.',
        '> Não me interessa só o "como", mas o "por quê".',
        '> Estudar todos os dias é o mínimo pra acompanhar essa área.',
      ],
      en: [
        '> Security is design, not a patch.',
        '> I care less about the "how" and more about the "why".',
        '> Studying every day is the minimum to keep up with this field.',
      ],
    },
  },
  sudo: {
    aliases: { pt: ['sudo'], en: ['sudo'] },
    out: {
      pt: ['🛡️  Boa tentativa. Você não tem permissão — ainda.'],
      en: ["🛡️  Nice try. You don't have permission — yet."],
    },
  },
};

const UI = {
  pt: {
    tabLabel: 'Terminal',
    title: 'Experimente o terminal',
    explanation:
      'Fiz esse terminal como uma forma mais interativa de apresentar quem eu sou. Em vez de só ler o conteúdo, você pode digitar comandos — igual a um shell real. Digite "ajuda" pra ver tudo, ou clica em um dos comandos abaixo.',
    quickCmds: ['ajuda', 'quem-sou', 'skills', 'scan', 'contato', 'cat manifesto.txt', 'limpar'],
    scanning: 'Iniciando scan em 127.0.0.1...',
    scanSummary: '4 abertas · 1 fechada · 1 filtrada',
    cmdNotFound: (c) => `comando não encontrado: ${c}`,
  },
  en: {
    tabLabel: 'Terminal',
    title: 'Try the terminal',
    explanation:
      'I built this terminal as a more interactive way to introduce myself. Instead of just reading, you can type commands — like a real shell. Type "help" to see everything, or click a command below.',
    quickCmds: ['help', 'whoami', 'skills', 'scan', 'contact', 'cat manifesto.txt', 'clear'],
    scanning: 'Starting scan on 127.0.0.1...',
    scanSummary: '4 open · 1 closed · 1 filtered',
    cmdNotFound: (c) => `command not found: ${c}`,
  },
};

/* Cores por comando */
const CMD_COLORS = {
  'ajuda':             { main: '#eeeeee', bg: 'rgba(78, 54, 172, 0.39)',   border: 'rgba(82, 50, 211, 0.4)' },
  'help':              { main: '#eeeeee', bg: 'rgba(196, 181, 253, 0.15)', border: 'rgba(113, 92, 197, 0.4)' },
  'quem-sou':          { main: '#eeeeee', bg: 'rgba(43, 158, 173, 0.45)',  border: 'rgba(17, 110, 122, 0.4)' },
  'whoami':            { main: '#eeeeee', bg: 'rgba(138, 234, 247, 0.15)', border: 'rgba(59, 175, 190, 0.4)' },
  'skills':            { main: '#eeeeee', bg: 'rgba(86, 199, 127, 0.44)',  border: 'rgba(54, 143, 86, 0.4)' },
  'scan':              { main: '#eeeeee', bg: 'rgba(219, 84, 84, 0.42)',   border: 'rgba(158, 29, 29, 0.4)' },
  'contato':           { main: '#eeeeee', bg: 'rgba(77, 160, 199, 0.43)',  border: 'rgba(49, 140, 182, 0.4)' },
  'contact':           { main: '#eeeeee', bg: 'rgba(125, 211, 252, 0.15)', border: 'rgba(39, 119, 156, 0.4)' },
  'cat manifesto.txt': { main: '#eeeeee', bg: 'rgba(214, 86, 157, 0.38)',  border: 'rgba(92, 9, 55, 0.4)' },
  'limpar':            { main: '#eeeeee', bg: 'rgba(216, 174, 37, 0.36)',  border: 'rgba(201, 161, 30, 0.4)' },
  'clear':             { main: '#eeeeee', bg: 'rgba(252, 211, 77, 0.15)',  border: 'rgba(173, 137, 18, 0.4)' },
};

function lineColor(type) {
  switch (type) {
    case 'system':  return 'text-purple-400/80';
    case 'muted':   return 'text-purple-500/60';
    case 'input':   return 'text-purple-100 mt-2';
    case 'output':  return 'text-purple-200/90';
    case 'success': return 'text-green-400';
    case 'error':   return 'text-red-400';
    case 'warning': return 'text-yellow-400';
    default:        return 'text-purple-200';
  }
}

export default function CyberTerminal() {
  const { lang } = useLanguage();
  const [lines, setLines] = useState(INITIAL_LINES.pt);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const ui = UI[lang] || UI.pt;

  useEffect(() => {
    setLines(INITIAL_LINES[lang] || INITIAL_LINES.pt);
    setHistory([]);
    setHistoryIdx(-1);
    setInput('');
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const pushLine = (line) => setLines((prev) => [...prev, line]);

  const runScan = () => {
    const hosts = [
      { port: 22,   service: 'ssh',      state: 'open' },
      { port: 80,   service: 'http',     state: 'open' },
      { port: 443,  service: 'https',    state: 'open' },
      { port: 3306, service: 'mysql',    state: 'closed' },
      { port: 5432, service: 'postgres', state: 'filtered' },
      { port: 8080, service: 'http-alt', state: 'open' },
    ];

    pushLine({ type: 'system', text: ui.scanning });

    hosts.forEach((h, i) => {
      setTimeout(() => {
        const colorType =
          h.state === 'open' ? 'success' : h.state === 'closed' ? 'error' : 'warning';
        pushLine({
          type: colorType,
          text: `  ${String(h.port).padEnd(6)}${h.service.padEnd(11)}${h.state}`,
        });
        if (i === hosts.length - 1) {
          setTimeout(() => {
            pushLine({ type: 'muted', text: ui.scanSummary });
          }, 250);
        }
      }, (i + 1) * 200);
    });
  };

  const resolveCommand = (raw) => {
    const lc = raw.trim().toLowerCase();
    if (!lc) return null;

    if (lc === 'clear' || lc === 'limpar') return { type: 'clear' };
    if (lc === 'scan') return { type: 'scan' };

    for (const [key, cmd] of Object.entries(COMMANDS)) {
      const aliases = cmd.aliases?.[lang] || [];
      if (aliases.includes(lc)) {
        return { type: 'output', key, cmd };
      }
    }
    return { type: 'notfound' };
  };

  const execute = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    pushLine({ type: 'input', text: `$ ${cmd}` });
    setHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);

    const resolved = resolveCommand(cmd);

    if (!resolved) return;

    if (resolved.type === 'clear') {
      setLines([]);
      return;
    }

    if (resolved.type === 'scan') {
      runScan();
      return;
    }

    if (resolved.type === 'output') {
      const out = resolved.cmd.out[lang] || resolved.cmd.out.en;
      out.forEach((text, i) => {
        setTimeout(() => pushLine({ type: 'output', text }), i * 60);
      });
      return;
    }

    pushLine({ type: 'error', text: ui.cmdNotFound(cmd) });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <section className="py-12">
      <div className="text-center mb-6">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-3">
          § {ui.tabLabel}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-app">{ui.title}</h2>
      </div>

      <div className="max-w-2xl mx-auto mb-8 text-center">
        <p className="text-app-muted text-sm leading-relaxed">{ui.explanation}</p>
      </div>

      <div className="rounded-xl border border-app-strong bg-[#0a0613] overflow-hidden shadow-app">
        {/* Barra superior */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-app bg-[#8b55d1c0]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[10px] font-mono text-app-muted">
            mmariacosta@sec — /bin/bash
          </span>
          <span className="ml-auto text-[10px] font-mono text-green-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            ONLINE
          </span>
        </div>
        {/* Corpo do terminal */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 h-72 overflow-y-auto font-mono text-xs leading-relaxed cursor-text"
        >
          {lines.map((line, i) => (
            <div key={i} className={lineColor(line.type)}>
              {line.text}
            </div>
          ))}

          <div className="flex items-center gap-1 mt-1">
            <span className="text-purple-400">mmariacosta@sec</span>
            <span className="text-app-muted">:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-app-muted">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent outline-none text-purple-100 caret-purple-400 ml-1"
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal input"
            />
          </div>
        </div>

        {/* Barra inferior com comandos coloridos */}
        <div className="flex flex-wrap gap-1.5 px-4 py-3 border-t border-app bg-[#8b55d1c0]">
          {ui.quickCmds.map((cmd) => {
            const c = CMD_COLORS[cmd] || CMD_COLORS['ajuda'];
            return (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd);
                  inputRef.current?.focus();
                }}
                className="text-[10px] font-mono px-2.5 py-1 rounded-md
                           border transition-all hover:scale-105"
                style={{
                  color: c.main,
                  backgroundColor: c.bg,
                  borderColor: c.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = c.main;
                  e.currentTarget.style.color = '#0a0613';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = c.bg;
                  e.currentTarget.style.color = c.main;
                }}
              >
                {cmd}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}