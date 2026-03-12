import React, { useEffect, useState } from 'react';
import apiClient from './utils/apiClient';
import PageContainer from './layout/PageContainer';
import FromInput from './components/Form/FromInput';
import Formselect from './components/Form/Formselect';
import {
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  ArrowLeft
} from 'lucide-react';

function App() {
  const [view, setView] = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policiesResponse = await apiClient.get("/admin/policies");
        const claimsResponse = await apiClient.get("/admin/claims");

        setPolicies(policiesResponse.data);
        setClaims(claimsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}