import React from 'react';
import './Dashboard-NavBar.css';
import LogoSmall from '../../Logo/LogoSmall';

export default function DashboardNavBar() {
  return (
    <div className="dashboard-navbar">
        <div className='dashboard-navbar-icon'><LogoSmall/></div>
        <div className='dashboard-navbar-rightside'></div>
    </div>
  )
}
