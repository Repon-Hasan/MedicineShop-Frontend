import React from 'react'
import Navbar from '../Component/Navbar/Navbar'
import { Outlet } from 'react-router'
import Footer from '../Component/Footer/Footer'

function MainLayout() {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
