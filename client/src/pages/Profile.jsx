import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Sparkles,
  ClipboardList,
  ShieldCheck,
  User,
  LogOut,
  Sliders
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // =========================
  // FETCH USER DATA
  // =========================
  useEffect(() => {
  const fetchUser = () => {
    const userId = localStorage.getItem("userId") || 1;

    fetch(`http://127.0.0.1:8000/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  };

  fetchUser();

  const interval = setInterval(fetchUser, 2000); // auto refresh

  return () => clearInterval(interval);

}, []);

  // =========================
  // LOADING STATE
  // =========================
  if (user === null) {
    return <div className="p-10 text-lg">Loading...</div>;
  }

  // =========================
  // SIDEBAR ITEM
  // =========================
  const SidebarItem = ({ icon, label, active }) => (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-card cursor-pointer
      ${active ? "bg-secondary text-white" : "text-green-100 hover:bg-secondary/40"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-appbg font-inter">

      {/* SIDEBAR */}
      <div className="hidden md:flex w-64 bg-primary text-white flex-col justify-between p-6">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold">InsureHub</h1>
            <p className="text-sm text-green-200">Client Portal</p>
          </div>

          <nav className="space-y-2 text-sm">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarItem icon={<FileText size={18} />} label="Policies" />
            <SidebarItem icon={<GitCompare size={18} />} label="Compare" />
            <SidebarItem icon={<Sparkles size={18} />} label="Recommendations" />
            <SidebarItem icon={<ClipboardList size={18} />} label="Claims" />
            <SidebarItem icon={<ShieldCheck size={18} />} label="Active Plan" />
            <SidebarItem icon={<User size={18} />} label="Profile" active />
          </nav>
        </div>

        <div className="text-sm">
          <p className="mb-4 text-green-200">
            Logged in as{" "}
            <span className="font-semibold text-white">
              {user?.name || "User"}
            </span>
          </p>

          <button className="flex items-center justify-center gap-2 w-full bg-white text-primary py-2 rounded-card">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8">Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 bg-white rounded-card shadow-card p-8">

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-lightgreen p-4 rounded-full">
                <User />
              </div>

              <div>
                <h3 className="text-2xl font-semibold">
                  {user?.name || "User"}
                </h3>
                <p className="text-gray-500">Client Account</p>
              </div>
            </div>

            <div className="space-y-6">

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <div className="bg-gray-100 p-3 rounded-card mt-1">
                  {user?.email || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <div className="bg-gray-100 p-3 rounded-card mt-1">
                  {user?.dob || "N/A"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Income</label>
                <div className="bg-gray-100 p-3 rounded-card mt-1">
                  ₹{user?.income ? user.income.toLocaleString() : "N/A"}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Risk Level</label>
                <div className="bg-gray-100 p-3 rounded-card mt-1 capitalize">
                  {user?.risk_level
                    ? user.risk_level.toUpperCase()
                    : "N/A"}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* PLAN */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h3 className="font-semibold mb-2">
                Your Customized Plan
              </h3>

              {user?.recommended_plan ? (
                <p className="text-green-700 font-semibold">
                   {user.recommended_plan}
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  No recommendation yet
                </p>
              )}
            </div>

            {/* COVERAGE */}
            <div className="bg-white rounded-card shadow-card p-6">
              <p className="text-gray-400 text-sm">Total Coverage</p>
              <h3 className="text-2xl font-bold mt-2">
                ₹{user?.coverage
                  ? user.coverage.toLocaleString()
                  : "N/A"}
              </h3>
            </div>

            {/* SUMMARY */}
            <div className="bg-lightgreen rounded-card shadow-card p-6">
              <h3 className="font-semibold mb-3">Account Summary</h3>
              <p>Member Since: 2026</p>
              <p>Account Type: Client</p>
              <p className="text-success font-semibold">
                Verified: Yes
              </p>
            </div>
            {/*recent policy*/}
            <div className="bg-white rounded-card shadow-card p-6">
  <h3 className="font-semibold mb-3">Recent Policy</h3>

  {user?.recommended_plan ? (
    <>
      <p className="font-medium text-green-700">
        {user.recommended_plan}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Coverage: ₹{user?.coverage
          ? user.coverage.toLocaleString()
          : "N/A"}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Status: Active
      </p>
    </>
  ) : (
    <p className="text-gray-400 text-sm">
      No recent policy
    </p>
  )}
</div>

            {/* PREFERENCES BUTTON */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sliders size={18} />
                <h3 className="font-semibold">Preferences</h3>
              </div>

              <button
                onClick={() => navigate("/preferences")}
                className="w-full bg-primary text-white py-2 rounded-card hover:bg-secondary"
              >
                Manage Preferences
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;