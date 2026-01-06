import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for students
  const [newRequest, setNewRequest] = useState({ certificateType: '', reason: '' });
  const [message, setMessage] = useState('');

  // 1. Fetch Data from MongoDB when page loads
  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      // Send user role and username to get specific data
      const response = await fetch(`http://localhost:5000/api/requests?role=${user.role}&username=${user.username}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle creating a new request (Student only)
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentUsername: user.username,
          certificateType: newRequest.certificateType,
          reason: newRequest.reason
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('Request submitted!');
        setNewRequest({ certificateType: '', reason: '' }); // Clear form
        fetchRequests(); // Refresh list
      }
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  // 3. Handle Approval/Rejection (HOD/Principal only)
  const handleStatusUpdate = async (requestId, action) => {
    const comment = prompt(`Enter comment for ${action}:`); // Simple prompt for comment
    if (!comment) return;

    try {
      const response = await fetch('http://localhost:5000/api/requests/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          role: user.role,
          action, // 'approve' or 'reject'
          comment
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Request ${action}d successfully`);
        fetchRequests(); // Refresh list to remove it or update status
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="main-content">
        <header>
          <h1>Welcome, {user.username} ({user.role})</h1>
        </header>

        {/* STUDENT VIEW: Create Request Form */}
        {user.role === 'student' && (
          <div className="card create-request-card">
            <h3>Apply for Certificate</h3>
            {message && <p className="success-msg">{message}</p>}
            <form onSubmit={handleCreateRequest}>
              <select 
                value={newRequest.certificateType}
                onChange={(e) => setNewRequest({...newRequest, certificateType: e.target.value})}
                required
              >
                <option value="">Select Certificate Type</option>
                <option value="Bonafide">Bonafide Certificate</option>
                <option value="Transfer">Transfer Certificate</option>
              </select>
              <textarea 
                placeholder="Reason for application..."
                value={newRequest.reason}
                onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                required
              />
              <button type="submit">Submit Request</button>
            </form>
          </div>
        )}

        {/* ALL ROLES: View Requests List */}
        <div className="card request-list-card">
          <h3>{user.role === 'student' ? 'My Applications' : 'Pending Approvals'}</h3>
          
          {loading ? <p>Loading...</p> : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Student</th>
                  <th>Status</th>
                  {(user.role === 'hod' || user.role === 'principal') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td>{req.requestId}</td>
                    <td>{req.certificateType}</td>
                    <td>{req.studentUsername}</td>
                    <td>
                      <span className={`status-badge ${req.status}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    
                    {/* Action Buttons for HOD/Principal */}
                    {(user.role === 'hod' || user.role === 'principal') && (
                      <td>
                        <button className="btn-approve" onClick={() => handleStatusUpdate(req.requestId, 'approve')}>Approve</button>
                        <button className="btn-reject" onClick={() => handleStatusUpdate(req.requestId, 'reject')}>Reject</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;