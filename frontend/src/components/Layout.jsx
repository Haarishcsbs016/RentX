import { NavLink, Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-mark" />
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-main">SmartRental</span>
            <span className="sidebar-logo-sub">Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-dot" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-dot" />
            <span>Bookings</span>
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-dot" />
            <span>Admin</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `sidebar-link sidebar-link-ghost ${
                isActive ? "sidebar-link-active" : ""
              }`
            }
          >
            <span className="sidebar-dot muted" />
            <span>Login / Signup</span>
          </NavLink>
        </div>
      </aside>

      <div className="app-shell">
        <header className="navbar">
          <div className="navbar-title">Welcome back</div>
          <div className="navbar-right">
            <input
              className="topbar-search"
              placeholder="Search for a car, bike or location"
            />
            <button className="topbar-chip" type="button">
              Light / Dark
            </button>
            <div className="topbar-user">
              <span className="topbar-user-avatar">SR</span>
              <span className="topbar-user-name">Guest</span>
            </div>
          </div>
        </header>

        <main className="page-container">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;

