"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#apercu", label: "Vue d'ensemble" },
  { href: "#resultats", label: "Résultats des tests" },
  { href: "#bilan", label: "Bilan de campagne" },
  { href: "#consequences", label: "Enjeux & conséquences" },
  { href: "#valeur", label: "Valeur & rapports" },
  { href: "#tests-automatises", label: "Tests automatisés" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.06] bg-white/85 shadow-card backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 focus-ring rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-red to-brand-red-dark">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold text-brand-red-darker">Audit Agent IA GLPI</span>
            <span className="text-[11px] font-medium text-neutral-400">Third SARL · Restitution</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="focus-ring rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-brand-red/[0.06] hover:text-brand-red-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#valeur"
          className="focus-ring hidden items-center rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-red-dark lg:inline-flex"
        >
          Consulter les rapports
        </a>

        <button
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-red-darker lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-black/[0.06] bg-white lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-brand-red/[0.06] hover:text-brand-red-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
