'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'



const Users = () => {
  const router = useRouter()

  const logout = async () => {
    
    // router.push('/logout-success')
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div>
      <button onClick={logout}>sign out</button>
    </div>
  )
}

export default Users
