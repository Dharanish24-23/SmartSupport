import { useEffect, useMemo, useState } from 'react';
import { getAllSchemes } from '../services/schemeService';
import SchemeCard from '../components/SchemeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function SchemeListingPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ state: '', category: '', maxIncome: '', age: '' });

  useEffect(() => {
    getAllSchemes()
      .then((res) => setSchemes(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [...new Set(schemes.map((s) => s.category))], [schemes]);
  const states = useMemo(() => [...new Set(schemes.map((s) => s.state))], [schemes]);

  const filtered = schemes.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.state && s.state !== filters.state && s.state !== 'ANY') return false;
    if (filters.category && s.category !== filters.category) return false;
    if (filters.maxIncome && s.maxIncome && Number(filters.maxIncome) > s.maxIncome) return false;
    if (filters.age && ((s.minAge && Number(filters.age) < s.minAge) || (s.maxAge && Number(filters.age) > s.maxAge))) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h2 className="mb-8">Browse Support Schemes</h2>
      <p className="text-muted mb-24">Explore all active financial support schemes available.</p>

      <div className="card card-pad mb-24">
        <div className="form-group">
          <input
            className="form-control"
            placeholder="Search schemes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-4">
          <select className="form-control" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-control" value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}>
            <option value="">All States</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            className="form-control" type="number" placeholder="Your income (₹)"
            value={filters.maxIncome} onChange={(e) => setFilters((f) => ({ ...f, maxIncome: e.target.value }))}
          />
          <input
            className="form-control" type="number" placeholder="Your age"
            value={filters.age} onChange={(e) => setFilters((f) => ({ ...f, age: e.target.value }))}
          />
        </div>
      </div>

      {loading && <LoadingSpinner label="Loading schemes..." />}
      {error && <ErrorState message="Failed to load schemes. Please try again." />}
      {!loading && !error && filtered.length === 0 && <EmptyState title="No schemes found" description="Try adjusting your filters." />}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-3">
          {filtered.map((s) => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      )}
    </div>
  );
}
