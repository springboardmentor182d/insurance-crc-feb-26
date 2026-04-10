import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  

  const [formData, setFormData] = useState({
    fullName: "John Anderson",
    email: "john.anderson@email.com",
    phone: "+1 (555) 123-4567",
    dob: "15-06-1985",
    occupation: "Software Engineer",
    annualIncome: "$120,000",
    streetAddress: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
  });
const [originalData, setOriginalData] = useState({...formData});
  const stats = [
    { value: "4", label: "Active Policies", color: "#4F46E5" },
    { value: "8", label: "Claims Approved", color: "#16A34A" },
    { value: "2", label: "Years Member", color: "#7C3AED" },
    { value: "$15K", label: "Claims Paid", color: "#EA580C" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };
  const handleEdit = () => {
  setOriginalData({...formData});
  setIsEditing(true);
};

const handleSave = () => {
  setIsEditing(false);
};

const handleCancel = () => {
  setFormData({...originalData});
  setIsEditing(false);
};

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>
        

        <div style={{ display: "flex", gap: "10px" }}>
        {isEditing && (
            <button className="cancel-btn" onClick={handleCancel}>
            Cancel
            </button>
        )}
        <button className="edit-btn" onClick={isEditing ? handleSave : handleEdit}>
            {isEditing ? "Save Profile" : "Edit Profile"}
        </button>
        </div>
        {/* <button className="edit-btn" onClick={handleEditToggle}>
          {isEditing ? "Save Profile" : "Edit Profile"}
        </button> */}
      </div>

      {/* Avatar Card */}
      <div className="profile-card avatar-card">
        <div className="avatar-circle">
          {getInitials(formData.fullName)}
        </div>
        <div className="avatar-info">
          <h2 className="avatar-name">{formData.fullName}</h2>
          <div className="avatar-details">
            <span className="avatar-detail">
              <span className="icon">✉</span> {formData.email}
            </span>
            <span className="avatar-detail">
              <span className="icon">📞</span> {formData.phone}
            </span>
            <span className="avatar-detail">
              <span className="icon">📍</span> {formData.city}, {formData.state}
            </span>
          </div>
          <span className="verified-badge">✔ Verified Account</span>
        </div>
      </div>

      {/* Personal Information */}
      <div className="profile-card">
        <h3 className="section-title">Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="John Anderson"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="john.anderson@email.com"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="15-06-1985"
            />
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Software Engineer"
            />
          </div>
          <div className="form-group">
            <label>Annual Income</label>
            <input
              type="text"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="$120,000"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="profile-card">
        <h3 className="section-title">Address Information</h3>
        <div className="form-group full-width">
          <label>Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="123 Main Street, Apt 4B"
          />
        </div>
        <div className="form-grid three-col">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="New York"
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="NY"
            />
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="profile-card">
        <h3 className="section-title">Account Statistics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <span className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;