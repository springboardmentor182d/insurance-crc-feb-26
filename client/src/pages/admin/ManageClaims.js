import AdminLayout from "../../layout/admin/AdminLayout";
import { FiFileText } from "react-icons/fi";

const ManageClaims = () => {
    return (
        <AdminLayout>
            <div className="admin-dashboard-theme p-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Manage Claims
                    </h1>
                    <p className="text-gray-500 mt-2">
                        View and manage all insurance claims (Coming Soon 🚀)
                    </p>
                </div>

                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                    <FiFileText className="mx-auto text-5xl text-gray-400 mb-4" />

                    <h2 className="text-xl font-semibold text-gray-700">
                        Feature Under Development
                    </h2>

                    <p className="text-gray-500 mt-2">
                        This section will allow admins to review, approve, reject,
                        and analyze all claims.
                    </p>

                    <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        onClick={() => alert("Coming soon 🚀")}
                    >
                        Explore Later
                    </button>
                </div>

            </div>
        </AdminLayout>
    );
};

export default ManageClaims;