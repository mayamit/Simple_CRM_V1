import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, createCustomer, Customer, getCurrentUser } from '../api/client';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Lead'
  });
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const data = await getCustomers(params);
      setCustomers(data.customers);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await createCustomer(formData);
      setShowCreateModal(false);
      setFormData({ name: '', email: '', phone: '', company: '', status: 'Lead' });
      fetchCustomers();
    } catch (err: any) {
      alert('Failed to create customer: ' + (err.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Customers</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Manage your customer relationships • <span className={`badge ${user?.role === 'ADMIN' ? 'badge-active' : 'badge-prospect'}`} style={{ marginLeft: '0.5rem' }}>{user?.role}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Customer
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Dashboard
          </button>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Create New Customer</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '', email: '', phone: '', company: '', status: 'Lead' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Lead">Lead</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', email: '', phone: '', company: '', status: 'Lead' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-success"
                >
                  {creating ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label htmlFor="search">Search Customers</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <label htmlFor="status">Filter by Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b', marginBottom: '1.5rem' }}>
          Error: {error}
        </div>
      )}

      {/* Customer List */}
      <div style={{ marginBottom: '1rem' }}>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
          Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h3 style={{ color: 'var(--text-secondary)' }}>No customers found</h3>
          <p className="text-secondary">Try adjusting your search or filters, or create a new customer.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 500 }}>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.company || '-'}</td>
                  <td>
                    <span className={`badge badge-${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="text-secondary">
                    {customer.assignedToUser?.name || 'Unassigned'}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
