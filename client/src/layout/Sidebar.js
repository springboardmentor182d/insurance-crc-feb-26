import "../styles/styles.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>InsureAI</h2>

      <p>Dashboard</p>
      <p className="active">Policies</p>
      <p>Recommendations</p>
      <p>Claims</p>
      <p>Profile</p>
    </div>
  );
}

export default Sidebar;