import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function AdminDashboard() {

const location = useLocation();

const linkStyle = (path) => ({
display: "block",
padding: "10px 15px",
marginBottom: "8px",
borderRadius: "8px",
textDecoration: "none",
color: location.pathname.includes(path) ? "#2563eb" : "#333",
background: location.pathname.includes(path) ? "#e0edff" : "transparent",
fontWeight: "500"
});

return (

<div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

{/* SIDEBAR */}

<div
style={{
width: "260px",
background: "#f9fafb",
borderRight: "1px solid #e5e7eb",
padding: "20px",
position: "relative"
}}
>

<h2 style={{ marginBottom: "5px" }}>InsureAdmin</h2>
<p style={{ color: "gray", marginBottom: "25px" }}>Admin Portal</p>

{/* MENU */}

<Link to="/admin-dashboard" style={linkStyle("/admin-dashboard")}>
Dashboard
</Link>

<Link to="/admin-dashboard/policies" style={linkStyle("/policies")}>
Policy Management
</Link>

<Link to="/admin-dashboard/claims" style={linkStyle("/claims")}>
Claims Management
</Link>

<Link
to="/admin-dashboard/fraud-detection"
style={linkStyle("/fraud-detection")}
>
Fraud Detection
</Link>

<Link to="/admin-dashboard/users" style={linkStyle("/users")}>
User Management
</Link>

<Link to="/admin-dashboard/reports" style={linkStyle("/reports")}>
Reports & Analytics
</Link>


{/* ADMIN USER */}

<div
style={{
position: "absolute",
bottom: "20px",
display: "flex",
alignItems: "center",
gap: "10px"
}}
>

<div
style={{
width: "36px",
height: "36px",
borderRadius: "50%",
background: "#2563eb",
color: "white",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "bold"
}}
>
AD
</div>

<div>
<div style={{ fontWeight: "600" }}>Admin User</div>
<div style={{ fontSize: "12px", color: "gray" }}>
admin@insure.com
</div>
</div>

</div>

</div>

{/* MAIN PAGE CONTENT */}

<div style={{ flex: 1, padding: "30px", background: "#f5f7fb" }}>
<Outlet />
</div>

</div>

);

}

export default AdminDashboard;