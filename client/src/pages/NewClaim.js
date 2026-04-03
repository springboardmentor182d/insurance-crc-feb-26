import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchActivePolicies } from "../features/policies/services/policiesService";
import Sidebar from "../layout/user/Sidebar";
import apiClient from "../utils/apiClient";

const normalizePolicy = (policy) => ({
  activePolicyId: policy.id,
  policyId: policy.policy_id,
  productName: policy.product_name,
  insurerName: policy.insurer_name,
  policyNumber: policy.policy_number,
  category: policy.category,
  coverageAmount: policy.coverage_amount,
});

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatPolicyLabel = (policy) => `${policy.productName} (${policy.policyNumber})`;

export default function NewClaim() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [policies, setPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    policy_id: "",
    date: "",
    time: "",
    amount: "",
    location: "",
    description: "",
    report_number: "",
    witnesses: "",
    additional: "",
  });

  const [files, setFiles] = useState([]);

  const preselectedPolicyId = useMemo(() => {
    const statePolicyId = location.state?.policy?.policyId || location.state?.policy?.policy_id;
    const queryValue = new URLSearchParams(location.search).get("policyId");
    return String(statePolicyId || queryValue || "");
  }, [location.search, location.state]);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoadingPolicies(true);
        setLoadingError("");
        const response = await fetchActivePolicies();
        const normalizedPolicies = Array.isArray(response)
          ? response.map(normalizePolicy)
          : [];
        setPolicies(normalizedPolicies);
      } catch (error) {
        console.error(error);
        setPolicies([]);
        setLoadingError("Unable to load your active policies.");
      } finally {
        setLoadingPolicies(false);
      }
    };

    loadPolicies();
  }, []);

  const claimablePolicies = useMemo(
    () => policies.filter((policy) => policy.policyId),
    [policies],
  );

  useEffect(() => {
    if (!preselectedPolicyId || claimablePolicies.length === 0) {
      return;
    }

    const matchingPolicy = claimablePolicies.find(
      (policy) => String(policy.policyId) === String(preselectedPolicyId),
    );

    if (matchingPolicy) {
      setForm((prev) => ({
        ...prev,
        policy_id: String(matchingPolicy.policyId),
      }));
    }
  }, [claimablePolicies, preselectedPolicyId]);

  const selectedPolicy = claimablePolicies.find(
    (policy) => String(policy.policyId) === String(form.policy_id),
  );

  const unlinkedPoliciesCount = policies.filter((policy) => !policy.policyId).length;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const goToStepTwo = () => {
    if (!form.policy_id) {
      setSubmitError("Select the policy you want to claim against.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setSubmitError("Enter a valid claim amount.");
      return;
    }
    setSubmitError("");
    setStep(2);
  };

  const goToStepThree = () => {
    if (!form.description.trim()) {
      setSubmitError("Add a short incident description before continuing.");
      return;
    }
    setSubmitError("");
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!form.policy_id) {
      setStep(1);
      setSubmitError("Select a policy before submitting your claim.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const fullDescription = [
        form.description.trim(),
        form.location.trim() ? `Location: ${form.location.trim()}` : "",
        form.date ? `Incident Date: ${form.date}` : "",
        form.time ? `Incident Time: ${form.time}` : "",
        form.report_number.trim() ? `Report Number: ${form.report_number.trim()}` : "",
        form.witnesses.trim() ? `Witnesses: ${form.witnesses.trim()}` : "",
        form.additional.trim() ? `Additional Details: ${form.additional.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const formData = new FormData();
      formData.append("policy_id", form.policy_id);
      formData.append("claim_amount", form.amount);
      formData.append("description", fullDescription);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post("/claims/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const claimNumber = response?.data?.claim_number || "New claim";
      const policyLabel = selectedPolicy ? formatPolicyLabel(selectedPolicy) : "selected policy";

      navigate("/claims", {
        state: {
          message: `${claimNumber} was submitted for ${policyLabel}. It is now available in your claims list and for admin review.`,
        },
      });
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.response?.data?.detail || "Error submitting claim. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-1">File New Claim</h1>
        <p className="text-gray-500 mb-6">
          Submit a claim for one of your active policies and send it to admin review.
        </p>

        {loadingError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadingError}
          </div>
        )}

        {submitError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {unlinkedPoliciesCount > 0 && (
          <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {unlinkedPoliciesCount} active {unlinkedPoliciesCount === 1 ? "policy is" : "policies are"} not linked to a claimable catalog policy yet, so they cannot file claims from this page.
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border mb-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span>Claim Details</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span>Incident Information</span>
          </div>

          <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span>Documents and Review</span>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Claim Details</h3>

            <label className="block mb-2">Select Policy *</label>
            <select
              name="policy_id"
              value={form.policy_id}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
              disabled={loadingPolicies || claimablePolicies.length === 0}
              required
            >
              <option value="">
                {loadingPolicies ? "Loading policies..." : "Choose a policy"}
              </option>
              {claimablePolicies.map((policy) => (
                <option key={policy.activePolicyId} value={policy.policyId}>
                  {formatPolicyLabel(policy)} - {policy.insurerName}
                </option>
              ))}
            </select>

            {selectedPolicy && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <p className="font-semibold">{selectedPolicy.productName}</p>
                <p>{selectedPolicy.insurerName}</p>
                <p>Policy Number: {selectedPolicy.policyNumber}</p>
                <p>Coverage: {formatCurrency(selectedPolicy.coverageAmount)}</p>
              </div>
            )}

            <label className="block mb-2">Incident Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <label className="block mb-2">Incident Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <label className="block mb-2">Claim Amount *</label>
            <input
              type="number"
              min="1"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToStepTwo}
                className="bg-blue-600 text-white px-6 py-2 rounded"
                disabled={loadingPolicies || claimablePolicies.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Incident Information</h3>

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              name="report_number"
              placeholder="Police or report number"
              value={form.report_number}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              name="witnesses"
              placeholder="Witnesses"
              value={form.witnesses}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4"
            />

            <textarea
              name="description"
              placeholder="Describe what happened"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4 min-h-32"
            />

            <textarea
              name="additional"
              placeholder="Additional info for the admin team"
              value={form.additional}
              onChange={handleChange}
              className="w-full border p-3 rounded mb-4 min-h-24"
            />

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)}>
                Previous
              </button>
              <button
                type="button"
                onClick={goToStepThree}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Documents and Review</h3>

            <div
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              className="border-2 border-dashed p-10 text-center mb-6 rounded-lg bg-gray-50"
            >
              Drag and drop files here or
              <label className="text-blue-600 cursor-pointer ml-2">
                Choose Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex justify-between bg-gray-100 p-2 mb-2 rounded">
                <span>{file.name}</span>
                <button type="button" onClick={() => handleRemove(index)}>
                  Remove
                </button>
              </div>
            ))}

            <div className="bg-gray-50 p-4 rounded mb-4 text-sm text-gray-700">
              <p><strong>Policy:</strong> {selectedPolicy ? formatPolicyLabel(selectedPolicy) : form.policy_id}</p>
              <p><strong>Amount:</strong> {formatCurrency(form.amount)}</p>
              <p><strong>Description:</strong> {form.description || "-"}</p>
              <p className="mt-2 text-xs text-gray-500">
                After submission, the claim appears in your Claims page and the admin Manage Claims section for approval or rejection.
              </p>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)}>
                Previous
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
