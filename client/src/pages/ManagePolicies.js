import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import AdminLayout from "../layout/admin/AdminLayout";
import "../features/admin/dashboardColors.css";

import { usePolicies } from "../features/admin/managepolicies/hooks/usePolicies";
import { getPolicyById } from "../features/admin/managepolicies/services/policiesService";

import { statsConfig } from "../features/admin/managepolicies/config/statsConfig";
import { filterTypes } from "../features/admin/managepolicies/config/filterTypes";

import PoliciesTable from "../features/admin/managepolicies/components/PoliciesTable";
import PolicyModal from "../features/admin/managepolicies/components/PolicyModal";
import ViewPolicyModal from "../features/admin/managepolicies/components/ViewPolicyModal";
import EditPolicyModal from "../features/admin/managepolicies/components/EditPolicyModal";

const statValueClass = {
  totalPolicies: "text-blue-600",
  activePolicies: "text-green-600",
  autoInsurance: "text-violet-600",
  homeInsurance: "text-gray-900"
};

const ManagePolicies = () => {
  const {
    stats,
    policies,
    search,
    setSearch,
    filter,
    setFilter,
    reload
  } = usePolicies();

  const [showModal, setShowModal] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleOpenView = async (policy) => {
    try {
      const fullPolicy = await getPolicyById(policy.id);
      setSelectedPolicy(fullPolicy);
    } catch {
      setSelectedPolicy(policy);
    }

    setViewOpen(true);
  };

  const handleOpenEdit = async (policy) => {
    try {
      const fullPolicy = await getPolicyById(policy.id);
      setSelectedPolicy(fullPolicy);
    } catch {
      setSelectedPolicy(policy);
    }

    setEditOpen(true);
  };

  const handleEditFromView = () => {
    setViewOpen(false);
    setEditOpen(true);
  };

  if (!stats) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-dashboard-theme space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold admin-text-primary">Manage Policies</h1>
            <p className="mt-2 text-base admin-text-secondary md:text-lg">Add, edit, and manage insurance policies</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-base text-white transition hover:bg-blue-700"
          >
            <FiPlus className="text-lg" />
            Add New Policy
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.key}
              className="admin-surface rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg admin-text-secondary">{stat.label}</p>
              <h2 className={`mt-4 text-4xl font-semibold ${statValueClass[stat.key] || "text-gray-900"}`}>
                {stats[stat.key]}
              </h2>
            </div>
          ))}
        </div>

        <div className="admin-surface rounded-3xl border border-gray-200 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
            <div className="relative w-full lg:flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
              <input
                placeholder="Search policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-2xl border border-gray-300 bg-white pl-12 pr-4 text-base outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="flex flex-nowrap items-center gap-3 overflow-x-auto">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`shrink-0 rounded-2xl px-4 py-2 text-base font-medium transition ${
                    filter === type
                      ? "border-2 border-gray-900 bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-surface overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <PoliciesTable
            policies={policies}
            openView={handleOpenView}
            openEdit={handleOpenEdit}
            reload={reload}
          />
        </div>

        <PolicyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reload={reload}
        />

        <ViewPolicyModal
          policy={selectedPolicy}
          isOpen={viewOpen}
          onClose={() => setViewOpen(false)}
          onEdit={handleEditFromView}
        />

        <EditPolicyModal
          policy={selectedPolicy}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          reload={reload}
        />
      </div>
    </AdminLayout>
  );
};

export default ManagePolicies;

