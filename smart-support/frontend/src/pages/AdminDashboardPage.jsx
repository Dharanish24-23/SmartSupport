import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const CARD_CONFIG = [
  { key: 'totalUsers', label: 'Total Users' },
  { key: 'totalSchemes', label: 'Total Schemes' },
  { key: 'totalApplications', label: 'Total Applications' },
  { key: 'pendingApplications', label: 'Pending Applications' },
  { key: 'underReviewApplications', label: 'Under Review' },
  { key: 'approvedApplications', label: 'Approved Applications' },
  { key: 'rejectedApplications', label: 'Rejected Applications' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <LoadingSpinner label="Loading dashboard..." />;

  const max = Math.max(stats.approvedApplications, stats.pendingApplications, stats.underReviewApplications, stats.rejectedApplications, 1);

  return (
    <div>
      <h2 className="mb-24">Admin Dashboard</h2>
      <div className="grid grid-4 mb-32">
        {CARD_CONFIG.map((c) => (
          <div className="card card-pad" key={c.key}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats[c.key]}</div>
            <div className="text-muted mt-8" style={{ fontSize: '0.85rem' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card card-pad">
        <h3 className="mb-16">Applications by Status</h3>
        <div className="flex-col gap-12">
          <BarRow label="Pending" value={stats.pendingApplications} max={max} color="var(--color-warning)" />
          <BarRow label="Under Review" value={stats.underReviewApplications} max={max} color="#2447c9" />
          <BarRow label="Approved" value={stats.approvedApplications} max={max} color="var(--color-primary)" />
          <BarRow label="Rejected" value={stats.rejectedApplications} max={max} color="var(--color-danger)" />
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-8" style={{ fontSize: '0.85rem' }}>
        <span>{label}</span><span>{value}</span>
      </div>
      <div style={{ background: 'var(--color-bg)', borderRadius: 8, height: 10 }}>
        <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 8 }} />
      </div>
    </div>
  );
}
