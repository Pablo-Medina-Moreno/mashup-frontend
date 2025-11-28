import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import TracksPage from "./pages/TracksPage";
import MixPage from "./pages/MixPage";

import { MixSearchContext } from "./MixSearchContext";

function App() {
  // 🔥 estado global SOLO para la búsqueda de mezclar
  const [mixQuery, setMixQuery] = useState("");

  return (
    <MixSearchContext.Provider value={{ mixQuery, setMixQuery }}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:artistId" element={<ArtistDetailPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
          <Route path="/tracks" element={<TracksPage />} />

          {/* MixPage recibe el trackId por params y usa el contexto para la query */}
          <Route path="/mix" element={<MixPage />} />
          <Route path="/mix/:trackId" element={<MixPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </MixSearchContext.Provider>
  );
}

export default App;
