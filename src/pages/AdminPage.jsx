import { useMemo, useState } from "react";
import { courts, business } from "../data/mockData";
import { useReservations, generateSlots } from "../hooks/useReservations";

// ─────────────────────────────────────────────────────────────
// Panel de administración — versión demo.
// El login de acá abajo es SOLO una simulación en el navegador
// (contraseña fija, sin backend) para poder mostrar el flujo.
// Antes de publicar hay que reemplazarlo por autenticación real
// (Supabase Auth), para que este panel quede realmente protegido.
// ─────────────────────────────────────────────────────────────
const DEMO_PASSWORD = "hob2026";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function LoginGate({ onSuccess }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pwd === DEMO_PASSWORD) {
      sessionStorage.setItem("hob_admin_demo", "1");
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-court-950 px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-cream-100/10 bg-court-850 p-8">
        <p className="font-display text-3xl text-cream-100">
          {business.name}
          <span className="text-ember-400">.</span>{" "}
          <span className="text-lg font-sans text-cream-200/60">admin</span>
        </p>
        <p className="mt-2 mb-6 text-sm text-cream-200/60">
          Acceso privado para gestionar reservas y horarios.
        </p>
        <input
          type="password"
          autoFocus
          placeholder="Contraseña"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setError(false);
          }}
          className="w-full rounded-xl border border-cream-100/15 bg-court-950 px-4 py-3 text-cream-100 outline-none focus:border-ember-400/60"
        />
        {error && <p className="mt-2 text-sm text-red-400">Contraseña incorrecta.</p>}
        <p className="mt-2 text-xs text-cream-200/30">Demo: {DEMO_PASSWORD}</p>
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-ember-500 py-3 text-sm font-semibold text-court-950 transition hover:bg-ember-400"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("hob_admin_demo") === "1"
  );

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => {
    sessionStorage.removeItem("hob_admin_demo");
    setAuthed(false);
  }} />;
}

function AdminDashboard({ onLogout }) {
  const { reservations, blocks, cancelReservation, addBlock, removeBlock } = useReservations();
  const [date, setDate] = useState(todayISO());
  const [blockForm, setBlockForm] = useState({
    courtId: courts[0].id,
    time: generateSlots()[0],
    reason: "",
  });

  const dayReservations = useMemo(
    () =>
      reservations
        .filter((r) => r.date === date && r.status !== "cancelada")
        .sort((a, b) => a.time.localeCompare(b.time)),
    [reservations, date]
  );

  const dayBlocks = useMemo(
    () => blocks.filter((b) => b.date === date),
    [blocks, date]
  );

  const totalsByCourt = useMemo(() => {
    return courts.map((c) => ({
      court: c,
      count: reservations.filter(
        (r) => r.courtId === c.id && r.status !== "cancelada"
      ).length,
    }));
  }, [reservations]);

  function submitBlock(e) {
    e.preventDefault();
    addBlock({ ...blockForm, date });
    setBlockForm({ ...blockForm, reason: "" });
  }

  return (
    <div className="min-h-screen bg-court-950 px-6 py-10 text-cream-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-3xl">
              {business.name}
              <span className="text-ember-400">.</span>{" "}
              <span className="text-lg font-sans text-cream-200/60">admin</span>
            </p>
            <p className="text-sm text-cream-200/50">Panel de reservas (datos de demo)</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-cream-200/60 hover:text-cream-100">
              Ver sitio
            </a>
            <button
              onClick={onLogout}
              className="rounded-lg border border-cream-100/15 px-4 py-2 text-sm text-cream-200/70 hover:border-cream-100/30"
            >
              Salir
            </button>
          </div>
        </div>

        {/* stats rápidas */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {totalsByCourt.map(({ court, count }, i) => (
            <div key={court.id} className="rounded-2xl border border-cream-100/10 bg-court-850 p-5">
              <p className="text-sm text-cream-200/60">{court.name}</p>
              <p className={`font-display text-4xl ${i % 2 === 0 ? "text-ember-400" : "text-teal-300"}`}>
                {count}
              </p>
              <p className="text-xs text-cream-200/40">reservas activas totales</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-cream-200/60">Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-cream-100/15 bg-court-850 px-4 py-2 text-cream-100 outline-none focus:border-ember-400/60"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* reservas del día */}
          <div className="rounded-2xl border border-cream-100/10 bg-court-850 p-6">
            <h2 className="mb-4 text-lg font-semibold">Reservas — {date}</h2>
            {dayReservations.length === 0 && (
              <p className="text-sm text-cream-200/40">No hay turnos reservados este día.</p>
            )}
            <ul className="space-y-2">
              {dayReservations.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-cream-100/10 bg-court-950 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {r.time} · {courts.find((c) => c.id === r.courtId)?.name}
                    </p>
                    <p className="text-cream-200/50">
                      {r.name} · {r.phone} · {r.email}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelReservation(r.id)}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
                  >
                    Cancelar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* bloqueos */}
          <div className="rounded-2xl border border-cream-100/10 bg-court-850 p-6">
            <h2 className="mb-4 text-lg font-semibold">Bloquear horario</h2>
            <form onSubmit={submitBlock} className="mb-5 space-y-3">
              <div className="flex gap-2">
                <select
                  value={blockForm.courtId}
                  onChange={(e) => setBlockForm({ ...blockForm, courtId: e.target.value })}
                  className="flex-1 rounded-xl border border-cream-100/15 bg-court-950 px-3 py-2 text-sm text-cream-100"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={blockForm.time}
                  onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}
                  className="rounded-xl border border-cream-100/15 bg-court-950 px-3 py-2 text-sm text-cream-100"
                >
                  {generateSlots().map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <input
                placeholder="Motivo (mantenimiento, uso propio…)"
                value={blockForm.reason}
                onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                className="w-full rounded-xl border border-cream-100/15 bg-court-950 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-200/30"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-ember-500 py-2.5 text-sm font-semibold text-court-950 hover:bg-ember-400"
              >
                Bloquear {date}
              </button>
            </form>

            <h3 className="mb-2 text-sm font-semibold text-cream-200/70">Bloqueos de este día</h3>
            {dayBlocks.length === 0 && (
              <p className="text-sm text-cream-200/40">Ninguno.</p>
            )}
            <ul className="space-y-2">
              {dayBlocks.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-cream-100/10 bg-court-950 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {b.time} · {courts.find((c) => c.id === b.courtId)?.name}
                    </p>
                    <p className="text-cream-200/50">{b.reason || "Sin motivo"}</p>
                  </div>
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="rounded-lg border border-cream-100/15 px-3 py-1.5 text-xs text-cream-200/70 hover:border-cream-100/30"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
