import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, getCustomerNotes, createNote, updateCustomer, deleteCustomer, Customer, Note } from '../api/client';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: ''
  });

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customerData, notesData] = await Promise.all([
        getCustomerById(id!),
        getCustomerNotes(id!)
      ]);
      setCustomer(customerData.customer);
      setNotes(notesData.notes);
      setEditData({
        name: customerData.customer.name,
        email: customerData.customer.email,
        phone: customerData.customer.phone || '',
        company: customerData.customer.company || '',
        status: customerData.customer.status
      });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setSubmitting(true);
      await createNote(id!, noteContent);
      setNoteContent('');
      const notesData = await getCustomerNotes(id!);
      setNotes(notesData.notes);
    } catch (err: any) {
      alert('Failed to add note: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCustomer(id!, editData);
      setIsEditing(false);
      fetchCustomerData();
    } catch (err: any) {
      alert('Failed to update customer: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteCustomer = async () => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCustomer(id!);
      alert('Customer deleted successfully');
      navigate('/customers');
    } catch (err: any) {
      alert('Failed to delete customer: ' + (err.message || 'Unknown error'));
    }
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
        <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b', marginBottom: '1.5rem' }}>
          Error: {error}
        </div>
        <button onClick={() => navigate('/customers')} className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Customer not found</h3>
          <button onClick={() => navigate('/customers')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Customer Details</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {customer.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button onClick={handleDeleteCustomer} className="btn btn-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </>
          )}
          <button onClick={() => navigate('/customers')} className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Edit Customer</h2>
          <form onSubmit={handleUpdateCustomer}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label htmlFor="edit-name">Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-email">Email *</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-phone">Phone</label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-company">Company</label>
                <input
                  id="edit-company"
                  type="text"
                  value={editData.company}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="Lead">Lead</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{customer.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p className="text-secondary" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{customer.email}</p>
            </div>
            <div>
              <p className="text-secondary" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{customer.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-secondary" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{customer.company || 'N/A'}</p>
            </div>
            <div>
              <p className="text-secondary" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
              <p style={{ margin: 0 }}>
                <span className={`badge badge-${customer.status.toLowerCase()}`}>
                  {customer.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-secondary" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</p>
              <p style={{ margin: 0, fontWeight: 500 }}>
                {customer.assignedToUser?.name || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <h2 style={{ marginBottom: '1.5rem' }}>Notes & Activities</h2>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Add New Note</h3>
        <form onSubmit={handleAddNote}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter note content..."
            rows={4}
            required
            style={{ marginBottom: '1rem' }}
          />
          <button
            type="submit"
            disabled={submitting || !noteContent.trim()}
            className="btn btn-success"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Note History ({notes.length})</h3>
        {notes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p className="text-secondary">No notes yet. Add the first note above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notes.map((note) => (
              <div key={note.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    {note.createdByUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>
                      {note.createdByUser.name}
                    </p>
                    <p className="text-secondary" style={{ margin: 0, fontSize: '0.75rem' }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
