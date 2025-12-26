import { useState } from "react";
import Sidebar from "./components/SideBar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({ children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Sidebar */}
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <Sidebar />
      </div>

      {/* Topbar */}
      <Topbar sidebarExpanded={expanded} />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300
          ${expanded ? "ml-64" : "ml-16"}
        `}
      >
        <div className="p-6 bg-gray-50 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
