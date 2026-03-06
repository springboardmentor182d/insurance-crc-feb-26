import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';

export default function App() {
    return (
        <Router>
            <Routes>


                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />


                <Route path="/settings" element={<Settings />} />


                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}