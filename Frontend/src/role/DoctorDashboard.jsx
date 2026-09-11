import React, { useState } from 'react';
import '../RoleCss/doctor.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = ({setIslogin}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');

  // Doctor Info State
  const doctorInfo = {
    name: "Dr. Vikrant Roy",
    specialty: "Neurologist",
    experience: "12 Yrs",
    hospital: "HealthTrack Central Hospital",
    rating: "4.9"
  };

  // Doctor's Appointments State
  const [appointments, setAppointments] = useState([
    { id: "APT-101", patientName: "Aman Kumar", age: 24, gender: "Male", phone: "+91 98765 43210", time: "10:30 AM", type: "In-Person", status: "Upcoming", condition: "Stable", symptoms: "Severe Headache & Dizziness" },
    { id: "APT-102", patientName: "Priya Kumari", age: 29, gender: "Female", phone: "+91 98765 43211", time: "11:15 AM", type: "Online", status: "In Consultation", condition: "Monitoring", symptoms: "Migraine Follow-up" },
    { id: "APT-103", patientName: "Rohit Singh", age: 42, gender: "Male", phone: "+91 98765 43212", time: "12:00 PM", type: "In-Person", status: "Completed", condition: "Critical", symptoms: "Nerve Pain" },
    { id: "APT-104", patientName: "Neha Sharma", age: 35, gender: "Female", phone: "+91 98765 43213", time: "02:30 PM", type: "Online", status: "Upcoming", condition: "Stable", symptoms: "Insomnia & Stress" },
    { id: "APT-105", patientName: "Vikash Kumar", age: 51, gender: "Male", phone: "+91 98765 43214", time: "03:15 PM", type: "In-Person", status: "Cancelled", condition: "Monitoring", symptoms: "Back Pain" },
  ]);

  // Logout Handler
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

  // Status Change Handler
  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  // Prescription Save Handler
  const handleSavePrescription = (e) => {
    e.preventDefault();
    if(!prescription) return alert("Please add prescription notes.");
    alert(`Prescription saved and sent to ${selectedPatient.patientName}!`);
    handleStatusChange(selectedPatient.id, "Completed");
    setSelectedPatient(null);
    setPrescription('');
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="doc-dash-wrapper">
      
      {/* 1. TOP HERO BANNER WITH LOGOUT BUTTON */}
      <div className="doc-dash-header">
        <div className="header-doctor-info">
          <div className="doc-avatar-large">
            {doctorInfo.name.replace('Dr. ', '')[0]}
          </div>
          <div>
            <h1>Welcome Back, {doctorInfo.name}! 👋</h1>
            <p>{doctorInfo.specialty} • {doctorInfo.experience} Exp • {doctorInfo.hospital}</p>
          </div>
        </div>

        <div className="header-actions-right">
          <div className="doc-quick-badge">
            <span>⭐ {doctorInfo.rating} Doctor Rating</span>
          </div>
          {/* MODERN LOGOUT BUTTON */}
          <button className="doc-logout-btn" onClick={handleLogout}>
            <svg className="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="doc-stats-grid">
        <div className="doc-stat-card">
          <div className="stat-icon-box blue">📅</div>
          <div>
            <span>Today's Patients</span>
            <strong>{appointments.length} Patients</strong>
            <small>5 Appointments Remaining</small>
          </div>
        </div>

        <div className="doc-stat-card">
          <div className="stat-icon-box green">🩺</div>
          <div>
            <span>Completed Today</span>
            <strong>{appointments.filter(a => a.status === 'Completed').length} Consulted</strong>
            <small>Updated Live</small>
          </div>
        </div>

        <div className="doc-stat-card">
          <div className="stat-icon-box orange">⚡</div>
          <div>
            <span>In Consultation</span>
            <strong>{appointments.filter(a => a.status === 'In Consultation').length} Active</strong>
            <small>Patient Waiting in Queue</small>
          </div>
        </div>

        <div className="doc-stat-card">
          <div className="stat-icon-box purple">💰</div>
          <div>
            <span>Estimated Earnings</span>
            <strong>₹4,200</strong>
            <small>Based on Today's Visits</small>
          </div>
        </div>
      </div>

      {/* 3. PATIENTS APPOINTMENTS MANAGEMENT CARD */}
      <div className="doc-main-card">
        <div className="main-card-header">
          <div>
            <h2>My Assigned Patients</h2>
            <p>Review schedule, patient condition, and update health status</p>
          </div>
          <div className="tab-pills">
            <button className={`tab-btn ${activeTab === 'Today' ? 'active' : ''}`} onClick={() => setActiveTab('Today')}>Today</button>
            <button className={`tab-btn ${activeTab === 'Upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('Upcoming')}>Upcoming</button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="doc-toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search assigned patient by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="doc-table-wrapper">
          <div className="doc-table-head">
            <span>Time & ID</span>
            <span>Patient Name</span>
            <span>Type</span>
            <span>Condition</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {filteredAppointments.map((apt) => (
            <div className="doc-table-row" key={apt.id}>
              <div className="time-col">
                <strong>{apt.time}</strong>
                <small>{apt.id}</small>
              </div>

              <div className="patient-col">
                <strong>{apt.patientName}</strong>
                <small>{apt.age} Yrs • {apt.gender} • {apt.phone}</small>
              </div>

              <div>
                <span className={`type-badge ${apt.type.toLowerCase()}`}>{apt.type}</span>
              </div>

              <div>
                <span className={`cond-badge ${apt.condition.toLowerCase()}`}>{apt.condition}</span>
              </div>

              <div>
                <span className={`status-pill ${apt.status.toLowerCase().replace(/\s+/g, '-')}`}>{apt.status}</span>
              </div>

              <div className="action-col">
                <button 
                  className="btn-prescribe"
                  onClick={() => setSelectedPatient(apt)}
                >
                  Prescribe / Details
                </button>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="no-data">No patients found for today.</div>
          )}
        </div>
      </div>

      {/* 4. PATIENT CONSULTATION & PRESCRIPTION MODAL */}
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-container animated-fadeIn">
            <div className="modal-header">
              <div>
                <h3>Consultation: {selectedPatient.patientName}</h3>
                <p>ID: {selectedPatient.id} • {selectedPatient.gender}, {selectedPatient.age} Yrs</p>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>

            <div className="patient-quick-info">
              <div className="info-block">
                <span>Reported Symptoms:</span>
                <strong>{selectedPatient.symptoms}</strong>
              </div>
              <div className="info-block">
                <span>Phone:</span>
                <strong>{selectedPatient.phone}</strong>
              </div>
            </div>

            <form onSubmit={handleSavePrescription} className="modal-form">
              <div className="form-group">
                <label>Add Prescription & Notes *</label>
                <textarea 
                  rows="4"
                  placeholder="e.g. Paracetamol 500mg (BD x 3 days), Rest, Blood Test recommended..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Update Condition</label>
                  <select defaultValue={selectedPatient.condition}>
                    <option value="Stable">Stable</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status Action</label>
                  <select defaultValue="Completed">
                    <option value="Completed">Mark as Consulted & Complete</option>
                    <option value="In Consultation">Set In-Consultation</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setSelectedPatient(null)}>Close</button>
                <button type="submit" className="submit-btn">Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
