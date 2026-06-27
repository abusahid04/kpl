import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About KPL", href: "/about" },
  { name: "Teams", href: "/teams" },
  { name: "Schedule", href: "/schedule" },
  { name: "Gallery", href: "/gallery" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Contact", href: "/contact" },
  { name: "Register", href: "/register" },
];

export default function Navbar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("kpl_admin_token");

  if (pathname.startsWith("/admin")) return null;

  const handleSignOut = () => {
    localStorage.removeItem("kpl_admin_token");
    localStorage.removeItem("kpl_admin_user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-heading font-black text-2xl text-[#1E3A8A] flex items-center gap-2.5">
              {settings?.logo_display_style !== "text_only" && (
                settings?.site_logo ? (
                  <img src={settings.site_logo} alt={settings.site_name || "KPL"} className="h-9 w-auto object-contain rounded" />
                ) : (
                  <div className="w-9 h-9 bg-[#1E3A8A] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-base">
                      {(settings?.site_name || "KPL").trim().charAt(0)}
                    </span>
                  </div>
                )
              )}
              {settings?.logo_display_style !== "logo_only" && (
                settings?.site_name ? (
                  (() => {
                    const parts = settings.site_name.trim().split(" ");
                    const first = parts[0];
                    const rest = parts.slice(1).join(" ");
                    return (
                      <span className="flex items-center gap-1">
                        <span className="text-[#1E3A8A]">{first}</span>
                        {rest && <span className="text-slate-400 text-lg font-semibold">{rest}</span>}
                      </span>
                    );
                  })()
                ) : (
                  <>
                    <span className="text-[#1E3A8A]">KPL</span>
                    <span className="text-slate-400 text-lg font-semibold">Season 2</span>
                  </>
                )
              )}
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.name === "Register") {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="ml-4 px-5 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-full text-sm hover:bg-[#17306d] hover:scale-105 transition-all shadow-md shadow-blue-900/20"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-[#1E3A8A] font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-blue-50 text-[#1E3A8A] font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  pathname === "/admin/login"
                    ? "bg-blue-50 text-[#1E3A8A] font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#1E3A8A]"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-[#1E3A8A] focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.name === "Register") {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 bg-[#1E3A8A] text-white font-bold rounded-xl text-base transition-colors shadow-md"
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#1E3A8A] font-bold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#1E3A8A]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      pathname.startsWith("/admin")
                        ? "bg-blue-50 text-[#1E3A8A] font-bold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#1E3A8A]"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleSignOut(); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === "/admin/login"
                      ? "bg-blue-50 text-[#1E3A8A] font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-[#1E3A8A]"
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
