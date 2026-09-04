import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

// ─────────────────────────────────────────────────────────────
// Animación cinematográfica del hero: una pelota que arquea,
// entra al aro (net "swish"), pica en el piso con squash/stretch
// y rebota cada vez más bajo, en loop, con un rastro de
// movimiento y brillo para que se sienta más real.
//
// La composición cambia entre escritorio (aro a la derecha,
// arco horizontal) y celular (aro arriba centrado, arco
// vertical), para que en pantallas angostas no se recorte nada
// y la escena entre completa. El "timeline" (fracciones T /
// squash / rotación / opacidad) es el mismo para las dos: solo
// cambian las coordenadas x/y de cada layout.
//
// En celular, además, es interactiva: deslizás el dedo desde la
// pelota hacia el aro y la tira de verdad (usa la misma "física"
// pero arrancando desde donde tocaste), en vez de solo mirar el
// loop automático.
// ─────────────────────────────────────────────────────────────

const DURATION = 4.6;
const REPEAT_DELAY = 0.5;

const T = [0, 0.08, 0.3, 0.48, 0.58, 0.68, 0.76, 0.83, 0.88, 0.93, 1];
const BALL_SCALE_X = [1, 1, 0.92, 1, 1, 1.35, 1, 1.3, 1, 1.15, 1];
const BALL_SCALE_Y = [1, 1, 1.12, 1, 1, 0.62, 1, 0.66, 1, 0.78, 1];
const BALL_ROTATE = [0, 60, 260, 420, 500, 560, 620, 660, 690, 710, 730];
const BALL_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];

const SHADOW_OPACITY = [0.1, 0.22, 0.04, 0.1, 0.16, 0.42, 0.2, 0.42, 0.28, 0.38, 0.1];
const SHADOW_SCALE = [0.7, 0.85, 0.35, 0.6, 0.75, 1.15, 0.8, 1.1, 0.9, 1, 0.7];

const NET_TIMES = [0, 0.55, 0.59, 0.63, 0.68, 0.75, 1];
const NET_SKEW = [0, 0, 10, -6, 3, 0, 0];
const NET_SCALE_Y = [1, 1, 0.9, 1.05, 0.98, 1, 1];

const IDLE_BALL_TRANSITION = {
  duration: DURATION,
  repeat: Infinity,
  repeatDelay: REPEAT_DELAY,
  times: T,
  ease: "easeInOut",
};
const IDLE_NET_TRANSITION = {
  duration: DURATION,
  repeat: Infinity,
  repeatDelay: REPEAT_DELAY,
  times: NET_TIMES,
  ease: "easeOut",
};

// rastro fantasma detrás de la pelota — dos copias con delay,
// más chicas y transparentes, simulan motion blur sin filtros caros
const TRAILS = [
  { delay: 0.05, opacity: 0.28, scale: 0.94 },
  { delay: 0.1, opacity: 0.14, scale: 0.88 },
];

const LAYOUTS = {
  // escena ancha de fondo, para el hero de escritorio (full-bleed)
  desktop: {
    viewBox: "0 0 800 500",
    preserveAspectRatio: "xMidYMid slice",
    ground: 430,
    glowR: 140,
    hoop: { cx: 600, cy: 150, rimRx: 42, rimRy: 9 },
    court: { lineX2: 800, circleCx: 180, circleR: 70 },
    ballX: [50, 110, 340, 540, 605, 605, 585, 600, 592, 598, 50],
    ballY: [378, 320, 55, 95, 150, 430, 300, 430, 375, 430, 378],
  },
  // escena compacta y contenida, pensada para vivir dentro de una
  // tarjeta 3:4 en el hero mobile (no como fondo full-bleed) — así
  // no queda nada flotando en un espacio vacío
  mobile: {
    viewBox: "0 0 300 400",
    preserveAspectRatio: "xMidYMid meet",
    ground: 349,
    glowR: 92,
    hoop: { cx: 150, cy: 68, rimRx: 27, rimRy: 6 },
    court: { lineX2: 300 },
    ballX: [43, 67, 150, 150, 150, 150, 133, 156, 139, 150, 43],
    ballY: [297, 246, 17, 39, 68, 349, 246, 349, 317, 349, 297],
  },
};

function idleBallAnim(ballX, ballY) {
  return { x: ballX, y: ballY, scaleX: BALL_SCALE_X, scaleY: BALL_SCALE_Y, rotate: BALL_ROTATE, opacity: BALL_OPACITY };
}
function idleShadowAnim(ballX) {
  return { cx: ballX, opacity: SHADOW_OPACITY, scaleX: SHADOW_SCALE };
}
const idleNetAnim = { skewX: NET_SKEW, scaleY: NET_SCALE_Y };

function BallMarks() {
  return (
    <>
      <path d="M -24 0 A 24 24 0 0 1 24 0" fill="none" stroke="#3a2010" strokeOpacity="0.55" strokeWidth="1.6" />
      <path d="M -24 0 A 24 24 0 0 0 24 0" fill="none" stroke="#3a2010" strokeOpacity="0.55" strokeWidth="1.6" />
      <path d="M 0 -24 L 0 24" stroke="#3a2010" strokeOpacity="0.55" strokeWidth="1.6" />
      <path d="M -17 -17 L 17 17" stroke="#3a2010" strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M 17 -17 L -17 17" stroke="#3a2010" strokeOpacity="0.35" strokeWidth="1.2" />
      <ellipse cx="-8" cy="-9" rx="7" ry="4.5" fill="#fff" opacity="0.4" />
    </>
  );
}

function Ball({ trail, ballX, ballY }) {
  const opacity = trail ? BALL_OPACITY.map((v) => v * trail.opacity) : BALL_OPACITY;
  const scaleBoost = trail?.scale ?? 1;

  return (
    <motion.g
      animate={{
        x: ballX,
        y: ballY,
        scaleX: BALL_SCALE_X.map((v) => v * scaleBoost),
        scaleY: BALL_SCALE_Y.map((v) => v * scaleBoost),
        rotate: BALL_ROTATE,
        opacity,
      }}
      transition={{ ...IDLE_BALL_TRANSITION, delay: trail?.delay ?? 0 }}
    >
      <circle r="24" fill={trail ? "#ff7a1a" : "url(#ballGradient)"} />
      {!trail && <BallMarks />}
    </motion.g>
  );
}

function Hoop({ hoop, netControls, netAnim, netTransition }) {
  const boardW = hoop.rimRx * 2.2;
  const boardH = boardW / 1.7;
  const boardX = hoop.cx - boardW / 2;
  const boardY = hoop.cy - boardH - hoop.rimRy * 1.6;
  const squareW = boardW * 0.38;
  const squareH = boardH * 0.52;
  const squareX = hoop.cx - squareW / 2;
  const squareY = boardY + boardH - squareH - boardH * 0.1;
  const poleW = Math.max(boardW * 0.07, 3);
  const poleX = hoop.cx - poleW / 2;

  return (
    <>
      {/* poste de soporte, detrás del tablero */}
      <rect x={poleX} y="0" width={poleW} height={boardY + 4} fill="#2a1c10" opacity="0.6" />

      {/* tablero */}
      <rect x={boardX} y={boardY} width={boardW} height={boardH} rx={boardW * 0.05} fill="url(#boardGradient)" stroke="#f2e7d5" strokeOpacity="0.6" strokeWidth="2" />
      <rect x={squareX} y={squareY} width={squareW} height={squareH} fill="none" stroke="#ff9a3d" strokeOpacity="0.75" strokeWidth="1.6" />

      {/* aro — doble trazo para dar volumen metálico */}
      <ellipse cx={hoop.cx} cy={hoop.cy} rx={hoop.rimRx} ry={hoop.rimRy} fill="none" stroke="#7a2c05" strokeWidth="8" opacity="0.5" />
      <ellipse cx={hoop.cx} cy={hoop.cy} rx={hoop.rimRx} ry={hoop.rimRy} fill="none" stroke="url(#rimGradient)" strokeWidth="5.5" />

      {/* red */}
      <motion.g
        animate={netControls ?? netAnim}
        transition={netControls ? undefined : netTransition}
        style={{ transformOrigin: `${hoop.cx}px ${hoop.cy + 2}px` }}
      >
        {[-30, -18, -6, 6, 18, 30].map((offset) => (
          <line
            key={offset}
            x1={hoop.cx + offset * 0.9 * (hoop.rimRx / 42)}
            y1={hoop.cy + 4}
            x2={hoop.cx + offset * 0.35 * (hoop.rimRx / 42)}
            y2={hoop.cy + 53}
            stroke="#f2e7d5"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
        ))}
        <path d={`M ${hoop.cx - 28} ${hoop.cy + 10} Q ${hoop.cx} ${hoop.cy + 26} ${hoop.cx + 28} ${hoop.cy + 10}`} fill="none" stroke="#f2e7d5" strokeOpacity="0.4" />
        <path d={`M ${hoop.cx - 22} ${hoop.cy + 33} Q ${hoop.cx} ${hoop.cy + 46} ${hoop.cx + 22} ${hoop.cy + 33}`} fill="none" stroke="#f2e7d5" strokeOpacity="0.4" />
      </motion.g>
    </>
  );
}

export default function BasketballHeroAnimation({ className = "" }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const layout = isMobile ? LAYOUTS.mobile : LAYOUTS.desktop;
  const { hoop, court, ground, ballX, ballY } = layout;
  const interactive = isMobile && !reduceMotion;

  const wrapRef = useRef(null);
  const pointerStart = useRef(null);
  const shootingRef = useRef(false);
  const [showHint, setShowHint] = useState(true);

  const ballControls = useAnimationControls();
  const shadowControls = useAnimationControls();
  const netControls = useAnimationControls();

  useEffect(() => {
    if (!interactive) return;
    ballControls.start({ ...idleBallAnim(ballX, ballY), transition: IDLE_BALL_TRANSITION });
    shadowControls.start({ ...idleShadowAnim(ballX), transition: IDLE_BALL_TRANSITION });
    netControls.start({ ...idleNetAnim, transition: IDLE_NET_TRANSITION });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, isMobile]);

  function toViewBoxPoint(e) {
    const rect = wrapRef.current.getBoundingClientRect();
    const [, , vbW, vbH] = layout.viewBox.split(" ").map(Number);
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    return { x: relX * vbW, y: relY * vbH };
  }

  async function shoot(startX, startY) {
    if (shootingRef.current) return;
    shootingRef.current = true;
    setShowHint(false);

    const shotX = [startX, (startX + ballX[2]) / 2, ...ballX.slice(2)];
    const shotY = [startY, (startY + ballY[2]) / 2, ...ballY.slice(2)];
    const shotOpacity = [1, ...BALL_OPACITY.slice(1)];
    const quickTransition = { duration: DURATION * 0.82, times: T, ease: "easeInOut" };

    await Promise.all([
      ballControls.start({
        x: shotX,
        y: shotY,
        scaleX: BALL_SCALE_X,
        scaleY: BALL_SCALE_Y,
        rotate: BALL_ROTATE,
        opacity: shotOpacity,
        transition: quickTransition,
      }),
      shadowControls.start({ cx: shotX, opacity: SHADOW_OPACITY, scaleX: SHADOW_SCALE, transition: quickTransition }),
      netControls.start({ ...idleNetAnim, transition: { ...quickTransition, times: NET_TIMES, ease: "easeOut" } }),
    ]);

    await new Promise((resolve) => setTimeout(resolve, REPEAT_DELAY * 1000));
    shootingRef.current = false;
    ballControls.start({ ...idleBallAnim(ballX, ballY), transition: IDLE_BALL_TRANSITION });
    shadowControls.start({ ...idleShadowAnim(ballX), transition: IDLE_BALL_TRANSITION });
    netControls.start({ ...idleNetAnim, transition: IDLE_NET_TRANSITION });
  }

  function handlePointerDown(e) {
    pointerStart.current = toViewBoxPoint(e);
  }

  function handlePointerUp(e) {
    if (!pointerStart.current) return;
    const start = pointerStart.current;
    const end = toViewBoxPoint(e);
    pointerStart.current = null;
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    if (dist > 16) shoot(start.x, start.y);
  }

  return (
    <div ref={wrapRef} className={`pointer-events-none relative select-none ${className}`}>
      <svg
        viewBox={layout.viewBox}
        preserveAspectRatio={layout.preserveAspectRatio}
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ballGradient" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffb974" />
            <stop offset="45%" stopColor="#ff7a1a" />
            <stop offset="100%" stopColor="#9a3f0a" />
          </radialGradient>
          <linearGradient id="rimGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffcf9d" />
            <stop offset="50%" stopColor="#ff9a3d" />
            <stop offset="100%" stopColor="#c2450a" />
          </linearGradient>
          <linearGradient id="boardGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2e7d5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f2e7d5" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* resplandor detrás del aro */}
        <motion.circle
          cx={hoop.cx}
          cy={hoop.cy}
          r={layout.glowR}
          fill="url(#glow)"
          animate={reduceMotion ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${hoop.cx}px ${hoop.cy}px` }}
        />

        {/* piso / línea de cancha */}
        <line x1="0" y1={ground} x2={court.lineX2} y2={ground} stroke="#f2e7d5" strokeOpacity="0.12" strokeWidth="2" />
        {court.circleR ? (
          <circle cx={court.circleCx} cy={ground} r={court.circleR} fill="none" stroke="#f2e7d5" strokeOpacity="0.08" strokeWidth="2" />
        ) : null}

        {interactive ? (
          <Hoop hoop={hoop} netControls={netControls} />
        ) : (
          <Hoop hoop={hoop} netAnim={reduceMotion ? undefined : idleNetAnim} netTransition={reduceMotion ? undefined : IDLE_NET_TRANSITION} />
        )}

        {/* sombra de la pelota */}
        {interactive ? (
          <motion.ellipse
            cy={ground + 2}
            rx="26"
            ry="7"
            fill="#000"
            initial={{ cx: ballX[0], opacity: 0 }}
            animate={shadowControls}
            style={{ transformOrigin: "center" }}
          />
        ) : (
          <motion.ellipse
            cy={ground + 2}
            rx="26"
            ry="7"
            fill="#000"
            animate={reduceMotion ? { opacity: 0.3 } : idleShadowAnim(ballX)}
            transition={reduceMotion ? undefined : IDLE_BALL_TRANSITION}
            style={{ transformOrigin: "center" }}
          />
        )}

        {reduceMotion ? (
          <g transform={`translate(${hoop.cx}, ${hoop.cy})`}>
            <circle r="22" fill="url(#ballGradient)" />
          </g>
        ) : interactive ? (
          <motion.g initial={{ x: ballX[0], y: ballY[0], opacity: 0 }} animate={ballControls}>
            <circle r="24" fill="url(#ballGradient)" />
            <BallMarks />
          </motion.g>
        ) : (
          <>
            {TRAILS.map((trail, i) => (
              <Ball key={i} trail={trail} ballX={ballX} ballY={ballY} />
            ))}
            <Ball ballX={ballX} ballY={ballY} />
          </>
        )}
      </svg>

      {interactive && (
        <div
          className="absolute inset-0"
          style={{ touchAction: "none", pointerEvents: "auto" }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      )}

      {interactive && showHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 5, times: [0, 0.15, 0.85, 1], delay: 1.6, repeat: Infinity, repeatDelay: 3 }}
          className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
        >
          <span className="rounded-full bg-court-950/80 px-3 py-1.5 text-[11px] font-medium text-cream-200/80 backdrop-blur-sm">
            👆 Deslizá la pelota hacia el aro
          </span>
        </motion.div>
      )}
    </div>
  );
}
