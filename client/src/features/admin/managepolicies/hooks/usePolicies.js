import { useState, useEffect } from "react";
import { getPolicies, getPolicyStats } from "../services/policiesService";

export const usePolicies = () => {

  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const policiesData = await getPolicies();
      const statsData = await getPolicyStats();

      setPolicies(Array.isArray(policiesData) ? policiesData : []);
      setStats(statsData && typeof statsData === "object" ? statsData : {});
    } catch (requestError) {
      console.error("Failed to load policies data", requestError);
      setError("Unable to load policy data. Please check backend API and try again.");
      setPolicies([]);
      setStats({});
    }
  };

  const safePolicies = Array.isArray(policies) ? policies : [];

  const filteredPolicies = safePolicies.filter(policy => {
    const normalizedSearch = search.trim().toLowerCase();
    const searchableFields = [
      policy.policyName,
      policy.provider,
      policy.type,
      policy.status,
      policy.description
    ]
      .filter(Boolean)
      .map(value => value.toLowerCase());

    const searchMatch =
      !normalizedSearch ||
      searchableFields.some(value => value.includes(normalizedSearch));

    const filterMatch =
      filter === "All" ||
      policy.type?.toLowerCase() === filter.toLowerCase();

    return searchMatch && filterMatch;
  });

  return {
    stats,
    policies: filteredPolicies,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    reload: loadData
  };
};
