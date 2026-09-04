import { motion } from "framer-motion";

const STEPS = [
  {
    title: "Elegís cancha, día y horario",
    text: "Ves en el momento qué horarios están libres en cada cancha, sin llamar ni escribir para preguntar.",
  },
  {
    title: "Confirmás con tus datos",
    text: "Nombre, teléfono y email. El turno queda tomado al instante — no se puede reservar dos veces el mismo horario.",
  },
  {
    title: "Te llega la confirmación",
    text: "Recibís un email automático con el detalle del turno, y un recordatorio antes de jugar.",
  },
];

const HIGHLIGHTS = [
  { label: "Todo registrado", text: "Cada turno y cada cliente queda guardado en un historial propio.", color: "text-ember-300" },
  { label: "Respuestas automáticas", text: "Confirmación y recordatorio sin que nadie tenga que escribir a mano.", color: "text-teal-300" },
  { label: "Panel propio", text: "Bloqueá horarios, cancelá turnos y mirá la ocupación de cada cancha.", color: "text-gold-400" },
];

const STEP_COLORS = ["text-ember-400/80", "text-teal-400/80", "text-gold-400/80"];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="relative overflow-hidden bg-court-950 px-6 py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-teal-500/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-ember-400">
            Cómo funciona
          </p>
          <h2 className="font-display text-4xl text-cream-100 sm:text-5xl">
            Reservar es cuestión de segundos
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="rounded-2xl border border-cream-100/10 bg-court-850 p-7"
            >
              <span className={`font-display text-4xl ${STEP_COLORS[i % STEP_COLORS.length]}`}>
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-cream-100">{step.title}</h3>
              <p className="mt-2 text-sm text-cream-200/70">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-ember-400/20 bg-ember-500/[0.06] p-7 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label}>
              <p className={`text-sm font-semibold ${h.color}`}>{h.label}</p>
              <p className="mt-1 text-sm text-cream-200/70">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
