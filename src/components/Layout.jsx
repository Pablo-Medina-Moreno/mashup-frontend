import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { useMixSearch } from "../MixSearchContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative px-2 py-1 text-sm font-medium transition-colors duration-300",
          isActive ? "text-cyan-400" : "text-slate-300 hover:text-cyan-300",
          "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full",
          "after:origin-left after:scale-x-0 after:rounded-full",
          "after:bg-gradient-to-r after:from-cyan-400 after:via-purple-500 after:to-pink-500",
          "after:transition-transform after:duration-300",
          isActive && "after:scale-x-100",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // estado global de mezcla
  const { mixQuery, setMixQuery } = useMixSearch();

  const handleMixSearch = (q) => {
    const value = (q || "").trim();
    if (!value) return;

    setMixQuery(value);
    navigate("/mix");
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[url('/foto.png')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/90" />
      </div>

      {/* HEADER */}
      <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="hover-spin cursor-pointer h-8 w-8 rounded-xl bg-gradient-to-tr 
            from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center 
            text-[10px] font-black shadow-lg"
          >
            DJ
          </span>

          <span className="text-xl font-bold tracking-wide text-cyan-400">
            MashupLab
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex gap-6">
          <NavItem to="/artists">Artistas</NavItem>
          <NavItem to="/albums">Álbumes</NavItem>
          <NavItem to="/tracks">Canciones</NavItem>
          <NavItem to="/mix">Mezclar</NavItem>
        </nav>

        {/* SEARCH DESKTOP (mezclar) */}
        <div className="hidden md:block w-80">
          <SearchBar
            compact
            placeholder="Buscar canción para mezclar..."
            onSearch={handleMixSearch}
            value={mixQuery}
            onChangeValue={setMixQuery}
          />
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Abrir menú de navegación"
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </header>

      {/* NAV + BUSCADOR MÓVIL */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 backdrop-blur px-6 py-3 space-y-3">
          <nav className="flex flex-col gap-2">
            <NavItem to="/artists">Artistas</NavItem>
            <NavItem to="/albums">Álbumes</NavItem>
            <NavItem to="/tracks">Canciones</NavItem>
            <NavItem to="/mix">Mezclar</NavItem>
          </nav>
          <SearchBar
            compact
            placeholder="Buscar canción para mezclar..."
            onSearch={handleMixSearch}
            value={mixQuery}
            onChangeValue={setMixQuery}
          />
        </div>
      )}

      {/* MAIN – menos padding arriba para que el SearchBar se pegue más al header */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-3 pb-6 md:pt-4">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-4 text-sm text-slate-400 flex items-center justify-center gap-3">
        <img
          src="/dj-icon.svg"
          alt="MashupLab icon"
          className="hover-spin cursor-pointer h-6 w-6"
        />
        <p className="leading-none">MashupLab · Recomendador de Mashups</p>
      </footer>
    </div>
  );
}
