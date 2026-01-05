import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user, onLogout }) {
  const [data, setData] = useState([]);
  // Default to the first option
  const [certType, setCertType] = useState('Bonafide Certificate');

  // Fetch data automatically on load
  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/data?role=${user.role}&userId=${user.userId}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Action: Student raises request
  const handleRaise = async () => {
    try {
      await axios.post('http://localhost:5000/request', {
        rollNumber: user.userId,
        certificateType: certType
      });
      alert('Request Sent!');
      fetchData();
    } catch (error) {
      alert('Error raising request');
    }
  };

  // Action: Office/Teacher/Principal approves
  const handleApprove = async (reqId) => {
    try {
      await axios.post('http://localhost:5000/approve', {
        requestId: reqId,
        role: user.role
      });
      alert('Approved!');
      fetchData();
    } catch (error) {
      alert('Error approving request');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user.role} ({user.username})</h2>
        <button onClick={onLogout} style={{background:'red', color:'white', padding: '5px 10px', border: 'none', cursor: 'pointer'}}>Logout</button>
      </div>
      <hr/>

      {/* STUDENT VIEW: RAISE REQUEST */}
      {user.role === 'STUDENT' && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Raise New Request</h3>
          <label style={{ marginRight: '10px' }}>Select Certificate:</label>
          <select 
            value={certType} 
            onChange={(e) => setCertType(e.target.value)} 
            style={{ padding: '8px', marginRight: '10px' }}
          >
            <option>Bonafide Certificate</option>
            <option>Study Certificate</option>
            <option>Conduct Certificate</option>
            <option>Character Certificate</option>
            <option>Transfer Certificate (TC)</option>
            <option>Course Completion Certificate</option>
            <option>Migration Certificate</option>
          </select>
          <button onClick={handleRaise} style={{ padding: '8px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            Submit Request
          </button>
        </div>
      )}

      {/* COMMON TABLE: STATUS / APPROVALS */}
      <h3>{user.role === 'STUDENT' ? 'My Requests' : 'Pending Approvals'}</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Current Stage</th>
            <th>Status</th>
            {user.role !== 'STUDENT' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="5">No records found</td></tr>
          ) : (
            data.map((row) => (
              <tr key={row.requestId}>
                <td>{row.requestId}</td>
                <td>{row.certificateType}</td>
                <td style={{ fontWeight: 'bold', color: 'blue' }}>{row.currentStage}</td>
                <td>
                  <span style={{ 
                    color: row.finalStatus === 'COMPLETED' ? 'green' : 'orange', 
                    fontWeight: 'bold' 
                  }}>
                    {row.finalStatus}
                  </span>
                </td>
                {user.role !== 'STUDENT' && (
                  <td>
                    <button onClick={() => handleApprove(row.requestId)} style={{background:'green', color:'white', padding: '5px 10px', border:'none', cursor:'pointer'}}>
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;