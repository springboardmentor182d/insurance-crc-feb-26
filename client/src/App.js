import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
