import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PlusCircle, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [requests, setRequests] = useState([]);
    const [certificateType, setCertificateType] = useState('Bonafide');
    const isStudent = user.role === 'STUDENT';

    // 1. Fetch Data when Dashboard loads
    const fetchData = async () => {
        try {
            // Pass role and userId to get the correct data
            const res = await fetch(`http://localhost:5000/data?role=${user.role}&userId=${user.username}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // 2. Handle "Apply for Certificate" (Student Only)
    const handleApply = async () => {
        await fetch('http://localhost:5000/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                rollNumber: user.username, 
                certificateType: certificateType 
            })
        });
        alert('Application Submitted!');
        fetchData(); // Refresh table
    };

    // 3. Handle "Approve Request" (Staff Only)
    const handleApprove = async (requestId) => {
        await fetch('http://localhost:5000/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                requestId, 
                role: user.role 
            })
        });
        alert('Request Approved!');
        fetchData(); // Refresh table so the item disappears
    };

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} onLogout={onLogout} />
            
            <main className="main-content">
                <header className="top-header">
                    <h1>Hello, {user.username} 👋</h1>
                    <p>Role: <strong>{user.role}</strong></p>
                </header>

                {/* --- STUDENT VIEW: Apply Section --- */}
                {isStudent && (
                    <div className="action-card">
                        <h3>Apply for a Certificate</h3>
                        <div className="apply-form">
                            <select 
                                value={certificateType} 
                                onChange={(e) => setCertificateType(e.target.value)}
                                className="apply-select"
                            >
                                <option value="Bonafide">Bonafide Certificate</option>
                                <option value="Transcript">Transcript</option>
                                <option value="Character">Character Certificate</option>
                            </select>
                            <button className="apply-btn" onClick={handleApply}>
                                <PlusCircle size={18} /> Apply Now
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TABLE SECTION --- */}
                <div className="content-section">
                    <h3>{isStudent ? 'My Applications' : 'Pending Approvals'}</h3>
                    
                    {requests.length === 0 ? (
                        <p className="empty-state">No records found.</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Student ID</th>
                                        <th>Type</th>
                                        <th>Current Stage</th>
                                        <th>Status</th>
                                        {!isStudent && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(req => (
                                        <tr key={req.requestId}>
                                            <td>{req.requestId}</td>
                                            <td>{req.rollNumber}</td>
                                            <td>{req.certificateType}</td>
                                            <td>
                                                <span className="stage-badge">
                                                    {req.currentStage}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${req.finalStatus === 'COMPLETED' ? 'approved' : 'pending'}`}>
                                                    {req.finalStatus}
                                                </span>
                                            </td>
                                            
                                            {/* Staff Approve Button */}
                                            {!isStudent && (
                                                <td>
                                                    <button 
                                                        className="approve-btn"
                                                        onClick={() => handleApprove(req.requestId)}
                                                    >
                                                        <CheckCircle size={16} /> Approve
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;