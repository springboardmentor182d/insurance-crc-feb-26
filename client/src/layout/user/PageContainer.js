import React from "react";
import Navbar from "./Navbar";

const PageContainer = ({ children, showNav = true, className = "" }) => {
  return (
    <div className={`page-container ${className}`}>
      {showNav && <Navbar />}
      <main className="page-main">{children}</main>
    </div>
  );
};

export default PageContainer;