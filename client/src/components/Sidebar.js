import React from 'react';
import { Home, FilePlus, CheckSquare, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
    const isStudent = user.role === 'STUDENT';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>UniPortal</h2>
                <span className="role-badge">{user.role}</span>
                <p style={{fontSize: '0.8rem', marginTop: '5px', color: '#666'}}>
                    {user.username}
                </p>
            </div>

            <nav className="sidebar-nav">
                <button className="nav-item active">
                    <Home size={20} /> Dashboard
                </button>

                {/* Show different buttons based on Role */}
                {isStudent ? (
                    <button className="nav-item">
                        <FilePlus size={20} /> New Application
                    </button>
                ) : (
                    <button className="nav-item">
                        <CheckSquare size={20} /> Pending Approvals
                    </button>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;