import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MAZE = [
  '111111111111111',
  '100000000000001',
  '101110111011101',
  '100000000000001',
  '101110111011101',
  '100000000000001',
  '101110111011101',
  '100000000000001',
  '101110111011101',
  '100000000000001',
  '111111111111111',
];
const TILE = 36;
const W = MAZE[0].length * TILE;
const H = MAZE.length * TILE;

const isWall = (x, y) =>
  y < 0 || y >= MAZE.length || x < 0 || x >= MAZE[0].length || MAZE[y][x] === '1';

function buildDots() {
  const dots = [];
  for (let y = 0; y < MAZE.length; y++)
    for (let x = 0; x < MAZE[0].length; x++)
      if (MAZE[y][x] === '0') dots.push({ x, y, eaten: false });
  return dots;
}

function freshState() {
  return {
    player: { x: 1, y: 1, dx: 0, dy: 0, nextDx: 0, nextDy: 0 },
    ghosts: [
      { x: 7, y: 5, dx: 1,  dy: 0,  color: '#ef4444' },
      { x: 7, y: 3, dx: -1, dy: 0,  color: '#22d3ee' },
      { x: 13, y: 9, dx: 0, dy: -1, color: '#f97316' },
    ],
    dots: buildDots(),
    status: 'playing',
  };
}

export default function PacManGame() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const stateRef = useRef(freshState());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');

  useEffect(() => {
    const onKey = (e) => {
      const p = stateRef.current.player;
      if (e.key === 'ArrowUp')         { p.nextDx = 0;  p.nextDy = -1; }
      else if (e.key === 'ArrowDown')  { p.nextDx = 0;  p.nextDy = 1; }
      else if (e.key === 'ArrowLeft')  { p.nextDx = -1; p.nextDy = 0; }
      else if (e.key === 'ArrowRight') { p.nextDx = 1;  p.nextDy = 0; }
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let lastMove = 0;
    const MOVE_MS = 130;

    const step = (time) => {
      const s = stateRef.current;

      if (s.status === 'playing' && time - lastMove > MOVE_MS) {
        lastMove = time;
        const p = s.player;

        if ((p.nextDx || p.nextDy) && !isWall(p.x + p.nextDx, p.y + p.nextDy)) {
          p.dx = p.nextDx; p.dy = p.nextDy;
          p.nextDx = 0; p.nextDy = 0;
        }
        if ((p.dx || p.dy) && !isWall(p.x + p.dx, p.y + p.dy)) {
          p.x += p.dx; p.y += p.dy;
        }

        s.dots.forEach((d) => {
          if (!d.eaten && d.x === p.x && d.y === p.y) {
            d.eaten = true;
            setScore((v) => v + 10);
          }
        });

        s.ghosts.forEach((g) => {
          const opts = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
          ].filter((d) => !isWall(g.x + d.dx, g.y + d.dy) && !(d.dx === -g.dx && d.dy === -g.dy));

          const pool = opts.length
            ? opts
            : [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }]
                .filter((d) => !isWall(g.x + d.dx, g.y + d.dy));

          if (!pool.length) return;

          let chosen = pool[Math.floor(Math.random() * pool.length)];
          if (Math.random() < 0.6) {
            pool.sort((a, b) => {
              const da = Math.abs(g.x + a.dx - p.x) + Math.abs(g.y + a.dy - p.y);
              const db = Math.abs(g.x + b.dx - p.x) + Math.abs(g.y + b.dy - p.y);
              return da - db;
            });
            chosen = pool[0];
          }
          g.x += chosen.dx;
          g.y += chosen.dy;
          g.dx = chosen.dx;
          g.dy = chosen.dy;
        });

        s.ghosts.forEach((g) => {
          if (g.x === p.x && g.y === p.y) s.status = 'lose';
        });
        if (s.dots.every((d) => d.eaten)) s.status = 'win';

        if (s.status !== 'playing') setStatus(s.status);
      }

      ctx.fillStyle = '#0a0613';
      ctx.fillRect(0, 0, W, H);

      for (let y = 0; y < MAZE.length; y++) {
        for (let x = 0; x < MAZE[0].length; x++) {
          if (MAZE[y][x] === '1') {
            ctx.fillStyle = '#4c1d95';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 6;
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
          }
        }
      }
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#facc15';
      s.dots.forEach((d) => {
        if (!d.eaten) {
          ctx.beginPath();
          ctx.arc(d.x * TILE + TILE / 2, d.y * TILE + TILE / 2, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      s.ghosts.forEach((g) => {
        const gx = g.x * TILE;
        const gy = g.y * TILE;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx + TILE / 2, gy + TILE / 2 - 1, TILE / 2 - 4, Math.PI, 0);
        ctx.lineTo(gx + TILE - 4, gy + TILE - 4);
        ctx.lineTo(gx + 4, gy + TILE - 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(gx + 12, gy + 14, 4, 0, Math.PI * 2);
        ctx.arc(gx + 22, gy + 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(gx + 12, gy + 14, 1.8, 0, Math.PI * 2);
        ctx.arc(gx + 22, gy + 14, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      const p = s.player;
      const cx = p.x * TILE + TILE / 2;
      const cy = p.y * TILE + TILE / 2;
      const r = TILE / 2 - 3;
      let ang = 0;
      if (p.dx === -1) ang = Math.PI;
      else if (p.dy === 1) ang = Math.PI / 2;
      else if (p.dy === -1) ang = -Math.PI / 2;
      const mouth = Math.abs(Math.sin(time / 120)) * 0.35 * Math.PI;

      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, ang + mouth, ang - mouth + Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const reset = () => {
    stateRef.current = freshState();
    setScore(0);
    setStatus('playing');
  };

  const statusLabel =
    status === 'playing' ? t.games.statusPlaying
    : status === 'win'   ? t.games.statusWin
    :                      t.games.statusLose;

  const statusColor =
    status === 'playing' ? 'text-green-400'
    : status === 'win'   ? 'text-yellow-300'
    :                      'text-red-400';

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-8 text-sm">
        <div className="text-center">
          <p className="text-app-muted text-xs uppercase tracking-widest">
            {t.games.score}
          </p>
          <p className="text-yellow-300 text-xl font-bold">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-app-muted text-xs uppercase tracking-widest">
            {t.games.status}
          </p>
          <p className={`text-xl font-bold ${statusColor}`}>{statusLabel}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-app-strong p-2
                      shadow-app bg-[#0a0613]
                      max-w-full overflow-x-auto">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-xl block" />
      </div>

      <p className="text-app-muted text-xs">{t.games.pacmanHint}</p>

      {(status === 'win' || status === 'lose') && (
        <div className="flex flex-col items-center gap-3">
          <p className={status === 'win' ? 'text-yellow-300' : 'text-red-400'}>
            {status === 'win' ? t.games.winMsg : t.games.loseMsg}
          </p>
          <button
            onClick={reset}
            className="px-5 py-2 rounded-lg text-white font-medium transition-all"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 16px var(--glow)' }}
          >
            {t.games.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}