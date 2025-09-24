import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 👈 CORRECTED PATH // 👈 Import the hook

const Navbar = () => {
  const { user, logOut, loading } = useAuth(); // 👈 Get user state and logout function

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
      {user && <li><NavLink to="/history">History</NavLink></li>} {/* 👈 Show history link if logged in */}
      <li><NavLink to="/about">About</NavLink></li>
      {/* <li><NavLink to="/text">GeminiText</NavLink></li> */}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          Dokan Ledger AI
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User profile" src={user.photoURL || 'default-avatar-url'} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={logOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
