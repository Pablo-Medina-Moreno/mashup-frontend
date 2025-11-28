import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { fetchAlbums, fetchSpotifyAlbumImages } from "../api";
import AlbumCard from "../components/AlbumCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 9;

// Placeholder sencillo (puedes cambiarlo por una imagen local si quieres)
const PLACEHOLDER_IMAGE =
  "/placeholders/track-placeholder.png"

async function preloadImages(urls) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  await Promise.all(
    uniqueUrls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // si falla, no bloqueamos
          img.src = url;
        })
    )
  );
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [albumImages, setAlbumImages] = useState({}); // { [albumId]: url }
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const load = async (search = "") => {
    setLoading(true);
    try {
      const albumsData = await fetchAlbums(search);
      const safeData = albumsData || [];

      setAlbums(safeData);
      setAlbumImages({}); // limpiamos cache de imágenes al cambiar búsqueda

      const firstPage = 1;
      const startIndex = (firstPage - 1) * ITEMS_PER_PAGE;
      const firstPageAlbums = safeData.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      const idsToFetch = firstPageAlbums
        .map((a) => a.album_id)
        .filter(Boolean);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyAlbumImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setAlbumImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(firstPage);
    } catch (err) {
      console.error("Error cargando álbumes", err);
      setAlbums([]);
      setAlbumImages({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pageCount = Math.ceil(albums.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = async (newPage) => {
    if (newPage === page) return;
    if (albums.length === 0) return;

    setLoading(true);
    try {
      const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
      const pageAlbums = albums.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      const idsToFetch = pageAlbums
        .map((a) => a.album_id)
        .filter((id) => id && !albumImages[id]);

      if (idsToFetch.length > 0) {
        const newMap = await fetchSpotifyAlbumImages(idsToFetch);
        const urlsToPreload = idsToFetch.map((id) => newMap[id]);
        await preloadImages(urlsToPreload);

        setAlbumImages((prev) => ({
          ...prev,
          ...newMap,
        }));
      }

      setPage(newPage);
    } catch (err) {
      console.error("Error cargando imágenes de la página de álbumes", err);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  };

  const goToAlbumDetail = (album) => {
    navigate(`/albums/${album.album_id}`);
  };

  return (
    <div>
      <SearchBar placeholder="Buscar álbum..." onSearch={load} />

      {loading ? (
        <LoadingSpinner label="Cargando álbumes..." />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {visibleAlbums.map((a, idx) => {
              const realImage = albumImages[a.album_id] || null;
              const displayImage = realImage || PLACEHOLDER_IMAGE;

              return (
                <div
                  key={a.album_id}
                  className="opacity-0 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  onClick={() => goToAlbumDetail(a)}
                >
                  <AlbumCard
                    album={{
                      ...a,
                      spotify_image_url: displayImage,
                    }}
                  />
                </div>
              );
            })}

            {visibleAlbums.length === 0 && (
              <p className="col-span-full text-sm text-slate-300">
                No se encontraron álbumes.
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
