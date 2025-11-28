import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Card from "../components/Card";
import {
  fetchTracks,
  fetchMixRecommendations,
  fetchSpotifyTrackImages,
} from "../api";
import { useMixSearch } from "../MixSearchContext";

export default function MixPage() {
  const navigate = useNavigate();
  const { trackId } = useParams();

  // estado global compartido con el Layout
  const { mixQuery, setMixQuery } = useMixSearch();

  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [baseTrack, setBaseTrack] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingMix, setLoadingMix] = useState(false);
  const [error, setError] = useState(null);

  const hasSearch = Boolean(mixQuery?.trim());

  /* ============ BÚSQUEDA DE CANCIONES PARA ELEGIR BASE ============ */

  useEffect(() => {
    if (!hasSearch) {
      setSearchResults([]);
      return;
    }

    const runSearch = async () => {
      setLoadingSearch(true);
      setError(null);
      try {
        // Solo se busca por nombre de canción
        const tracks = await fetchTracks(mixQuery);

        // Guardamos las canciones tal cual, sin pedir imágenes extra
        setSearchResults(tracks || []);
      } catch (err) {
        console.error("Error buscando canciones para mezclar", err);
        setError("Error buscando canciones para mezclar.");
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    };

    runSearch();
  }, [mixQuery, hasSearch]);

  /* ============ CARGA DE MIX PARA UN TRACK BASE ============ */

  useEffect(() => {
    if (!trackId) {
      setBaseTrack(null);
      setRecommendations([]);
      return;
    }

    const loadMix = async () => {
      setLoadingMix(true);
      setError(null);
      try {
        const res = await fetchMixRecommendations(trackId);
        const data = res.data || {};
        let base = data.base_track || null;
        let recs = data.recommendations || [];

        // Aquí SÍ pedimos imágenes solo de la canción base seleccionada + recomendaciones
        try {
          const ids = [
            ...(base?.track_id ? [base.track_id] : []),
            ...recs.map((r) => r.track_id).filter(Boolean),
          ];

          if (ids.length > 0) {
            const imageMap = await fetchSpotifyTrackImages(ids); // { [id]: url }

            if (base) {
              base = {
                ...base,
                spotify_image_url:
                  imageMap[base.track_id] ?? base.spotify_image_url ?? null,
              };
            }

            recs = recs.map((r) => ({
              ...r,
              spotify_image_url:
                imageMap[r.track_id] ?? r.spotify_image_url ?? null,
            }));
          }
        } catch (err) {
          console.error("Error cargando imágenes en mix", err);
        }

        setBaseTrack(base);
        setRecommendations(recs);
      } catch (err) {
        console.error("Error cargando recomendaciones de mezcla", err);
        setError("Error cargando recomendaciones de mezcla.");
        setBaseTrack(null);
        setRecommendations([]);
      } finally {
        setLoadingMix(false);
      }
    };

    loadMix();
  }, [trackId]);

  /* ============ HANDLERS ============ */

  // submit del SearchBar de MixPage
  const handleSearch = (term) => {
    const value = (term || "").trim();
    if (!value) return;
    setMixQuery(value);
    navigate("/mix"); // quita el trackId si había uno
  };

  const handleSelectBaseTrack = (track) => {
    navigate(`/mix/${track.track_id}`);
  };

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="mb-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/60 px-4 py-5 md:px-8 md:py-7 shadow-[0_0_30px_rgba(8,47,73,0.6)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-1">
                Mezclador inteligente
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Crea el mashup perfecto
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
                Elige una canción base y deja que el motor analice tempo,
                energía, tonalidad y popularidad para sugerirte mezclas que
                encajan de forma suave y creativa.
              </p>
            </div>

            {/* SearchBar sincronizado con Layout */}
            <div className="w-full md:w-80 lg:w-96">
              <SearchBar
                placeholder="Buscar canción para mezclar..."
                onSearch={handleSearch}
                value={mixQuery}
                onChangeValue={setMixQuery}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Consejo: escribe parte del título de la canción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        {/* IZQUIERDA: buscar, resultados y base seleccionada */}
        <div className="space-y-4">
          {/* Paso 1: buscar y elegir base */}
          <Card className="border border-slate-800/70 bg-slate-950/70 backdrop-blur-sm">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-1">
                  Paso 1
                </p>
                <h2 className="text-lg md:text-xl font-semibold text-emerald-300">
                  Buscar canción para usar como base
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Estos resultados se actualizan con lo que escribas en los
                  buscadores. Después, selecciona una canción como base del
                  mashup.
                </p>
              </div>

              {hasSearch && (
                <span className="inline-flex items-center gap-1 text-[11px] rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-emerald-200 whitespace-nowrap">
                  <span>{searchResults.length}</span>
                  <span>
                    {searchResults.length === 1 ? "resultado" : "resultados"}
                  </span>
                </span>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-rose-300">{error}</p>
            )}

            {loadingSearch ? (
              <div className="mt-4">
                <LoadingSpinner label="Buscando canciones..." />
              </div>
            ) : (
              <>
                {!hasSearch && (
                  <p className="mt-3 text-sm text-slate-400">
                    Empieza escribiendo el título de una canción en el buscador
                    de arriba.
                  </p>
                )}

                {hasSearch && searchResults.length === 0 && !error && (
                  <p className="mt-3 text-sm text-slate-400">
                    No se encontraron canciones llamadas{" "}
                    <span className="font-semibold text-slate-200">
                      “{mixQuery}”
                    </span>
                    .
                  </p>
                )}

                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-[20rem] overflow-y-auto pr-1 custom-scroll">
                    {searchResults.map((track, idx) => (
                      <button
                        key={track.track_id}
                        onClick={() => handleSelectBaseTrack(track)}
                        className="w-full text-left group opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 group-hover:border-cyan-400/70 group-hover:bg-slate-900/90 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            {/* Sin imagen en la lista de resultados */}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-100">
                                {track.track_name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {track.artists?.length
                                  ? track.artists
                                      .map((a) => a.artist_name)
                                      .join(", ")
                                  : track.artist_name || "Artista desconocido"}
                              </p>
                              {track.album_name && (
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Álbum:{" "}
                                  <span className="text-slate-300">
                                    {track.album_name}
                                  </span>
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              {track.track_tempo && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-200">
                                  {Math.round(track.track_tempo)} BPM
                                </span>
                              )}
                              <span className="text-[11px] text-cyan-300 group-hover:text-cyan-200">
                                Usar como base →
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Bloque: ver cuál es la base seleccionada */}
            <div className="mt-6 pt-4 border-t border-slate-800/70">
              <h3 className="text-sm font-semibold text-cyan-300">
                Canción base seleccionada
              </h3>
              {!trackId && (
                <p className="mt-2 text-sm text-slate-400">
                  Todavía no has elegido una canción base. Haz clic en una de
                  las canciones de la lista de arriba.
                </p>
              )}

              {trackId && (
                <div className="mt-3">
                  {loadingMix ? (
                    <LoadingSpinner label="Analizando canción base..." />
                  ) : baseTrack ? (
                    <div className="animate-fade-in-up">
                      {/* Aquí sí se muestra la imagen de la canción seleccionada */}
                      <TrackCard track={baseTrack} />
                    </div>
                  ) : (
                    <p className="text-sm text-rose-300">
                      No se encontró la canción base.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* DERECHA: recomendaciones */}
        <div className="space-y-3">
          <Card className="border border-slate-800/70 bg-slate-950/70 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-1">
              Paso 2
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-purple-300">
              Canciones recomendadas para mezclar
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Cuanto más bajo sea el "score mezcla", mejor encaja con tu base.
            </p>

            {!trackId && (
              <p className="mt-3 text-sm text-slate-400">
                Primero elige una canción base en el Paso 1 para ver
                recomendaciones.
              </p>
            )}

            {loadingMix && trackId && (
              <div className="mt-4">
                <LoadingSpinner label="Buscando combinaciones perfectas..." />
              </div>
            )}

            {!loadingMix && trackId && recommendations.length > 0 && (
              <div className="mt-4 space-y-3 max-h-[32rem] overflow-y-auto pr-1 custom-scroll">
                {recommendations.map((track) => (
                  <div
                    key={track.track_id}
                    className="opacity-0 animate-fade-in-up"
                  >
                    {/* Las recomendaciones ya vienen con imagen solo cuando hay base */}
                    <TrackCard track={track} />
                  </div>
                ))}
              </div>
            )}

            {!loadingMix &&
              trackId &&
              recommendations.length === 0 &&
              !error && (
                <p className="mt-3 text-sm text-slate-400">
                  No se encontraron mezclas compatibles.
                </p>
              )}
          </Card>
        </div>
      </section>
    </div>
  );
}
