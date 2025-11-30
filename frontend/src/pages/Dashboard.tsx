import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, DashboardSummary, getCurrentUser, removeToken, removeCurrentUser } from '../api/client';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    navigate('/');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Welcome, {user?.name} ({user?.role})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/customers')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Customers
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {summary && (
        <div>
          <h2>Key Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1976d2' }}>Total Customers</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0d47a1' }}>
                {summary.totalCustomers}
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ffb74d' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#f57c00' }}>Activities (7 days)</h3>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#e65100' }}>
                {summary.activitiesLast7Days}
              </p>
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>Customers by Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#fce4ec', borderRadius: '8px', border: '1px solid #f8bbd0' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#c2185b' }}>Lead</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#880e4f' }}>
                {summary.customersByStatus.Lead}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#fff9c4', borderRadius: '8px', border: '1px solid #fff59d' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#f57f17' }}>Prospect</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f57f17' }}>
                {summary.customersByStatus.Prospect}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#c8e6c9', borderRadius: '8px', border: '1px solid '#81c784' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#2e7d32' }}>Active</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1b5e20' }}>
                {summary.customersByStatus.Active}
              </p>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '8px', border: '1px solid #bdbdbd' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#616161' }}>Inactive</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#424242' }}>
                {summary.customersByStatus.Inactive}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
