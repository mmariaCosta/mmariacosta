# mmariacosta

Portfólio pessoal construído em React + Vite. Bilíngue (PT/EN), com tema claro e escuro, terminal interativo, sistema de labs em Markdown e páginas de projetos, skills e certificações.

**Live:** https://mmariacosta.vercel.app/

---

## Sobre o projeto

Sou desenvolvedora ADVPL em transição para cibersegurança. Este portfólio reúne os projetos, labs e estudos que mostram essa transição de forma prática — não só como currículo, mas como vitrine técnica.

A ideia foi construir algo que fosse mais do que uma página estática de "olá, sou X". Tem terminal interativo, sistema de publicação de labs, suporte a dois idiomas, dois temas e uma arquitetura pensada para crescer.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite |
| Estilo | Tailwind CSS + CSS custom properties |
| Animações | Framer Motion |
| Ícones | React Icons + Devicon + Simple Icons |
| Roteamento | React Router |
| Markdown | Parser próprio |
| Deploy | Vercel |

---

## Estrutura

```
src/
├── components/       Componentes reutilizáveis
│   ├── Nav.jsx
│   ├── CyberTerminal.jsx
│   ├── MarkdownRenderer.jsx
│   ├── LabCard.jsx
│   ├── VideoBackground.jsx
│   ├── SocialIcons.jsx
│   └── ...
├── contexts/
│   ├── useLanguage.jsx
│   └── useTheme.jsx
├── hooks/            Hooks personalizados
├── pages/
│   ├── Home.jsx
│   ├── Sobre.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   └── LabDetail.jsx
├── utils/
│   ├── frontmatter.js
│   ├── labs.js
│   └── pickText.js
├── labs/             Arquivos .md dos labs
│   ├── _template.md
│   └── teste.md
├── styles/
│   └── markdown.css
├── App.jsx
└── main.jsx
```

---

## Funcionalidades

### Home
- Hero com digitação animada (cycling de 3 frases)
- Terminal interativo com comandos, histórico e scan simulado
- Bloco de contato com e-mail e WhatsApp
- Foto de perfil com glow animado

### Sobre
- Bio em parágrafos
- Timeline de formação acadêmica e profissional
- Trilha de certificações com barra de progresso geral
- Certificações interativas (clica e vê detalhes de cada uma)

### Skills
- Arsenal dividido em "Dominados" e "Em evolução"
- Ícones carregados via CDN (Devicon e Simple Icons)
- Fallback automático para emoji se o ícone falhar
- Soft skills em lista numerada

### Projetos
- 4 abas: Repos, Write-ups, Notas, Lab
- Cards com screenshot, descrição, stack e botões (Demo + GitHub)
- Aba "Lab" carrega automaticamente os arquivos `.md` da pasta `src/labs/`

### Labs
- Cada lab é um arquivo `.md` com frontmatter YAML
- Sistema lê em tempo de build (sem fetch, sem API)
- Renderização de Markdown com suporte a headers, listas, código, links e imagens
- Página dedicada por lab (`/labs/:slug`)

---

## Desafios técnicos e soluções

### 1. Portfólio que dependia de API do GitHub em tempo real

**Versão inicial:** o portfólio buscava repositórios direto da API do GitHub. Isso trazia vários problemas:

- Cota da API estourava (60 requisições/hora sem token)
- Quebrava silenciosamente quando a API mudava
- Adicionava latência no carregamento
- Dependência externa para algo que podia ser estático

**Solução:** reescrevi o `Projects.jsx` para usar dados hard-coded. Cada projeto é um objeto no próprio arquivo:

```js
const PROJETOS = [
  {
    id: 'torre-de-controle',
    name: 'Torre de Controle',
    summary: 'SOC simulado com geração de logs em tempo real...',
    stack: ['Python', 'FastAPI', 'React', 'Vite'],
    demo: 'https://torre-de-controle-tawny.vercel.app',
    github: 'https://github.com/mmariacosta/torre-de-controle',
    cover: '/projects/torre.png',
  },
  // ...
];
```

**Ganho:** zero requisições externas, carregamento instantâneo, controle total sobre o conteúdo.

### 2. Sistema de publicação de labs sem back-end

Precisava de um jeito de publicar write-ups de labs sem banco de dados, sem CMS e sem API. A solução foi usar `import.meta.glob` do Vite, que lê arquivos em tempo de build:

```js
// src/utils/labs.js
const arquivos = import.meta.glob('/src/labs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

Cada arquivo `.md` tem frontmatter:

```markdown
---
title: Análise de phishing no LetsDefend
date: 2026-10-15
platform: LetsDefend
difficulty: medio
category: Phishing
tags: [phishing, email, iocs]
summary: Análise de e-mail suspeito com extração de IOCs.
---

## Cenário
...
```

E o parser de frontmatter lê os metadados:

```js
// src/utils/frontmatter.js
export function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.startsWith('---')) return { data: {}, content: text };

  const endIdx = text.indexOf('\n---', 3);
  const yamlBlock = text.slice(3, endIdx).trim();
  const content = text.slice(endIdx + 4).replace(/^\n+/, '');

  const data = {};
  for (const line of yamlBlock.split('\n')) {
    const [key, ...rest] = line.split(':');
    let value = rest.join(':').trim();

    // Arrays: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key.trim()] = value.slice(1, -1).split(',').map(s => s.trim());
      continue;
    }
    data[key.trim()] = value;
  }

  return { data, content };
}
```

**Ganho:** publicar um lab novo é só copiar o `.md` pra pasta `src/labs/`. Sem banco, sem API, sem build script.

### 3. Renderizador de Markdown sem dependência

Em vez de instalar `marked` ou `react-markdown`, escrevi um parser próprio em ~80 linhas. Cobre o essencial:

- Headers (h1-h4)
- Bold, italic, code inline
- Code blocks com syntax highlighting básico
- Links, imagens
- Listas ordenadas e não ordenadas
- Blockquotes

```js
// src/components/MarkdownRenderer.jsx
function markdownToHtml(md) {
  let html = md;

  // Extrai code blocks primeiro pra não conflitar com o resto
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
    return `\u0000CODEBLOCK${idx}\u0000`;
  });

  // Escapa HTML restante (evita XSS)
  html = escapeHtml(html);

  // Aplica transformações
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // ...

  // Restaura code blocks
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`\u0000CODEBLOCK${idx}\u0000`, block);
  });

  return html;
}
```

**Cuidado importante:** o `escapeHtml()` roda **antes** das tags serem geradas, evitando XSS em conteúdo Markdown malicioso. Só depois as tags permitidas são injetadas.

### 4. Terminal interativo com histórico e autocomplete

O terminal tem mais lógica do que parece. Suporta:

- Comandos com aliases (`quem-sou` = `whoami`)
- Histórico navegável com setas ↑ ↓
- Scan simulado com delay entre as linhas
- Cores por tipo de comando
- Comandos rápidos clicáveis embaixo

```jsx
const execute = (raw) => {
  const cmd = raw.trim();
  if (!cmd) return;

  pushLine({ type: 'input', text: `$ ${cmd}` });
  setHistory((h) => [...h, cmd]);

  const resolved = resolveCommand(cmd);

  if (resolved.type === 'clear') {
    setLines([]);
    return;
  }

  if (resolved.type === 'scan') {
    runScan(); // simula port scan com setTimeout
    return;
  }

  if (resolved.type === 'output') {
    const out = resolved.cmd.out[lang];
    out.forEach((text, i) => {
      setTimeout(() => pushLine({ type: 'output', text }), i * 60);
    });
    return;
  }

  pushLine({ type: 'error', text: `command not found: ${cmd}` });
};
```

### 5. Bilíngue sem duplicar componente

O sistema de idiomas usa um contexto com hook que retorna `{ t, lang, setLang }`. Os textos ficam em um arquivo de traduções, e cada componente só busca o que precisa:

```jsx
const { t, lang } = useLanguage();

<h1>{t.skills.title}</h1>
<p>{t.skills.subtitle}</p>
```

Quando o usuário clica em **PT** ou **EN**, o contexto atualiza `lang`, todos os componentes consomem o novo valor e a página re-renderiza. Sem duplicar arquivos, sem reload.

### 6. Tema claro/escuro com CSS variables

Tema via classe no `<html>` e CSS custom properties:

```css
:root {
  --bg: #f5f4f7;
  --text: #111114;
  --accent: #7c3aed;
}

[data-theme="dark"] {
  --bg: #0a0613;
  --text: #e4e7eb;
  --accent: #a78bfa;
}
```

Todos os componentes usam `var(--bg)`, `var(--text)`, etc. Trocar tema é trocar um atributo no `<html>`. Zero JS lidando com cor.

O estado persiste em `localStorage` e é lido **antes** do React montar, evitando flash de tema errado:

```html
<script>
  (function () {
    var t = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

### 7. Ícones com fallback automático

O Devicon não tem ícone de ADVPL. Em vez de deixar imagem quebrada, o componente `TechCard` tem 3 níveis de fallback:

1. **Simple Icons** (ícones atualizados) — via CDN
2. **Devicon** (ícones clássicos) — via CDN
3. **Emoji** — fallback final

```jsx
const fallback = (e) => {
  const parent = e.target.parentElement;
  e.target.style.display = 'none';
  const span = document.createElement('span');
  span.textContent = tech.emoji || '📦';
  parent.insertBefore(span, e.target);
};

{tech.simpleIcon ? (
  <img src={`https://cdn.simpleicons.org/${tech.simpleIcon}/${tech.color}`}
       onError={fallback} />
) : tech.icon ? (
  <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}.svg`}
       onError={fallback} />
) : (
  <span>{tech.emoji}</span>
)}
```

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
git clone https://github.com/mmariacosta/mmariacosta.git
cd mmariacosta
npm install
npm run dev
```

Roda em `http://localhost:5173`.

**Build de produção:**

```bash
npm run build
npm run preview
```

---

## Como adicionar um lab novo

1. Escreve o lab no Obsidian (ou qualquer editor Markdown)
2. Adiciona o frontmatter no topo:

   ```markdown
   ---
   title: Nome do lab
   date: 2026-10-15
   platform: LetsDefend
   difficulty: facil
   category: Phishing
   tags: [phishing, iocs]
   summary: Resumo de uma linha.
   lang: pt
   ---
   ```

3. Salva o arquivo em `src/labs/nome-do-lab.md`
4. Commit e push
5. Vercel rebuilda e o lab aparece em `/projetos` → aba **Lab**

**Dificuldades aceitas:** `facil`, `medio`, `dificil` (ou em inglês: `easy`, `medium`, `hard`)

---

## Deploy

Deploy automático via Vercel. Cada push na branch `main` gera um novo deploy em ~1 minuto.

**Domínio:** https://mmariacosta.vercel.app/

---

## Referências

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Devicon](https://devicon.dev/) — ícones de tecnologias
- [Simple Icons](https://simpleicons.org/) — ícones atualizados
- [MITRE ATT&CK](https://attack.mitre.org/) — framework usado nos labs

---

## Autor

**Maria Costa**
Desenvolvedora ADVPL · Estudante de Cibersegurança (FIAP 2027)

- E-mail: mmaria.costa@outlook.com
- LinkedIn: [mmariacosta](https://www.linkedin.com/in/mmariacosta)
- GitHub: [mmariacosta](https://github.com/mmariacosta)
- Portfólio: https://mmariacosta.vercel.app/

---

## Licença

MIT