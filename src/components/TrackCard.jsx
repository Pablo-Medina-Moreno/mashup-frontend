import { Link, useNavigate } from "react-router-dom";
import { FaSpotify, FaYoutube } from "react-icons/fa";
import Card from "./Card";
import IconLink from "./IconLink";

export default function TrackCard({ track }) {
  console.log(track)
  const navigate = useNavigate();

  // Normalizar artistas (array siempre)
  const artists =
    Array.isArray(track.artists) && track.artists.length > 0
      ? track.artists
      : track.artist_id
      ? [
          {
            artist_id: track.artist_id,
            artist_name: track.artist_name,
          },
        ]
      : [];

  const albumPreview = {
    album_id: track.album_id,
    album_name: track.album_name,
  };

  const imageUrl = track.spotify_image_url;

  return (
    <Card>
      {/* Contenedor en columna para poder fijar la fila de acciones abajo */}
      <div className="flex flex-col h-full min-h-[190px]">
        {/* Imagen + info */}
        <div className="flex gap-3">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={track.track_name}
              className="h-16 w-16 rounded-xl object-cover border border-slate-700 shadow-md flex-shrink-0"
            />
          )}

          <div className="flex-1">
            {/* Nombre de la canción */}
            <h3 className="text-lg font-semibold text-orange-300">
              {track.track_name}
            </h3>

            {/* Género si existe */}
            {track.track_genre && (
              <p className="text-xs text-purple-300 mt-1 italic">
                Género: <span className="capitalize">{track.track_genre}</span>
              </p>
            )}

            {/* Lista de artistas (cada uno clicable) */}
            <p className="text-sm text-slate-400 mt-1">
              Artista{artists.length > 1 ? "s" : ""}:{" "}
              {artists.length === 0 ? (
                <span className="italic text-slate-500">Desconocido</span>
              ) : (
                artists.map((artist, index) => (
                  <span key={artist.artist_id || index}>
                    {index > 0 && ", "}
                    <Link
                      to={`/artists/${artist.artist_id}`}
                      state={{ artist }}
                      className="text-cyan-400 hover:underline"
                    >
                      {artist.artist_name}
                    </Link>
                  </span>
                ))
              )}
            </p>

            {/* Álbum debajo, también clicable */}
            <p className="text-sm text-slate-400">
              Álbum:{" "}
              {track.album_id ? (
                <Link
                  to={`/albums/${track.album_id}`}
                  state={{ album: albumPreview }}
                  className="text-cyan-400 hover:underline"
                >
                  {track.album_name || "Sin título"}
                </Link>
              ) : (
                <span className="italic text-slate-500">Sin álbum</span>
              )}
            </p>

            {/* Extra opcional: score de mezcla */}
            {track.similarity_score != null && (
              <p className="text-xs text-slate-500 mt-1">
                Score mezcla:{" "}
                <span className="font-mono">
                  {track.similarity_score.toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Espaciador para empujar las acciones al fondo de la tarjeta */}
        <div className="flex-1" />

        {/* Fila de acciones: Spotify (izq), YouTube (centro), Mezclar (dcha) */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Slot IZQUIERDA: Spotify */}
          <div className="flex items-center gap-2">
            {track.track_spotify_url && (
              <IconLink
                href={track.track_spotify_url}
                icon={FaSpotify}
                label="Spotify"
                color="text-green-500"
              />
            )}
          </div>

          {/* Slot CENTRO: YouTube (centrado, con ancho fijo para que quede en medio) */}
          <div className="flex items-center justify-center min-w-[110px]">
            {track.track_youtube_url && (
              <IconLink
                href={track.track_youtube_url}
                icon={FaYoutube}
                label="YouTube"
                color="text-red-500"
              />
            )}
          </div>

          {/* Slot DERECHA: botón Mezclar */}
          <button
            onClick={() => navigate(`/mix/${track.track_id}`)}
            className="px-4 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-sm shadow-md"
          >
            Mezclar
          </button>
        </div>
      </div>
    </Card>
  );
}
