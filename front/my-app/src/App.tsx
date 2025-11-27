import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/AlbumPage/AlbumPage";
import { AlbumsPage } from "./pages/AlbumsPage/AlbumsPage";
import ITunesPage from "./pages/ITunesPage/ITunesPage";
import { HomePage } from "./pages/HomePage/HomePage";
import Navigation from "./components/Navigation/Navigation"; // импорт навигации
import { ROUTES } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      {/* Добавляем навигацию */}
      <Navigation />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itunes" element={<ITunesPage />} />
        <Route path={ROUTES.ALBUMS} element={<AlbumsPage />} />
        <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;