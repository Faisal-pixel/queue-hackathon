import React, { useEffect } from 'react'
import { signOutUser } from '../../utils/firebase'



const NotAnEmployee: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      signOutUser()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <div className='h-screen flex justify-center items-center'>
        You don't exist as an employee in our database
        <br />
        <br />
        <span className='inline-block'>You will be signed out in 3 seconds</span>
    </div>
  )
}

export default NotAnEmployee