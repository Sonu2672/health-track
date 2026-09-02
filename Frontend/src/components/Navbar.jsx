import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  HeartPulse,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import "../css/Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);

    document.body.classList.toggle("dark-mode");
  };

  return (
    <header className="navbar">

      {/* ================= LOGO ================= */}

      <Link to="/" className="logo">

        <div className="logo-icon">
          <HeartPulse size={28} />
        </div>

        <div className="logo-text">
          <h2>PHC</h2>
          <span>Personal Health Companion</span>
        </div>

      </Link>


      {/* ================= DESKTOP NAV ================= */}

      <nav className="desktop-nav">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/features"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Features
        </NavLink>

        <NavLink
          to="/howitworks"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          How It Works
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About Us
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Contact
        </NavLink>

      </nav>


      {/* ================= RIGHT SIDE ================= */}

      <div className="nav-right">

        {/* Theme */}

        <div className="theme-toggle">

          <button
            className={!darkMode ? "theme-btn selected" : "theme-btn"}
            onClick={() => {
              if (darkMode) toggleTheme();
            }}
          >
            <Sun size={18} />
          </button>

          <button
            className={darkMode ? "theme-btn selected" : "theme-btn"}
            onClick={() => {
              if (!darkMode) toggleTheme();
            }}
          >
            <Moon size={18} />
          </button>

        </div>


        {/* Login */}

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>


        {/* Sign Up */}

        <Link
          to="/signup"
          className="signup-btn"
        >
          Sign Up
        </Link>


        {/* Mobile Menu Button */}

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (

        <div className="mobile-menu">

          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/features"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
          >
            Features
          </NavLink>


          <NavLink
            to="/howitworks"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
          >
            How It Works
          </NavLink>


          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
          >
            About Us
          </NavLink>


          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
          >
            Contact
          </NavLink>


          <div className="mobile-auth">

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="signup-btn"
            >
              Sign Up
            </Link>

          </div>

        </div>

      )}

    </header>
  );
}

export default Navbar;