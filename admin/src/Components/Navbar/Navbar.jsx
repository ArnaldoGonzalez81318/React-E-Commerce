// import React from 'react'
import navLogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navLogo} alt="logo" className="nav-logo" />
      <div className="nav-profile">
        <img src={navProfile} alt="profile" className="nav-profile-img" />
      </div>
    </div>
  )
}

export default Navbar