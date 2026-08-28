import { useEffect, useState } from 'react';
import { getOfficerApplications, updateOfficerApplicationStatus } from '../services/officerService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const OFFICER_STATUSES = [
  { value: 'DOCUMENT_VERIFICATION', label: 'Document Verification' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'APPROVED', label: 'Approved' },
];

export default function OfficerApplicationManagementPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    getOfficerApplications()
      .then((response) => setApplications(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (application, status) => {
    try {
      await updateOfficerApplicationStatus(application.id, status);
      showToast('Application status updated');
      load();
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div>
      <h2 className="mb-24">Assigned Applications</h2>
      {loading ? <LoadingSpinner /> : applications.length === 0 ? (
        <EmptyState title="No applications assigned" description="Applications for your scheme will appear here." />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th><th>Applicant</th><th>Scheme</th><th>Submitted</th><th>Status</th><th>Update</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.applicationNumber}</td>
                  <td>{application.applicantName}</td>
                  <td>{application.schemeName}</td>
                  <td>{new Date(application.submittedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={application.status} /></td>
                  <td>
                    <select
                      className="form-control"
                      style={{ minWidth: 190 }}
                      value={OFFICER_STATUSES.some((item) => item.value === application.status) ? application.status : ''}
                      onChange={(event) => changeStatus(application, event.target.value)}
                    >
                      <option value="" disabled>Select status</option>
                      {OFFICER_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
