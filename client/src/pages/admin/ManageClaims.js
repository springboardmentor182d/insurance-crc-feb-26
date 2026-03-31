import React from "react";

const ManageClaims = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Claims</h2>
      <p>Review and process insurance claims</p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <div>Total: 4</div>
        <div>Pending: 1</div>
        <div>Under Review: 1</div>
        <div>Approved: 1</div>
        <div>Rejected: 1</div>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Claim #</th>
            <th>User</th>
            <th>Policy</th>
            <th>Incident</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CLM-2026-001</td>
            <td>John Anderson</td>
            <td>Auto Insurance</td>
            <td>Vehicle Collision</td>
            <td>$5200</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageClaims;