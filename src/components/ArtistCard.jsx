import Card from "./Card";
import IconLink from "./IconLink";
import { FaSpotify } from "react-icons/fa";

export default function ArtistCard({ artist }) {
  // Followers bonito estilo Spotify
  const followers =
    artist.artist_followers != null
      ? Math.round(Number(artist.artist_followers)).toLocaleString("es-ES")
      : "-";

  const popularity = Number(artist.artist_popularity) || 0;
  const popularityPercent = Math.min(Math.max(popularity, 0), 100);

  const genres = Array.isArray(artist.genres)
    ? artist.genres
    : artist.artist_genres?.split(",") || [];

  const imageUrl = artist.spotify_image_url; // <- añadimos esto

  return (
    <Card>
      {/* Cabecera con imagen + nombre */}
      <div className="flex items-center gap-3 mb-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={artist.artist_name}
            className="h-12 w-12 rounded-full object-cover border border-slate-700 shadow-md flex-shrink-0"
          />
        )}
        <h3 className="text-lg font-semibold text-cyan-300">
          {artist.artist_name || "Artista desconocido"}
        </h3>
      </div>

      {/* Followers */}
      <p className="text-sm text-slate-400 mt-1">
        Seguidores:{" "}
        <span className="text-slate-200 font-semibold">
          {followers}
        </span>
      </p>

      {/* Popularidad con barra animada */}
      <div className="mt-2">
        <p className="text-sm text-slate-400 mb-1">
          Popularidad: {popularityPercent}%
        </p>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${popularityPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Géneros */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs text-slate-300 mt-3">
          {genres.map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700 capitalize"
            >
              {g.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Spotify (no propaga el click a la card) */}
      {artist.artist_spotify_url && (
        <div
          className="mt-4 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <IconLink
            href={artist.artist_spotify_url}
            icon={FaSpotify}
            label="Spotify"
            color="text-green-500"
          />
        </div>
      )}
    </Card>
  );
}
