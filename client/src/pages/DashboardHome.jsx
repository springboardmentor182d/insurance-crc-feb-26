import "./DashboardHome.css";
import {
  FiUsers,
  FiShield,
  FiAlertTriangle,
  FiPlusCircle,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

function DashboardHome() {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12%",
      icon: <FiUsers />,
      color: "blue",
      negative: false,
    },
    {
      title: "Active Policies",
      value: "3,456",
      change: "+8%",
      icon: <FiShield />,
      color: "green",
      negative: false,
    },
    {
      title: "Pending Claims",
      value: "89",
      change: "-3%",
      icon: <FiAlertTriangle />,
      color: "orange",
      negative: true,
    },
    {
      title: "Fraud Alerts",
      value: "12",
      change: "+5%",
      icon: <FiAlertTriangle />,
      color: "purple",
      negative: false,
    },
  ];

  const actions = [
    {
      title: "Manage Users",
      desc: "View and manage all users",
      icon: <FiUsers />,
      color: "blue",
    },
    {
      title: "Add Policy",
      desc: "Create new policy entry",
      icon: <FiPlusCircle />,
      color: "purple",
    },
    {
      title: "View Analytics",
      desc: "Detailed reports and insights",
      icon: <FiBarChart2 />,
      color: "green",
    },
    {
      title: "Settings",
      desc: "Configure system settings",
      icon: <FiSettings />,
      color: "orange",
    },
  ];

  const alerts = [
    {
      title: "Duplicate Billing",
      desc: "Multiple invoices detected for the same claim.",
      risk: "High Risk",
    },
    {
      title: "Location Mismatch",
      desc: "Claim raised from unusual region/device pattern.",
      risk: "Medium Risk",
    },
    {
      title: "Rapid Claim Activity",
      desc: "User submitted repeated claims in short time.",
      risk: "High Risk",
    },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h1 className="logo">InsureLogic</h1>

        <nav className="sidebar-menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">Users</button>
          <button className="menu-item">Policies</button>
          <button className="menu-item">Claims</button>
          <button className="menu-item">Analytics</button>
          <button className="menu-item">Settings</button>
        </nav>
      </aside>

      <div className="main-section">
        <header className="topbar">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="org-id">Organization ID: ORG-12345</p>
          </div>

          <div className="topbar-right">
            <div className="user-chip">John Doe</div>
            <button className="logout-btn">Logout</button>
          </div>
        </header>

        <main className="content-area">
          <section className="stats-grid">
            {stats.map((item, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-top">
                  <div className={`icon-box ${item.color}`}>
                    <span className="card-icon">{item.icon}</span>
                  </div>
                  <span className={item.negative ? "change red" : "change green"}>
                    {item.change}
                  </span>
                </div>

                <p className="stat-title">{item.title}</p>
                <h2 className="stat-value">{item.value}</h2>
              </div>
            ))}
          </section>

          <section className="actions-grid">
            {actions.map((item, index) => (
              <div className="action-card" key={index}>
                <div className={`icon-box ${item.color}`}>
                  <span className="card-icon">{item.icon}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </section>

          <section className="fraud-section">
            <h2 className="fraud-heading">Fraud Alerts</h2>

            <div className="fraud-grid">
              {alerts.map((item, index) => (
                <div className="fraud-card" key={index}>
                  <div className="fraud-top">
                    <h3>{item.title}</h3>
                    <span className={`risk-badge ${item.risk === "Medium Risk" ? "medium" : "high"}`}>
                      {item.risk}
                    </span>
                  </div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardHome;