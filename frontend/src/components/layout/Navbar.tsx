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
    <>
      <nav className="sticky top-0 z-[60] bg-[#030303]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-sm transition-all">
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
                        <span className="text-white">{first}</span>
                        {rest && <span className="text-blue-500 text-lg font-semibold">{rest}</span>}
                      </span>
                    );
                  })()
                ) : (
                  <>
                    <span className="text-white">KPL</span>
                    <span className="text-blue-500 text-lg font-semibold">Season 2</span>
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
                    className="ml-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl text-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all shadow-md shadow-blue-900/20"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400 font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-blue-500/10 text-blue-400 font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === "/admin/login"
                    ? "bg-blue-500/10 text-blue-400 font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-[60]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-400 focus:outline-none p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] md:hidden"
            style={{ position: 'fixed' }}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-[#030303] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[9999] md:hidden flex flex-col border-l border-white/[0.08] overflow-hidden"
            style={{ position: 'fixed' }}
          >
            {/* Drawer Ambient Background */}
            <div className="absolute top-0 right-0 w-full h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.05] relative z-10">
              <span className="font-heading font-black text-xl text-white flex items-center gap-1.5">
                KPL <span className="text-blue-500 text-sm">Season 2</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2 relative z-10 no-scrollbar">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.name === "Register") {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-4 py-4 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl text-base transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] shadow-lg shadow-black/50"
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
                    className={`block px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20 translate-x-2"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03] hover:translate-x-2 border border-transparent"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer (Auth) */}
            <div className="p-6 border-t border-white/[0.05] relative z-10 bg-[#030303]/80 backdrop-blur-md">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-3 rounded-2xl bg-white/[0.05] text-white font-semibold text-sm hover:bg-white/[0.1] transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleSignOut(); }}
                    className="p-3 rounded-2xl bg-red-500/10 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-2xl bg-white/[0.05] text-slate-300 font-semibold text-sm hover:text-white hover:bg-white/[0.1] transition-all border border-white/[0.05]"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
