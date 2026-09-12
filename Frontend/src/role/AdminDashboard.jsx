import { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
import '../RoleCss/admin.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminDashboard = ({ setIslogin }) => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctorReq, setdoctorReq] = useState([]);

  const stats = [
    {
      id: 1,
      title: 'Total Patients',
      value: '1,248',
      change: '↑ 12% this month',
      isPositive: true,
      icon: '👥',
      color: 'purple',
    },
    {
      id: 2,
      title: 'Total Doctors',
      value: '186',
      change: '↑ 8% this month',
      isPositive: true,
      icon: '🩺',
      color: 'blue',
    },
    {
      id: 3,
      title: 'Pending Requests',
      value: '3',
      change: 'Requires attention',
      isWarning: true,
      icon: '⏳',
      color: 'amber',
    },
    {
      id: 4,
      title: 'Active Users',
      value: '1,102',
      change: '88.3% active',
      isPositive: true,
      icon: '⚡',
      color: 'emerald',
    },
  ];

  const navigate = useNavigate();
    const handleLogout = async() => {
         const response = await fetch("https://health-track-2b.onrender.com/api/users/islogout", {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              // body: JSON.stringify(),
            });
        
            const data = await response.json();
            console.log("aacha= ", data.message);
            toast.success("Logout Successful 🚀");
            setIslogin(false);
            navigate("/");
    };

  const Reqhandler = async (id) => {
    try {
      const response = await fetch(
        "https://health-track-2b.onrender.com/api/doctors/doctorReq",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Failed to fetch doctor requests:', error);
    }
  };

  useEffect(() => {
    const docdata = async () => {
      try {
        const response = await fetch(
          "https://health-track-2b.onrender.com/api/doctors/doctorRequest",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("STATUS:", response.status);
        console.log("OK:", response.ok);

        const data = await response.json();
        console.log(data);
        setdoctorReq(data.pendingdata || []);
      } catch (error) {
        console.error('Failed to fetch doctor requests:', error);
      }
    };

    docdata();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">💜</div>
          <div className="brand-info">
            <h2>HealthTrack</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Admin Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <span className="nav-icon">📋</span>
            <span>Doctor Requests</span>
            <span className="badge">3</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <span className="nav-icon">🤒</span>
            <span>Patients</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <span className="nav-icon">👨‍⚕️</span>
            <span>Doctors</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <span className="profile-name">Administrator</span>
            <span className="profile-role">Super Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Administrator 👋</p>
          </div>

          <div className="header-actions">
            <button className="icon-btn notification-btn" title="Notifications">
              🔔
              <span className="notif-badge">3</span>
            </button>
            <div className="user-avatar-top" title="Administrator">A</div>

            {/* Modern Logout Button */}
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg
                className="logout-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className={`stat-icon-wrapper ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-details">
                <span className="stat-title">{stat.title}</span>
                <h3 className="stat-value">{stat.value}</h3>
                <span
                  className={`stat-change ${
                    stat.isWarning ? 'warning' : 'positive'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Doctor Registration Requests Section */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Doctor Registration Requests</h3>
              <p>Review and approve new doctor registrations</p>
            </div>
            <button className="btn-link">View All →</button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>DOCTOR</th>
                  <th>QUALIFICATION</th>
                  <th>SPECIALIZATION</th>
                  <th>EXPERIENCE</th>
                  <th>STATUS</th>
                  <th className="text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {doctorReq && doctorReq.map((req) => (
                  <tr key={req._id || req.id}>
                    <td>
                      <div className="doctor-cell">
                        <div
                          className="doctor-avatar"
                          style={{ backgroundColor: req.avatarBg || '#6366f1' }}
                        >
                          {req.firstname ? req.firstname.charAt(0) : 'D'}
                        </div>
                        <span className="doctor-name">{req.firstname}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag-pill">{req.qualification}</span>
                    </td>
                    <td>{req.specialization}</td>
                    <td>{req.experience}</td>
                    <td>
                      <span className="status-badge pending">
                        {req.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button
                          onClick={() => Reqhandler(req._id)}
                          className="action-btn approve"
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button className="action-btn reject" title="Reject">
                          ✕
                        </button>
                        <button className="action-btn view" title="View Details">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom Quick Management Cards */}
        <section className="management-grid">
          <div className="quick-card">
            <div className="quick-info">
              <div className="quick-icon purple-bg">🩺</div>
              <div>
                <h4>Doctor Management</h4>
                <p>Manage registered doctors and profiles</p>
              </div>
            </div>
            <button onClick={() => navigate("/doctorm")} className="arrow-btn">→</button>
          </div>

          <div className="quick-card">
            <div className="quick-info">
              <div className="quick-icon blue-bg">👥</div>
              <div>
                <h4>Patient Management</h4>
                <p>View and manage registered patients</p>
              </div>
            </div>
            <button onClick={() => navigate("/patientm")} className="arrow-btn">→</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
