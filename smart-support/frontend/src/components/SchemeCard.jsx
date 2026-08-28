import { Link } from 'react-router-dom';

export default function SchemeCard({ scheme }) {
  return (
    <div className="card card-pad flex-col gap-12">
      <div className="flex justify-between items-center">
        <span className="badge" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
          {scheme.category}
        </span>
        {scheme.active === false && <span className="badge badge-rejected">Inactive</span>}
      </div>
      <h3 style={{ fontSize: '1.1rem' }}>{scheme.name}</h3>
      <p className="text-muted" style={{ fontSize: '0.88rem', minHeight: 40 }}>
        {scheme.organization}
      </p>
      <div className="flex justify-between text-muted" style={{ fontSize: '0.85rem' }}>
        <span>Max support</span>
        <strong style={{ color: 'var(--color-primary)' }}>₹{Number(scheme.maximumAmount).toLocaleString('en-IN')}</strong>
      </div>
      <div className="flex justify-between text-muted" style={{ fontSize: '0.85rem' }}>
        <span>State</span>
        <span>{scheme.state}</span>
      </div>
      <Link to={`/schemes/${scheme.id}`} className="btn btn-outline btn-block mt-8">View Details</Link>
    </div>
  );
}
