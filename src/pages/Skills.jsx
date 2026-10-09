import { useLanguage } from '../contexts/useLanguage';
import { pickText } from '../utils/pickText';


/* =========================================================
   DADOS HARD-CODED
   ========================================================= */
const KNOWN = [
  { name: 'Python',     icon: 'python/python-original' },
  { name: 'JavaScript', icon: 'javascript/javascript-original' },
  { name: 'React',      icon: 'react/react-original' },
  { name: 'C#',         icon: 'csharp/csharp-original' },
  { name: 'SQL Server', icon: 'microsoftsqlserver/microsoftsqlserver-plain' },
  { name: 'Git',        icon: 'git/git-original' },
  { name: 'VS Code',    icon: 'vscode/vscode-original' },
  { name: 'HTML5',      icon: 'html5/html5-original' },
  { name: 'CSS3',       icon: 'css3/css3-original' },
  { name: 'ADVPL',      icon: null, emoji: '/images/advpl.svg' }, 
  { name: 'Firebase',   simpleIcon: 'firebase', color: 'FFCA28' },
  { name: 'Node.js',    icon: 'nodejs/nodejs-original' },
  { name: 'PowerShell', icon: 'powershell/powershell-original' },
];

const LEARNING = [
  { name: 'AWS',    icon: 'amazonwebservices/amazonwebservices-original-wordmark' },
  { name: 'Docker', icon: 'docker/docker-original' },
  { name: 'Linux',  icon: 'linux/linux-original' },
  { name: 'Ruby',   icon: 'ruby/ruby-original' },
  { name: 'Rust',   icon: 'rust/rust-original' },
];

const SOFT_SKILLS = [
  {
    title: { pt: 'Pensamento Analítico', en: 'Analytical Thinking' },
    desc: {
      pt: 'Gosto de quebrar problemas em partes menores, entender a causa raiz e construir uma solução que faça sentido no contexto.',
      en: 'I like breaking problems into smaller parts, understanding the root cause, and building solutions that make sense in context.',
    },
  },
  {
    title: { pt: 'Autonomia', en: 'Autonomy' },
    desc: {
      pt: 'Aprendo sozinha quando preciso. Pesquiso, testo, erro e ajusto até funcionar — sem depender de alguém me guiando a cada passo.',
      en: 'I learn on my own when needed. I research, test, fail, and adjust until it works — without needing someone guiding every step.',
    },
  },
  {
    title: { pt: 'Comunicação Direta', en: 'Direct Communication' },
    desc: {
      pt: 'Prefiro clareza a rodeios. Explico o que fiz, o que não fiz e o que precisa ser feito — sem inflar resultado.',
      en: 'I prefer clarity over fluff. I explain what I did, what I did not do, and what needs to be done — without inflating results.',
    },
  },
  {
    title: { pt: 'Curiosidade Técnica', en: 'Technical Curiosity' },
    desc: {
      pt: 'Não me contento com "funciona". Quero entender o porquê por trás de cada escolha — de arquitetura a detalhes de implementação.',
      en: 'I am not satisfied with "it works". I want to understand the why behind every choice — from architecture to implementation details.',
    },
  },
];

function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`group relative rounded-2xl border border-app bg-surface-soft
                  overflow-hidden transition-all ${
                    hover ? 'hover:border-app-strong hover:shadow-app hover:-translate-y-0.5' : ''
                  } ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CARD DE TECNOLOGIA (aceita ícone ou emoji)
   ========================================================= */
function TechCard({ tech, muted = false }) {
  // Função de fallback: quando um ícone falha, cai pro emoji
  const fallback = (e) => {
    const parent = e.target.parentElement;
    e.target.style.display = 'none';
    const span = document.createElement('span');
    span.className = 'text-2xl leading-none';
    span.textContent = tech.emoji || '📦';
    parent.insertBefore(span, e.target);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                  border border-app bg-surface min-h-[72px]
                  ${muted ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}
    >
      {/* Prioridade 1: Simple Icons (ícones atualizados) */}
      {tech.simpleIcon ? (
        <img
          src={`https://cdn.simpleicons.org/${tech.simpleIcon}/${tech.color || 'white'}`}
          alt={tech.name}
          className="h-8 w-8"
          loading="lazy"
          onError={fallback}
        />
      ) : tech.icon ? (
        // Prioridade 2: Devicon (ícones clássicos)
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}.svg`}
          alt={tech.name}
          className="h-8 w-8"
          loading="lazy"
          onError={fallback}
        />
      ) : (
        // Prioridade 3: Emoji ou caminho de imagem customizada
        tech.emoji?.startsWith('/') ? (
          <img
            src={tech.emoji}
            alt={tech.name}
            className="h-8 w-8"
            loading="lazy"
            onError={fallback}
          />
        ) : (
          <span className="text-2xl leading-none">{tech.emoji || '📦'}</span>
        )
      )}

      <span className={`text-[10px] text-center font-mono ${muted ? 'text-app-muted' : 'text-app'}`}>
        {tech.name}
      </span>
    </div>
  );
}

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Skills() {
  const { t, lang } = useLanguage();

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.skills.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.skills.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.skills.subtitle}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }}
            />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.skills.arsenalTitle}
            </h2>
            <span
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }}
            />
          </div>

          <div className="space-y-4">
            {/* Dominados */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-muted">
                  {t.skills.groups.known}
                </p>
                <span className="text-[10px] font-mono text-app-dim ml-auto">
                  {KNOWN.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {KNOWN.map((s) => (
                  <TechCard key={s.name} tech={s} />
                ))}
              </div>
            </Card>

            {/* Em evolução */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1.5 h-1.5 rounded-full border"
                  style={{ borderColor: 'var(--accent)' }}
                />
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-muted">
                  {t.skills.groups.learning}
                </p>
                <span className="text-[10px] font-mono text-app-dim ml-auto">
                  {LEARNING.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {LEARNING.map((s) => (
                  <TechCard key={s.name} tech={s} muted />
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Soft Skills */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }}
            />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.skills.softTitle}
            </h2>
            <span
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }}
            />
          </div>

          <ul className="space-y-3">
            {SOFT_SKILLS.map((s, i) => (
              <li
                key={i}
                className="group p-4 rounded-2xl border border-app bg-surface-soft
                           hover:border-app-strong hover:shadow-app
                           hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-app-dim tabular-nums mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-app font-semibold text-sm mb-1 leading-tight
                                   group-hover:text-app-accent transition-colors">
                      {pickText(s.title, lang)}
                    </h3>
                    <p className="text-app-muted text-xs leading-relaxed">
                      {pickText(s.desc, lang)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}