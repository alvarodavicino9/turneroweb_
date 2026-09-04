import { useCallback, useEffect, useState } from "react";
import { business, seedBlocks, seedReservations } from "../data/mockData";

// ─────────────────────────────────────────────────────────────
// Este hook SIMULA el backend/base de datos (Supabase + API)
// mientras no está conectado. Guarda todo en localStorage para
// que la demo se sienta real (persiste turnos entre recargas).
// Cuando se conecte el backend real, este es el punto exacto
// donde hay que reemplazar las funciones por llamadas a la API.
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "hob_cba_reservas_demo_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted storage
  }
  return { reservations: seedReservations, blocks: seedBlocks };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage not available — demo keeps working in memory only
  }
}

export function generateSlots() {
  const slots = [];
  for (let h = business.openHour; h < business.closeHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

export function useReservations() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const isTaken = useCallback(
    (courtId, date, time) => {
      const reserved = state.reservations.some(
        (r) =>
          r.courtId === courtId &&
          r.date === date &&
          r.time === time &&
          r.status !== "cancelada"
      );
      const blocked = state.blocks.some(
        (b) => b.courtId === courtId && b.date === date && b.time === time
      );
      return reserved || blocked;
    },
    [state]
  );

  const getSlotStatus = useCallback(
    (courtId, date, time) => {
      const reservation = state.reservations.find(
        (r) =>
          r.courtId === courtId &&
          r.date === date &&
          r.time === time &&
          r.status !== "cancelada"
      );
      if (reservation) return { status: "reservada", reservation };
      const block = state.blocks.find(
        (b) => b.courtId === courtId && b.date === date && b.time === time
      );
      if (block) return { status: "bloqueada", block };
      return { status: "libre" };
    },
    [state]
  );

  const createReservation = useCallback(
    ({ courtId, date, time, name, phone, email }) => {
      if (isTaken(courtId, date, time)) {
        return { ok: false, error: "Ese horario ya no está disponible." };
      }
      const reservation = {
        id: `res-${Date.now()}`,
        courtId,
        date,
        time,
        name,
        phone,
        email,
        status: "confirmada",
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        reservations: [...prev.reservations, reservation],
      }));
      // TODO backend real: acá se dispara el email automático de
      // confirmación (y luego el recordatorio programado) desde el
      // servidor al crear la fila en Supabase.
      return { ok: true, reservation };
    },
    [isTaken]
  );

  const cancelReservation = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === id ? { ...r, status: "cancelada" } : r
      ),
    }));
  }, []);

  const addBlock = useCallback(({ courtId, date, time, reason }) => {
    setState((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { id: `block-${Date.now()}`, courtId, date, time, reason },
      ],
    }));
  }, []);

  const removeBlock = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));
  }, []);

  return {
    reservations: state.reservations,
    blocks: state.blocks,
    slots: generateSlots(),
    isTaken,
    getSlotStatus,
    createReservation,
    cancelReservation,
    addBlock,
    removeBlock,
  };
}
