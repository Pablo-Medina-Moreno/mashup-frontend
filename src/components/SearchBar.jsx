import { useEffect, useState } from "react";

export default function SearchBar({
  placeholder,
  onSearch,
  compact,
  // para modo no controlado (otros listados)
  initialValue = "",
  // para modo controlado (mezclar)
  value,
  onChangeValue,
}) {
  const isControlled = value !== undefined;

  // estado interno sólo si NO es controlado
  const [innerValue, setInnerValue] = useState(
    isControlled ? "" : initialValue
  );

  // si usamos initialValue (modo no controlado), sincronizamos
  useEffect(() => {
    if (!isControlled) {
      setInnerValue(initialValue);
    }
  }, [initialValue, isControlled]);

  const currentValue = isControlled ? value : innerValue;

  const handleChange = (e) => {
    const v = e.target.value;
    if (isControlled) {
      onChangeValue?.(v); // modo controlado -> avisa al padre
    } else {
      setInnerValue(v); // modo no controlado -> estado interno
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(currentValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-full bg-slate-900/70 border border-slate-700/70 px-3 py-1 mb-4 ${
        compact ? "text-sm" : "text-base"
      }`}
    >
      <input
        className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-semibold text-xs md:text-sm hover:bg-cyan-400 transition"
      >
        Buscar
      </button>
    </form>
  );
}
