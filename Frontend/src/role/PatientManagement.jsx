import React, { useState } from "react";
import "../RoleCss/patientmanage.css";

const PatientManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const patients = [
    {
      id: "PT001",
      name: "Aman Kumar",
      age: 24,
      gender: "Male",
      phone: "+91 98765 43210",
      doctor: "Dr. Rahul Sharma",
      condition: "Stable",
      status: "Active",
      initial: "A",
    },
    {
      id: "PT002",
      name: "Priya Kumari",
      age: 29,
      gender: "Female",
      phone: "+91 98765 43211",
      doctor: "Dr. Priya Singh",
      condition: "Monitoring",
      status: "Active",
      initial: "P",
    },
    {
      id: "PT003",
      name: "Rohit Singh",
      age: 42,
      gender: "Male",
      phone: "+91 98765 43212",
      doctor: "Dr. Amit Kumar",
      condition: "Critical",
      status: "Active",
      initial: "R",
    },
    {
      id: "PT004",
      name: "Neha Sharma",
      age: 35,
      gender: "Female",
      phone: "+91 98765 43213",
      doctor: "Dr. Neha Verma",
      condition: "Stable",
      status: "Active",
      initial: "N",
    },
    {
      id: "PT005",
      name: "Vikash Kumar",
      age: 51,
      gender: "Male",
      phone: "+91 98765 43214",
      doctor: "Dr. Rahul Sharma",
      condition: "Monitoring",
      status: "Inactive",
      initial: "V",
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search);

    const matchesFilter =
      filter === "All" ||
      patient.status === filter ||
      patient.condition === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="patients-page">

      {/* HEADER */}
      <div className="patients-header">
        <div>
          <h1>Patient Management</h1>
          <p>View, monitor and manage registered patients</p>
        </div>

        <button className="export-btn">
          ↓ Export
        </button>
      </div>


      {/* STAT CARDS */}
      <div className="patient-stats">

        <div className="patient-stat-card">
          <div className="patient-stat-icon purple">
            ●
          </div>

          <div>
            <span>Total Patients</span>
            <strong>1,248</strong>
            <small>↑ 12% this month</small>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Patients</span>
            <strong>1,102</strong>
            <small>88.3% active</small>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon orange">
            !
          </div>

          <div>
            <span>Under Monitoring</span>
            <strong>86</strong>
            <small className="orange-text">
              Requires monitoring
            </small>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon red">
            !
          </div>

          <div>
            <span>Critical Patients</span>
            <strong className="critical-number">12</strong>
            <small className="red-text">
              Immediate attention
            </small>
          </div>
        </div>

      </div>


      {/* MAIN TABLE CARD */}
      <div className="patients-card">

        {/* CARD HEADER */}
        <div className="patients-card-header">

          <div>
            <h2>All Patients</h2>
            <p>
              Manage patient information and health status
            </p>
          </div>

          <span className="patient-count">
            {filteredPatients.length} Patients
          </span>

        </div>


        {/* TOOLBAR */}
        <div className="patients-toolbar">

          <div className="patient-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Patients</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Stable">Stable</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Critical">Critical</option>
          </select>

        </div>


        {/* TABLE */}
        <div className="patients-table">

          <div className="patients-head">
            <span>Patient</span>
            <span>Age</span>
            <span>Gender</span>
            <span>Assigned Doctor</span>
            <span>Condition</span>
            <span>Status</span>
            <span>Action</span>
          </div>


          {filteredPatients.map((patient) => (

            <div className="patient-row" key={patient.id}>

              {/* PATIENT */}
              <div className="patient-info">

                <div className="patient-avatar">
                  {patient.initial}
                </div>

                <div>
                  <strong>{patient.name}</strong>

                  <small>
                    {patient.id} · {patient.phone}
                  </small>
                </div>

              </div>


              {/* AGE */}
              <span>{patient.age}</span>


              {/* GENDER */}
              <span>{patient.gender}</span>


              {/* DOCTOR */}
              <span className="assigned-doctor">
                {patient.doctor}
              </span>


              {/* CONDITION */}
              <span>

                <label
                  className={
                    patient.condition === "Critical"
                      ? "condition-critical"
                      : patient.condition === "Monitoring"
                      ? "condition-monitoring"
                      : "condition-stable"
                  }
                >
                  {patient.condition}
                </label>

              </span>


              {/* STATUS */}
              <span>

                <label
                  className={
                    patient.status === "Active"
                      ? "patient-active"
                      : "patient-inactive"
                  }
                >
                  {patient.status}
                </label>

              </span>


              {/* ACTION */}
              <button className="patient-view">
                View
              </button>

            </div>

          ))}


          {filteredPatients.length === 0 && (
            <div className="no-patients">
              No patients found
            </div>
          )}

        </div>


        {/* FOOTER */}
        <div className="patients-footer">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>

      </div>

    </div>
  );
};

export default PatientManagement;