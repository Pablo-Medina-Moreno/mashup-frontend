export default function IconLink({ href, icon: Icon, label }) {
  if (!href) return null;

  // Detectar el tipo de icono para aplicar color
  const color =
    Icon.displayName === "FaSpotify"
      ? "text-green-500"
      : Icon.displayName === "FaYoutube"
      ? "text-red-500"
      : "text-white";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 text-xs border border-slate-700 px-2 py-1 rounded-full bg-slate-900 hover:bg-slate-800 transition"
    >
      <Icon className={`text-lg ${color}`} />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

// export default function IconLink({ href, icon: Icon, label, color = "text-white" }) {
//   if (!href) return null;

//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center gap-1 text-xs border border-slate-700 px-2 py-1 rounded-full bg-slate-900 hover:bg-slate-800 transition"
//     >
//       <Icon className={`text-lg ${color}`} />
//       <span className="hidden sm:inline">{label}</span>
//     </a>
//   );
// }

