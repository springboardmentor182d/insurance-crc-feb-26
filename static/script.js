fetch("/api/dashboard")
.then(res => res.json())
.then(data => {

    // KPI values
    document.getElementById("total").innerText = data.kpis.total_policies;
    document.getElementById("active").innerText = data.kpis.active_policies;
    document.getElementById("claims").innerText = data.kpis.claims;
    document.getElementById("revenue").innerText = "₹ " + data.kpis.revenue;

    // Line Chart
    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun"],
            datasets: [{
                label: "Revenue",
                data: data.monthly_revenue,
                borderColor: "blue",
                fill: false,
                tension: 0.3
            }]
        }
    });

    // Pie Chart
    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: Object.keys(data.policy_distribution),
            datasets: [{
                data: Object.values(data.policy_distribution),
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FFC107",
                    "#E91E63"
                ]
            }]
        }
    });

    // Table data
    let table = document.getElementById("policyTable");

    data.recent_policies.forEach(policy => {

        let row = `
        <tr>
            <td>${policy.id}</td>
            <td>${policy.customer}</td>
            <td>${policy.type}</td>
            <td>${policy.status}</td>
        </tr>
        `;

        table.innerHTML += row;
    });

});