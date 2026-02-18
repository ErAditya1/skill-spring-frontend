'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'

export default function AnalyticsPage() {

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    api.get('/v1/analytics')
      .then(res => setData(res.data))
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Learning Analytics</h1>

      <div className="bg-muted p-6 rounded-xl">
        <p>Total Study Time:</p>
        <h2 className="text-2xl font-bold">
          {data?.totalStudyMinutes || 0} minutes
        </h2>
      </div>
    </div>
  )
}
