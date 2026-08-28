export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const labels = {
    pending: 'Pending',
    document_verification: 'Document Verification',
    review: 'Review',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return <span className={`badge badge-${key}`}>{labels[key] || status}</span>;
}
