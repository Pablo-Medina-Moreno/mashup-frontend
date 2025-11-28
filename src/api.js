import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// ================ ARTISTS ================

// GET /artists?search=...
// Devuelve un array de artistas (con genres[])
export const fetchArtists = async (search) => {
  const res = await api.get("/artists", { params: { search } });
  return res.data?.data || [];
};

// GET /artists/:id
// Devuelve { artist, albums, tracks }
export const fetchArtistDetail = async (id) => {
  const res = await api.get(`/artists/${id}`);
  return res.data;
};

// GET /artists/:id/tracks
// Devuelve array de tracks
export const fetchArtistTracks = async (id) => {
  const res = await api.get(`/artists/${id}/tracks`);
  return res.data?.data || [];
};

// GET /artists/:id/albums
// Devuelve array de álbumes
export const fetchArtistAlbums = async (id) => {
  const res = await api.get(`/artists/${id}/albums`);
  return res.data?.data || [];
};

// ================ ALBUMS ================

// GET /albums?search=...
// Devuelve array de álbumes (con artist_id, artist_name)
export const fetchAlbums = async (search) => {
  const res = await api.get("/albums", { params: { search } });
  return res.data?.data || [];
};

// GET /albums/:id
// Devuelve sólo el álbum (o null)
export const fetchAlbumDetail = async (id) => {
  const res = await api.get(`/albums/${id}`);
  return res.data?.data || null;
};

// GET /albums/:id/tracks
// Devuelve array de tracks del álbum
export const fetchAlbumTracks = async (id) => {
  const res = await api.get(`/albums/${id}/tracks`);
  return res.data?.data || [];
};

// ================ TRACKS ================

// GET /tracks?search=...
// Devuelve array de tracks con album_id, album_name y artists[]
export const fetchTracks = async (search) => {
  const res = await api.get("/tracks", { params: { search } });
  return res.data?.data || [];
};

// Si algún día tienes /tracks/:id lo adaptas aquí.
// export const fetchTrackDetail = async (id) => {
//   const res = await api.get(`/tracks/${id}`);
//   return res.data;
// };

// ================ MIX / RECOMMENDATIONS ================

export const fetchMixRecommendations = (trackId) =>
  api.get("/mix", { params: { trackId } });

// ================ SPOTIFY IMAGES ================

// ids: array de artist_id
export const fetchSpotifyArtistImages = async (ids) => {
  console.log("Pidiendo imagenes de artistas")
  if (!ids || ids.length === 0) return {};
  const res = await api.get("/spotify/artists/images", {
    params: { ids: ids.join(",") },
  });
  return res.data?.data || {}; // { [id]: url }
};

// ids: array de album_id
export const fetchSpotifyAlbumImages = async (ids) => {
  console.log("Pidiendo imagenes de albumes")
  if (!ids || ids.length === 0) return {};
  const res = await api.get("/spotify/albums/images", {
    params: { ids: ids.join(",") },
  });
  return res.data?.data || {}; // { [id]: url }
};

// ids: array de track_id
export const fetchSpotifyTrackImages = async (ids) => {
  console.log("Pidiendo imagenes de canciones")
  if (!ids || ids.length === 0) return {};
  const res = await api.get("/spotify/tracks/images", {
    params: { ids: ids.join(",") },
  });
  return res.data?.data || {}; // { [id]: url }
};

