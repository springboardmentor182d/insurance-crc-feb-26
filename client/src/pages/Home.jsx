import React, { useEffect, useState } from 'react'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import Sidebar from '../layout/Sidebar'
import defaultStats from '../data/defaultStats'

export default function Home() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/dashboard')
      .then(res => res.json())
      .then(d => setData({ ...defaultStats, ...d }))
      .catch(() => setData(defaultStats))
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          <BarChart stats={data} />
          <PieChart distribution={data.distribution} />
        </div>
      </div>
    </div>
  )
}