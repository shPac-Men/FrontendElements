import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChemicalPage } from "./pages/ChemicalPage/ChemicalPage";
import { ChemicalDetailPage } from "./pages/ChemicalDetailPage/ChemicalDetailPage";
import { MixingPage } from "./pages/MixingPage/MixingPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { ROUTES } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CHEMICALS} element={<ChemicalPage />} />
        <Route path="/element/:id" element={<ChemicalDetailPage />} />
        <Route path="/mixing" element={<MixingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;