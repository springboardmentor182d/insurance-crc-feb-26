import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  );
};

export default AdminLayout;
