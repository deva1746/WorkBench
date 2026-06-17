import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">⚡</div>
          <div>
            <h2>WorkBench</h2>
            <span>Centralized Workspace for Teams and Tasks</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <motion.div whileHover={{ x: 4 }}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            Dashboard
          </NavLink>
        </motion.div>

        <motion.div whileHover={{ x: 4 }}>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            All Tasks
          </NavLink>
        </motion.div>

        <motion.div whileHover={{ x: 4 }}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            Settings
          </NavLink>
        </motion.div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>

          <div className="user-details">
            <p>{user?.full_name}</p>
            <span>{user?.email}</span>
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ width: "100%", marginTop: "0.75rem" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}