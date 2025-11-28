// HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h1 className="text-4xl font-bold">
          MashupLab{" "}
          <span className="text-cyan-400">Recommender</span>
        </h1>

        <p className="text-slate-400 mt-3 max-w-xl">
          Explora artistas, álbumes y canciones, y recibe recomendaciones
          automáticas para mezclar canciones compatibles.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          {/* Botón principal: Empezar a mezclar */}
          <Link
            to="/mix"
            className="
              inline-flex items-center gap-2
              px-6 py-2.5 rounded-full
              bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500
              text-slate-950 font-semibold
              shadow-lg shadow-cyan-500/30
              hover:shadow-cyan-400/50
              hover:-translate-y-0.5 hover:brightness-110
              active:translate-y-0 active:brightness-95
              transition-all duration-200
            "
          >
            <span>Empezar a mezclar</span>
            <span className="text-sm">▶</span>
          </Link>

          {/* Botón secundario: Ver canciones */}
          <Link
            to="/tracks"
            className="
              relative inline-flex items-center gap-2
              px-6 py-2.5 rounded-full
              border border-slate-700
              bg-slate-900/70 text-slate-100
              hover:border-cyan-400 hover:text-cyan-300
              hover:-translate-y-0.5
              transition-all duration-200
              before:absolute before:inset-0 before:rounded-full
              before:bg-gradient-to-r before:from-cyan-500/20 before:to-purple-500/20
              before:opacity-0 hover:before:opacity-100
              before:-z-10
            "
          >
            <span>Ver canciones</span>
            <span className="text-sm">♪</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
