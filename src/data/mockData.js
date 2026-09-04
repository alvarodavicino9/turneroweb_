// ─────────────────────────────────────────────────────────────
// DATOS GENÉRICOS / PLACEHOLDER
// Todo lo de este archivo es de ejemplo hasta tener la info real
// de HOB (nombre definitivo, horarios, dirección, precios, fotos).
// Reemplazar por los datos reales antes de publicar el sitio.
// ─────────────────────────────────────────────────────────────

export const business = {
  name: "HOB",
  tagline: "Canchas de básquet en Córdoba",
  address: "Dirección a confirmar, Córdoba Capital",
  instagram: "https://www.instagram.com/hob.cba",
  phone: "351 000 0000",
  email: "reservas@hob.cba",
  openHour: 9, // 9:00
  closeHour: 24, // 24:00 (medianoche)
  slotDurationMinutes: 60,
};

export const courts = [
  {
    id: "cancha-1",
    name: "Cancha 1",
    description: "Cancha techada, piso parquet, tablero de vidrio.",
  },
  {
    id: "cancha-2",
    name: "Cancha 2",
    description: "Cancha techada, piso sintético, ideal para 3x3.",
  },
];

// Reservas ya existentes de ejemplo, para que el turnero se vea
// con horarios ocupados y disponibles al mismo tiempo.
function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const seedReservations = [
  {
    id: "seed-1",
    courtId: "cancha-1",
    date: todayISO(0),
    time: "19:00",
    name: "Grupo Martes",
    phone: "351 555 1234",
    email: "ejemplo1@mail.com",
    status: "confirmada",
  },
  {
    id: "seed-2",
    courtId: "cancha-1",
    date: todayISO(0),
    time: "20:00",
    name: "Franco G.",
    phone: "351 555 5678",
    email: "ejemplo2@mail.com",
    status: "confirmada",
  },
  {
    id: "seed-3",
    courtId: "cancha-2",
    date: todayISO(0),
    time: "21:00",
    name: "Torneo interno",
    phone: "351 555 8765",
    email: "ejemplo3@mail.com",
    status: "confirmada",
  },
  {
    id: "seed-4",
    courtId: "cancha-2",
    date: todayISO(1),
    time: "18:00",
    name: "Cumple Sofi",
    phone: "351 555 4321",
    email: "ejemplo4@mail.com",
    status: "confirmada",
  },
];

export const seedBlocks = [
  {
    id: "block-1",
    courtId: "cancha-1",
    date: todayISO(2),
    time: "09:00",
    reason: "Mantenimiento de piso",
  },
];
