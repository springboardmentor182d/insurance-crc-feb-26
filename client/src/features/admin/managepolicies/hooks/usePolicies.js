import { useState, useEffect } from "react";
import { getPolicies, getPolicyStats } from "../services/policiesService";

export const usePolicies = () => {

  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const policiesData = await getPolicies();
    const statsData = await getPolicyStats();

    setPolicies(policiesData);
    setStats(statsData);
  };

  const filteredPolicies = policies.filter(policy => {
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
    search,
    setSearch,
    filter,
    setFilter,
    reload: loadData
  };
};
