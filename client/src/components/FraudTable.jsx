import React from "react";

function FraudTable({flags,updateStatus}){

  return(
    <div className="card table-card">

      <table className="fraud-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Claim ID</th>
            <th>Rule</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {flags.map(flag=>(
            <tr key={flag.id}>

              <td>{flag.id}</td>
              <td>{flag.claim_id}</td>
              <td>{flag.rule_code}</td>

              <td>
                <span className={`badge ${flag.severity}`}>
                  {flag.severity}
                </span>
              </td>

              <td>
                <span className={`badge ${flag.status}`}>
                  {flag.status}
                </span>
              </td>

              <td>

                <button className="btn-review">
                  Review
                </button>

                <button
                  className="btn-reject"
                  onClick={()=>updateStatus(flag.id,"rejected")}
                >
                  Reject
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default FraudTable