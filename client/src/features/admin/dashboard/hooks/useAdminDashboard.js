import { useEffect, useState } from "react";
import {
  fetchStats,
  fetchClaimsTrends,
  fetchRevenue,
  fetchPolicyDistribution,
  fetchTopAdjusters,
  fetchRecentActivity
} from "../services/adminService";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [adjusters, setAdjusters] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        const statsRes = await fetchStats();
        const claimsRes = await fetchClaimsTrends();
        const revenueRes = await fetchRevenue();
        const distributionRes = await fetchPolicyDistribution();
        const adjustersRes = await fetchTopAdjusters();
        const activityRes = await fetchRecentActivity();

        setStats(statsRes.data.data);
        setClaims(claimsRes.data.data);
        setRevenue(revenueRes.data.data);
        setDistribution(distributionRes.data.data);
        setAdjusters(adjustersRes.data.data);
        setActivity(activityRes.data.data);
      } catch (requestError) {
        console.error("Failed to load admin dashboard data", requestError);
        setError("Unable to load admin dashboard data.");
      }
    };

    loadData();
  }, []);

  return { stats, claims, revenue, distribution, adjusters, activity, error };
};
