import React from 'react'
import { NavLink } from 'react-router'
import PaymentHistory from './PaymentHistory'

function UserMain() {
  return (
    <div>
    <NavLink to="/seller/payment-history" className="...">
     <PaymentHistory></PaymentHistory>
</NavLink>
    </div>
  )
}

export default UserMain
