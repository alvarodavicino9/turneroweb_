import { business } from "../data/mockData";

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-cream-100/10 bg-court-950 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
        <div>
          <p className="font-display text-2xl text-cream-100">
            {business.name}
            <span className="text-ember-400">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-cream-200/60">{business.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-16">
          <div>
            <p className="mb-2 font-semibold text-cream-100/90">Contacto</p>
            <p className="text-cream-200/60">{business.phone}</p>
            <p className="text-cream-200/60">{business.email}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-cream-100/90">Ubicación</p>
            <p className="text-cream-200/60">{business.address}</p>
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-ember-400 hover:text-ember-300"
            >
              Instagram
            </a>
          </div>
          <div>
            <p className="mb-2 font-semibold text-cream-100/90">Panel</p>
            <a href="/admin" className="text-cream-200/60 hover:text-cream-100">
              Ingreso administrador
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-cream-200/30">
        Datos de contacto y ubicación de ejemplo — se actualizan con la
        información real antes de publicar el sitio.
      </p>
    </footer>
  );
}
