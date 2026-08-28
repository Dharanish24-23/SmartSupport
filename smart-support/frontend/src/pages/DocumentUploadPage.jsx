import { useEffect, useState } from 'react';
import { getMyDocuments, uploadDocument } from '../services/documentService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DOCUMENT_TYPES = ['Aadhaar', 'Income Certificate', 'Medical Report', 'Bank Passbook', 'Address Proof', 'BPL Card'];

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [file, setFile] = useState(null);
  const { showToast } = useToast();

  const loadDocuments = () => {
    getMyDocuments().then((res) => setDocuments(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please choose a file to upload', 'error');
      return;
    }
    setUploading(true);
    try {
      await uploadDocument(file, documentType);
      showToast('Document uploaded successfully');
      setFile(null);
      loadDocuments();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 700 }}>
      <h2 className="mb-8">Upload Documents</h2>
      <p className="text-muted mb-24">Upload supporting documents (PDF, JPG, JPEG, PNG — max 5MB).</p>

      <form className="card card-pad mb-32" onSubmit={handleUpload}>
        <div className="form-group">
          <label className="form-label">Document Type</label>
          <select className="form-control" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">File</label>
          <input
            className="form-control"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      <h3 className="mb-16">Your Documents</h3>
      {loading && <LoadingSpinner />}
      {!loading && documents.length === 0 && <EmptyState title="No documents uploaded yet" />}
      {!loading && documents.length > 0 && (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Type</th><th>File Name</th><th>Uploaded</th></tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>{d.documentType}</td>
                  <td>{d.fileName}</td>
                  <td>{new Date(d.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
