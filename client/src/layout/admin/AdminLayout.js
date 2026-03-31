import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar (Fixed, No Scroll) */}
      <div className="w-[235px] bg-white h-full flex flex-col justify-between flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1240px] mx-auto px-8 py-8">
          {children}
        </div>
      </div>

    </div>
  );
};
export default AdminLayout;