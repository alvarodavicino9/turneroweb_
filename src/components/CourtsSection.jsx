import { motion } from "framer-motion";
import { courts } from "../data/mockData";

const ACCENTS = [
  { glow: "bg-ember-500/10 group-hover:bg-ember-500/20", badge: "bg-ember-500/15 text-ember-400", link: "text-ember-400 hover:text-ember-300" },
  { glow: "bg-teal-500/10 group-hover:bg-teal-500/20", badge: "bg-teal-500/15 text-teal-300", link: "text-teal-300 hover:text-teal-200" },
];

export default function CourtsSection() {
  return (
    <section id="canchas" className="relative bg-court-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-ember-400">
            Nuestras canchas
          </p>
          <h2 className="font-display text-4xl text-cream-100 sm:text-5xl">
            Dos canchas, la misma cancha de siempre
          </h2>
          <p className="mt-4 text-cream-200/70">
            Datos de ejemplo — se reemplazan por las fotos, superficie y
            detalles reales de cada cancha una vez confirmados.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {courts.map((court, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-2xl border border-cream-100/10 bg-court-850 p-8"
              >
                <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl transition ${accent.glow}`} />
                <span className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${accent.badge}`}>
                  🏀
                </span>
                <h3 className="font-display text-2xl text-cream-100">{court.name}</h3>
                <p className="mt-2 text-cream-200/70">{court.description}</p>
                <a
                  href="#reservar"
                  className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold transition ${accent.link}`}
                >
                  Reservar esta cancha →
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
