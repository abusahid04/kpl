"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Trophy, Users, Megaphone, ArrowRight,
  Star, CheckCircle2, ChevronRight, Sparkles
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function HomeClient({
  teams, announcements, sponsors, gallery,
  heroBadge, heroTitle, heroDescription,
  landingHeroImage, landingPlayerImage, landingStatsImage
}: HomeClientProps) {
  
  const heroImg    = landingHeroImage   || "/hero_stadium.png";
  const playerImg  = landingPlayerImage || "/player_batting.png";
  const statsImg   = landingStatsImage  || "/cricket_field.png";

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 z-10 isolate">
        {/* Background Image Mask */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-[#030303]/80 to-[#030303] z-10"></div>
          <img
            src={heroImg}
            alt="Stadium"
            className="w-full h-full object-cover object-top opacity-30 grayscale"
          />
        </div>

        <div className="relative z-20 text-center px-4 pb-24 max-w-6xl mx-auto flex flex-col items-center justify-center w-full min-h-[80vh]">
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center w-full">
            
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 inline-block">
                  {heroBadge}
                </span>
                <Sparkles size={14} className="text-indigo-400" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={fadeUp}
              className="font-heading text-5xl sm:text-7xl md:text-[7rem] font-black tracking-tight mb-8 leading-[1.05]"
            >
              {heroTitle.split(" ").map((word, i, arr) =>
                i >= arr.length - 2 ? (
                  <span key={i} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500"> {word}</span>
                ) : (
                  <span key={i} className="text-white drop-shadow-2xl">{word} </span>
                )
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
            >
              {heroDescription}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
              <Link
                to="/register?type=player"
                className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Register as Player <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/register?type=team"
                className="group w-full sm:w-auto px-10 py-5 bg-white/[0.08] backdrop-blur-xl border border-white/[0.2] text-white font-black rounded-2xl hover:bg-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                🏆 Register as Team
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 sm:bottom-10 z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
        >
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Scroll Down</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          QUICK STATS
      ══════════════════════════════════════════════ */}
      <section className="relative z-20 py-10 border-y border-white/[0.05] bg-[#050505]/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/[0.05]">
            {[
              { icon: MapPin, label: "Venue", value: "Khoraghat" },
              { icon: Calendar, label: "Schedule", value: "Nov 15" },
              { icon: Trophy, label: "Format", value: "Sixit Hard" },
              { icon: Users, label: "Teams", value: "8 Franchises" },
            ].map(({ icon: Icon, label, value }, idx) => (
              <div key={label} className={`flex items-center justify-center gap-4 py-4 ${idx % 2 === 0 ? 'pl-0' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                  <Icon size={22} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-base sm:text-lg font-black text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT KPL 
      ══════════════════════════════════════════════ */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-20"
          >
            {/* Image Composition */}
            <motion.div variants={fadeUp} className="flex-1 w-full relative">
              <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.1] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src={playerImg}
                  alt="Cricket Player in Action"
                  className="w-full h-auto object-contain rounded-3xl"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20 scale-90 sm:scale-100 origin-bottom-left">
                  <div className="bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                    <div className="flex flex-col">
                      <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Prize Pool</p>
                      <p className="text-2xl sm:text-4xl font-black text-white">₹40k<span className="text-blue-500">+</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={fadeUp} className="flex-1">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">About The League</span>
              </div>
              
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
                Where Local Cricket <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Meets the Big Stage</span>
              </h2>
              
              <p className="text-slate-400 leading-relaxed mb-10 text-lg font-light">
                Khoraghat Premier League is more than just a tournament — it's a festival of cricket.
                Bringing together the finest local talents, KPL provides a professional platform
                for players to showcase their skills in a high-octane, competitive environment.
              </p>
              
              <ul className="space-y-4 mb-12">
                {[
                  "Professional franchise-based structure",
                  "Transparent auction & bidding system",
                  "Equal opportunity for all local talent",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-4 text-slate-300 text-base font-medium bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-blue-400" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors group"
              >
                Read full rulebook <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ANNOUNCEMENTS
      ══════════════════════════════════════════════ */}
      {announcements.length > 0 && (
        <section className="py-24 relative z-10 bg-white/[0.01] border-y border-white/[0.05]">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="text-center mb-16">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white">
                  Latest <span className="text-blue-500">Updates</span>
                </h2>
              </motion.div>
              
              <div className="space-y-6">
                {announcements.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 border border-white/[0.08] hover:border-blue-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pl-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Megaphone size={18} className="text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          {item.isPinned && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-base leading-relaxed whitespace-pre-line">{item.content}</p>
                      </div>
                      <div className="shrink-0 text-slate-500 text-sm font-semibold bg-white/[0.03] px-4 py-2 rounded-xl">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
          FEATURED TEAMS
      ══════════════════════════════════════════════ */}
      {teams.length > 0 && (
        <section className="py-32 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-16">
                <div>
                  <h2 className="font-heading text-4xl md:text-5xl font-black text-white">
                    The <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Franchises</span>
                  </h2>
                </div>
                <Link to="/teams" className="px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-semibold transition-colors text-sm flex items-center gap-2">
                  View All Teams <ChevronRight size={16} />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.slice(0, 4).map((team) => (
                  <motion.div
                    key={team.id}
                    variants={fadeUp}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300 group"
                  >
                    <div className="h-48 relative flex items-center justify-center p-8 bg-black/40 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent z-10"></div>
                      <img src={statsImg} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-700" alt="" />
                      
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="relative z-20 w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform" />
                      ) : (
                        <span className="relative z-20 text-6xl font-black text-white/10">{team.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="p-6 relative z-20">
                      <h3 className="font-black text-white text-xl mb-2">{team.name}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6">{team.description || "Official KPL Franchise."}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Roster Size</span>
                        <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                          {team.players.length}
                        </span>
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
          SPONSORS
      ══════════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="py-20 bg-white/[0.01] border-t border-white/[0.05] relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">Trusted & Sponsored By</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target={sponsor.website ? "_blank" : "_self"}
                  className="w-32 h-16 relative grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                >
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="absolute inset-0 w-full h-full object-contain" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          CTA FOOTER
      ══════════════════════════════════════════════ */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-7xl font-black text-white mb-6">
            Ready for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Season 2?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            The stage is set. The crowds are waiting. Secure your spot in the most prestigious local tournament of the year.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Start Registration
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
