import React, { useEffect, useState } from 'react';

import Sidebar from '../layout/user/Sidebar';
import {
  createExternalActivePolicy,
  deleteActivePolicy,
  downloadPolicyDocument,
  fetchActivePolicies,
  fetchActivePoliciesSummary,
  updateActivePolicy,
  uploadPolicyDocuments,
} from '../features/policies/services/policiesService';
import ActivePoliciesPageContent from './active-policies/ActivePoliciesPageContent';
import PolicyDetailsModal from './active-policies/PolicyDetailsModal';
import { downloadPolicyPdf } from './active-policies/policyDownload';

const INITIAL_EXTERNAL_FORM = {
  policyName: '',
  policyType: 'AUTO',
  insuranceProvider: '',
  policyNumber: '',
  annualPremium: '',
  coverageAmount: '',
  deductible: '',
  startDate: '',
  endDate: '',
  notes: '',
};

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const ACCEPTED_DOCUMENT_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileExtension = (fileName = '') => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.slice(lastDotIndex).toLowerCase();
};

const getSelectedFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

const normalizePolicyDocument = (document) => ({
  id: document.id,
  activePolicyId: document.active_policy_id,
  fileName: document.file_name,
  contentType: document.content_type,
  fileSize: document.file_size,
  createdAt: document.created_at,
});

const normalizeActivePolicy = (policy) => ({
  id: policy.id,
  policyNumber: policy.policy_number,
  status: policy.status,
  category: policy.category,
  insurerName: policy.insurer_name,
  productName: policy.product_name,
  premiumAnnual: policy.premium_annual,
  coverageAmount: policy.coverage_amount,
  deductibleAmount: policy.deductible_amount,
  startDate: policy.start_date,
  endDate: policy.end_date,
  notes: policy.tags || '',
  isExpiringSoon: policy.is_expiring_soon,
  warningText: policy.warning_text,
  documents: (Array.isArray(policy.documents) ? policy.documents : [])
    .map(normalizePolicyDocument)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
});

const toPolicyFormState = (policy) => ({
  policyName: policy.productName || '',
  policyType: policy.category || 'AUTO',
  insuranceProvider: policy.insurerName || '',
  policyNumber: policy.policyNumber || '',
  annualPremium:
    policy.premiumAnnual !== null && policy.premiumAnnual !== undefined
      ? String(policy.premiumAnnual)
      : '',
  coverageAmount:
    policy.coverageAmount !== null && policy.coverageAmount !== undefined
      ? String(policy.coverageAmount)
      : '',
  deductible:
    policy.deductibleAmount !== null && policy.deductibleAmount !== undefined
      ? String(policy.deductibleAmount)
      : '',
  startDate: policy.startDate || '',
  endDate: policy.endDate || '',
  notes: policy.notes || '',
});

const computeFallbackSummary = (policies) => ({
  activeCount: policies.length,
  expiringSoonCount: policies.filter((policy) => policy.isExpiringSoon).length,
  totalCoverage: policies.reduce((sum, policy) => sum + (policy.coverageAmount || 0), 0),
  annualPremium: policies.reduce((sum, policy) => sum + (policy.premiumAnnual || 0), 0),
});

const ActivePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalSubmitting, setExternalSubmitting] = useState(false);
  const [externalError, setExternalError] = useState(null);
  const [externalUploadError, setExternalUploadError] = useState(null);
  const [externalDocuments, setExternalDocuments] = useState([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [externalForm, setExternalForm] = useState(INITIAL_EXTERNAL_FORM);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [policyForm, setPolicyForm] = useState(INITIAL_EXTERNAL_FORM);
  const [policyDocumentsToUpload, setPolicyDocumentsToUpload] = useState([]);
  const [policySubmitting, setPolicySubmitting] = useState(false);
  const [policyError, setPolicyError] = useState(null);
  const [policyUploadError, setPolicyUploadError] = useState(null);
  const [exportingPolicyId, setExportingPolicyId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [policiesRes, summaryRes] = await Promise.allSettled([
        fetchActivePolicies(),
        fetchActivePoliciesSummary(),
      ]);

      const normalizedPolicies =
        policiesRes.status === 'fulfilled' && Array.isArray(policiesRes.value)
          ? policiesRes.value.map(normalizeActivePolicy)
          : [];

      setPolicies(normalizedPolicies);

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setSummary({
          activeCount: summaryRes.value.active_count,
          expiringSoonCount: summaryRes.value.expiring_soon_count,
          totalCoverage: summaryRes.value.total_coverage,
          annualPremium: summaryRes.value.annual_premium,
        });
      } else {
        setSummary(computeFallbackSummary(normalizedPolicies));
      }

      return normalizedPolicies;
    } catch (requestError) {
      setPolicies([]);
      setSummary(computeFallbackSummary([]));
      setError('Failed to load policies.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const parseNumber = (value) => {
    if (!value) return null;
    const numeric = String(value).replace(/[^0-9.]/g, '');
    if (!numeric) return null;
    return Number(numeric);
  };

  const validateIncomingFiles = (incomingFiles, existingFiles = []) => {
    const selectedKeys = new Set(existingFiles.map(getSelectedFileKey));
    const acceptedFiles = [];
    const rejectedMessages = [];

    incomingFiles.forEach((file) => {
      const fileType = (file.type || '').toLowerCase();
      const fileExtension = getFileExtension(file.name);
      const fileKey = getSelectedFileKey(file);

      if (
        !ACCEPTED_DOCUMENT_TYPES.has(fileType) &&
        !ACCEPTED_DOCUMENT_EXTENSIONS.has(fileExtension)
      ) {
        rejectedMessages.push(`${file.name}: only PDF, JPG, and PNG files are allowed.`);
        return;
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        rejectedMessages.push(`${file.name}: file must be 10MB or smaller.`);
        return;
      }

      if (selectedKeys.has(fileKey)) {
        rejectedMessages.push(`${file.name}: this document is already selected.`);
        return;
      }

      selectedKeys.add(fileKey);
      acceptedFiles.push(file);
    });

    return {
      acceptedFiles,
      errorMessage: rejectedMessages.length > 0 ? rejectedMessages.join(' ') : null,
    };
  };

  const resetExternalModal = () => {
    setShowExternalModal(false);
    setExternalError(null);
    setExternalUploadError(null);
    setExternalDocuments([]);
    setExternalForm(INITIAL_EXTERNAL_FORM);
    setIsDraggingFiles(false);
  };

  const closePolicyDetails = () => {
    setSelectedPolicy(null);
    setIsEditingPolicy(false);
    setPolicyForm(INITIAL_EXTERNAL_FORM);
    setPolicyDocumentsToUpload([]);
    setPolicyError(null);
    setPolicyUploadError(null);
    setPolicySubmitting(false);
  };

  const handleExternalChange = (event) => {
    const { name, value } = event.target;
    setExternalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolicyChange = (event) => {
    const { name, value } = event.target;
    setPolicyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDocuments = (fileList, existingFiles, setFiles, setUploadError) => {
    const incomingFiles = Array.from(fileList || []);
    if (incomingFiles.length === 0) return;

    const { acceptedFiles, errorMessage } = validateIncomingFiles(incomingFiles, existingFiles);

    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }

    setUploadError(errorMessage);
  };

  const handleDocumentSelection = (event) => {
    handleAddDocuments(
      event.target.files,
      externalDocuments,
      setExternalDocuments,
      setExternalUploadError,
    );
    event.target.value = '';
  };

  const handlePolicyDocumentSelection = (event) => {
    handleAddDocuments(
      event.target.files,
      policyDocumentsToUpload,
      setPolicyDocumentsToUpload,
      setPolicyUploadError,
    );
    event.target.value = '';
  };

  const handleRemoveDocument = (fileToRemove) => {
    setExternalDocuments((prev) =>
      prev.filter((file) => getSelectedFileKey(file) !== getSelectedFileKey(fileToRemove)),
    );
  };

  const handleRemovePolicyDocument = (fileToRemove) => {
    setPolicyDocumentsToUpload((prev) =>
      prev.filter((file) => getSelectedFileKey(file) !== getSelectedFileKey(fileToRemove)),
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingFiles(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingFiles(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingFiles(false);
    handleAddDocuments(
      event.dataTransfer.files,
      externalDocuments,
      setExternalDocuments,
      setExternalUploadError,
    );
  };

  const handlePreviewDocument = async (policyId, document) => {
    try {
      const blob = await downloadPolicyDocument(policyId, document.id);
      const objectUrl = window.URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
    } catch (requestError) {
      setError('Failed to preview the selected document.');
    }
  };

  const handleDownloadDocument = async (policyId, document) => {
    try {
      const blob = await downloadPolicyDocument(policyId, document.id);
      const objectUrl = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (requestError) {
      setError('Failed to download the selected document.');
    }
  };

  const handleOpenPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
    setPolicyForm(toPolicyFormState(policy));
    setPolicyDocumentsToUpload([]);
    setPolicyError(null);
    setPolicyUploadError(null);
    setIsEditingPolicy(false);
  };

  const handleStartEditingPolicy = () => {
    if (!selectedPolicy) return;
    setPolicyForm(toPolicyFormState(selectedPolicy));
    setPolicyDocumentsToUpload([]);
    setPolicyError(null);
    setPolicyUploadError(null);
    setIsEditingPolicy(true);
  };

  const handleCancelEdit = () => {
    setIsEditingPolicy(false);
    setPolicyForm(toPolicyFormState(selectedPolicy));
    setPolicyDocumentsToUpload([]);
    setPolicyError(null);
    setPolicyUploadError(null);
  };

  const handleExternalSubmit = async (event) => {
    event.preventDefault();
    setExternalError(null);
    setExternalUploadError(null);
    setExternalSubmitting(true);

    try {
      const payload = {
        policy_number: externalForm.policyNumber,
        category: externalForm.policyType,
        insurer_name: externalForm.insuranceProvider,
        product_name: externalForm.policyName,
        premium_annual: parseNumber(externalForm.annualPremium) ?? 0,
        coverage_amount: parseNumber(externalForm.coverageAmount) ?? 0,
        deductible_amount: parseNumber(externalForm.deductible),
        start_date: externalForm.startDate,
        end_date: externalForm.endDate,
        tags: externalForm.notes || null,
        warning_text: null,
      };

      const created = await createExternalActivePolicy(payload);
      let uploadMessage = null;

      if (externalDocuments.length > 0) {
        if (!created?.id) {
          uploadMessage =
            'Policy was added, but documents could not be linked because the server did not return a policy id.';
        } else {
          try {
            await uploadPolicyDocuments(created.id, externalDocuments);
          } catch (uploadError) {
            uploadMessage =
              uploadError.response?.data?.detail ||
              'Policy was added, but the documents could not be uploaded.';
          }
        }
      }

      await loadData();
      if (uploadMessage) {
        setError(uploadMessage);
      }
      resetExternalModal();
    } catch (requestError) {
      setExternalError(requestError.response?.data?.detail || 'Failed to add external policy');
    } finally {
      setExternalSubmitting(false);
    }
  };

  const handleSavePolicyDetails = async (event) => {
    event.preventDefault();
    if (!selectedPolicy) return;

    setPolicyError(null);
    setPolicyUploadError(null);
    setPolicySubmitting(true);

    try {
      const payload = {
        policy_number: policyForm.policyNumber,
        status: selectedPolicy.status || 'ACTIVE',
        category: policyForm.policyType,
        insurer_name: policyForm.insuranceProvider,
        product_name: policyForm.policyName,
        premium_annual: parseNumber(policyForm.annualPremium) ?? 0,
        coverage_amount: parseNumber(policyForm.coverageAmount) ?? 0,
        deductible_amount: parseNumber(policyForm.deductible),
        start_date: policyForm.startDate,
        end_date: policyForm.endDate,
        tags: policyForm.notes || null,
        warning_text: selectedPolicy.warningText || null,
      };

      await updateActivePolicy(selectedPolicy.id, payload);
      let uploadMessage = null;

      if (policyDocumentsToUpload.length > 0) {
        try {
          await uploadPolicyDocuments(selectedPolicy.id, policyDocumentsToUpload);
        } catch (uploadError) {
          uploadMessage =
            uploadError.response?.data?.detail ||
            'Policy details were saved, but new documents could not be uploaded.';
        }
      }

      const refreshedPolicies = await loadData();
      const refreshedPolicy =
        refreshedPolicies.find((policy) => policy.id === selectedPolicy.id) || null;

      if (refreshedPolicy) {
        setSelectedPolicy(refreshedPolicy);
        setPolicyForm(toPolicyFormState(refreshedPolicy));
      }

      if (uploadMessage) {
        setPolicyError(uploadMessage);
      } else {
        setIsEditingPolicy(false);
        setPolicyDocumentsToUpload([]);
      }
    } catch (requestError) {
      setPolicyError(requestError.response?.data?.detail || 'Failed to update this policy.');
    } finally {
      setPolicySubmitting(false);
    }
  };

  const handleDownloadPolicySummary = async (policy) => {
    try {
      setExportingPolicyId(policy.id);
      await downloadPolicyPdf({ policy, downloadPolicyDocument });
    } catch (requestError) {
      setError('Failed to generate the policy PDF.');
    } finally {
      setExportingPolicyId(null);
    }
  };

  const handleDeletePolicy = async (id) => {
    const confirmed = window.confirm('Delete this active policy?');
    if (!confirmed) return;

    try {
      await deleteActivePolicy(id);
      if (selectedPolicy?.id === id) {
        closePolicyDetails();
      }
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Failed to delete active policy.');
    }
  };

  if (loading && policies.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading active policies...</p>
          </div>
        </div>
      </div>
    );
  }

  const effectiveSummary = summary || computeFallbackSummary(policies);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <ActivePoliciesPageContent
          effectiveSummary={effectiveSummary}
          error={error}
          policies={policies}
          showExternalModal={showExternalModal}
          externalSubmitting={externalSubmitting}
          externalError={externalError}
          externalUploadError={externalUploadError}
          externalDocuments={externalDocuments}
          isDraggingFiles={isDraggingFiles}
          externalForm={externalForm}
          formatFileSize={formatFileSize}
          getSelectedFileKey={getSelectedFileKey}
          exportingPolicyId={exportingPolicyId}
          onOpenExternalModal={() => setShowExternalModal(true)}
          onResetExternalModal={resetExternalModal}
          onExternalChange={handleExternalChange}
          onDocumentSelection={handleDocumentSelection}
          onRemoveDocument={handleRemoveDocument}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onExternalSubmit={handleExternalSubmit}
          onDeletePolicy={handleDeletePolicy}
          onPreviewDocument={handlePreviewDocument}
          onDownloadDocument={handleDownloadDocument}
          onViewDetails={handleOpenPolicyDetails}
          onDownloadPolicySummary={handleDownloadPolicySummary}
        />

        <PolicyDetailsModal
          selectedPolicy={selectedPolicy}
          isEditingPolicy={isEditingPolicy}
          policySubmitting={policySubmitting}
          policyForm={policyForm}
          policyDocumentsToUpload={policyDocumentsToUpload}
          policyError={policyError}
          policyUploadError={policyUploadError}
          exportingPolicyId={exportingPolicyId}
          formatFileSize={formatFileSize}
          getSelectedFileKey={getSelectedFileKey}
          onClose={closePolicyDetails}
          onStartEditingPolicy={handleStartEditingPolicy}
          onPreviewDocument={handlePreviewDocument}
          onDownloadDocument={handleDownloadDocument}
          onDownloadPolicySummary={handleDownloadPolicySummary}
          onPolicyChange={handlePolicyChange}
          onPolicyDocumentSelection={handlePolicyDocumentSelection}
          onRemovePolicyDocument={handleRemovePolicyDocument}
          onCancelEdit={handleCancelEdit}
          onSavePolicyDetails={handleSavePolicyDetails}
        />
      </div>
    </div>
  );
};

export default ActivePolicies;
