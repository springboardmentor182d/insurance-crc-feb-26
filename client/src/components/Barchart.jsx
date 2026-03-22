import React from 'react'

export default function BarChart({ stats }) {

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
        {[0, 500, 1000, 1500, 2000].map((value, index) => {
          const y = 20 + chartHeight - (value / maxValue) * chartHeight
          return (
            <g key={index}>
              <line x1="60" y1={y} x2={width - 20} y2={y} stroke="#e5e7eb" strokeDasharray="4"/>
              <text x="25" y={y + 4} fontSize="11" fill="#9ca3af">{value}</text>
            </g>
          )
        })}

        {bars.map((bar, idx) => {
          const barHeight = (bar.value / maxValue) * chartHeight
          const x = startX + idx * (barWidth + gap)
          const y = 20 + chartHeight - barHeight

          return (
            <rect key={idx} x={x} y={y} width={barWidth} height={barHeight} fill={bar.color} rx="8"/>
          )
        })}
      </svg>
    </div>
  )
}