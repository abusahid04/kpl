import { Link, useLocation } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer({ settings }: { settings?: any }) {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  const siteName = settings?.site_name || "KPL Season 2";
  const siteDesc = settings?.site_description || "Where Local Cricket Comes Alive. Khoraghat Premier League Season 2 brings the best cricket action to Assam.";
  const address = settings?.contact_address || "Khoraghat Cricket Ground, Bilasipara, Assam";
  const phone = settings?.contact_phone || "+91 98765 43210";
  const email = settings?.contact_email || "info@kplseason2.com";
  const fbUrl = "#";
  const igUrl = "#";
  const twUrl = "#";
  const ytUrl = "";

  return (
    <footer className="bg-[#0F172A] mt-auto">
      {/* Top wave divider */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none" style={{ height: 40 }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-heading font-black text-2xl text-white flex items-center gap-2.5 mb-4">
              {settings?.logo_display_style !== "text_only" && settings?.site_logo ? (
                <img src={settings.site_logo} alt={siteName} className="h-8 w-auto object-contain rounded" />
              ) : (
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">K</span>
                </div>
              )}
              {settings?.logo_display_style !== "logo_only" && (
                settings?.site_name ? (
                  (() => {
                    const parts = settings.site_name.trim().split(" ");
                    const first = parts[0];
                    const rest = parts.slice(1).join(" ");
                    return (
                      <span>
                        <span className="text-white">{first}</span>
                        {rest && <span className="text-slate-400 text-lg font-semibold ml-1">{rest}</span>}
                      </span>
                    );
                  })()
                ) : (
                  <>KPL<span className="text-slate-400 text-lg font-semibold ml-1">S2</span></>
                )
              )}
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{siteDesc}</p>
            <div className="flex space-x-3">
              {[
                { href: fbUrl, Icon: FaFacebook },
                { href: igUrl, Icon: FaInstagram },
                { href: twUrl, Icon: FaTwitter },
                ...(ytUrl ? [{ href: ytUrl, Icon: FaYoutube }] : []),
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1E3A8A] hover:border-[#1E3A8A] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/about", label: "About Tournament" },
                { to: "/teams", label: "Teams & Squads" },
                { to: "/schedule", label: "Match Schedule" },
                { to: "/register", label: "Player Registration" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-[#1E3A8A] rounded-full group-hover:bg-[#F59E0B] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Information</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/rules", label: "Rules & Regulations" },
                { to: "/sponsors", label: "Sponsors" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact Us" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-[#1E3A8A] rounded-full group-hover:bg-[#F59E0B] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={16} className="text-[#F59E0B] shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-[#F59E0B] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>{settings?.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</p>
          <p>{settings?.footer_organized_by || "Organized by KPL Organizing Committee"}</p>
        </div>
      </div>
    </footer>
  );
}
