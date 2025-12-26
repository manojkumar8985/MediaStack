import { useEffect, useRef, useState } from "react";
import userAuth from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Topbar({ sidebarExpanded, pageTitle = "Dashboard" }) {
  const { user: data } = userAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);            // desktop avatar dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu
  const dropdownRef = useRef(null);

  /* ================= USER ================= */
  useEffect(() => {
    if (data) {
      setUser({
        name: data.userName,
        email: data.email,
        avatar: "",
      });
    }
  }, [data]);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    return (
      words[0]?.[0]?.toUpperCase() +
      (words[1]?.[0]?.toUpperCase() || "")
    );
  };

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ACTIONS ================= */
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setMobileOpen(false);
  };

const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:9000/auth/logout",
      {},
      { withCredentials: true }
    );

    // ✅ IMPORTANT: explicitly remove auth user
    queryClient.setQueryData(["authUser"], null);
    queryClient.removeQueries({ queryKey: ["authUser"] });

    toast.success("Logout successful");

    navigate("/login", { replace: true });
  } catch (err) {
    toast.error("Logout failed");
  }
};


  return (
    <>
      {/* ================= TOPBAR ================= */}
      <header
        className={`
          fixed top-0 right-0 h-16
          bg-white dark:bg-gray-900
          border-b border-gray-200 dark:border-gray-700
          flex items-center justify-between
          px-3 sm:px-4 md:px-6
          z-20 transition-all duration-300
          left-0
          md:${sidebarExpanded ? "left-64" : "left-16"}
        `}
      >
        {/* Title */}
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
         <Link to="/"> MediaStack</Link>
        </h1>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          {/* ---------- MOBILE MENU BUTTON ---------- */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ☰
          </button>

          {/* ---------- DESKTOP ACTIONS ---------- */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              🌙
            </button>

            <button className="text-sm text-gray-600 dark:text-gray-300">
              Docs
            </button>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-medium"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.name)
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate text-white">{user?.email}</p>
                  </div>

                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-white">
                   <Link to="/profile"> Profile</Link>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-white">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DROPDOWN ================= */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg z-10">
          <button
            onClick={toggleDarkMode}
            className="w-full px-4 py-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🌙 Dark Mode
          </button>

          <button className="w-full px-4 py-4 text-left hover:bg-gray-100 text-white">
            Docs
          </button>

          <div className="px-4 py-3 border-t  text-white">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate text-white">{user?.email}</p>
          </div>

          <button className="w-full px-4 py-4 text-left hover:bg-gray-100  text-white">
            Profile
          </button>

          <button className="w-full px-4 py-4 text-left hover:bg-gray-100  text-white">
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-4 text-left text-red-600 hover:bg-red-50 "
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
