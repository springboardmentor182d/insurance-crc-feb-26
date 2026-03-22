import React, { useEffect, useState } from 'react'
function BarChart({ stats }) {

  const bars = [
    { label: 'Approved', value: stats?.approvedClaims ?? 320, color: '#3b82f6' },
    { label: 'Under Review', value: stats?.underReview ?? 180, color: '#3b82f6' },
    { label: 'Pending', value: stats?.pending ?? 1850, color: '#3b82f6' },
    { label: 'Rejected', value: stats?.rejected ?? 420, color: '#3b82f6' },
  ]

  const maxValue = Math.max(...bars.map((bar) => bar.value), 2000)

  const width = 560
  const height = 300
  const chartHeight = height - 90
  const barWidth = 60
  const gap = 50
  const startX = 80

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Claims Status Overview</h3>

      <svg width={width} height={height}>

        {/* Y Axis Grid */}
        {[0, 500, 1000, 1500, 2000].map((value, index) => {

          const y = 20 + chartHeight - (value / maxValue) * chartHeight

          return (
            <g key={index}>
              <line
                x1="60"
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4"
              />

              <text
                x="25"
                y={y + 4}
                fontSize="11"
                fill="#9ca3af"
              >
                {value}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {bars.map((bar, idx) => {

          const barHeight = (bar.value / maxValue) * chartHeight

          const x = startX + idx * (barWidth + gap)

          const y = 20 + chartHeight - barHeight

          const centerX = x + barWidth / 2

          return (
            <g key={idx}>

              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={bar.color}
                rx="8"
              />

              <text
                x={centerX}
                y={height - 25}
                textAnchor="middle"
                fontSize="12"
                fill="#1f2937"
                fontWeight="600"
              >
                {bar.label}
              </text>

            </g>
          )
        })}

      </svg>
    </div>
  )
}

function PieChart({ distribution }) {

  const data = distribution?.length
    ? distribution
    : [
        { label: "Health Insurance", value: 40, color: "#3b82f6" },
        { label: "Life Insurance", value: 26, color: "#10b981" },
        { label: "Auto Insurance", value: 22, color: "#f59e0b" },
        { label: "Home Insurance", value: 12, color: "#8b5cf6" },
      ]

  const totalValue = data.reduce((sum, item) => sum + item.value, 0) || 1

  let angle = 0

  const slices = data.map((slice) => {

    const start = angle
    const arc = (slice.value / totalValue) * 360
    angle += arc

    const x1 = 50 + 50 * Math.cos((Math.PI / 180) * start)
    const y1 = 50 + 50 * Math.sin((Math.PI / 180) * start)

    const x2 = 50 + 50 * Math.cos((Math.PI / 180) * (start + arc))
    const y2 = 50 + 50 * Math.sin((Math.PI / 180) * (start + arc))

    const largeArc = arc > 180 ? 1 : 0

    const d = `M50 50 L${x1} ${y1} A50 50 0 ${largeArc} 1 ${x2} ${y2} Z`

    return {
      ...slice,
      d,
      percentage: ((slice.value / totalValue) * 100).toFixed(0),
    }
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Policy Distribution</h3>

      <div className="flex items-center gap-8">

        {/* Pie Chart */}
        <svg width="220" height="220" viewBox="0 0 100 100">

          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.d}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="1"
            />
          ))}

        </svg>

        {/* Legend */}
        <div className="space-y-3 text-sm">

          {slices.map((slice) => (
            <div
              key={slice.label}
              className="flex items-center justify-between w-56"
            >

              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: slice.color }}
                ></span>

                <span className="font-medium text-gray-700">
                  {slice.label}
                </span>
              </div>

              <span
                className="font-semibold"
                style={{ color: slice.color }}
              >
                {slice.percentage}%
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  )


}

const defaultStats = {
  totalUsers: 12458,
  totalPolicies: 8234,
  pendingClaims: 342,
  approvedClaims: 1847,
  underReview: 80,
  rejected: 30,
  approved: 95,
  distribution: [
    { label: 'Health Insurance', value: 38, color: '#3b82f6' },
    { label: 'Life Insurance', value: 26, color: '#10b981' },
    { label: 'Auto Insurance', value: 22, color: '#f59e0b' },
    { label: 'Home Insurance', value: 14, color: '#8b5cf6' },
  ],
  alerts: [
    { text: '15 claims require immediate review', color: 'bg-orange-50', border: 'border-orange-200' },
    { text: 'Fraud detection alert: Claim #CL-8734', color: 'bg-red-50', border: 'border-red-200' },
    { text: '3 policies expiring in next 7 days', color: 'bg-yellow-50', border: 'border-yellow-200' },
  ],
  activity: [
    { text: 'Claim #CL-8743 submitted by John Doe', time: '5 min ago' },
    { text: 'Policy #POL-2341 activated for Sarah Miller', time: '12 min ago' },
    { text: 'Claim #CL-8721 approved - $2,500', time: '23 min ago' },
    { text: 'New user registration: Mike Johnson', time: '35 min ago' },
    { text: 'Claim #CL-8698 rejected - insufficient documentation', time: '1 hour ago' },
    { text: 'Policy #POL-2298 renewed by Emma Wilson', time: '2 hours ago' },
  ],
}

export default function App() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
      fetch('http://127.0.0.1:8000/stats')
      .then((res) => res.json())
      .then((data) =>
       setDashboard({
    ...defaultStats,
    approvedClaims: data.approved,
    pendingClaims: data.pending,
    rejected: data.rejected,
    underReview: data.pending, // or separate if backend provides it
  })
)
      .catch((err) => {
        console.warn(err)
        setDashboard(defaultStats)
        setError('Could not load backend data, using default values.')
      })
  }, [])

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg font-semibold">Loading dashboard data...</div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total Users', value: dashboard.totalUsers, change: '+12.5%', label: 'vs last month', icon: '👤', color: 'text-blue-600' },
    { title: 'Total Policies', value: dashboard.totalPolicies, change: '+8.2%', label: 'vs last month', icon: '📄', color: 'text-green-600' },
    { title: 'Pending Claims', value: dashboard.pendingClaims, change: '-5.4%', label: 'vs last month', icon: '⏳', color: 'text-orange-500' },
    { title: 'Approved Claims', value: dashboard.approvedClaims, change: '+18.7%', label: 'vs last month', icon: '✔️', color: 'text-purple-600' },
  ]

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans text-gray-800">
      <div className="w-64 bg-white p-6 shadow-lg text-gray-700 border-r border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">I</div>
          <div>
            <div className="text-lg font-bold text-gray-900">InsureAdmin</div>
            <div className="text-xs text-gray-500">Admin Portal</div>
          </div>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="text-blue-600 font-semibold">Dashboard</li>
          <li className="text-gray-600">Policy Management</li>
          <li className="text-gray-600">Claims Management</li>
          <li className="text-gray-600">Fraud Detection</li>
          <li className="text-gray-600">User Management</li>
          <li className="text-gray-600">Reports & Analytics</li>
        </ul>
      </div>
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">Dashboard Overview</h1>
            <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">InsureAdmin</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="text-2xl">{card.icon}</div>
                <div className={`text-xs font-semibold ${card.color}`}>{card.change}</div>
              </div>
              <div className="text-sm font-semibold text-gray-500 mt-3">{card.title}</div>
              <div className="text-3xl font-bold mt-1">{card.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-3">Priority Alerts</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {dashboard.alerts.map((alert, idx) => (
              <li key={idx} className={`${alert.color} ${alert.border} p-3 rounded flex justify-between`}>
                <span>{alert.text}</span>
                <span className="font-bold text-blue-600">Review</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-red-600">Fraud Detection Alert</h2>
          <p className="text-gray-600">Active fraud cases requiring attention</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Critical Cases</div>
              <div className="text-3xl font-bold text-red-600">23</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Under Review</div>
              <div className="text-3xl font-bold text-orange-500">87</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Amount at Risk</div>
              <div className="text-3xl font-bold text-green-600">$458K</div>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg">Review Fraud Cases</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <BarChart stats={dashboard} />
          <PieChart distribution={dashboard.distribution} />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {dashboard.activity.slice(0, 6).map((item, idx) => (
              <li key={idx} className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{item.text}</span>
                </div>
                <span className="text-gray-400 text-xs">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
