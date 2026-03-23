import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiLogOut,
} from "react-icons/fi";
import { ClipboardList } from "lucide-react";
import { TOKEN_KEYS, ROUTES } from "../../data/constants";

const Sidebar = () => {
  const navigate = useNavigate();

  const navBase =
    "flex items-center gap-3 px-6 py-4 rounded-xl text-[15px] font-bold transition";

  const navClass = ({ isActive }) =>
    `${navBase} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`;

  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k));
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="w-[235px] bg-white border-r border-gray-200 h-full flex flex-col justify-between">

      {/* ── Logo ── */}
      <div>
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-4xl">
              <FiShield />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-blue-600 leading-none">
                BimaVerse
              </h1>
              <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        {/* ROUTES.ADMIN_DASHBOARD = "/admin/dashboard" */}
        <nav className="mt-6 space-y-3 px-3">

          <NavLink to={ROUTES.ADMIN_DASHBOARD} end className={navClass}>
            <FiGrid size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/manage-policies" className={navClass}>
            <FiFileText size={18} />
            Manage Policies
          </NavLink>

          <NavLink to="/admin/manage-claims" className={navClass}>
            <ClipboardList size={18} />
            Manage Claims
          </NavLink>


          <NavLink to="/admin/fraud-rules" className={navClass}>
            <FiShield size={18} />
            Fraud Rules
          </NavLink>

          <NavLink to="/admin/flagged-claims" className={navClass}>
            <FiAlertTriangle size={18} />
            Flagged Claims
          </NavLink>

          
        </nav>
      </div>

      {/* ── Logout ── */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 font-bold text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;