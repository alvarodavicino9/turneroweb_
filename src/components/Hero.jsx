import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import BasketballHeroAnimation from "./BasketballHeroAnimation";
import FloatingParticles from "./FloatingParticles";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { business } from "../data/mockData";

const SUBTITLE =
  "Reservá tu cancha de básquet en segundos, directo con nosotros. Sin intermediarios, sin vueltas: elegís cancha, día y horario, y queda confirmado al instante.";

const TRUST_ITEMS = [
  { icon: "🏀", label: "2 canchas" },
  { icon: "⚡", label: "Confirmación al instante" },
  { icon: "🔒", label: "Sin intermediarios" },
];

function PrimaryCta({ className = "" }) {
  return (
    <a
      href="#reservar"
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-ember-500 px-7 py-4 text-base font-semibold text-court-950 shadow-[0_8px_30px_-6px_rgba(255,122,26,0.55)] transition hover:bg-ember-400 hover:shadow-[0_10px_36px_-4px_rgba(255,122,26,0.7)] active:scale-[0.98] ${className}`}
    >
      Reservar ahora
      <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        →
      </span>
    </a>
  );
}

function SecondaryCta({ className = "" }) {
  return (
    <a
      href="#canchas"
      className={`inline-flex items-center justify-center rounded-xl border border-cream-100/20 bg-cream-100/[0.03] px-7 py-4 text-base font-medium text-cream-100/90 transition hover:border-cream-100/40 hover:bg-cream-100/[0.08] active:scale-[0.98] ${className}`}
    >
      Ver las canchas
    </a>
  );
}

function Badge() {
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ember-400/40 bg-ember-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-ember-300">
      2 canchas · reservá por hora
    </p>
  );
}

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  return isMobile ? <MobileHero /> : <DesktopHero />;
}

// ─────────────────────────────────────────────────────────────
// Mobile: la escena no intenta ser un fondo full-bleed (ahí es
// donde quedaba espacio vacío raro) — es una tarjeta contenida
// arriba, y el contenido fluye debajo con su propio ritmo, sin
// forzar 100svh. Una fila de "trust badges" abajo ocupa el
// espacio que antes quedaba muerto con algo útil.
// ─────────────────────────────────────────────────────────────
function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-court-950 px-6 pb-10 pt-24">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative mx-auto max-w-sm text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mb-7 aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-cream-100/10 bg-court-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="court-floor absolute inset-0 opacity-60" />
          <BasketballHeroAnimation className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,7,4,0.7)_100%)]" />
          <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Badge />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="font-display text-6xl leading-none text-cream-100"
        >
          {business.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-base leading-relaxed text-cream-200/75"
        >
          {SUBTITLE}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-7 grid grid-cols-2 gap-3"
        >
          <PrimaryCta />
          <SecondaryCta />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-9 grid grid-cols-3 gap-2 border-t border-cream-100/10 pt-6"
        >
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-[11px] font-medium leading-tight text-cream-200/55">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Desktop: escena cinematográfica full-bleed con paralaje de
// mouse, como antes.
// ─────────────────────────────────────────────────────────────
function DesktopHero() {
  const sectionRef = useRef(null);
  const spotlightRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  const sceneX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const sceneY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const glowX = useTransform(springX, [-0.5, 0.5], [-34, 34]);
  const glowY = useTransform(springY, [-0.5, 0.5], [-24, 24]);
  const floorX = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(relX);
    my.set(relY);

    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      spotlightRef.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      spotlightRef.current.style.opacity = "1";
    }
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden bg-court-950"
    >
      <motion.div className="court-floor absolute inset-0" style={{ x: floorX }} />

      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,154,61,0.14), transparent 70%)",
        }}
      />

      <motion.div className="pointer-events-none absolute inset-0" style={{ x: glowX, y: glowY }}>
        <div className="absolute right-[6%] top-[16%] h-64 w-64 rounded-full bg-ember-500/10 blur-3xl sm:h-96 sm:w-96" />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: sceneX, y: sceneY }}>
        <BasketballHeroAnimation className="absolute inset-0" />
      </motion.div>

      <FloatingParticles />

      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,7,4,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-court-950 via-transparent to-court-950/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Badge />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-display text-6xl leading-[0.95] text-cream-100 sm:text-7xl md:text-8xl"
          >
            {business.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-5 text-lg text-cream-200/80 sm:text-xl"
          >
            {SUBTITLE}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <PrimaryCta />
            <SecondaryCta />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex items-center gap-6 border-t border-cream-100/10 pt-5"
          >
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-cream-200/55">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-5 rounded-full border border-cream-100/30 p-1"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-ember-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
