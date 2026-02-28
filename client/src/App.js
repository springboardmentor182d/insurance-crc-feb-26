import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT PAGE */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin-dashboard" element={<h1>Admin Dashboard</h1>} />
<Route path="/user-dashboard" element={<h1>User Dashboard</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;