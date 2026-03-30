import { useEffect, useState } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { fetchPendingPolicies } from "../../api/adminApi";
import { approvePolicy, rejectPolicy } from "../../api/adminApi";
const PolicyApprovals = () => {
    const [policies, setPolicies] = useState([]);

    const loadPolicies = () => {
        fetchPendingPolicies().then(setPolicies);
    };

    useEffect(() => {
        loadPolicies();

        const interval = setInterval(() => {
            loadPolicies();
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const handleApprove = async (id) => {
        await approvePolicy(id);
        loadPolicies(); // refresh data
    };

    const handleReject = async (id) => {
        await rejectPolicy(id);
        loadPolicies();
    };
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">
                    Policy Approvals
                </h1>

                <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Policy</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {policies.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">{p.id}</td>

                                <td className="p-3 font-medium">
                                    {p.product_name || "N/A"}
                                </td>

                                <td className="p-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                                        {p.category}
                                    </span>
                                </td>

                                <td className="p-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                        Pending
                                    </span>
                                </td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                        onClick={() => handleApprove(p.id)}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleReject(p.id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default PolicyApprovals;