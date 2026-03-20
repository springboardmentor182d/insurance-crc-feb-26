import React from 'react'

export default function PieChart({ distribution }) {

  const data = distribution || []

  const total = data.reduce((sum, d) => sum + d.value, 0)

  let angle = 0

  const slices = data.map((slice) => {
    const start = angle
    const arc = (slice.value / total) * 360
    angle += arc

    const x1 = 50 + 50 * Math.cos((Math.PI / 180) * start)
    const y1 = 50 + 50 * Math.sin((Math.PI / 180) * start)

    const x2 = 50 + 50 * Math.cos((Math.PI / 180) * (start + arc))
    const y2 = 50 + 50 * Math.sin((Math.PI / 180) * (start + arc))

    const largeArc = arc > 180 ? 1 : 0

    return {
      ...slice,
      d: `M50 50 L${x1} ${y1} A50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
    }
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Policy Distribution</h3>

      <svg width="220" height="220" viewBox="0 0 100 100">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} />
        ))}
      </svg>
    </div>
  )
}