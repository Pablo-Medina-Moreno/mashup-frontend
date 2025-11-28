import { Link } from "react-router-dom";
import Card from "./Card";
import IconLink from "./IconLink";
import { FaSpotify } from "react-icons/fa";

export default function AlbumCard({ album }) {
  const artist = album.artist_id
    ? {
        artist_id: album.artist_id,
        artist_name: album.artist_name,
      }
    : null;

  const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  const releaseDate = formatDate(album.album_release_date);

  const trackCount = album.album_total_tracks;
  const trackLabel =
    trackCount === 1
      ? "1 pista"
      : trackCount > 1
      ? `${trackCount} pistas`
      : null;

  return (
    <Card className="flex flex-col h-full">
      {/* IMAGEN: ahora se ve completa */}
      {album.spotify_image_url && (
        <div className="mb-3 w-full rounded-2xl overflow-hidden bg-slate-900/70 flex items-center justify-center">
          <img
            src={album.spotify_image_url}
            alt={album.album_name}
            className="w-full h-full object-contain"  // <- antes seguro era object-cover
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-purple-300">
          {album.album_name || "Álbum sin nombre"}
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Artista:{" "}
          {artist ? (
            <Link
              to={`/artists/${artist.artist_id}`}
              state={{ artist }}
              className="text-cyan-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {artist.artist_name}
            </Link>
          ) : (
            <span className="italic text-slate-500">Desconocido</span>
          )}
        </p>

        <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
          {album.album_type && (
            <span className="capitalize">{album.album_type}</span>
          )}
          {releaseDate && <span>{releaseDate}</span>}
          {trackLabel && <span>{trackLabel}</span>}
        </p>

        {/* Iconos abajo del todo para que todas las tarjetas tengan misma altura visual */}
        <div
          className="mt-auto pt-3 flex flex-wrap gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {album.album_spotify_url && (
            <IconLink
              href={album.album_spotify_url}
              icon={FaSpotify}
              label="Spotify"
              color="text-green-500"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
