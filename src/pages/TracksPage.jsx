import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";
import { fetchTracks, fetchSpotifyTrackImages } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 9;

async function preloadImages(urls) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  await Promise.all(
    uniqueUrls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  );
}

const PLACEHOLDER_IMAGE =
  "/placeholders/track-placeholder.png"

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);
  const [trackImages, setTrackImages] = useState({}); // { [trackId]: url }
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const load = async (s = "") => {
    setLoading(true);
    try {
      const tracksData = await fetchTracks(s);
      const safeData = tracksData || [];

      setTracks(safeData);
      setTrackImages({});

      const firstPage = 1;
      const startIndex = (firstPage - 1) * ITEMS_PER_PAGE;
      const firstPageTracks = safeData.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      const idsToFetch = firstPageTracks
        .map((t) => t.track_id)
        .filter(Boolean);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyTrackImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setTrackImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(firstPage);
    } catch (err) {
      console.error("Error cargando canciones", err);
      setTracks([]);
      setTrackImages({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pageCount = Math.ceil(tracks.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleTracks = tracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = async (newPage) => {
    if (newPage === page) return;
    if (tracks.length === 0) return;

    setLoading(true);
    try {
      const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
      const pageTracks = tracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      const idsToFetch = pageTracks
        .map((t) => t.track_id)
        .filter((id) => id && !trackImages[id]);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyTrackImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setTrackImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(newPage);
    } catch (err) {
      console.error("Error cargando imágenes de la página de canciones", err);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchBar placeholder="Buscar canción..." onSearch={load} />

      {loading ? (
        <LoadingSpinner label="Cargando canciones..." />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {visibleTracks.map((t, idx) => {
              const realImage = trackImages[t.track_id] || null;
              const displayImage = realImage || PLACEHOLDER_IMAGE;

              return (
                <div
                  key={t.track_id}
                  className="opacity-0 animate-fade-in-up"
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

            {visibleTracks.length === 0 && (
              <p className="col-span-full text-sm text-slate-300">
                No se encontraron canciones.
              </p>
            )}
          </div>

          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
