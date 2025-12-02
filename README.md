# MashupLab Recommender – Frontend

Aplicación frontend en **React + Vite** que consume una API REST para explorar artistas, álbumes y canciones y generar recomendaciones de mashups.

---

## 📦 Requisitos previos

- [Node.js](https://nodejs.org/) (recomendado **>= 18**)
- npm (incluido con Node) o pnpm/yarn (si los prefieres)
- Backend de la API corriendo (el frontend usa `VITE_API_URL` como base de la API)

---

## 🚀 Puesta en marcha en desarrollo

### 1. Clonar el repositorio

```bash
git clone git@github.com:Pablo-Medina-Moreno/mashup-frontend.git
cd mashup-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Debes tener un fichero .env.local (o .env) en la raíz del proyecto con la URL de tu backend:

```bash
VITE_API_URL=http://localhost:8000
```
### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Vite te mostrará en consola la URL
```bash
http://localhost:5173/
```

Abre esa URL en tu navegador y ya podrás usar la app.



