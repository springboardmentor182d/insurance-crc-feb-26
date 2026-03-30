import React from 'react';

import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const SummaryCard = ({ label, value, helper, valueClassName = '' }) => (
  <div className="flex-1 min-w-[180px] bg-white rounded-xl shadow-sm px-5 py-4">
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </div>
);

const StatusPill = ({ text, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    categoryHome: 'bg-blue-50 text-blue-700',
    categoryAuto: 'bg-sky-50 text-sky-700',
    categoryLife: 'bg-purple-50 text-purple-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variants[variant] || variants.default
      }`}
    >
      {text}
    </span>
  );
};

const ActivePolicyCard = ({
  policy,
  formatFileSize,
  onDelete,
  onPreviewDocument,
  onDownloadDocument,
  onViewDetails,
  onDownloadPolicySummary,
  isExporting,
}) => {
  const deductibleLabel =
    policy.deductibleAmount !== null && policy.deductibleAmount !== undefined
      ? formatCurrency(policy.deductibleAmount)
      : 'N/A';

  const categoryVariant =
    policy.category === 'HOME'
      ? 'categoryHome'
      : policy.category === 'AUTO'
        ? 'categoryAuto'
        : policy.category === 'LIFE'
          ? 'categoryLife'
          : 'default';

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100">
      <div className="flex items-start p-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mr-4">
          <span className="text-blue-600 text-sm font-semibold">Policy</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">{policy.productName}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {policy.insurerName} / Policy #{policy.policyNumber}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill text={policy.status || 'Active'} variant="active" />
              <StatusPill text={policy.category} variant={categoryVariant} />
            </div>
          </div>
        </div>
      </div>

      {policy.isExpiringSoon && policy.warningText && (
        <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-100 text-xs text-yellow-800 flex items-start gap-2">
          <span>Warning</span>
          <p>{policy.warningText}</p>
        </div>
      )}

      <div className="px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-600">
          <div>
            <p className="text-gray-500 mb-1">Premium</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(policy.premiumAnnual)}
              <span className="text-gray-500 text-[11px] ml-1">/year</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Coverage</p>
            <p className="font-semibold text-gray-900">{formatCurrency(policy.coverageAmount)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Deductible</p>
            <p className="font-semibold text-gray-900">{deductibleLabel}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Start Date</p>
            <p className="font-semibold text-gray-900">{formatDate(policy.startDate)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">End Date</p>
            <p className="font-semibold text-gray-900">{formatDate(policy.endDate)}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-blue-900">Uploaded Documents</p>
              <p className="text-[11px] text-blue-700">
                {policy.documents.length > 0
                  ? `${policy.documents.length} document${policy.documents.length > 1 ? 's' : ''} available`
                  : 'No documents uploaded yet'}
              </p>
            </div>
          </div>

          {policy.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {policy.documents.map((document) => (
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
                      onClick={() => onPreviewDocument(policy.id, document)}
                      className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadDocument(policy.id, document)}
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
      </div>

      <div className="px-5 pb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onViewDetails(policy)}
          className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onDownloadPolicySummary(policy)}
          disabled={isExporting}
          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download Policy
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-transparent px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
        >
          File Claim
        </button>
        <button
          type="button"
          onClick={() => onDelete(policy.id)}
          className="inline-flex items-center rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 ml-auto"
        >
          Delete Policy
        </button>
      </div>
    </div>
  );
};

const ActivePoliciesPageContent = ({
  effectiveSummary,
  error,
  policies,
  showExternalModal,
  externalSubmitting,
  externalError,
  externalUploadError,
  externalDocuments,
  isDraggingFiles,
  externalForm,
  formatFileSize,
  getSelectedFileKey,
  exportingPolicyId,
  onOpenExternalModal,
  onResetExternalModal,
  onExternalChange,
  onDocumentSelection,
  onRemoveDocument,
  onDragOver,
  onDragLeave,
  onDrop,
  onExternalSubmit,
  onDeletePolicy,
  onPreviewDocument,
  onDownloadDocument,
  onViewDetails,
  onDownloadPolicySummary,
}) => (
  <div className="max-w-6xl mx-auto p-8">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Active Policies</h1>
        <p className="text-gray-600 text-sm">View and manage your insurance policies</p>
      </div>
      <button
        type="button"
        onClick={onOpenExternalModal}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <span className="text-lg mr-1">+</span>
        Add Active Policy
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        label="Active Policies"
        value={effectiveSummary.activeCount}
        helper="Policies currently in force"
        valueClassName="text-blue-600"
      />
      <SummaryCard
        label="Expiring Soon"
        value={effectiveSummary.expiringSoonCount}
        helper="Policies expiring in the few days"
        valueClassName="text-yellow-600"
      />
      <SummaryCard
        label="Total Coverage"
        value={formatCurrency(effectiveSummary.totalCoverage)}
        helper="Combined coverage limit"
        valueClassName="text-emerald-600"
      />
      <SummaryCard
        label="Annual Premium"
        value={formatCurrency(effectiveSummary.annualPremium)}
        helper="Total yearly premium"
        valueClassName="text-purple-600"
      />
    </div>

    {error && (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )}

    <div className="mt-2">
      {policies.map((policy) => (
        <ActivePolicyCard
          key={policy.id}
          policy={policy}
          formatFileSize={formatFileSize}
          onDelete={onDeletePolicy}
          onPreviewDocument={onPreviewDocument}
          onDownloadDocument={onDownloadDocument}
          onViewDetails={onViewDetails}
          onDownloadPolicySummary={onDownloadPolicySummary}
          isExporting={exportingPolicyId === policy.id}
        />
      ))}

      {policies.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-gray-600 mt-4">
          You don't have any active policies yet. Browse the catalog to get started.
        </div>
      )}
    </div>

    {showExternalModal && (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Add External Policy</h2>
            <button
              type="button"
              onClick={onResetExternalModal}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              x
            </button>
          </div>

          <form onSubmit={onExternalSubmit} className="px-6 py-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Policy Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Name *</label>
                  <input
                    type="text"
                    name="policyName"
                    value={externalForm.policyName}
                    onChange={onExternalChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comprehensive Auto Coverage"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Type *</label>
                  <select
                    name="policyType"
                    value={externalForm.policyType}
                    onChange={onExternalChange}
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
                    value={externalForm.insuranceProvider}
                    onChange={onExternalChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SafeDrive Insurance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Policy Number *</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={externalForm.policyNumber}
                    onChange={onExternalChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="AUTO-2024-5678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Annual Premium *</label>
                  <input
                    type="text"
                    name="annualPremium"
                    value={externalForm.annualPremium}
                    onChange={onExternalChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$850/year"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Coverage Amount *</label>
                  <input
                    type="text"
                    name="coverageAmount"
                    value={externalForm.coverageAmount}
                    onChange={onExternalChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$250,000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Deductible</label>
                  <input
                    type="text"
                    name="deductible"
                    value={externalForm.deductible}
                    onChange={onExternalChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={externalForm.startDate}
                      onChange={onExternalChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={externalForm.endDate}
                      onChange={onExternalChange}
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
                value={externalForm.notes}
                onChange={onExternalChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about this policy..."
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">Upload Policy Documents</h3>
                {externalDocuments.length > 0 && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                    {externalDocuments.length} selected
                  </span>
                )}
              </div>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl px-4 py-6 text-center transition-colors ${
                  isDraggingFiles ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop policy documents here, or click to select
                </p>
                <p className="text-xs text-gray-400 mb-4">PDF, JPG, PNG (Max 10MB each)</p>
                <label className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onDocumentSelection}
                    className="hidden"
                  />
                </label>
              </div>

              {externalUploadError && (
                <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs text-yellow-800">
                  {externalUploadError}
                </div>
              )}

              {externalDocuments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {externalDocuments.map((file) => (
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
                        onClick={() => onRemoveDocument(file)}
                        className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-xs text-gray-700 text-left">
                <p className="font-medium mb-1">Recommended documents:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Policy declaration page</li>
                  <li>Coverage details</li>
                  <li>Premium schedule</li>
                  <li>Terms and conditions</li>
                </ul>
              </div>
            </div>

            {externalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs">
                {externalError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 pb-4">
              <button
                type="button"
                onClick={onResetExternalModal}
                className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                disabled={externalSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={externalSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {externalSubmitting ? 'Adding...' : 'Add Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

export default ActivePoliciesPageContent;
