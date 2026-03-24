import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import Sidebar from '../layout/Sidebar'
import defaultStats from '../data/defaultStats'

export default function Home() {

  const [data, setData] = useState(null)

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    axios.get(`${BASE_URL}/claims`)
      .then(res => {
        setData({ ...defaultStats, ...res.data })
      })
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