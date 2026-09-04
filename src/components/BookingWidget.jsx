import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { courts, business } from "../data/mockData";
import { useReservations } from "../hooks/useReservations";
import CourtDiagram from "./CourtDiagram";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const STATUS_STYLES = {
  libre:
    "border-cream-100/15 bg-court-950 text-cream-100 hover:border-ember-400/60 hover:bg-ember-500/10 cursor-pointer",
  reservada: "border-transparent bg-court-700/50 text-cream-200/30 cursor-not-allowed",
  bloqueada: "border-transparent bg-court-700/30 text-cream-200/20 cursor-not-allowed",
};

const PERIODS = [
  { label: "Mañana", test: (h) => h >= 5 && h < 13 },
  { label: "Tarde", test: (h) => h >= 13 && h < 19 },
  { label: "Noche", test: (h) => h >= 19 || h < 5 },
];

function groupByPeriod(slotList) {
  return PERIODS.map((period) => ({
    ...period,
    items: slotList.filter(({ time }) => period.test(Number(time.slice(0, 2)))),
  })).filter((group) => group.items.length > 0);
}

export default function BookingWidget() {
  const { slots, getSlotStatus, createReservation } = useReservations();
  const [courtId, setCourtId] = useState(courts[0].id);
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [result, setResult] = useState(null); // { ok, error } | null
  const [submitting, setSubmitting] = useState(false);

  const slotList = useMemo(
    () => slots.map((time) => ({ time, ...getSlotStatus(courtId, date, time) })),
    [slots, courtId, date, getSlotStatus]
  );
  const groups = useMemo(() => groupByPeriod(slotList), [slotList]);

  const selectedCourt = courts.find((c) => c.id === courtId);
  const courtNumber = courts.findIndex((c) => c.id === courtId) + 1;

  function chooseSlot(time, status) {
    if (status !== "libre") return;
    setSlot(time);
    setResult(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!slot) return;
    setSubmitting(true);
    // simulamos una pequeña latencia de red, como tendría el backend real
    setTimeout(() => {
      const res = createReservation({ courtId, date, time: slot, ...form });
      setResult(res);
      setSubmitting(false);
      if (res.ok) {
        setForm({ name: "", phone: "", email: "" });
        setSlot(null);
      }
    }, 400);
  }

  return (
    <section id="reservar" className="relative bg-court-900 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-ember-400">
            Turnero
          </p>
          <h2 className="font-display text-4xl text-cream-100 sm:text-5xl">
            Reservá tu cancha
          </h2>
          <p className="mt-3 text-cream-200/70">
            Horario de {business.name}: {business.openHour}:00 a{" "}
            {business.closeHour === 24 ? "00:00" : `${business.closeHour}:00`} · turnos de 1 hora
          </p>
        </div>

        <div className="rounded-2xl border border-cream-100/10 bg-court-850 p-6 sm:p-8">
          {/* selector de cancha */}
          <div className="mb-6 flex gap-2">
            {courts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCourtId(c.id);
                  setSlot(null);
                  setResult(null);
                }}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  c.id === courtId
                    ? "border-ember-400 bg-ember-500/15 text-ember-300"
                    : "border-cream-100/10 text-cream-200/60 hover:border-cream-100/25"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* columna izquierda: vista de la cancha */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={courtId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="aspect-[3/4]"
                >
                  <CourtDiagram courtNumber={courtNumber} label={selectedCourt.name} />
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-sm text-cream-200/60">{selectedCourt.description}</p>
            </div>

            {/* columna derecha: fecha + horarios + formulario */}
            <div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-cream-200/70">
                  Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  min={todayISO()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlot(null);
                    setResult(null);
                  }}
                  className="w-full rounded-xl border border-cream-100/15 bg-court-950 px-4 py-3 text-cream-100 outline-none focus:border-ember-400/60 sm:w-56"
                />
              </div>

              <div className="mb-2">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-cream-200/70">
                    Horarios · {selectedCourt.name}
                  </p>
                  <div className="flex gap-4 text-xs text-cream-200/50">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-court-950 ring-1 ring-cream-100/25" /> Libre
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-court-700/60" /> Reservado
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-court-700/30" /> Bloqueado
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${courtId}-${date}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {groups.map((group) => (
                      <div key={group.label}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cream-200/40">
                          {group.label}
                        </p>
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                          {group.items.map(({ time, status, block }) => (
                            <button
                              key={time}
                              type="button"
                              title={
                                status === "bloqueada"
                                  ? `Bloqueado${block?.reason ? `: ${block.reason}` : ""}`
                                  : status === "reservada"
                                    ? "Horario ya reservado"
                                    : "Horario disponible"
                              }
                              onClick={() => chooseSlot(time, status)}
                              disabled={status !== "libre"}
                              className={`relative rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                                STATUS_STYLES[status]
                              } ${slot === time ? "!border-ember-400 !bg-ember-500 !text-court-950" : ""}`}
                            >
                              {time}
                              {status === "bloqueada" && (
                                <span className="absolute right-1.5 top-1.5 text-[10px] opacity-60">
                                  🔒
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* formulario de datos */}
              <AnimatePresence mode="wait">
                {slot && (
                  <motion.form
                    key={slot}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="mt-6 overflow-hidden border-t border-cream-100/10 pt-6"
                  >
                    <p className="mb-4 text-sm text-cream-200/70">
                      Confirmando <span className="font-semibold text-cream-100">{selectedCourt.name}</span> el{" "}
                      <span className="font-semibold text-cream-100">{date}</span> a las{" "}
                      <span className="font-semibold text-ember-400">{slot}</span>
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        required
                        placeholder="Nombre y apellido"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="rounded-xl border border-cream-100/15 bg-court-950 px-4 py-3 text-sm text-cream-100 outline-none placeholder:text-cream-200/30 focus:border-ember-400/60"
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Teléfono"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="rounded-xl border border-cream-100/15 bg-court-950 px-4 py-3 text-sm text-cream-100 outline-none placeholder:text-cream-200/30 focus:border-ember-400/60"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="rounded-xl border border-cream-100/15 bg-court-950 px-4 py-3 text-sm text-cream-100 outline-none placeholder:text-cream-200/30 focus:border-ember-400/60"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-4 w-full rounded-xl bg-ember-500 py-3.5 text-sm font-semibold text-court-950 transition hover:bg-ember-400 disabled:opacity-60 sm:w-auto sm:px-8"
                    >
                      {submitting ? "Confirmando…" : "Confirmar turno"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                    result.ok
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {result.ok
                    ? "¡Turno confirmado! Te va a llegar un email de confirmación (simulado en esta demo)."
                    : result.error}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
