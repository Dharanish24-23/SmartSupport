import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    submitted: applications.length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    pending: applications.filter((a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length,
  };

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h2 className="mb-8">Welcome, {user?.fullName}</h2>
      <p className="text-muted mb-24">Here's an overview of your applications and quick actions.</p>

      <div className="grid grid-4 mb-32">
        <StatCard label="Eligible Schemes" value="Check now" link="/eligibility-checker" />
        <StatCard label="Applications Submitted" value={counts.submitted} />
        <StatCard label="Applications Approved" value={counts.approved} />
        <StatCard label="Applications Pending" value={counts.pending} />
      </div>

      <div className="grid grid-4 mb-32">
        <Link to="/eligibility-checker" className="btn btn-primary">Check Eligibility</Link>
        <Link to="/schemes" className="btn btn-outline">Browse Schemes</Link>
        <Link to="/applications" className="btn btn-outline">My Applications</Link>
        <Link to="/documents" className="btn btn-outline">Upload Documents</Link>
      </div>

      <h3 className="mb-16">Recent Applications</h3>
      {loading && <LoadingSpinner label="Loading applications..." />}
      {!loading && applications.length === 0 && (
        <EmptyState title="No applications yet" description="Start by checking your eligibility." />
      )}
      {!loading && applications.length > 0 && (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scheme</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 8).map((app) => (
                <tr key={app.id}>
                  <td>{app.schemeName}</td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td><Link to="/applications" className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, link }) {
  const content = (
    <div className="card card-pad text-center">
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>{value}</div>
      <div className="text-muted mt-8" style={{ fontSize: '0.85rem' }}>{label}</div>
    </div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}
