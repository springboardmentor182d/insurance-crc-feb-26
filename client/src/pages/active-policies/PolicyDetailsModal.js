import React from 'react';

import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PolicyDetailsModal = ({
  selectedPolicy,
  isEditingPolicy,
  policySubmitting,
  policyForm,
  policyDocumentsToUpload,
  policyError,
  policyUploadError,
  exportingPolicyId,
  formatFileSize,
  getSelectedFileKey,
  onClose,
  onStartEditingPolicy,
  onPreviewDocument,
  onDownloadDocument,
  onDownloadPolicySummary,
  onPolicyChange,
  onPolicyDocumentSelection,
  onRemovePolicyDocument,
  onCancelEdit,
  onSavePolicyDetails,
}) => {
  if (!selectedPolicy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Policy Details</h2>
            <p className="text-xs text-gray-500 mt-1">
              {selectedPolicy.productName} / Policy #{selectedPolicy.policyNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={policySubmitting}
          >
            x
          </button>
        </div>

        {!isEditingPolicy ? (
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Insurance Provider</p>
                <p className="text-sm font-semibold text-gray-900">{selectedPolicy.insurerName}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Policy Type</p>
                <p className="text-sm font-semibold text-gray-900">{selectedPolicy.category}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Annual Premium</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(selectedPolicy.premiumAnnual)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Coverage Amount</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(selectedPolicy.coverageAmount)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Deductible</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedPolicy.deductibleAmount !== null &&
                  selectedPolicy.deductibleAmount !== undefined
                    ? formatCurrency(selectedPolicy.deductibleAmount)
                    : 'N/A'}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-1">Policy Period</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(selectedPolicy.startDate)} to {formatDate(selectedPolicy.endDate)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
              <p className="text-sm text-gray-700">
                {selectedPolicy.notes || 'No additional notes added for this policy.'}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-blue-900">Uploaded Documents</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedPolicy.documents.length > 0
                      ? `${selectedPolicy.documents.length} document${
                          selectedPolicy.documents.length > 1 ? 's' : ''
                        } linked to this policy`
                      : 'This policy does not have any uploaded documents yet.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartEditingPolicy}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {selectedPolicy.documents.length > 0 ? 'Edit Policy' : 'Edit And Upload'}
                </button>
              </div>

              {selectedPolicy.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedPolicy.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{document.fileName}</p>
                        <p className="text-[11px] text-gray-500">
                          {formatFileSize(document.fileSize)} /{' '}
                          {document.contentType === 'application/pdf' ? 'PDF' : 'Image'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onPreviewDocument(selectedPolicy.id, document)}
                          className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => onDownloadDocument(selectedPolicy.id, document)}
                          className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onDownloadPolicySummary(selectedPolicy)}
                disabled={exportingPolicyId === selectedPolicy.id}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportingPolicyId === selectedPolicy.id ? 'Generating PDF...' : 'Download Policy'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSavePolicyDetails} className="px-6 py-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Edit Policy Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Name *</label>
                  <input
                    type="text"
                    name="policyName"
                    value={policyForm.policyName}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Type *</label>
                  <select
                    name="policyType"
                    value={policyForm.policyType}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="AUTO">Auto Insurance</option>
                    <option value="HOME">Home Insurance</option>
                    <option value="LIFE">Life Insurance</option>
                    <option value="HEALTH">Health Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Insurance Provider *</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={policyForm.insuranceProvider}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Number *</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={policyForm.policyNumber}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Annual Premium *</label>
                  <input
                    type="text"
                    name="annualPremium"
                    value={policyForm.annualPremium}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Coverage Amount *</label>
                  <input
                    type="text"
                    name="coverageAmount"
                    value={policyForm.coverageAmount}
                    onChange={onPolicyChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Deductible</label>
                  <input
                    type="text"
                    name="deductible"
                    value={policyForm.deductible}
                    onChange={onPolicyChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={policyForm.startDate}
                      onChange={onPolicyChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={policyForm.endDate}
                      onChange={onPolicyChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={policyForm.notes}
                onChange={onPolicyChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about this policy..."
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">Upload Additional Documents</h3>
                {policyDocumentsToUpload.length > 0 && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                    {policyDocumentsToUpload.length} selected
                  </span>
                )}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 text-center bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">
                  Add missing policy documents here, or upload newer copies
                </p>
                <p className="text-xs text-gray-400 mb-4">PDF, JPG, PNG (Max 10MB each)</p>
                <label className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onPolicyDocumentSelection}
                    className="hidden"
                  />
                </label>
              </div>

              {policyUploadError && (
                <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs text-yellow-800">
                  {policyUploadError}
                </div>
              )}

              {policyDocumentsToUpload.length > 0 && (
                <div className="mt-3 space-y-2">
                  {policyDocumentsToUpload.map((file) => (
                    <div
                      key={getSelectedFileKey(file)}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} /{' '}
                          {file.type === 'application/pdf' ? 'PDF document' : 'Image file'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemovePolicyDocument(file)}
                        className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {policyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs">
                {policyError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pb-1">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                disabled={policySubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={policySubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {policySubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PolicyDetailsModal;
