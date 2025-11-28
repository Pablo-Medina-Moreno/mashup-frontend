import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchAlbumDetail,
  fetchAlbumTracks,
  fetchSpotifyAlbumImages,
  fetchSpotifyTrackImages,
} from "../api";
import TrackCard from "../components/TrackCard";
import LoadingSpinner from "../components/LoadingSpinner";
import IconLink from "../components/IconLink";
import { FaSpotify, FaYoutube } from "react-icons/fa";

const PLACEHOLDER_ALBUM = "/placeholders/track-placeholder.png";

const PLACEHOLDER_TRACK = "/placeholders/track-placeholder.png"

export default function AlbumDetailPage() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("es-ES");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const albumData = await fetchAlbumDetail(albumId);
        const tracksData = await fetchAlbumTracks(albumId);

        if (!albumData) {
          setAlbum(null);
          setArtist(null);
          setTracks([]);
          return;
        }

        if (albumData.artist_id) {
          setArtist({
            artist_id: albumData.artist_id,
            artist_name: albumData.artist_name,
          });
        } else {
          setArtist(null);
        }

        let albumImage = albumData.spotify_image_url || null;
        let trackImageMap = {};

        try {
          if (!albumImage && albumData.album_id) {
            const albImgMap = await fetchSpotifyAlbumImages([
              albumData.album_id,
            ]);
            albumImage = albImgMap[albumData.album_id] || null;
          }

          const trackIds = (tracksData || [])
            .map((t) => t.track_id)
            .filter(Boolean);

          if (trackIds.length > 0) {
            trackImageMap =
              (await fetchSpotifyTrackImages(trackIds)) || {};
          }
        } catch (err) {
          console.error("Error cargando imágenes de álbum", err);
        }

        setAlbum({
          ...albumData,
          spotify_image_url: albumImage,
        });

        setTracks(
          (tracksData || []).map((t) => ({
            ...t,
            spotify_image_url:
              trackImageMap[t.track_id] ?? t.spotify_image_url ?? null,
          }))
        );
      } catch (err) {
        console.error("Error fetching album detail", err);
        setAlbum(null);
        setArtist(null);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [albumId]);

  if (loading) {
    return <LoadingSpinner label="Cargando álbum..." />;
  }

  if (!album) return <p>No se encontró el álbum.</p>;

  const tracksCount = tracks.length || album.album_total_tracks || 0;
  const tracksLabel =
    tracksCount === 1 ? "1 pista" : `${tracksCount} pistas`;
  const sectionTitle = tracksCount === 1 ? "Canción" : "Canciones";

  const albumCover = album.spotify_image_url || PLACEHOLDER_ALBUM;

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row gap-4 items-start mb-4">
        <img
          src={albumCover}
          alt={album.album_name}
          className="w-40 h-40 rounded-xl object-cover border border-slate-700 shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold text-purple-400">
            {album.album_name || "Álbum"}
          </h2>

          <div className="mt-3 flex flex-col gap-1 text-sm text-slate-300">
            {artist && (
              <p>
                Artista:{" "}
                <Link
                  to={`/artists/${artist.artist_id}`}
                  state={{ artist }}
                  className="font-semibold text-cyan-400 hover:underline"
                >
                  {artist.artist_name}
                </Link>
              </p>
            )}

            <p>
              Fecha de lanzamiento:{" "}
              <span className="font-medium">
                {formatDate(album.album_release_date)}
              </span>
            </p>

            <p>
              Tipo:{" "}
              <span className="font-medium">
                {album.album_type || "-"}
              </span>
            </p>

            <p>
              Pistas:{" "}
              <span className="font-medium">
                {tracksCount ? tracksLabel : "-"}
              </span>
            </p>
          </div>

          {(album.album_spotify_url || album.album_youtube_url) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {album.album_spotify_url && (
                <IconLink
                  href={album.album_spotify_url}
                  icon={FaSpotify}
                  label="Ver en Spotify"
                  color="text-green-500"
                />
              )}

              {album.album_youtube_url && (
                <IconLink
                  href={album.album_youtube_url}
                  icon={FaYoutube}
                  label="Ver en YouTube"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lista de canciones */}
      <h3 className="text-xl mt-2">{sectionTitle}</h3>

      <div className="grid md:grid-cols-3 gap-4 mt-3">
        {tracks.map((t, idx) => {
          const displayImage = t.spotify_image_url || PLACEHOLDER_TRACK;

          return (
            <div
              key={t.track_id}
              className="cursor-pointer opacity-0 animate-fade-in-up transform transition-transform duration-200 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <TrackCard
                track={{
                  ...t,
                  spotify_image_url: displayImage,
                }}
              />
            </div>
          );
        })}

        {tracks.length === 0 && (
          <p className="col-span-full text-sm text-slate-300">
            No hay canciones registradas para este álbum.
          </p>
        )}
      </div>
    </div>
  );
}
