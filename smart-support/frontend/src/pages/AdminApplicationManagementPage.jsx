import { useEffect, useState } from 'react';
import { getAllApplicationsAdmin, updateApplicationStatus } from '../services/adminService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const STATUS_FLOW = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

export default function AdminApplicationManagementPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    getAllApplicationsAdmin().then((res) => setApplications(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (app, status) => {
    if (status === 'REJECTED') {
      setRejectTarget(app);
      return;
    }
    try {
      await updateApplicationStatus(app.id, { status });
      showToast('Application status updated');
      load();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    try {
      await updateApplicationStatus(rejectTarget.id, { status: 'REJECTED', rejectionReason });
      showToast('Application rejected');
      setRejectTarget(null);
      setRejectionReason('');
      load();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to reject application', 'error');
    }
  };

  return (
    <div>
      <h2 className="mb-24">Application Management</h2>
      {loading ? <LoadingSpinner /> : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th><th>Applicant</th><th>Scheme</th><th>Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.applicationNumber}</td>
                  <td>{app.applicantName}</td>
                  <td>{app.schemeName}</td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <select
                      className="form-control"
                      style={{ minWidth: 150 }}
                      value={app.status}
                      onChange={(e) => changeStatus(app, e.target.value)}
                    >
                      {STATUS_FLOW.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!rejectTarget}
        title={`Reject application ${rejectTarget?.applicationNumber || ''}`}
        onClose={() => setRejectTarget(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmReject}>Confirm Rejection</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Rejection Reason</label>
          <textarea
            className="form-control" rows={3} value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this application is being rejected..."
          />
        </div>
      </Modal>
    </div>
  );
}
