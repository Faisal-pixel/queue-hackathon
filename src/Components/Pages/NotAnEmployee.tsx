import React, { useContext, useEffect } from 'react'
import { signOutUser } from '../../utils/firebase'
import { GlobalContext } from '../../context/global-context'



const NotAnEmployee: React.FC = () => {
  const {setSignInAsEmployee} = useContext(GlobalContext)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSignInAsEmployee(false);
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