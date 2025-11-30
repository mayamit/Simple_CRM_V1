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
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Welcome back, <strong>{user?.name}</strong> • <span className={`badge ${user?.role === 'ADMIN' ? 'badge-active' : 'badge-prospect'}`} style={{ marginLeft: '0.5rem' }}>{user?.role}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/customers')} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            View Customers
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {summary && (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', opacity: 0.9 }}>Total Customers</p>
                  <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{summary.totalCustomers}</h2>
                </div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', opacity: 0.9 }}>Activities (7 days)</p>
                  <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{summary.activitiesLast7Days}</h2>
                </div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Customers by Status */}
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Customers by Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #fde68a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead</span>
                  <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#78350f' }}>
                  {summary.customersByStatus.Lead}
                </p>
              </div>

              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prospect</span>
                  <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1e3a8a' }}>
                  {summary.customersByStatus.Prospect}
                </p>
              </div>

              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #a7f3d0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</span>
                  <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>
                  {summary.customersByStatus.Active}
                </p>
              </div>

              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inactive</span>
                  <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#7f1d1d' }}>
                  {summary.customersByStatus.Inactive}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
