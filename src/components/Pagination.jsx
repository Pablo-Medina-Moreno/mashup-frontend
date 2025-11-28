import React from "react";

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > pageCount) return;
    onPageChange(p);
  };

  const MAX_PAGES_SHOWN = 5;
  let start = Math.max(1, page - 2);
  let end = Math.min(pageCount, start + MAX_PAGES_SHOWN - 1);
  if (end - start + 1 < MAX_PAGES_SHOWN) {
    start = Math.max(1, end - MAX_PAGES_SHOWN + 1);
  }

  const pages = [];
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-xs md:text-sm">
      {/* Ir al principio */}
      <button
        onClick={() => goTo(1)}
        disabled={page === 1}
        className={`px-2 py-1 rounded-full border border-slate-700/70 bg-slate-900/60
          hover:border-cyan-400 hover:text-cyan-300 transition
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        «
      </button>

      {/* Anterior */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className={`px-2 py-1 rounded-full border border-slate-700/70 bg-slate-900/60
          hover:border-cyan-400 hover:text-cyan-300 transition
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {/* Páginas intermedias */}
      {start > 1 && (
        <span className="px-1 text-slate-400">...</span>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`px-3 py-1 rounded-full border text-xs md:text-sm
            ${
              p === page
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                : "border-slate-700/70 bg-slate-900/60 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            }
            transition`}
        >
          {p}
        </button>
      ))}

      {end < pageCount && (
        <span className="px-1 text-slate-400">...</span>
      )}

      {/* Siguiente */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === pageCount}
        className={`px-2 py-1 rounded-full border border-slate-700/70 bg-slate-900/60
          hover:border-cyan-400 hover:text-cyan-300 transition
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        ›
      </button>

      {/* Ir al final */}
      <button
        onClick={() => goTo(pageCount)}
        disabled={page === pageCount}
        className={`px-2 py-1 rounded-full border border-slate-700/70 bg-slate-900/60
          hover:border-cyan-400 hover:text-cyan-300 transition
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        »
      </button>
    </div>
  );
}
