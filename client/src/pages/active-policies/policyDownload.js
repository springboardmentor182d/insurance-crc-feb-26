import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ensurePdfSpace = (pdf, cursorY, neededHeight) => {
  if (cursorY + neededHeight <= 280) return cursorY;
  pdf.addPage();
  return 16;
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const renderImageBlobToPreview = async (blob) => {
  const sourceDataUrl = await blobToDataUrl(blob);
  const image = await loadImageElement(sourceDataUrl);
  const maxWidth = 1000;
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = window.document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.88);
};

const renderPdfBlobToPreview = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const documentProxy = await pdfjsLib.getDocument({
    data: arrayBuffer,
    disableWorker: true,
  }).promise;
  const page = await documentProxy.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(1.6, 900 / viewport.width);
  const scaledViewport = page.getViewport({ scale });
  const canvas = window.document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(scaledViewport.width));
  canvas.height = Math.max(1, Math.floor(scaledViewport.height));
  const context = canvas.getContext('2d');
  await page.render({
    canvasContext: context,
    viewport: scaledViewport,
  }).promise;
  return canvas.toDataURL('image/jpeg', 0.9);
};

const getPreviewDimensions = async (dataUrl, maxWidthMm, maxHeightMm) => {
  const image = await loadImageElement(dataUrl);
  const widthRatio = maxWidthMm / image.width;
  const heightRatio = maxHeightMm / image.height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.max(20, image.width * ratio),
    height: Math.max(20, image.height * ratio),
  };
};

export const downloadPolicyPdf = async ({ policy, downloadPolicyDocument }) => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let cursorY = 16;

  const addLine = (label, value) => {
    cursorY = ensurePdfSpace(pdf, cursorY, 12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(label, 14, cursorY);
    cursorY += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(value || 'N/A', 180);
    pdf.text(lines, 14, cursorY);
    cursorY += lines.length * 5 + 3;
  };

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(policy.productName || 'Policy Summary', 14, cursorY);
  cursorY += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`${policy.insurerName} / Policy #${policy.policyNumber}`, 14, cursorY);
  cursorY += 10;

  addLine('Category', policy.category);
  addLine('Status', policy.status || 'Active');
  addLine('Annual Premium', formatCurrency(policy.premiumAnnual));
  addLine('Coverage Amount', formatCurrency(policy.coverageAmount));
  addLine(
    'Deductible',
    policy.deductibleAmount !== null && policy.deductibleAmount !== undefined
      ? formatCurrency(policy.deductibleAmount)
      : 'N/A',
  );
  addLine('Start Date', formatDate(policy.startDate));
  addLine('End Date', formatDate(policy.endDate));
  addLine('Additional Notes', policy.notes || 'No additional notes');

  cursorY = ensurePdfSpace(pdf, cursorY, 14);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Uploaded Document Previews', 14, cursorY);
  cursorY += 8;

  if (policy.documents.length === 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text('No uploaded documents available for this policy.', 14, cursorY);
    cursorY += 8;
  }

  for (const [index, document] of policy.documents.entries()) {
    cursorY = ensurePdfSpace(pdf, cursorY, 18);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`Document ${index + 1}: ${document.fileName}`, 14, cursorY);
    cursorY += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(
      `${document.contentType === 'application/pdf' ? 'PDF' : 'Image'} / ${formatFileSize(
        document.fileSize,
      )}`,
      14,
      cursorY,
    );
    cursorY += 6;

    try {
      const blob = await downloadPolicyDocument(policy.id, document.id);
      const previewDataUrl =
        document.contentType === 'application/pdf'
          ? await renderPdfBlobToPreview(blob)
          : await renderImageBlobToPreview(blob);
      const dimensions = await getPreviewDimensions(previewDataUrl, 180, 110);
      cursorY = ensurePdfSpace(pdf, cursorY, dimensions.height + 8);
      pdf.addImage(previewDataUrl, 'JPEG', 14, cursorY, dimensions.width, dimensions.height);
      cursorY += dimensions.height + 8;
    } catch (error) {
      cursorY = ensurePdfSpace(pdf, cursorY, 12);
      pdf.setTextColor(180, 0, 0);
      pdf.text('Preview could not be rendered for this document.', 14, cursorY);
      pdf.setTextColor(0, 0, 0);
      cursorY += 7;
    }
  }

  pdf.save(`${policy.policyNumber || policy.productName || 'policy'}-summary.pdf`);
};
