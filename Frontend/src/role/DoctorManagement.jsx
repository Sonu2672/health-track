import React, { useState } from 'react';
import '../RoleCss/doctormanage.css';

// import React, { useState } from 'react';
// import './DoctorManagement.css';
// import React, { useState } from 'react';
// import './DoctorManagement.css';

const DoctorManagement = ({setIslogin}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  
  // State for Modal Overlay
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Doctors State
  const [doctors, setDoctors] = useState([
    { id: 'DOC-201', name: 'Dr. Vikrant Roy', specialty: 'Neurologist', exp: '12 Yrs', fee: '₹800', status: 'Available', email: 'vikrant@healthtrack.com', rating: '4.9', avatarBg: '#6366f1' },
    { id: 'DOC-202', name: 'Dr. Ananya Sen', specialty: 'Dermatologist', exp: '7 Yrs', fee: '₹600', status: 'In Consultation', email: 'ananya@healthtrack.com', rating: '4.8', avatarBg: '#ec4899' },
    { id: 'DOC-203', name: 'Dr. Rajesh Patel', specialty: 'Pediatrician', exp: '15 Yrs', fee: '₹700', status: 'On Leave', email: 'rajesh@healthtrack.com', rating: '4.7', avatarBg: '#10b981' },
    { id: 'DOC-204', name: 'Dr. Sneha Rao', specialty: 'Cardiologist', exp: '10 Yrs', fee: '₹1000', status: 'Available', email: 'sneha@healthtrack.com', rating: '4.9', avatarBg: '#8b5cf6' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Cardiologist',
    email: '',
    exp: '',
    fee: '',
    status: 'Available',
    avatarBg: '#6366f1'
  });

  const handleDelete = (id) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.exp || !formData.fee) {
      alert('Please fill all required fields');
      return;
    }

    const newDoc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
      specialty: formData.specialty,
      exp: `${formData.exp} Yrs`,
      fee: `₹${formData.fee}`,
      status: formData.status,
      email: formData.email,
      rating: '5.0',
      avatarBg: formData.avatarBg
    };

    setDoctors([newDoc, ...doctors]);
    setIsModalOpen(false); // Close Modal
    
    // Reset Form
    setFormData({
      name: '',
      specialty: 'Cardiologist',
      email: '',
      exp: '',
      fee: '',
      status: 'Available',
      avatarBg: '#6366f1'
    });
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'All' || doc.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="doc-mgmt-wrapper">
      {/* Top Banner Controls */}
      <div className="doc-mgmt-header">
        <div className="header-text-group">
          <h2>Doctor Management</h2>
          <p>Manage doctor schedules, fees, and active statuses</p>
        </div>
        <button className="add-doctor-btn" onClick={() => setIsModalOpen(true)}>
          <span className="btn-icon">+</span> Add New Doctor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="doc-filter-panel">
        <div className="doc-search-input-group">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search doctor name or specialty..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="doc-select-group">
          <label>Specialty:</label>
          <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
            <option value="All">All Specialties</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Cardiologist">Cardiologist</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="doc-cards-grid">
        {filteredDoctors.map((doc) => (
          <div className="doc-profile-card" key={doc.id}>
            <div className="doc-card-header">
              <div className="doc-avatar-circle" style={{ backgroundColor: doc.avatarBg || '#e0e7ff' }}>
                {doc.name.replace('Dr. ', '')[0] || 'D'}
              </div>
              <div className="doc-status-badge">
                <span className={`status-indicator ${doc.status.toLowerCase().replace(/\s+/g, '-')}`}></span>
                <span>{doc.status}</span>
              </div>
            </div>

            <div className="doc-details-body">
              <h3 className="doc-name-title">{doc.name}</h3>
              <span className="doc-spec-tag">{doc.specialty}</span>
              <p className="doc-email-text">{doc.email}</p>
            </div>

            <div className="doc-stats-row">
              <div className="stat-item">
                <span className="stat-lbl">Exp</span>
                <span className="stat-val">{doc.exp}</span>
              </div>
              <div className="stat-item">
                <span className="stat-lbl">Fee</span>
                <span className="stat-val">{doc.fee}</span>
              </div>
              <div className="stat-item">
                <span className="stat-lbl">Rating</span>
                <span className="stat-val">⭐ {doc.rating}</span>
              </div>
            </div>

            <div className="doc-card-footer">
              <button className="btn-action-edit">Edit Profile</button>
              <button className="btn-action-remove" onClick={() => handleDelete(doc.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL: ADD NEW DOCTOR ================= */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container animated-fadeIn">
            <div className="modal-header">
              <div>
                <h3>Register New Doctor</h3>
                <p>Fill out doctor details to list on the platform</p>
              </div>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Avatar Color Choice */}
              <div className="form-group">
                <label>Choose Avatar Theme</label>
                <div className="color-picker-row">
                  {['#6366f1', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b'].map((color) => (
                    <span 
                      key={color} 
                      className={`color-dot ${formData.avatarBg === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, avatarBg: color })}
                    />
                  ))}
                </div>
              </div>

              {/* Doctor Name & Email */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="e.g. Rahul Sharma" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="doctor@healthtrack.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Specialty & Experience */}
              <div className="form-row">
                <div className="form-group">
                  <label>Specialty</label>
                  <select name="specialty" value={formData.specialty} onChange={handleInputChange}>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="General Physician">General Physician</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience (in Years) *</label>
                  <input 
                    type="number" 
                    name="exp"
                    placeholder="e.g. 8" 
                    value={formData.exp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Fee & Initial Status */}
              <div className="form-row">
                <div className="form-group">
                  <label>Consultation Fee (₹) *</label>
                  <input 
                    type="number" 
                    name="fee"
                    placeholder="e.g. 800" 
                    value={formData.fee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Availability Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Available">Available</option>
                    <option value="In Consultation">In Consultation</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save & Publish Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;