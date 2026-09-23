import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GRID = 15;
const TILE = 28;
const W = GRID * TILE;
const H = GRID * TILE;

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function freshState() {
  return {
    snake: [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 11, y: 7 },
    status: 'playing',
    speed: 120,
  };
}

export default function SnakeGame() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const stateRef = useRef(freshState());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');

  useEffect(() => {
    const onKey = (e) => {
      const s = stateRef.current;
      const d = s.dir;
      if (e.key === 'ArrowUp' && d.y !== 1)          s.nextDir = { x: 0, y: -1 };
      else if (e.key === 'ArrowDown' && d.y !== -1)  s.nextDir = { x: 0, y: 1 };
      else if (e.key === 'ArrowLeft' && d.x !== 1)   s.nextDir = { x: -1, y: 0 };
      else if (e.key === 'ArrowRight' && d.x !== -1) s.nextDir = { x: 1, y: 0 };
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

    const step = (time) => {
      const s = stateRef.current;

      if (s.status === 'playing' && time - lastMove > s.speed) {
        lastMove = time;
        s.dir = s.nextDir;
        const head = s.snake[0];
        const next = { x: head.x + s.dir.x, y: head.y + s.dir.y };

        if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
          s.status = 'lose';
        } else if (s.snake.some((seg) => seg.x === next.x && seg.y === next.y)) {
          s.status = 'lose';
        } else {
          s.snake.unshift(next);
          if (next.x === s.food.x && next.y === s.food.y) {
            setScore((v) => v + 10);
            s.food = randomFood(s.snake);
          } else {
            s.snake.pop();
          }
        }

        if (s.status !== 'playing') setStatus(s.status);
      }

      // fundo
      ctx.fillStyle = '#0a0613';
      ctx.fillRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = 'rgba(76, 29, 149, 0.18)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE, 0); ctx.lineTo(i * TILE, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * TILE); ctx.lineTo(W, i * TILE);
        ctx.stroke();
      }

      // comida
      ctx.fillStyle = '#f472b6';
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(s.food.x * TILE + TILE / 2, s.food.y * TILE + TILE / 2, TILE / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // cobra
      s.snake.forEach((seg, i) => {
        const head = i === 0;
        ctx.fillStyle = head
          ? '#c084fc'
          : `rgba(168, 85, 247, ${Math.max(0.35, 0.95 - i * 0.04)})`;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = head ? 14 : 3;
        const pad = head ? 1 : 3;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * TILE + pad,
          seg.y * TILE + pad,
          TILE - pad * 2,
          TILE - pad * 2,
          6
        );
        ctx.fill();
      });
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
    status === 'playing' ? t.games.statusPlaying : t.games.statusLose;

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
          <p className={`text-xl font-bold ${
            status === 'playing' ? 'text-green-400' : 'text-red-400'
          }`}>
            {statusLabel}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-app-strong p-2
                      shadow-app bg-[#0a0613]">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-xl block" />
      </div>

      <p className="text-app-muted text-xs">{t.games.snakeHint}</p>

      {status === 'lose' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-400">{t.games.snakeGameOver}</p>
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