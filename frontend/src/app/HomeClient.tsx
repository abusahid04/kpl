"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Trophy, Users, Megaphone, ArrowRight,
  Star, CheckCircle2, ChevronRight
} from "lucide-react";

type Team = {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  players: any[];
};
type Announcement = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
};
type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};
type GalleryItem = {
  id: string;
  type: string;
  url: string;
  album: string | null;
};
interface HomeClientProps {
  teams: Team[];
  announcements: Announcement[];
  sponsors: Sponsor[];
  gallery: GalleryItem[];
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  landingHeroImage?: string;
  landingPlayerImage?: string;
  landingStatsImage?: string;
  landingTeamImage?: string;
  landingTrophyImage?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.13 } } };

export default function HomeClient({
  teams, announcements, sponsors, gallery,
  heroBadge, heroTitle, heroDescription,
  landingHeroImage, landingPlayerImage, landingStatsImage, landingTeamImage, landingTrophyImage
}: HomeClientProps) {
  // Use admin-uploaded images with fallback to generated defaults
  const heroImg    = landingHeroImage   || "/hero_stadium.png";
  const playerImg  = landingPlayerImage || "/player_batting.png";
  const statsImg   = landingStatsImage  || "/cricket_field.png";
  const teamImg    = landingTeamImage   || "/team_huddle.png";
  const trophyImg  = landingTrophyImage || "/trophy.png";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ══════════════════════════════════════════════
          HERO — full-bleed stadium photo + overlay text
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Full-bleed hero photo */}
        <img
          src={heroImg}
          alt="KPL Cricket Stadium"
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-white z-10" />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 py-1.5 px-5 rounded-2xl bg-white/5 border border-white/30 text-white text-xs font-bold mb-8 uppercase tracking-widest backdrop-blur-sm"
            >
              <Star size={11} className="fill-[#F59E0B] text-blue-400" />
              {heroBadge}
              <Star size={11} className="fill-[#F59E0B] text-blue-400" />
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="font-heading text-5xl sm:text-7xl md:text-[6rem] font-black text-white mb-6 leading-[1.0] drop-shadow-2xl"
            >
              {heroTitle.split(" ").map((word, i, arr) =>
                i >= arr.length - 2 ? (
                  <span key={i} className="text-blue-400"> {word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              {heroDescription}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register?type=player"
                className="px-9 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:bg-blue-500/100 transition-all shadow-2xl  hover:-translate-y-1 text-sm md:text-base tracking-wide"
              >
                🏏 Register as Player
              </Link>
              <Link
                to="/register?type=team"
                className="px-9 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl border border-white/30 hover:bg-[#0a0a0a]/20 transition-all text-sm md:text-base hover:-translate-y-1"
              >
                🏆 Register as Team
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-10 z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <div className="w-5 h-8 border-2 border-white/50 rounded-2xl flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#0a0a0a] rounded-2xl animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          QUICK STATS — floating cards
      ══════════════════════════════════════════════ */}
      <section className="relative z-20 -mt-12 pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { icon: MapPin, label: "Venue", value: "Khoraghat Ground" },
              { icon: Calendar, label: "Schedule", value: "Nov 15 Onwards" },
              { icon: Trophy, label: "Format", value: "Sixit Hard Tennis" },
              { icon: Users, label: "Teams", value: "8 Franchises" },
            ].map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 flex flex-col items-center text-center shadow-xl shadow-2xl shadow-black/50 border border-white/[0.08] hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3 shrink-0">
                  <Icon size={20} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white">{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT KPL — Split layout with player photo
      ══════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Photo side */}
            <motion.div variants={fadeUp} className="flex-1 relative">
              {/* Main action photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-2xl shadow-black/50">
                <img
                  src={playerImg}
                  alt="Cricket Player in Action"
                  className="w-full h-[480px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/20 to-transparent" />
              </div>
              {/* Floating trophy badge */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-xl p-4 flex items-center gap-3 border border-white/[0.08] w-52">
                <img src={trophyImg} alt="Trophy" className="w-14 h-14 object-contain" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Prize Pool</p>
                  <p className="text-xl font-black text-blue-500">₹1 Lakh+</p>
                </div>
              </div>
              {/* Floating field chip */}
              <div className="absolute -top-5 -left-5 lg:-left-8 bg-[#1E3A8A] rounded-xl shadow-lg px-4 py-3 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Season</p>
                <p className="text-2xl font-black leading-none">2</p>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div variants={fadeUp} className="flex-1 mt-8 lg:mt-0">
              <span className="inline-block text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 bg-blue-500/10 px-4 py-1.5 rounded-2xl border border-blue-500/20">
                About the League
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Where Local Cricket <br />
                <span className="text-blue-500">Meets the Big Stage</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 text-base">
                Khoraghat Premier League is more than just a tournament — it's a festival of cricket.
                Bringing together the finest local talents, KPL provides a professional platform
                for players to showcase their skills in a high-octane, competitive environment.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "Professional franchise-based structure",
                  "Transparent auction & bidding system",
                  "Equal opportunity for all local talent",
                  "Organized by experienced committee",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <CheckCircle2 size={17} className="text-blue-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link
                  to="/register?type=player"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E3A8A] text-white font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 text-sm"
                >
                  🏏 Player Registration <ArrowRight size={15} />
                </Link>
                <Link
                  to="/register?type=team"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0a0a0a] text-blue-500 font-bold rounded-2xl border border-white/10 bg-white/5 hover:bg-blue-500/10 transition-all text-sm hover:-translate-y-0.5"
                >
                  🏆 Team Registration <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BANNER — field image background
      ══════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <img
          src={statsImg}
          alt="Cricket Field"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0F172A]/75 backdrop-blur-sm" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "200+", label: "Registered Players" },
              { value: "8", label: "Franchise Teams" },
              { value: "30+", label: "Total Matches" },
              { value: "₹1L+", label: "Prize Pool" },
            ].map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <p className="text-4xl md:text-5xl font-black text-blue-400 mb-2 drop-shadow">{value}</p>
                <p className="text-sm font-semibold text-white/70 uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ANNOUNCEMENTS
      ══════════════════════════════════════════════ */}
      {announcements.length > 0 && (
        <section className="py-24 bg-transparent">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <span className="inline-block text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-2xl border border-blue-500/20">
                  News & Updates
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-black text-white">
                  Latest <span className="text-blue-500">Announcements</span>
                </h2>
              </motion.div>
              <div className="space-y-4">
                {announcements.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 border border-white/[0.08] shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1E3A8A] to-[#3B5FC0] rounded-l-2xl" />
                    {item.isPinned && (
                      <span className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-2xl border border-blue-500/20 uppercase tracking-wider">
                        📌 Pinned
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2 ml-3">
                      <Megaphone size={17} className="text-blue-500 shrink-0" />
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm whitespace-pre-line mb-3 ml-3">{item.content}</p>
                    <span className="text-xs text-slate-400 font-medium ml-3">
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          FEATURED TEAMS
      ══════════════════════════════════════════════ */}
      {teams.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="flex justify-between items-end mb-12">
                <div>
                  <span className="inline-block text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-2xl border border-blue-500/20">
                    Competing Franchises
                  </span>
                  <h2 className="font-heading text-3xl md:text-5xl font-black text-white">
                    Featured <span className="text-blue-500">Teams</span>
                  </h2>
                </div>
                <Link to="/teams" className="text-blue-500 hover:text-blue-800 font-semibold flex items-center gap-1 text-sm whitespace-nowrap">
                  View All <ChevronRight size={16} />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    variants={fadeUp}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-md shadow-2xl shadow-black/50 border border-white/[0.08] hover:shadow-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:-translate-y-2 transition-all group"
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
                      {/* background field subtle overlay */}
                      <img
                        src={statsImg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                      />
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="relative z-10 w-full h-full object-contain p-4"
                        />
                      ) : (
                        <span className="relative z-10 text-6xl font-black text-white/20">
                          {team.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-white text-lg mb-1">{team.name}</h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mb-4">{team.description || "KPL elite franchise."}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
                        <span className="text-xs text-slate-400 font-medium">Squad</span>
                        <span className="text-sm font-black text-blue-500">{team.players.length} Players</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════
          GALLERY PREVIEW
      ══════════════════════════════════════════════ */}
      {gallery.length > 0 && (
        <section className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="flex justify-between items-end mb-12">
                <div>
                  <span className="inline-block text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-2xl border border-blue-500/20">
                    Photo Gallery
                  </span>
                  <h2 className="font-heading text-3xl md:text-5xl font-black text-white">
                    Recent <span className="text-blue-500">Highlights</span>
                  </h2>
                </div>
                <Link to="/gallery" className="text-blue-500 hover:text-blue-800 font-semibold flex items-center gap-1 text-sm whitespace-nowrap">
                  View Gallery <ChevronRight size={16} />
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {gallery.map((item, i) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="rounded-xl overflow-hidden aspect-square relative group cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all"
                  >
                    <img
                      src={item.url}
                      alt="Gallery"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SPONSORS
      ══════════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="mb-12">
                <span className="inline-block text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-2xl border border-blue-500/20">
                  Supported By
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-black text-white">
                  Our Proud <span className="text-blue-500">Sponsors</span>
                </h2>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website || "#"}
                    target={sponsor.website ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="w-36 h-20 bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4 flex items-center justify-center hover:border-blue-300 hover:shadow-md transition-all filter grayscale hover:grayscale-0"
                  >
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          CTA FOOTER BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1e4db8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/hero_stadium.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Play in <span className="text-blue-400">KPL Season 2?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Don't miss your chance to be part of the biggest local cricket event. Register today and show the world what you've got.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:bg-blue-500/100 transition-all shadow-xl  hover:-translate-y-1 text-base"
              >
                Register as Player
              </Link>
              <Link
                to="/about"
                className="px-10 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/20 hover:bg-[#0a0a0a]/20 transition-all text-base hover:-translate-y-1"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
