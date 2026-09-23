import { motion } from 'framer-motion';

export default function PacManIcon({ size = 24, color = '#facc15', className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 8px #facc15)' }}
    >
      <motion.path
        fill={color}
        d="M50 50 L95 25 A50 50 0 1 0 95 75 Z"
        animate={{
          d: [
            'M50 50 L95 25 A50 50 0 1 0 95 75 Z',
            'M50 50 L95 50 A50 50 0 1 0 95 50 Z',
            'M50 50 L95 25 A50 50 0 1 0 95 75 Z',
          ],
        }}
        transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="55" cy="32" r="4" fill="#0a0613" />
    </motion.svg>
  );
}