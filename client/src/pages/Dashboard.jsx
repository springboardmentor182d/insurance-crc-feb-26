import { useEffect, useState } from "react";
import { refreshAccessToken } from "../utils/auth";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
  CalendarDays,
  Search,
  Bell,
  Funnel,
  Download,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  CircleCheck,
  Clock3,
  Activity,
  Target,
  XCircle,
  Shield,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Policy Catalog", icon: BookOpen, active: false },
  { name: "Recommendations", icon: Sparkles, active: false },
  { name: "Claims & Analytics", icon: ShieldCheck, active: false },
  { name: "Provider Settings", icon: Building2, active: false },
  { name: "Profile", icon: User, active: false },
];

const summaryIconMap = {
  "Approved Today": CircleCheck,
  Pending: Clock3,
  Processing: Activity,
  Accuracy: Target,
  "Avg Response": Activity,
  Rejected: XCircle,
};

const summaryStyleMap = {
  "Approved Today": {
    border: "border-green-200",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  Pending: {
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  Processing: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  Accuracy: {
    border: "border-purple-200",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  "Avg Response": {
    border: "border-pink-200",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  Rejected: {
    border: "border-red-200",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
};

const statIconMap = {
  "Active Policies": Shield,
  "Total Claims": FileText,
  "Monthly Revenue": DollarSign,
  "Satisfaction Score": TrendingUp,
};

function Sidebar() {
  return (
    <aside className="w-[270px] shrink-0 border-r border-slate-200/70 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-800 text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-fuchsia-600">InsureLogic</h1>
          <p className="text-sm text-slate-500">Insurance Management</p>
        </div>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-[15px] font-medium transition ${
                item.active
                  ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-200"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ onLogout }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <button className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
        <CalendarDays className="h-4 w-4 text-violet-500" />
        Last 6 Months
      </button>

      <div className="flex items-center gap-3">
        <div className="flex w-[270px] items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="rounded-full border border-slate-200 bg-white p-3 text-slate-600">
          <Funnel className="h-5 w-5" />
        </button>

        <div className="relative">
          <button className="rounded-full border border-slate-200 bg-white p-3 text-slate-600">
            <Bell className="h-5 w-5" />
          </button>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white">
            3
          </span>
        </div>

        <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
          <Download className="h-4 w-4" />
          Export
        </button>

        <button
          onClick={onLogout}
          className="rounded-full bg-slate-800 px-4 py-3 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ summaryCards }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
      {summaryCards.map((card) => {
        const Icon = summaryIconMap[card.title] || Activity;
        const styles = summaryStyleMap[card.title] || {
          border: "border-slate-200",
          bg: "bg-slate-50",
          iconColor: "text-slate-600",
        };

        return (
          <div
            key={card.title}
            className={`rounded-3xl border ${styles.border} ${styles.bg} px-5 py-4`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon className={`h-5 w-5 ${styles.iconColor}`} />
              <span className="text-sm text-slate-500">{card.title}</span>
            </div>
            <div className="text-[34px] font-semibold leading-none text-slate-700">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MainStatCards({ statCards }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = statIconMap[card.title] || Activity;

        return (
          <div
            key={card.title}
            className="rounded-[26px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md">
                <Icon className="h-6 w-6" />
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                ↗ {card.change}
              </span>
            </div>

            <p className="mb-2 text-lg text-slate-500">{card.title}</p>
            <h3 className="mb-4 text-[52px] leading-none font-semibold tracking-tight text-slate-800">
              {card.value}
            </h3>

            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
              </div>
              <span className="text-sm text-slate-400">{card.extra}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart({ revenueData }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-slate-800">
            Revenue & Performance Trends
          </h2>
          <p className="mt-1 text-lg text-slate-500">Multi-metric analysis over time</p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">
            Revenue
          </button>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            Claims
          </button>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            Policies
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee7f3" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={4}
              fill="url(#revFill)"
            />
            <Area
              type="monotone"
              dataKey="satisfaction"
              stroke="#10b981"
              strokeWidth={3}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-violet-500">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          Revenue ($)
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Satisfaction (%)
        </div>
      </div>
    </div>
  );
}

function RadarCard({ radarData }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]">
      <h2 className="text-[24px] font-bold text-slate-800">Performance Metrics</h2>
      <p className="mt-1 text-lg text-slate-500">System health indicators</p>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e9dff2" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#b8a9c9" }} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.45}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PolicyDistribution({ pieData }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]">
      <h2 className="text-[24px] font-bold text-slate-800">Policy Distribution</h2>
      <p className="mt-1 text-lg text-slate-500">Active policies by category</p>

      <div className="mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={92}
              dataKey="value"
              paddingAngle={4}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {pieData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-lg text-slate-500">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </div>
            <span className="text-xl font-semibold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaimsStatus({ claimsStatusData }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]">
      <h2 className="text-[24px] font-bold text-slate-800">Claims Status</h2>
      <p className="mt-1 text-lg text-slate-500">Current claim distribution</p>

      <div className="mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={claimsStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee7f3" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {claimsStatusData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-fuchsia-100 bg-fuchsia-50/50 px-4 py-4">
        <span className="text-lg text-slate-500">Total Processed</span>
        <span className="text-[20px] font-semibold text-slate-700">314 claims</span>
      </div>
    </div>
  );
}

function TopPerformers({ topPerformers }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_24px_rgba(221,203,231,0.35)]">
      <h2 className="text-[24px] font-bold text-slate-800">Top Performers</h2>
      <p className="mt-1 text-lg text-slate-500">Best selling policies</p>

      <div className="mt-6 space-y-4">
        {topPerformers.map((item) => (
          <div
            key={item.name}
            className="rounded-[24px] border border-fuchsia-100 bg-fuchsia-50/30 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-semibold text-slate-700">{item.name}</h3>
                <p className="mt-2 text-base text-slate-500">{item.sales} sales</p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                  {item.growth}
                </span>
                <p className="mt-3 text-[20px] font-semibold text-violet-500">{item.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomBanner() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-gradient-to-r from-pink-600 to-violet-500 px-7 py-7 text-white shadow-[0_12px_30px_rgba(217,70,239,0.28)]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-[20px] font-bold">System Performance Excellent</h3>
          <p className="mt-1 text-white/90">
            All systems operational. 23 claims pending review. Average processing time: 2.4 hours.
          </p>
        </div>
      </div>

      <button className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-violet-600">
        View Details
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchDashboard = async () => {
    let token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      let response = await fetch("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        token = await refreshAccessToken();

        response = await fetch("http://127.0.0.1:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setError("Session expired. Please login again.");
      navigate("/");
    }
  };

  fetchDashboard();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f2fb] text-2xl font-semibold text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f2fb] text-2xl font-semibold text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f2fb] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 bg-[#fbf7fd] px-8 py-6">
          <TopBar onLogout={handleLogout} />
          <SummaryRow summaryCards={dashboardData.summaryCards} />
          <MainStatCards statCards={dashboardData.statCards} />

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <RevenueChart revenueData={dashboardData.revenueData} />
            </div>
            <div className="xl:col-span-4">
              <RadarCard radarData={dashboardData.radarData} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <PolicyDistribution pieData={dashboardData.pieData} />
            </div>
            <div className="xl:col-span-4">
              <ClaimsStatus claimsStatusData={dashboardData.claimsStatusData} />
            </div>
            <div className="xl:col-span-4">
              <TopPerformers topPerformers={dashboardData.topPerformers} />
            </div>
          </div>

          <BottomBanner />
        </main>
      </div>
    </div>
  );
}