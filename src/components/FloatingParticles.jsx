import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = [
  { left: "12%", size: 3, duration: 7, delay: 0 },
  { left: "22%", size: 2, duration: 9, delay: 1.2 },
  { left: "38%", size: 4, duration: 8, delay: 0.4 },
  { left: "55%", size: 2, duration: 10, delay: 2 },
  { left: "68%", size: 3, duration: 7.5, delay: 0.8 },
  { left: "78%", size: 2, duration: 9.5, delay: 1.6 },
  { left: "88%", size: 3, duration: 8.5, delay: 0.2 },
];

// Motitas de polvo flotando muy suave, para dar atmósfera de
// cancha iluminada con luz de foco. Puramente decorativo.
export default function FloatingParticles() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-ember-300/60"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: "8%",
          }}
          animate={{
            y: [0, -220, -260],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
