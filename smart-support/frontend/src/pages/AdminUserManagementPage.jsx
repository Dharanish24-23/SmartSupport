import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-24">User Management</h2>
      <div className="card table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>State</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.state}</td>
                <td><span className="badge badge-approved">{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
