import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PolicyCatalogPage from "./pages/PolicyCatalogPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PolicyCatalogPage />} />
        <Route path="/policies" element={<PolicyCatalogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;