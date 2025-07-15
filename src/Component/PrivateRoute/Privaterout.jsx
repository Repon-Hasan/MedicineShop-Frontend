import React, { useContext } from 'react'

import { Navigate, useLocation } from 'react-router';
import AuthContext from '../../../AuthContext';

function Privaterout({children}) {

  const {user,loading}=useContext(AuthContext)

  const {pathname} =useLocation()

  //console.log(pathname)
  if(loading){
    return <div>loading.....</div>
  }

  if(!user || !user?.email){
   return <Navigate state={{from:location.pathname}} to='/login'></Navigate>
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default Privaterout