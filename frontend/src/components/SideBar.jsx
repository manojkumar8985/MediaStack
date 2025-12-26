import { NavLink } from "react-router-dom";
import { useState } from "react";
import { LayoutGrid, Video, Settings,User } from "lucide-react";
import { Link } from "react-router-dom";
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-0 h-screen bg-[#0b0e14] text-gray-300
        transition-all duration-300 ease-in-out
        ${expanded ? "w-64" : "w-16"}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <span className="text-white font-bold text-lg">
          <Link to="/">
          {expanded ? "MediaStack" : "MS"}
          </Link>
          
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col space-y-1 px-2">

{/* Profile */}
  <SidebarItem
    to="/profile"
    icon={<User size={20} />}
    label="Profile"
    expanded={expanded}
  />

  <SidebarItem
    to="/upload"
    icon={<LayoutGrid size={20} />}
    label="Upload"
    expanded={expanded}
  />

  <SidebarItem
    to="/myvideos"
    icon={<Video size={20} />}
    label="Assets"
    expanded={expanded}
  />

  
</nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label, expanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm
         ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800"}
        `
      }
    >
      <div className="min-w-[20px]">{icon}</div>
      {expanded && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}
