import { useEffect, useState } from "react";
import { business } from "../data/mockData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-court-950/85 backdrop-blur-sm shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-2xl tracking-wide text-cream-100">
          {business.name}
          <span className="text-ember-400">.</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-cream-200/80 sm:flex">
          <a href="#canchas" className="transition hover:text-cream-100">
            Canchas
          </a>
          <a href="#como-funciona" className="transition hover:text-cream-100">
            Cómo funciona
          </a>
          <a href="#contacto" className="transition hover:text-cream-100">
            Contacto
          </a>
        </div>
        <a
          href="#reservar"
          className="rounded-lg bg-ember-500 px-5 py-2.5 text-sm font-semibold text-court-950 transition hover:bg-ember-400"
        >
          Reservar
        </a>
      </nav>
    </header>
  );
}
