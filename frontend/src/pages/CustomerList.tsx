import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, Customer } from '../api/client';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Customers</h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label htmlFor="search" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Search (name, email, company):
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search..."
            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
          <label htmlFor="status" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Filter by Status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Prospect">Prospect</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Found {customers.length} customer{customers.length !== 1 ? 's' : ''}
          </p>

          {customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Company</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Assigned To</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>{customer.name}</td>
                      <td style={{ padding: '12px' }}>{customer.email}</td>
                      <td style={{ padding: '12px' }}>{customer.company || '-'}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor:
                              customer.status === 'Active' ? '#d4edda' :
                              customer.status === 'Lead' ? '#fff3cd' :
                              customer.status === 'Prospect' ? '#d1ecf1' :
                              '#f8d7da',
                            color:
                              customer.status === 'Active' ? '#155724' :
                              customer.status === 'Lead' ? '#856404' :
                              customer.status === 'Prospect' ? '#0c5460' :
                              '#721c24'
                          }}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {customer.assignedToUser?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
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
        </>
      )}
    </div>
  );
}
