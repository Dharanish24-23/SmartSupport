import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSchemeById } from '../services/schemeService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getSchemeById(id)
      .then((res) => setScheme(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading scheme details..." />;
  if (error || !scheme) return <ErrorState message="Scheme not found." />;

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/apply/${scheme.id}`);
  };

  const docs = scheme.requiredDocuments ? scheme.requiredDocuments.split(',').map((d) => d.trim()) : [];

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 820 }}>
      <div className="card card-pad">
        <span className="badge" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
          {scheme.category}
        </span>
        <h2 className="mt-16 mb-8">{scheme.name}</h2>
        <p className="text-muted mb-24">{scheme.organization}</p>

        <p className="mb-24">{scheme.description}</p>

        <div className="grid grid-2 mb-24">
          <InfoRow label="Financial Support" value={`₹${Number(scheme.maximumAmount).toLocaleString('en-IN')}`} />
          <InfoRow label="Age Limit" value={`${scheme.minAge ?? '-'} – ${scheme.maxAge ?? '-'} years`} />
          <InfoRow label="Income Limit" value={`₹${Number(scheme.maxIncome).toLocaleString('en-IN')}`} />
          <InfoRow label="Supported State" value={scheme.state === 'ANY' ? 'All States' : scheme.state} />
          <InfoRow label="Supported District" value={scheme.district === 'ANY' ? 'All Districts' : scheme.district} />
          <InfoRow label="Supported Condition" value={scheme.disease === 'ANY' ? 'Any' : scheme.disease} />
        </div>

        <h3 className="mb-8" style={{ fontSize: '1rem' }}>Required Documents</h3>
        <ul className="mb-24">
          {docs.map((d) => <li key={d}>{d}</li>)}
        </ul>

        <h3 className="mb-8" style={{ fontSize: '1rem' }}>Application Process</h3>
        <p className="text-muted mb-24">
          Click "Apply Now" below, fill in your applicant and bank details, and submit. You'll receive a
          unique application ID and can track its status from your dashboard.
        </p>

        <button className="btn btn-primary" onClick={handleApply}>Apply Now</button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
