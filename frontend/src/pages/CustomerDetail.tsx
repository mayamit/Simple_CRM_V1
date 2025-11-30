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
    return <div style={{ padding: '20px' }}>Loading customer details...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00', marginBottom: '20px' }}>
          Error: {error}
        </div>
        <button
          onClick={() => navigate('/customers')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div style={{ padding: '20px' }}>Customer not found</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Customer Details</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit Customer
              </button>
              <button
                onClick={handleDeleteCustomer}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/customers')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to List
          </button>
        </div>
      </div>

      {isEditing ? (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0 }}>Edit Customer</h2>
          <form onSubmit={handleUpdateCustomer}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company</label>
                <input
                  type="text"
                  value={editData.company}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="Lead">Lead</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0 }}>{customer.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Email:</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{customer.email}</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Phone:</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{customer.phone || 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Company:</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{customer.company || 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Status:</p>
              <p style={{ margin: '5px 0' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
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
              </p>
            </div>
            <div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Assigned To:</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
                {customer.assignedToUser?.name || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
      )}

      <h2>Notes & Activities</h2>

      <div style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Add New Note</h3>
        <form onSubmit={handleAddNote}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter note content..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
              fontFamily: 'inherit'
            }}
            required
          />
          <button
            type="submit"
            disabled={submitting || !noteContent.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting || !noteContent.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      </div>

      <div>
        <h3>Note History ({notes.length})</h3>
        {notes.length === 0 ? (
          <p style={{ color: '#666' }}>No notes yet. Add the first note above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  backgroundColor: '#fff',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    <strong>{note.createdByUser.name}</strong> •{' '}
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
