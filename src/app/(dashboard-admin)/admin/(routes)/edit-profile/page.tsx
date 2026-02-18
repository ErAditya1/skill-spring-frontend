
// import EditProfile from '@/components/EditProfile';
import dynamic from 'next/dynamic'
import React from 'react'
const EditProfile = dynamic(()=> import ('@/components/EditProfile') ,{
  loading: () => <h1>Loading...</h1>,
})

export const metadata = {
  title: "My Learning Website...",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
};
function Page() {
  
   
  return (
    <EditProfile/>
  )
}

export default Page