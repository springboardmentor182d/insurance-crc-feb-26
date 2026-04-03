import { useEffect, useState } from "react";
import AdminLayout from "../../layout/admin/AdminLayout";
import { fetchPendingPolicies } from "../../api/adminApi";
import { approvePolicy, rejectPolicy, markUnderReview } from "../../api/adminApi";

const PolicyApprovals = () => {
    const [policies, setPolicies] = useState([]);

    const loadPolicies = () => {
        fetchPendingPolicies().then(setPolicies);
    };
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [actionType, setActionType] = useState(null); // APPROVE / REJECT
    const [reason, setReason] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("");
    const [statusFilter, setStatusFilter] = useState("PENDING");

    useEffect(() => {
        loadPolicies();

        const interval = setInterval(() => {
            loadPolicies();
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    const handleConfirmAction = async () => {
        if (!selectedPolicy) return;

        console.log("ACTION:", actionType);
        console.log("POLICY ID:", selectedPolicy.id);
        console.log("REASON:", reason);

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
    const filteredPolicies = policies
        .filter((p) => {
            const searchText = search.toLowerCase();

            return (
                p.product_name?.toLowerCase().includes(searchText) ||
                p.category?.toLowerCase().includes(searchText) ||
                p.user?.name?.toLowerCase().includes(searchText) ||
                p.user?.email?.toLowerCase().includes(searchText)
            );
        })
        .filter((p) => {
            if (categoryFilter === "ALL") return true;
            return p.category === categoryFilter;
        })
        .filter((p) => {
            return p.status === statusFilter;
        })
        .sort((a, b) => {
            if (sortBy === "CATEGORY") {
                return a.category.localeCompare(b.category);
            }
            if (sortBy === "PREMIUM") {
                return b.premium_annual - a.premium_annual;
            }
            if (sortBy === "COVERAGE") {
                return b.coverage_amount - a.coverage_amount;
            }
            return 0;
        });

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">
                    Policy Approvals
                </h1>
                <div className="flex items-center gap-3 mb-6">

                    {/* 🔍 Search */}
                    <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 w-full max-w-md bg-white shadow-sm">
                        <span className="text-gray-400 mr-2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by user, email, policy..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm placeholder-gray-400"
                        />
                    </div>

                    {/* 📂 Category */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm text-sm"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="HEALTH">Health</option>
                        <option value="LIFE">Life</option>
                    </select>

                    {/* 🔽 Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm text-sm"
                    >
                        <option value="">Sort By</option>
                        <option value="CATEGORY">Category</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="COVERAGE">Coverage</option>
                    </select>
                    <div className="flex gap-2 mb-4">

                        {["PENDING", "UNDER_REVIEW", "ACTIVE", "REJECTED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm ${statusFilter === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {status === "PENDING" && "Pending"}
                                {status === "UNDER_REVIEW" && "Under Review"}
                                {status === "ACTIVE" && "Approved"}
                                {status === "REJECTED" && "Rejected"}
                            </button>
                        ))}

                    </div>



                </div>
                <h1 className="text-3xl font-semibold mb-6"></h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Policy</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Coverage</th>
                                <th className="p-3">Premium</th>
                                <th className="p-3">Eligibility</th>
                                <th className="p-3">Status</th>
                                {(statusFilter === "PENDING" || statusFilter === "UNDER_REVIEW") && (
                                    <th className="p-3">Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredPolicies.length === 0 ? (
                                <tr>
                                    <td colSpan="100%" className="p-10 text-center text-gray-500">

                                        {statusFilter === "PENDING" && "🚫 No Pending Policies"}
                                        {statusFilter === "UNDER_REVIEW" && "🚫 No Policies Under Review"}
                                        {statusFilter === "ACTIVE" && "🚫 No Approved Policies"}
                                        {statusFilter === "REJECTED" && "🚫 No Rejected Policies"}

                                    </td>
                                </tr>
                            ) : (
                                filteredPolicies.map((p) => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50 transition">

                                        <td className="p-3">{p.id}</td>

                                        <td className="p-3 font-semibold">
                                            {p.user?.name || "N/A"}
                                        </td>




                                        <td className="p-3 font-medium">
                                            {p.product_name || "N/A"}
                                        </td>

                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                                {p.category}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            ${p.coverage_amount}
                                        </td>

                                        <td className="p-3">
                                            ${p.premium_annual}
                                        </td>

                                        <td className="p-3">
                                            {p.is_eligible ? (
                                                <span className="text-green-600 font-semibold text-sm">
                                                    ✅ Eligible
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-semibold text-sm">
                                                    ❌ Not Eligible
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {p.status === "PENDING" && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                                    Pending
                                                </span>
                                            )}

                                            {p.status === "UNDER_REVIEW" && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                                    Under Review
                                                </span>
                                            )}

                                            {p.status === "ACTIVE" && (
                                                <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                                                    Approved
                                                </span>
                                            )}

                                            {p.status === "REJECTED" && (
                                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
                                                    Rejected
                                                </span>
                                            )}
                                        </td>

                                        {(statusFilter === "PENDING" || statusFilter === "UNDER_REVIEW") && (
                                            <td className="p-3 flex gap-2">

                                                {p.status === "PENDING" && (
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs"
                                                        onClick={async () => {
                                                            await markUnderReview(p.id);
                                                            loadPolicies();
                                                        }}
                                                    >
                                                        Review
                                                    </button>
                                                )}

                                                <button
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs"
                                                    onClick={() => {
                                                        setSelectedPolicy(p);
                                                        setActionType("APPROVE");
                                                    }}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                                                    onClick={() => {
                                                        setSelectedPolicy(p);
                                                        setActionType("REJECT");
                                                    }}
                                                >
                                                    Reject
                                                </button>

                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                selectedPolicy && (
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
                                    disabled={actionType === "APPROVE" && !selectedPolicy.is_eligible}
                                    className={`px-4 py-2 text-white rounded-lg ${actionType === "APPROVE"
                                        ? selectedPolicy.is_eligible
                                            ? "bg-green-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500"   // ✅ Reject always active
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </AdminLayout >
    );
};

export default PolicyApprovals;