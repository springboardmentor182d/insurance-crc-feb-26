import React from "react";

function Header(){
  return(
    <div style={{
      background:"#ffffff",
      borderBottom:"1px solid #e6e6ee",
      padding:"16px 30px",
      display:"flex",
      justifyContent:"space-between"
    }}>
      <div>
        <h2 style={{margin:0}}>Fraud Detection</h2>
        <small style={{color:"#6b7280"}}>
          Organization ID: ORG-12345
        </small>
      </div>

      <div>
        <button style={{
          marginRight:10,
          padding:"6px 12px",
          borderRadius:8,
          border:"1px solid #ddd"
        }}>
          Admin
        </button>

        <button style={{
          background:"#7c3aed",
          color:"white",
          border:"none",
          padding:"6px 12px",
          borderRadius:8
        }}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Header