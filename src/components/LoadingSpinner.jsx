// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ label = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
      <div className="relative h-12 w-12 mb-3">
        {/* aro girando */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        {/* centro DJ */}
        <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-cyan-300">
          DJ
        </div>
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
