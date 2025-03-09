import React from 'react';
import { Dashboard, Person, Description, Article } from '@mui/icons-material';
import { useLocation, Link } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <Dashboard />, label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '32px' }}>
        <img src="/logo-with-text.svg" alt="ATS Logo" style={{ height: '32px' }} />
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {React.cloneElement(item.icon, { 
              sx: { fontSize: 20 } 
            })}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;