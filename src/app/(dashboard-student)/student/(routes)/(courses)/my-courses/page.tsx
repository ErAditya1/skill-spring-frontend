'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'
import CourseCard from '../components/CourseCard'

export default function Dashboard() {

  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/v1/enrollment/my-courses')
      .then(res => setCourses(res.data))
  }, [])

  return (
    <div className="px-8 py-10 space-y-10">

      <Section title="Continue Watching">
        {courses
          .filter((c: any) => c.progress > 0 && c.progress < 100)
          .map((c: any) => (
            <CourseCard key={c._id} _id={c.course_Id._id} />
          ))}
      </Section>

      <Section title="Completed Courses">
        {courses
          .filter((c: any) => c.isCompleted)
          .map((c: any) => (
            <CourseCard key={c._id} _id={c.course_Id._id} />
          ))}
      </Section>

    </div>
  )
}

const Section = ({ title, children }: any) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="flex gap-6 overflow-x-auto pb-4">
      {children}
    </div>
  </div>
)
