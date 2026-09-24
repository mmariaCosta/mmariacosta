export const translations = {
  pt: {
    nav: {
      home: 'Início',
      about: 'Sobre',
      skills: 'Skills',
      projects: 'Projetos',
      cyber: 'Cyber',
      services: 'Serviços',
    },

    home: {
      intro: 'Olá, eu sou',
      name: 'Maria Costa',
      typing: [
        'Hi!! I AM Maria Costa',
        'Analista de Segurança em formação',
        'From Brazil 🇧🇷',
        'Apaixonada por Cyber!!',
      ],
      bio: 'Pensamento estratégico aplicado à segurança de sistemas. Estudante de Cibersegurança em formação, com foco em infraestrutura resiliente, análise de vulnerabilidades e automação. Não me interessa só o "como", mas o "por quê" por trás de cada falha. Segurança é design, não remendo.',
      bugQuote: '> "Comer bugs é meu passatempo favorito!" 🍒',
      ctaProjects: 'Ver projetos',
      ctaContact: 'Contato',
      contactEyebrow: 'Contato',
      contactTitle: 'Vamos conversar',
      contactSubtitle: 'Estou aberta a oportunidades, colaborações e trocas sobre segurança.',
      email: 'mmaria.costa@outlook.com',
    },

    sobre: {
      eyebrow: 'Sobre',
      title: 'Quem eu sou',
      subtitle: 'Um pouco da minha trajetória, do que acredito e do que estou construindo.',
      bio: [
        'Sou Maria Costa, estudante de Cibersegurança com base técnica em programação e infraestrutura. Vim do ensino médio integrado ao técnico em Informática pelo Cotuca (Unicamp), e em 2027 inicio a graduação em Cibersegurança pela FIAP.',
        'O que me move na segurança não é só o desafio técnico, mas a forma de pensar: entender a origem da falha, questionar o porquê, e projetar sistemas que resistam por design — não por remendo.',
        'Fora do código, gosto de escrever sobre o que aprendo, resolver desafios em CTFs e estudar arquiteturas de defesa.',
      ],
      eduTitle: 'Formação',
      eduSubtitle: 'Do estudo à prática — o que construí até aqui.',
      education: {
        academic: 'Acadêmica',
        professional: 'Profissional',
        items: {
          academic: [
            {
              title: 'FIAP — Cibersegurança',
              place: 'Tecnólogo · FIAP',
              period: '2027 — 2029 (previsão)',
              desc: 'Formação superior focada em segurança da informação, pentest, criptografia e defesa cibernética.',
              tags: ['Cyber', 'Pentest', 'Defesa'],
            },
            {
              title: 'Técnico em Informática',
              place: 'Colégio Técnico de Campinas (Cotuca/Unicamp)',
              period: '2023 — 2026',
              desc: 'Ensino médio integrado ao técnico em Informática — programação, redes, banco de dados e infraestrutura.',
              tags: ['Programação', 'Redes', 'BD'],
            },
          ],
          professional: [
            {
              title: 'Estagiária em TI',
              place: 'Alpha Consultoria de Sistemas',
              period: 'fev 2026 — fev 2027',
              desc: 'Atuação em consultoria de sistemas com foco em suporte, automação e infraestrutura.',
              tags: ['TI', 'Automação', 'Infra'],
            },
          ],
        },
      },
      certsTitle: 'Trilha de certificações',
      certsSubtitle: 'Metas de certificação que estou perseguindo — roadmap de evolução técnica.',
      certsHint: '// certificações são metas — atualizo o status conforme avanço',
      certsStatus: {
        done: 'concluída',
        studying: 'estudando',
        planned: 'planejada',
      },
      certs: [
        {
          name: 'AWS Cloud Practitioner',
          issuer: 'Amazon Web Services',
          status: 'studying',
          year: '2026',
        },
        {
          name: 'CompTIA Security+',
          issuer: 'CompTIA',
          status: 'planned',
          year: '2027',
        },
        {
          name: 'AWS Security Specialty',
          issuer: 'Amazon Web Services',
          status: 'planned',
          year: '2028',
        },
      ],
    },

    skills: {
      eyebrow: 'Skills',
      title: 'Ferramentas e habilidades',
      subtitle: 'O arsenal técnico e as soft skills que carrego pra qualquer time.',
      arsenalTitle: 'Arsenal',
      arsenalSubtitle: 'O que já domino e o que estou colocando na bagagem.',
      learningHint: 'em progresso',
      groups: {
        known: 'Domino',
        learning: 'Em evolução',
      },
      softTitle: 'Soft Skills',
      softSubtitle: 'Habilidades que não se aprende só em curso técnico.',
      softItems: [
        {
          title: 'Pensamento Analítico',
          desc: 'Quebro o problema em partes, entendo o contexto antes de agir e questiono o porquê.',
        },
        {
          title: 'Autonomia e Autogestão',
          desc: 'Consigo me organizar sozinha, priorizar tarefas e entregar sem precisar de cobrança.',
        },
        {
          title: 'Aprendizado Contínuo',
          desc: 'Estudo todos os dias — seja uma ferramenta nova, um conceito ou um erro que cometi.',
        },
        {
          title: 'Planejamento Estratégico',
          desc: 'Penso no impacto a longo prazo antes de decidir. Prefiro construir certo do que refazer depois.',
        },
        {
          title: 'Comunicação Direta',
          desc: 'Falo claro, pergunto quando não sei e não enrolo quando preciso dizer não.',
        },
        {
          title: 'Adaptabilidade Estruturada',
          desc: 'Lido bem com mudanças sem perder o método — me adapto rápido, mas com processo.',
        },
      ],
    },

    projects: {
      eyebrow: 'Projetos',
      title: 'Coisas que construí',
      subtitle: 'Sincronizado em tempo real com meu GitHub.',
      loading: 'carregando projetos...',
      error: '⚠️ erro ao buscar do GitHub',
      errorHint: '(talvez o limite da API tenha estourado — tente de novo em 1h)',
      empty: '— sem descrição —',
      viewDetails: 'ver detalhes',
    },

    projectDetail: {
      eyebrow: 'Projeto',
      loading: 'carregando projeto',
      error: 'Não foi possível carregar este projeto.',
      back: 'voltar para projetos',
      viewRepo: 'Ver no GitHub',
      viewLive: 'Ver ao vivo',
      topics: 'Tópicos',
      readme: 'Sobre o projeto',
      about: 'Informações',
      locale: 'pt-BR',
      meta: {
        language: 'Linguagem',
        stars: 'Estrelas',
        forks: 'Forks',
        updated: 'Atualizado',
      },
      aboutFields: {
        repo: 'Repositório',
        live: 'Demo ao vivo',
        branch: 'Branch',
        license: 'Licença',
        created: 'Criado em',
      },
    },

    cyber: {
      eyebrow: 'Cyber',
      title: 'Laboratório e prática',
      subtitle: 'O que estou construindo, quebrando e documentando.',
      intro: 'Esta seção existe pra registrar minha evolução prática em segurança — não só o que eu estudo na teoria, mas o que eu monto, quebro e documento. Aqui você encontra três abas: o Lab mostra meu ambiente de estudos (máquinas virtuais, ferramentas e exercícios); os Write-ups reúnem os desafios de CTF que resolvi e o que aprendi em cada um; e as Notas são resumos curtos dos temas que estou estudando.',
      tabs: {
        lab: 'Lab',
        writeups: 'Write-ups',
        notes: 'Notas',
      },
      lab: {
        title: 'Meu Home Lab',
        subtitle: 'Ambiente onde pratico ataques, defesas e automação.',
        intro: 'Meu home lab é o laboratório pessoal onde treino sem medo de quebrar nada. É composto por máquinas virtuais isoladas, ferramentas que uso no dia a dia e exercícios que pratico para fixar o que estudo.',
        emptyTitle: 'Home Lab em construção',
        emptyDesc: 'Estou montando meu ambiente virtualizado para praticar segurança. Volte em breve para ver as máquinas, ferramentas e exercícios documentados.',
        status: {
          done: 'pronto',
          building: 'montando',
          planned: 'planejado',
        },
        sections: {
          vms: 'Máquinas Virtuais',
          tools: 'Ferramentas',
          exercises: 'Exercícios',
        },
        vms: [],
        tools: [],
        exercises: [],
      },
      writeups: {
        title: 'Desafios resolvidos',
        subtitle: 'CTFs, laboratórios e desafios práticos que documentei.',
        intro: 'Cada write-up registra um desafio que resolvi — do TryHackMe, HackTheBox ou PicoCTF. Mais do que a resposta, o que importa é o raciocínio por trás da solução e o que aprendi no caminho.',
        emptyTitle: 'Nenhum write-up ainda',
        emptyDesc: 'Estou começando minha jornada em CTFs (TryHackMe, HackTheBox, PicoCTF). Em breve vou publicar aqui os desafios que resolver e o que aprendi.',
        viewOn: 'ver no',
        difficulty: {
          easy: 'fácil',
          medium: 'médio',
          hard: 'difícil',
        },
        items: [],
      },
      notes: {
        title: 'Anotações de estudo',
        subtitle: 'O que estou aprendendo, resumido em texto curto.',
        intro: 'Escrever é a melhor forma de fixar o que se aprende. Aqui publico resumos curtos de temas que estudo — não são tutoriais completos, são minhas anotações pessoais que podem servir pra quem está começando também.',
        emptyTitle: 'Nenhuma nota publicada',
        emptyDesc: 'Escrever é a melhor forma de fixar o que se aprende. Vou publicar aqui resumos de temas que estudo — OWASP, redes, criptografia, resposta a incidentes.',
        readMore: 'ler mais',
        items: [],
      },
    },

    services: {
      eyebrow: 'Serviços',
      title: 'O que eu posso fazer por você',
      subtitle: 'Serviços técnicos que ofereço — desde análises pontuais até consultoria contínua. Valores sob consulta.',
      ctaTitle: 'Precisa de algo específico?',
      ctaSubtitle: 'Me conta o que você precisa e eu monto uma proposta sob medida.',
      ctaButton: 'Solicitar proposta',
      items: [
        {
          title: 'Análise de Vulnerabilidades',
          desc: 'Avaliação de aplicações web e infraestrutura com relatório técnico de achados e recomendações.',
          bullets: ['Reconhecimento', 'Scan de portas', 'Relatório priorizado'],
        },
        {
          title: 'Automação com Python',
          desc: 'Scripts e rotinas automatizadas para tarefas repetitivas — relatórios, coleta de dados, integrações.',
          bullets: ['Scripts CLI', 'Integração de APIs', 'Web scraping'],
        },
        {
          title: 'Hardening de Infraestrutura',
          desc: 'Configuração segura de servidores Linux e boas práticas de rede e permissões.',
          bullets: ['Configuração Linux', 'Firewall e SSH', 'Backup e logs'],
        },
        {
          title: 'Desenvolvimento Backend',
          desc: 'APIs e serviços em Python ou C# com foco em segurança desde o design.',
          bullets: ['APIs REST', 'Banco de dados', 'Autenticação'],
        },
        {
          title: 'Mentoria para Iniciantes',
          desc: 'Acompanhamento para quem está começando em cibersegurança — trilha, dúvidas e projetos guiados.',
          bullets: ['Trilha personalizada', 'Sessões 1:1', 'Revisão de projetos'],
        },
        {
          title: 'Consultoria em Cloud (básico)',
          desc: 'Apoio na migração inicial pra AWS — IAM, buckets, custos e segurança básica.',
          bullets: ['AWS Free Tier', 'IAM e políticas', 'Otimização de custos'],
        },
      ],
    },

    social: {
      where: 'Onde me encontrar',
    },

    footer: {
      tagline: 'feito com ☕ e muito bug',
    },
  },

  // ============================================================
  // ENGLISH
  // ============================================================
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      cyber: 'Cyber',
      services: 'Services',
    },

    home: {
      intro: "Hi, I'm",
      name: 'Maria Costa',
      typing: [
        'Hi!! I AM Maria Costa',
        'Security Analyst in training',
        'From Brazil 🇧🇷',
        'Passionate about Cyber!!',
      ],
      bio: 'Strategic thinking applied to system security. Cybersecurity student in training, focused on resilient infrastructure, vulnerability analysis and automation. I care less about the "how" and more about the "why" behind every failure. Security is design, not a patch.',
      bugQuote: '> "Eating bugs is my favorite pastime!" 🍒',
      ctaProjects: 'View projects',
      ctaContact: 'Contact',
      contactEyebrow: 'Contact',
      contactTitle: "Let's talk",
      contactSubtitle: "I'm open to opportunities, collaborations and chats about security.",
      email: 'mmaria.costa@outlook.com',
    },

    sobre: {
      eyebrow: 'About',
      title: 'Who I am',
      subtitle: 'A bit of my journey, what I believe and what I am building.',
      bio: [
        'I am Maria Costa, a Cybersecurity student with a technical background in programming and infrastructure. I came from the technical high school program at Cotuca (Unicamp), and in 2027 I start my degree in Cybersecurity at FIAP.',
        'What drives me in security is not only the technical challenge, but the way of thinking: understanding the origin of the failure, questioning the why, and designing systems that are resilient by design — not by patch.',
        'Outside code, I enjoy writing about what I learn, solving CTF challenges and studying defense architectures.',
      ],
      eduTitle: 'Education',
      eduSubtitle: 'From study to practice — what I built so far.',
      education: {
        academic: 'Academic',
        professional: 'Professional',
        items: {
          academic: [
            {
              title: 'FIAP — Cybersecurity',
              place: 'Technologist degree · FIAP',
              period: '2027 — 2029 (expected)',
              desc: 'Higher education focused on information security, pentesting, cryptography and cyber defense.',
              tags: ['Cyber', 'Pentest', 'Defense'],
            },
            {
              title: 'IT Technician',
              place: 'Colégio Técnico de Campinas (Cotuca/Unicamp)',
              period: '2023 — 2026',
              desc: 'High school integrated with a technical degree in IT — programming, networking, databases and infrastructure.',
              tags: ['Programming', 'Networking', 'DB'],
            },
          ],
          professional: [
            {
              title: 'IT Intern',
              place: 'Alpha Consultoria de Sistemas',
              period: 'Feb 2026 — Feb 2027',
              desc: 'Working at a systems consultancy focused on support, automation and infrastructure.',
              tags: ['IT', 'Automation', 'Infra'],
            },
          ],
        },
      },
      certsTitle: 'Certification roadmap',
      certsSubtitle: "Certification goals I'm chasing — a roadmap of technical growth.",
      certsHint: '// certifications are goals — I update the status as I progress',
      certsStatus: {
        done: 'earned',
        studying: 'studying',
        planned: 'planned',
      },
      certs: [
        {
          name: 'AWS Cloud Practitioner',
          issuer: 'Amazon Web Services',
          status: 'studying',
          year: '2026',
        },
        {
          name: 'CompTIA Security+',
          issuer: 'CompTIA',
          status: 'planned',
          year: '2027',
        },
        {
          name: 'AWS Security Specialty',
          issuer: 'Amazon Web Services',
          status: 'planned',
          year: '2028',
        },
      ],
    },

    skills: {
      eyebrow: 'Skills',
      title: 'Tools and skills',
      subtitle: 'The technical arsenal and the soft skills I bring to any team.',
      arsenalTitle: 'Arsenal',
      arsenalSubtitle: "What I already handle and what I'm building up.",
      learningHint: 'in progress',
      groups: {
        known: 'Proficient',
        learning: 'Learning',
      },
      softTitle: 'Soft Skills',
      softSubtitle: "Skills you don't learn from a technical course alone.",
      softItems: [
        {
          title: 'Analytical Thinking',
          desc: 'I break the problem into parts, understand the context before acting and always question the why.',
        },
        {
          title: 'Autonomy & Self-Management',
          desc: 'I can organize myself, prioritize tasks and deliver without needing to be chased.',
        },
        {
          title: 'Continuous Learning',
          desc: "I study every day — whether it's a new tool, a concept or a mistake I made.",
        },
        {
          title: 'Strategic Planning',
          desc: "I think about long-term impact before deciding. I'd rather build it right than redo it later.",
        },
        {
          title: 'Direct Communication',
          desc: "I speak clearly, ask when I don't know and don't dance around when I need to say no.",
        },
        {
          title: 'Structured Adaptability',
          desc: 'I handle change well without losing method — I adapt fast, but with process.',
        },
      ],
    },

    projects: {
      eyebrow: 'Projects',
      title: 'Things I built',
      subtitle: 'Synced in real time with my GitHub.',
      loading: 'loading projects...',
      error: '⚠️ error fetching from GitHub',
      errorHint: '(the API rate limit may be hit — try again in 1h)',
      empty: '— no description —',
      viewDetails: 'view details',
    },

    projectDetail: {
      eyebrow: 'Project',
      loading: 'loading project',
      error: 'Could not load this project.',
      back: 'back to projects',
      viewRepo: 'View on GitHub',
      viewLive: 'View live',
      topics: 'Topics',
      readme: 'About the project', 
      about: 'Information',
      locale: 'en-US',
      meta: {
        language: 'Language',
        stars: 'Stars',
        forks: 'Forks',
        updated: 'Updated',
      },
      aboutFields: {
        repo: 'Repository',
        live: 'Live demo',
        branch: 'Branch',
        license: 'License',
        created: 'Created',
      },
    },

    cyber: {
      eyebrow: 'Cyber',
      title: 'Lab and practice',
      subtitle: "What I'm building, breaking and documenting.",
      intro: 'This section exists to record my hands-on evolution in security — not just what I study in theory, but what I build, break and document. You will find three tabs here: the Lab shows my study environment (virtual machines, tools and exercises); the Write-ups gather the CTF challenges I solved and what I learned from each; and the Notes are short summaries of the topics I am studying.',
      tabs: {
        lab: 'Lab',
        writeups: 'Write-ups',
        notes: 'Notes',
      },
      lab: {
        title: 'My Home Lab',
        subtitle: 'Environment where I practice attacks, defense and automation.',
        intro: "My home lab is the personal lab where I practice without fear of breaking anything. It consists of isolated virtual machines, tools I use every day and exercises I run to consolidate what I'm learning.",
        emptyTitle: 'Home Lab under construction',
        emptyDesc: "I'm building my virtualized environment to practice security. Come back soon to see the machines, tools and exercises documented.",
        status: {
          done: 'done',
          building: 'building',
          planned: 'planned',
        },
        sections: {
          vms: 'Virtual Machines',
          tools: 'Tools',
          exercises: 'Exercises',
        },
        vms: [],
        tools: [],
        exercises: [],
      },
      writeups: {
        title: 'Solved challenges',
        subtitle: 'CTFs, labs and hands-on challenges I documented.',
        intro: 'Each write-up records a challenge I solved — from TryHackMe, HackTheBox or PicoCTF. More than the answer, what matters is the reasoning behind the solution and what I learned along the way.',
        emptyTitle: 'No write-ups yet',
        emptyDesc: "I'm starting my CTF journey (TryHackMe, HackTheBox, PicoCTF). Soon I'll publish the challenges I solve and what I learned.",
        viewOn: 'view on',
        difficulty: {
          easy: 'easy',
          medium: 'medium',
          hard: 'hard',
        },
        items: [],
      },
      notes: {
        title: 'Study notes',
        subtitle: "What I'm learning, summarized.",
        intro: 'Writing is the best way to consolidate what you learn. Here I publish short summaries of topics I study — not full tutorials, but my personal notes that may also help beginners.',
        emptyTitle: 'No notes published yet',
        emptyDesc: "Writing is the best way to consolidate what you learn. I'll publish short summaries of topics I study here — OWASP, networking, cryptography, incident response.",
        readMore: 'read more',
        items: [],
      },
    },

    services: {
      eyebrow: 'Services',
      title: 'What I can do for you',
      subtitle: 'Technical services I offer — from one-off analyses to ongoing consulting. Pricing on request.',
      ctaTitle: 'Need something specific?',
      ctaSubtitle: 'Tell me what you need and I will put together a tailored proposal.',
      ctaButton: 'Request proposal',
      items: [
        {
          title: 'Vulnerability Assessment',
          desc: 'Evaluation of web applications and infrastructure with a technical report of findings and recommendations.',
          bullets: ['Reconnaissance', 'Port scanning', 'Prioritized report'],
        },
        {
          title: 'Python Automation',
          desc: 'Scripts and automated routines for repetitive tasks — reports, data collection, integrations.',
          bullets: ['CLI scripts', 'API integrations', 'Web scraping'],
        },
        {
          title: 'Infrastructure Hardening',
          desc: 'Secure configuration of Linux servers and best practices for networking and permissions.',
          bullets: ['Linux setup', 'Firewall & SSH', 'Backup and logs'],
        },
        {
          title: 'Backend Development',
          desc: 'APIs and services in Python or C# with security by design.',
          bullets: ['REST APIs', 'Databases', 'Authentication'],
        },
        {
          title: 'Mentoring for Beginners',
          desc: 'Guidance for those starting in cybersecurity — roadmap, questions and guided projects.',
          bullets: ['Custom roadmap', '1:1 sessions', 'Project review'],
        },
        {
          title: 'Cloud Consulting (basic)',
          desc: 'Support for initial AWS migration — IAM, buckets, costs and basic security.',
          bullets: ['AWS Free Tier', 'IAM & policies', 'Cost optimization'],
        },
      ],
    },

    social: {
      where: 'Where to find me',
    },

    footer: {
      tagline: 'made with ☕ and lots of bugs',
    },
  },
};