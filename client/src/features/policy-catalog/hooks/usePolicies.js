// usePolicies.js
// Custom React hook for fetching and filtering policies from the backend API

import { useState, useEffect } from "react";
import { getPolicies } from "../services/policyService";

const usePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPolicies()
      .then((data) => {
        setPolicies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch policies:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { policies, loading, error };
};

export default usePolicies;
