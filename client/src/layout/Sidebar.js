import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShield,
  FiLogOut,
  FiUser,
  FiSettings,
  FiFileText,
} from "react-icons/fi";
import { Lightbulb } from "lucide-react";
import { TOKEN_KEYS, ROUTES } from "../../src/data/constants";

const Sidebar = () => {
  const navigate = useNavigate();

  const navBase =
    "flex items-center gap-3 px-6 py-4 rounded-xl text-[15px] font-bold transition";

  const navClass = ({ isActive }) =>
    `${navBase} ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k));
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="w-[235px] bg-white border-r border-gray-200 h-full flex flex-col justify-between fixed top-0 left-0">
      <div>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiShield size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">BimaVerse</span>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          <NavLink to={ROUTES.DASHBOARD} end className={navClass}>
            <FiGrid size={18} />
            Dashboard
          </NavLink>

          <NavLink to={ROUTES.ACTIVE_POLICIES} className={navClass}>
            <FiShield size={18} />
            Policies
          </NavLink>

          {/* ROUTES.RECOMMENDATIONS = "/policies/recommendations" */}
          <NavLink to={ROUTES.RECOMMENDATIONS} className={navClass}>
            <Lightbulb size={18} />
            Recommendations
          </NavLink>

          <NavLink to="/claims" className={navClass}>
            <FiFileText size={18} />
            Claims
          </NavLink>

          <NavLink to={ROUTES.PROFILE} className={navClass}>
            <FiUser size={18} />
            Profile
          </NavLink>

          <NavLink to={ROUTES.PREFERENCES} className={navClass}>
            <FiSettings size={18} />
            Preferences
          </NavLink>
        </nav>
      </div>

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