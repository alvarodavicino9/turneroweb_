# HOB — sitio + turnero (demo con datos genéricos)

Landing + sistema de reservas para HOB (2 canchas de básquet, alquiler por
hora). Esta versión usa **datos de ejemplo** y simula el backend en el
navegador (localStorage), para poder mostrar el flujo completo antes de
tener la información real y conectar Supabase.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`. El panel de administración está en
`/admin` (contraseña de demo: `hob2026`, ver `src/pages/AdminPage.jsx`).

## Qué es real y qué es demo

- **Frontend (real, listo para producción):** landing, hero animado,
  turnero, panel admin. Stack: React + Vite + Tailwind CSS v4 + Framer
  Motion + React Router.
- **"Backend" (demo, hay que reemplazarlo):** `src/hooks/useReservations.js`
  guarda todo en `localStorage` del navegador. Ahí están marcados con
  `TODO backend real` los puntos exactos donde hay que conectar la API/
  Supabase en vez de la simulación.
- **Login del panel admin (demo):** contraseña fija en el código
  (`src/pages/AdminPage.jsx`). Hay que reemplazarlo por autenticación real
  (Supabase Auth) antes de publicar.
- **Emails automáticos:** por ahora solo se muestra un mensaje simulado de
  "te va a llegar un email". Falta conectar un servicio de envío
  transaccional (ej. Resend) desde el backend.
- **Datos del negocio:** nombre, horario, direcciones, teléfono, textos de
  las canchas y contenido de contacto están en `src/data/mockData.js`,
  todos marcados como genéricos. Reemplazar ahí cuando tengamos la
  info confirmada de HOB (fotos, precios, horario real, dirección).

## Estructura

```
src/
  components/   Hero, animación del aro/pelota, navbar, secciones, turnero
  pages/        LandingPage (/) y AdminPage (/admin)
  hooks/        useReservations — simulación de reservas/disponibilidad
  data/         mockData.js — todo el contenido placeholder
```

## Siguientes pasos (según la propuesta)

1. Confirmar datos reales de HOB y reemplazar `mockData.js`.
2. Crear las tablas en Supabase (`canchas`, `reservas`, `bloqueos`) según
   el modelo de la propuesta.
3. Reemplazar `useReservations.js` por llamadas reales a la API/Supabase.
4. Conectar el envío de emails automáticos (confirmación + recordatorio).
5. Reemplazar el login demo del panel admin por Supabase Auth.
6. Deploy: frontend (Vercel/Netlify) + backend (Railway), como el resto de
   los proyectos.
