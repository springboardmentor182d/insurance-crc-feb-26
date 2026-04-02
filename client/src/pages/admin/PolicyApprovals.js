import { useEffect, useState } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { fetchPendingPolicies } from "../../api/adminApi";
import { approvePolicy, rejectPolicy } from "../../api/adminApi";

const PolicyApprovals = () => {
    const [policies, setPolicies] = useState([]);

    const loadPolicies = () => {
        fetchPendingPolicies().then(setPolicies);
    };
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [actionType, setActionType] = useState(null); // APPROVE / REJECT
    const [reason, setReason] = useState("");


    useEffect(() => {
        loadPolicies();

        const interval = setInterval(() => {
            loadPolicies();
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const handleConfirmAction = async () => {
        if (!selectedPolicy) return;

        if (actionType === "APPROVE") {
            await approvePolicy(selectedPolicy.id);
        } else {
            await rejectPolicy(selectedPolicy.id, reason);
        }

        setSelectedPolicy(null);
        setReason("");
        setActionType(null);
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
                        {policies.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-500">
                                    🚫 No policies to approve
                                </td>
                            </tr>
                        ) : (
                            policies.map((p) => (
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
                                            onClick={() => {
                                                setSelectedPolicy(p);
                                                setActionType("APPROVE");
                                            }}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                setSelectedPolicy(p);
                                                setActionType("REJECT");
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {selectedPolicy && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">

                        <h2 className="text-xl font-semibold mb-4">
                            {actionType === "APPROVE" ? "Approve Policy" : "Reject Policy"}
                        </h2>

                        {/* USER DETAILS */}


                        <div className="mb-4">
                            <p className="text-sm text-gray-500">User Details</p>

                            <p className="font-semibold">{selectedPolicy.user?.name}</p>
                            <p className="text-sm text-gray-500">{selectedPolicy.user?.email}</p>

                            <p className="text-sm mt-2">Age: {selectedPolicy.user?.age}</p>
                            <p className="text-sm">Income: ₹{selectedPolicy.user?.income}</p>
                        </div>


                        {/* POLICY DETAILS */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Policy</p>
                            <p className="font-semibold">{selectedPolicy.product_name}</p>

                            <p className="text-sm text-gray-500 mt-2">Category</p>
                            <p>{selectedPolicy.category}</p>

                            <p className="text-sm text-gray-500 mt-2">Coverage</p>
                            <p>${selectedPolicy.coverage_amount}</p>

                            <p className="text-sm text-gray-500 mt-2">Premium</p>
                            <p>${selectedPolicy.premium_annual}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Eligibility</p>

                            {selectedPolicy.is_eligible ? (
                                <span className="text-green-600 font-semibold">
                                    ✅ Eligible
                                </span>
                            ) : (
                                <span className="text-red-600 font-semibold">
                                    ❌ Not Eligible
                                </span>
                            )}
                        </div>

                        {/* REASON INPUT (ONLY FOR REJECT) */}
                        {actionType === "REJECT" && (
                            <div className="mb-4">
                                <label className="text-sm text-gray-500">Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full border rounded-lg p-2 mt-1"
                                    placeholder="Enter rejection reason..."
                                />
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedPolicy(null)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmAction}
                                disabled={!selectedPolicy.is_eligible}
                                className={`px-4 py-2 text-white rounded-lg ${selectedPolicy.is_eligible
                                        ? actionType === "APPROVE"
                                            ? "bg-green-600"
                                            : "bg-red-500"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PolicyApprovals;