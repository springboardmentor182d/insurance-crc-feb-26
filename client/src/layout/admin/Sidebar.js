import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-6 hidden md:block">
      <h2 className="text-xl font-bold mb-8">BimaVerse Admin</h2>

      <nav className="space-y-4">

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/manage-policies"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Manage Policies
        </NavLink>

        <NavLink
          to="/admin/fraud-rules"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Fraud Rules
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Analytics
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
