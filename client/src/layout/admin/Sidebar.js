import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();

  const navItem =
    "flex items-center gap-3 px-6 py-4 rounded-xl text-[15px] transition";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>

        {/* Logo Area */}
        <div className="px-8 py-8 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-blue-600 leading-tight">
            BimaVerse
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            AdminPanel
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 px-4 space-y-2">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiGrid size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/manage-policies"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiFileText size={18} />
            Manage Policies
          </NavLink>

          <NavLink
            to="/admin/fraud-rules"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiShield size={18} />
            Fraud Rules
          </NavLink>

          <NavLink
            to="/admin/flagged-claims"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiAlertTriangle size={18} />
            Flagged Claims
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiBarChart2 size={18} />
            Analytics
          </NavLink>

          {/* Divider 
          <div className="border-t border-gray-200 my-6"></div>

          <NavLink
            to="/dashboard"
            className={`${navItem} text-gray-700 hover:bg-gray-100`}
          >
            <FiGrid size={18} />
            User Dashboard
          </NavLink>*/}

        </div>
      </div>

      {/* LOGOUT SECTION */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;