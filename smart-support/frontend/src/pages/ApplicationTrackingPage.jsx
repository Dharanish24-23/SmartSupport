import { useEffect, useState } from 'react';
import { getMyApplications } from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const TIMELINE_STAGES = ['PENDING', 'DOCUMENT_VERIFICATION', 'REVIEW', 'APPROVED'];

export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your applications..." />;

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h2 className="mb-8">My Applications</h2>
      <p className="text-muted mb-24">Track the status of the schemes you've applied for.</p>

      {applications.length === 0 && (
        <EmptyState
          title="No applications yet"
          description="Browse schemes and apply to see them here."
          action={<Link to="/schemes" className="btn btn-primary">Browse Schemes</Link>}
        />
      )}

      {applications.length > 0 && (
        <div className="grid grid-2">
          {applications.map((app) => (
            <div className="card card-pad" key={app.id}>
              <div className="flex justify-between items-center mb-8">
                <strong>{app.applicationNumber}</strong>
                <StatusBadge status={app.status} />
              </div>
              <p className="mb-8">{app.schemeName}</p>
              <p className="text-muted mb-16" style={{ fontSize: '0.85rem' }}>
                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(app)}>View Timeline</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="card card-pad mt-32">
          <div className="flex justify-between items-center mb-16">
            <h3>Timeline — {selected.applicationNumber}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Close</button>
          </div>

          {selected.status === 'REJECTED' ? (
            <div>
              <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Application Rejected</p>
              <p className="text-muted mt-8">{selected.rejectionReason}</p>
            </div>
          ) : (
            <div className="flex justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
              {['Application Submitted', 'Document Verification', 'Review', 'Approved'].map((stage, idx) => {
                const currentIdx = Math.max(0, TIMELINE_STAGES.indexOf(selected.status));
                const isDone = currentIdx >= idx;
                return (
                  <div key={stage} className="flex-col text-center" style={{ minWidth: 130 }}>
                    <div className="step-circle" style={{ background: isDone ? 'var(--color-primary)' : 'var(--color-border)', margin: '0 auto 8px' }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.82rem' }}>{stage}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
