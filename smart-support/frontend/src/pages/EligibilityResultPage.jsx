import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EligibilityBadge from '../components/EligibilityBadge';
import EmptyState from '../components/EmptyState';

export default function EligibilityResultPage() {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem('smartsupport_eligibility_results');
    if (raw) setResults(JSON.parse(raw));
    else setResults([]);
  }, []);

  if (results === null) return null;

  if (results.length === 0) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <EmptyState
          title="No eligibility results found"
          description="Please run the eligibility checker first."
          action={<button className="btn btn-primary" onClick={() => navigate('/eligibility-checker')}>Check Eligibility</button>}
        />
      </div>
    );
  }

  const eligible = results.filter((r) => r.eligible);
  const notEligible = results.filter((r) => !r.eligible);

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 900 }}>
      <h2 className="mb-8">Eligibility Result</h2>
      <p className="text-muted mb-24">Based on the information you provided, here's what we found.</p>

      {eligible.length > 0 && (
        <>
          <h3 className="mb-16" style={{ color: 'var(--color-primary)' }}>Highly Recommended</h3>
          <div className="flex-col gap-16 mb-32">
            {eligible.map((r) => (
              <ResultCard key={r.schemeId} result={r} />
            ))}
          </div>
        </>
      )}

      {notEligible.length > 0 && (
        <>
          <h3 className="mb-16 text-muted">Not Eligible</h3>
          <div className="flex-col gap-16">
            {notEligible.map((r) => (
              <ResultCard key={r.schemeId} result={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div className="card card-pad">
      <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ fontSize: '1.05rem' }}>{result.schemeName}</h3>
        <EligibilityBadge eligible={result.eligible} />
      </div>
      <div className="flex gap-24 mb-16 text-muted" style={{ fontSize: '0.88rem', flexWrap: 'wrap' }}>
        <span>Financial Support: <strong style={{ color: 'var(--color-text)' }}>₹{Number(result.maximumAmount).toLocaleString('en-IN')}</strong></span>
        <span>Match Score: <strong style={{ color: 'var(--color-text)' }}>{result.matchScore}%</strong></span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.9rem' }}>
        {result.reasons.map((reason, idx) => (
          <li key={idx} style={{ marginBottom: 4, color: reason.startsWith('\u2717') ? 'var(--color-danger)' : 'inherit' }}>
            {reason}
          </li>
        ))}
      </ul>
      <div className="mt-16">
        {result.eligible ? (
          <Link to={`/schemes/${result.schemeId}`} className="btn btn-primary btn-sm">Apply Now</Link>
        ) : (
          <Link to={`/schemes/${result.schemeId}`} className="btn btn-ghost btn-sm">View Requirements</Link>
        )}
      </div>
    </div>
  );
}
