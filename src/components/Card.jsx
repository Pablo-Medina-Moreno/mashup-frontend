// src/components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        [
          "h-full",                     // 👈 que el card llene la celda
          "flex flex-col",             // por si quieres alinear contenido dentro
          "bg-slate-900/80",
          "border border-slate-800",
          "rounded-xl",
          "p-4",
          "shadow-lg",
          "hover:border-cyan-400/60",
          "transition-colors",
          className,
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </div>
  );
}
