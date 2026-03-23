import React from "react";

function Sidebar(){
  return(
    <div style={{
      width:230,
      background:"#ffffff",
      borderRight:"1px solid #e6e6ee",
      padding:"20px"
    }}>

      <h3 style={{color:"#7c3aed"}}>Admin Panel</h3>

      <div style={{marginTop:20}}>
        <p>Dashboard</p>
        <p>Manage Users</p>
        <p>Manage Policies</p>
        <p>Claims Management</p>

        <p style={{
          background:"#ede9fe",
          padding:"8px",
          borderRadius:6,
          color:"#7c3aed"
        }}>
          Fraud Detection
        </p>

        <p>Analytics</p>
        <p>Add Policy Manually</p>
        <p>Admin Logs</p>
        <p>Settings</p>
        <p>Logout</p>
      </div>
    </div>
  )
}

export default Sidebar