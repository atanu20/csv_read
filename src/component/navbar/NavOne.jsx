import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';
import Cookies from 'js-cookie';

const NavOne = () => {
  const login = localStorage.getItem('_fileupload_access_user_login');
  const [status, setStatus] = useState(false);
  useEffect(() => {
    if (login) {
      setStatus(true);
    }
  }, []);

  const logout = () => {
    Cookies.remove('_fileupload_access_user_tokon_');
    localStorage.removeItem('_fileupload_access_user_login');
    console.clear();
    window.location.href = '/login';
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand">
          File<span class="text-warning">Upload</span>
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            {status ? (
              <>
                <li className="mr-2">
                  <NavLink to="/dashboard" className="nav-link">
                    List
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-warning" onClick={() => logout()}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavOne;
