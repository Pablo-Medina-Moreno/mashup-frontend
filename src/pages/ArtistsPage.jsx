import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ArtistCard from "../components/ArtistCard";
import {
  fetchArtists,
  fetchSpotifyArtistImages,
} from "../api";
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

const PLACEHOLDER_IMAGE = "/placeholders/track-placeholder.png"

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [artistImages, setArtistImages] = useState({}); // { [artistId]: url }
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const load = async (search = "") => {
    setLoading(true);
    try {
      const artistsData = await fetchArtists(search);
      const safeData = artistsData || [];

      setArtists(safeData);
      setArtistImages({});

      const firstPage = 1;
      const startIndex = (firstPage - 1) * ITEMS_PER_PAGE;
      const firstPageArtists = safeData.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      const idsToFetch = firstPageArtists
        .map((a) => a.artist_id)
        .filter(Boolean);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyArtistImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setArtistImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(firstPage);
    } catch (err) {
      console.error("Error cargando artistas", err);
      setArtists([]);
      setArtistImages({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pageCount = Math.ceil(artists.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleArtists = artists.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = async (newPage) => {
    if (newPage === page) return;
    if (artists.length === 0) return;

    setLoading(true);
    try {
      const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
      const pageArtists = artists.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      const idsToFetch = pageArtists
        .map((a) => a.artist_id)
        .filter((id) => id && !artistImages[id]);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyArtistImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setArtistImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(newPage);
    } catch (err) {
      console.error("Error cargando imágenes de la página de artistas", err);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  };

  const goToArtistDetail = (artist) => {
    navigate(`/artists/${artist.artist_id}`);
  };

  return (
    <div>
      <SearchBar placeholder="Buscar artista..." onSearch={load} />

      {loading ? (
        <LoadingSpinner label="Cargando artistas..." />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {visibleArtists.map((a, idx) => {
              const realImage = artistImages[a.artist_id] || null;
              const displayImage = realImage || PLACEHOLDER_IMAGE;

              return (
                <div
                  key={a.artist_id}
                  className="h-full opacity-0 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  onClick={() => goToArtistDetail(a)}
                >
                  <ArtistCard
                    artist={{
                      ...a,
                      spotify_image_url: displayImage,
                    }}
                  />
                </div>
              );
            })}

            {visibleArtists.length === 0 && (
              <p className="col-span-full text-sm text-slate-300">
                No se encontraron artistas.
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
