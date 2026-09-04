import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// Diagrama esquemático de la cancha (vista de planta, estilo
// "plano/tablero"), para el turnero. No es una foto real del
// lugar — eso se suma después — pero le da referencia visual al
// que está reservando: dónde juega, no solo un horario en una
// grilla de texto.
// ─────────────────────────────────────────────────────────────
const ACCENTS = {
  1: { rim: "#ff9a3d", dot: "#ff7a1a", text: "#ffb974", label: "text-ember-400" },
  2: { rim: "#2dd4bf", dot: "#14b8a6", text: "#7dede0", label: "text-teal-400" },
};

export default function CourtDiagram({ courtNumber = 1, label = "Cancha" }) {
  const accent = ACCENTS[courtNumber] ?? ACCENTS[1];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cream-100/10 bg-court-950">
      {/* piso de madera */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(242,231,213,0.05) 0px, rgba(242,231,213,0.05) 1px, transparent 1px, transparent 22px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,7,4,0.85)_100%)]" />

      <svg viewBox="0 0 300 560" className="relative h-full w-full">
        <defs>
          <linearGradient id={`floor-${courtNumber}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241a10" />
            <stop offset="100%" stopColor="#180f09" />
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="280" height="540" rx="6" fill={`url(#floor-${courtNumber})`} />

        {/* contorno de cancha */}
        <rect
          x="20"
          y="20"
          width="260"
          height="520"
          rx="2"
          fill="none"
          stroke="#f2e7d5"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* línea central + círculo central */}
        <line x1="20" y1="280" x2="280" y2="280" stroke="#f2e7d5" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="150" cy="280" r="38" fill="none" stroke="#f2e7d5" strokeOpacity="0.35" strokeWidth="1.5" />

        {/* aro superior + zona */}
        <g stroke="#f2e7d5" strokeOpacity="0.4" strokeWidth="1.5" fill="none">
          <rect x="100" y="20" width="100" height="120" />
          <circle cx="150" cy="140" r="38" />
          <path d="M 45 20 A 145 145 0 0 0 45 155" strokeDasharray="0" />
          <path d="M 255 20 A 145 145 0 0 1 255 155" />
          <path d="M 45 155 A 145 145 0 0 0 150 190 A 145 145 0 0 0 255 155" />
        </g>
        <line x1="115" y1="34" x2="185" y2="34" stroke={accent.rim} strokeWidth="3" />
        <motion.circle
          cx="150"
          cy="46"
          r="5.5"
          fill={accent.dot}
          animate={{ cy: [46, 42, 46] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* aro inferior + zona (espejado) */}
        <g stroke="#f2e7d5" strokeOpacity="0.4" strokeWidth="1.5" fill="none">
          <rect x="100" y="420" width="100" height="120" />
          <circle cx="150" cy="420" r="38" />
          <path d="M 45 540 A 145 145 0 0 1 45 405" />
          <path d="M 255 540 A 145 145 0 0 0 255 405" />
          <path d="M 45 405 A 145 145 0 0 1 150 370 A 145 145 0 0 1 255 405" />
        </g>
        <line x1="115" y1="526" x2="185" y2="526" stroke={accent.rim} strokeWidth="3" />
        <motion.circle
          cx="150"
          cy="514"
          r="5.5"
          fill={accent.dot}
          animate={{ cy: [514, 518, 514] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />

        {/* marca de número de cancha en el centro */}
        <circle cx="150" cy="280" r="20" fill="#0d0805" stroke={accent.rim} strokeOpacity="0.6" strokeWidth="1.5" />
        <text
          x="150"
          y="288"
          textAnchor="middle"
          fontSize="18"
          fontFamily="'Bebas Neue', sans-serif"
          fill={accent.text}
        >
          {courtNumber}
        </text>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-court-950 to-transparent px-5 pb-4 pt-10">
        <p className={`text-xs font-semibold uppercase tracking-widest ${accent.label}`}>
          Vista de la cancha
        </p>
        <p className="text-sm text-cream-200/60">{label} · fotos reales próximamente</p>
      </div>
    </div>
  );
}
