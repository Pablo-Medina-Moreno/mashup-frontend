import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchArtistDetail,
  fetchSpotifyArtistImages,
  fetchSpotifyAlbumImages,
  fetchSpotifyTrackImages,
} from "../api";
import AlbumCard from "../components/AlbumCard";
import TrackCard from "../components/TrackCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import IconLink from "../components/IconLink";
import { FaSpotify } from "react-icons/fa";

const ALBUMS_PER_PAGE = 6;
const TRACKS_PER_PAGE = 9;

const PLACEHOLDER_ALBUM =
  "/placeholders/track-placeholder.png"

const PLACEHOLDER_TRACK =
  "/placeholders/track-placeholder.png"

export default function ArtistDetailPage() {
  const { artistId } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAlbums, setShowAlbums] = useState(true);
  const [showTracks, setShowTracks] = useState(true);

  const [albumPage, setAlbumPage] = useState(1);
  const [trackPage, setTrackPage] = useState(1);

  const [albumImages, setAlbumImages] = useState({}); // { [albumId]: url }
  const [trackImages, setTrackImages] = useState({}); // { [trackId]: url }

  const formatFollowers = (num) => {
    if (num == null) return "-";
    return Math.round(Number(num)).toLocaleString("es-ES");
  };

  // Carga datos + imagen del artista
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const detail = await fetchArtistDetail(artistId);
        const artistData = detail?.artist || null;
        const albumsData = detail?.albums || [];
        const tracksData = detail?.tracks || [];

        let artistImage = null;
        try {
          if (artistData && artistData.artist_id) {
            const imgsA = await fetchSpotifyArtistImages([artistData.artist_id]);
            artistImage = imgsA[artistData.artist_id] || null;
          }
        } catch (err) {
          console.error("Error cargando imagen del artista", err);
        }

        setArtist(
          artistData
            ? { ...artistData, spotify_image_url: artistImage }
            : null
        );
        setAlbums(albumsData || []);
        setTracks(tracksData || []);

        setAlbumPage(1);
        setTrackPage(1);
        setAlbumImages({});
        setTrackImages({});
      } catch (err) {
        console.error("Error fetching artist detail", err);
        setArtist(null);
        setAlbums([]);
        setTracks([]);
        setAlbumImages({});
        setTrackImages({});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [artistId]);

  // Imágenes de álbumes por página
  useEffect(() => {
    const loadAlbumPageImages = async () => {
      if (!albums.length) return;

      const start = (albumPage - 1) * ALBUMS_PER_PAGE;
      const currentPageAlbums = albums.slice(start, start + ALBUMS_PER_PAGE);

      const idsToFetch = currentPageAlbums
        .map((a) => a.album_id)
        .filter((id) => id && !albumImages[id]);

      if (idsToFetch.length === 0) return;

      try {
        const newMap = await fetchSpotifyAlbumImages(idsToFetch);
        setAlbumImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      } catch (err) {
        console.error("Error cargando imágenes de álbumes (paginado)", err);
      }
    };

    loadAlbumPageImages();
  }, [albums, albumPage, albumImages]);

  // Imágenes de canciones por página
  useEffect(() => {
    const loadTrackPageImages = async () => {
      if (!tracks.length) return;

      const start = (trackPage - 1) * TRACKS_PER_PAGE;
      const currentPageTracks = tracks.slice(start, start + TRACKS_PER_PAGE);

      const idsToFetch = currentPageTracks
        .map((t) => t.track_id)
        .filter((id) => id && !trackImages[id]);

      if (idsToFetch.length === 0) return;

      try {
        const newMap = await fetchSpotifyTrackImages(idsToFetch);
        setTrackImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      } catch (err) {
        console.error("Error cargando imágenes de canciones (paginado)", err);
      }
    };

    loadTrackPageImages();
  }, [tracks, trackPage, trackImages]);

  if (loading) return <LoadingSpinner label="Cargando artista..." />;
  if (!artist) return <p>No se encontró el artista.</p>;

  const visibleAlbums = albums.slice(
    (albumPage - 1) * ALBUMS_PER_PAGE,
    albumPage * ALBUMS_PER_PAGE
  );
  const albumsPageCount = Math.ceil(albums.length / ALBUMS_PER_PAGE) || 1;

  const visibleTracks = tracks.slice(
    (trackPage - 1) * TRACKS_PER_PAGE,
    trackPage * TRACKS_PER_PAGE
  );
  const tracksPageCount = Math.ceil(tracks.length / TRACKS_PER_PAGE) || 1;

  const popularity = artist.artist_popularity ?? null;

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {artist.spotify_image_url && (
          <img
            src={artist.spotify_image_url}
            alt={artist.artist_name}
            className="w-32 h-32 rounded-full object-cover border border-slate-700 shadow-lg"
          />
        )}

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-cyan-400">
            {artist.artist_name}
          </h2>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            {artist.artist_followers != null && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Seguidores
                </p>
                <p className="text-2xl font-semibold text-slate-50 leading-tight">
                  {formatFollowers(artist.artist_followers)}
                </p>
              </div>
            )}

            {popularity != null && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Popularidad
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, popularity))}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-200 min-w-[3rem] text-right">
                    {Math.round(popularity)}%
                  </span>
                </div>
              </div>
            )}

            {artist.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 text-xs">
                {artist.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-slate-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {artist.artist_spotify_url && (
              <div className="mt-2 flex gap-2">
                <IconLink
                  href={artist.artist_spotify_url}
                  icon={FaSpotify}
                  label="Ver en Spotify"
                  color="text-green-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Switches */}
      <div className="mt-6 flex gap-6 text-sm items-center">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAlbums}
            onChange={() => setShowAlbums((v) => !v)}
            className="accent-cyan-400"
          />
          <span>Mostrar álbumes</span>
        </label>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTracks}
            onChange={() => setShowTracks((v) => !v)}
            className="accent-cyan-400"
          />
          <span>Mostrar canciones</span>
        </label>
      </div>

      {/* Álbumes */}
      {showAlbums && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Álbumes</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {visibleAlbums.map((al, i) => {
              const realImage =
                albumImages[al.album_id] ||
                al.spotify_image_url ||
                null;
              const displayImage = realImage || PLACEHOLDER_ALBUM;

              return (
                <div
                  key={al.album_id}
                  className="cursor-pointer opacity-0 animate-fade-in-up hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => navigate(`/albums/${al.album_id}`)}
                >
                  <AlbumCard
                    album={{
                      ...al,
                      spotify_image_url: displayImage,
                    }}
                  />
                </div>
              );
            })}

            {visibleAlbums.length === 0 && (
              <p className="col-span-full text-slate-400 text-sm">
                No hay álbumes para este artista.
              </p>
            )}
          </div>

          <Pagination
            page={albumPage}
            pageCount={albumsPageCount}
            onPageChange={setAlbumPage}
          />
        </div>
      )}

      {/* Canciones */}
      {showTracks && (
        <div className="mt-8">
          <h3 className="text-xl mb-2">Canciones</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {visibleTracks.map((t, i) => {
              const realImage =
                trackImages[t.track_id] ||
                t.spotify_image_url ||
                null;
              const displayImage = realImage || PLACEHOLDER_TRACK;

              return (
                <div
                  key={t.track_id}
                  className="opacity-0 animate-fade-in-up hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${i * 60}ms` }}
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

            {visibleTracks.length === 0 && (
              <p className="col-span-full text-slate-400 text-sm">
                No hay canciones para este artista.
              </p>
            )}
          </div>

          <Pagination
            page={trackPage}
            pageCount={tracksPageCount}
            onPageChange={setTrackPage}
          />
        </div>
      )}
    </div>
  );
}
