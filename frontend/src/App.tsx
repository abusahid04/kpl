import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { Calendar, MapPin, Trophy, Users, Megaphone, ArrowRight, LayoutDashboard, User, Image, Heart, Settings, Plus, Trash2, Edit, GraduationCap, BookOpen, Newspaper, Briefcase, LogOut, Sun, Moon, Shield, Activity, FileText, Mail, Phone, Menu, X, Eye, IndianRupee, Coins, TrendingUp, Check } from "lucide-react";
import HomeClient from "./app/HomeClient";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { apiFetch } from "./lib/api";

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("ErrorBoundary caught an error", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-500 bg-red-50"><h2>Something went wrong.</h2><pre>{this.state.error?.message}</pre></div>;
    }
    return this.props.children;
  }
}


// 1. Home Page wrapper
function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch("/home")
      .then((res) => {
        setData(res);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#030303] overflow-hidden relative flex flex-col items-center justify-center pt-24 pb-12">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse"></div>
      
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center gap-8 z-10">
        <div className="w-48 h-8 bg-white/[0.05] rounded-full animate-pulse border border-white/[0.05]"></div>
        <div className="w-full max-w-2xl h-24 sm:h-32 bg-white/[0.05] rounded-[2rem] animate-pulse border border-white/[0.05]"></div>
        <div className="w-3/4 max-w-xl h-4 bg-white/[0.05] rounded-full animate-pulse"></div>
        <div className="w-1/2 max-w-md h-4 bg-white/[0.05] rounded-full animate-pulse"></div>
        
        <div className="flex gap-4 mt-8 w-full justify-center">
          <div className="w-48 h-14 bg-white/[0.05] rounded-2xl animate-pulse border border-white/[0.05]"></div>
          <div className="w-48 h-14 bg-white/[0.05] rounded-2xl animate-pulse border border-white/[0.05]"></div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center text-destructive">Error: {error}</div>;

  return (
    <HomeClient
      teams={data.teams || []}
      announcements={data.announcements || []}
      sponsors={data.sponsors || []}
      gallery={data.gallery || []}
      heroBadge={data.heroBadge}
      heroTitle={data.heroTitle}
      heroDescription={data.heroDescription}
      landingHeroImage={data.landingHeroImage}
      landingPlayerImage={data.landingPlayerImage}
      landingStatsImage={data.landingStatsImage}
      landingTeamImage={data.landingTeamImage}
      landingTrophyImage={data.landingTrophyImage}
    />
  );
}

// 2. Teams list and details page
function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/teams")
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Loading Teams...</div>;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white text-center mb-12">
        KPL Franchise <span className="text-primary">Teams</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teams.map((team) => (
          <div key={team.id} className="glass-card overflow-hidden hover:scale-[1.02] transition-all p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 overflow-hidden">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">{team.name.charAt(0)}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{team.name}</h2>
            <p className="text-muted-foreground text-sm mb-4">{team.ownerName ? `Owner: ${team.ownerName}` : "Franchise Team"}</p>
            <p className="text-muted-foreground text-xs line-clamp-3 mb-6">{team.description}</p>
            <div className="mt-auto pt-4 border-t border-white/5 w-full">
              <span className="text-sm font-bold text-primary">{team.players?.length || 0} Registered Players</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Match Schedule page
function Schedule() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/matches")
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Loading Schedule...</div>;

  return (
    <div className="py-24 max-w-4xl mx-auto px-4">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white text-center mb-12">
        Match <span className="text-primary">Schedule</span>
      </h1>
      {matches.length === 0 ? (
        <p className="text-center text-muted-foreground">No matches scheduled yet.</p>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-primary">
              <div className="flex items-center gap-4 w-full md:w-1/3 justify-end">
                <span className="font-bold text-white text-lg">{match.team1Name}</span>
                <img src={match.team1Logo || "https://placehold.co/50"} className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="text-center bg-white/5 px-4 py-2 rounded-xl border border-white/10 min-w-[120px]">
                <span className="text-xs text-muted-foreground block">{new Date(match.date).toLocaleDateString()}</span>
                <span className="font-bold text-primary text-sm block my-1">{match.time}</span>
                <span className="text-[10px] text-white/50 block">{match.venue}</span>
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <img src={match.team2Logo || "https://placehold.co/50"} className="w-12 h-12 rounded-full object-cover" />
                <span className="font-bold text-white text-lg">{match.team2Name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 4. Gallery page
function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/gallery")
      .then(setGallery)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Loading Gallery...</div>;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white text-center mb-12">
        KPL <span className="text-primary">Gallery</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden aspect-square relative group cursor-pointer">
            <img src={item.url} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Sponsors page
function Sponsors() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/sponsors")
      .then(sponsors => setSponsors(sponsors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Loading Sponsors...</div>;

  return (
    <div className="py-24 max-w-5xl mx-auto px-4 text-center">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white mb-12">
        Our <span className="text-primary">Sponsors</span>
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsors.map((sponsor) => (
          <a key={sponsor.id} href={sponsor.website || "#"} target="_blank" rel="noopener noreferrer" className="w-48 h-28 bg-white/5 rounded-xl border border-white/10 p-4 flex items-center justify-center hover:border-primary transition-all">
            <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
          </a>
        ))}
      </div>
    </div>
  );
}

// 6. Contact page
function Contact() {
  return (
    <div className="py-24 max-w-xl mx-auto px-4 text-center">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white mb-6">
        Contact <span className="text-primary">KPL</span>
      </h1>
      <p className="text-muted-foreground mb-12">Have any queries or sponsorship requests? Reach out to us!</p>
      <div className="glass-card p-8 text-left space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
          <p className="text-lg text-white font-semibold">info@kplcricket.com</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Phone Number</label>
          <p className="text-lg text-white font-semibold">+91 98765 43210</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Tournament Venue</label>
          <p className="text-lg text-white font-semibold">Khoraghat Cricket Ground, Bilasipara, Assam</p>
        </div>
      </div>
    </div>
  );
}

// 7. Player Registration form
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Register() {
  const location = useLocation();
  const urlType = new URLSearchParams(location.search).get("type");
  const [registerType, setRegisterType] = useState<"player" | "team">(urlType === "team" ? "team" : "player");
  
  useEffect(() => {
    if (urlType === "team" || urlType === "player") {
      setRegisterType(urlType);
    }
  }, [urlType]);
  
  const [formData, setFormData] = useState<any>({});

  const [files, setFiles] = useState<Record<string, File>>({});
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ id: string, type: string, name: string, paymentId: string } | null>(null);

  const schemaKey = registerType === "player" ? "player_form_schema" : "team_form_schema";
  const paymentTypeKey = registerType === "player" ? "player_form_payment_type" : "team_form_payment_type";
  const paymentFeeKey = registerType === "player" ? "player_form_payment_fee" : "team_form_payment_fee";

  const paymentType = settings ? (settings[paymentTypeKey] || "free") : "free";
  const paymentFee = settings ? (settings[paymentFeeKey] || "0") : "0";

  let schema: any[] = [];
  if (settings) {
    try {
      schema = settings[schemaKey] ? JSON.parse(settings[schemaKey]) : [];
    } catch (e) { schema = []; }
  }

  if (!Array.isArray(schema) || schema.length === 0) {
    if (registerType === "player") {
      schema = [
        { id: "name", label: "Player Full Name", type: "text", required: true },
        { id: "fatherName", label: "Father's Name", type: "text", required: true },
        { id: "mobile", label: "Mobile Number", type: "tel", required: true },
        { id: "email", label: "Email", type: "email", required: false },
        { id: "dob", label: "Date of Birth", type: "date", required: true },
        { id: "playingRole", label: "Playing Role", type: "select", required: true, options: ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"] },
        { id: "battingStyle", label: "Batting Style", type: "select", required: false, options: ["Right Hand", "Left Hand", "None"] },
        { id: "bowlingStyle", label: "Bowling Style", type: "text", required: false },
        { id: "address", label: "Present Address", type: "textarea", required: true },
        { id: "isWicketKeeper", label: "Are you a Wicket Keeper?", type: "checkbox", required: false },
        { id: "photo", label: "Passport Size Photo", type: "file", required: true },
        { id: "document", label: "Aadhar / Document (PDF/Image)", type: "file", required: true }
      ];
    } else {
      schema = [
        { id: "name", label: "Franchise/Team Name", type: "text", required: true },
        { id: "ownerName", label: "Owner Name", type: "text", required: true },
        { id: "ownerMobile", label: "Owner Contact Number", type: "tel", required: true },
        { id: "description", label: "Team Description", type: "textarea", required: false },
        { id: "logo", label: "Team Logo", type: "file", required: false }
      ];
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://kpl.devkayy.in/api/settings.php")
      .then(res => res.json())
      .then(res => setSettings(res))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const initialForm: any = {};
    schema.forEach((f: any) => {
      if (f.type === "checkbox") initialForm[f.id] = false;
      else if (f.type !== "file") initialForm[f.id] = "";
    });
    setFormData(initialForm);
    setFiles({});
    setMessage("");
    setError("");
  }, [registerType, settings]);

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) setFiles(prev => ({ ...prev, [fieldId]: file }));
    else setFiles(prev => { const c = { ...prev }; delete c[fieldId]; return c; });
  };

  const submitRegistration = async (gatewayPaymentId: string = "") => {
    const data = new FormData();
    data.append("register_type", registerType);
    if (gatewayPaymentId) data.append("paymentId", gatewayPaymentId);
    Object.entries(formData).forEach(([key, val]) => data.append(key, String(val)));
    Object.entries(files).forEach(([key, file]) => data.append(key, file as File));
    try {
      const res = await fetch("https://kpl.devkayy.in/api/register_custom.php", { method: "POST", body: data });
      const result = await res.json();
      if (res.ok) {
        setReceipt({
          id: result.id,
          type: registerType,
          name: formData.name || formData.ownerName || "Applicant",
          paymentId: gatewayPaymentId || "N/A"
        });
        setMessage(result.message || "Registration submitted successfully! Status: PENDING review.");
        const resetForm: any = {};
        schema.forEach((f: any) => {
          if (f.type === "checkbox") resetForm[f.id] = false;
          else if (f.type !== "file") resetForm[f.id] = "";
        });
        setFormData(resetForm);
        setFiles({});
      } else {
        setError(result.error || "Failed to submit registration");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const gatewayEnabled = settings?.payment_gateway_enabled == "1" || settings?.payment_gateway_enabled === true || settings?.payment_gateway_enabled === "true";
    const useRazorpay = settings?.payment_gateway === "razorpay";
    if (paymentType === "paid" && gatewayEnabled && useRazorpay) {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay Payment Gateway. Check your internet connection.");
        setLoading(false);
        return;
      }
      try {
        if (!settings.payment_gateway_key) {
          setError("Payment gateway is enabled but API key is missing. Please contact admin.");
          setLoading(false);
          return;
        }
        const options = {
          key: settings.payment_gateway_key,
          amount: Number(paymentFee) * 100,
          currency: "INR",
          name: settings.site_name || "KPL",
          description: `${registerType === "player" ? "Player" : "Team"} Registration Fee`,
          handler: function (response: any) { submitRegistration(response.razorpay_payment_id); },
          prefill: { name: formData.name || "", email: formData.email || "", contact: formData.mobile || formData.ownerMobile || "" },
          theme: { color: "#1E3A8A" },
          modal: { ondismiss: function () { setLoading(false); } }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function(response: any) {
          setError(response.error?.description || "Payment failed");
          setLoading(false);
        });
        rzp.open();
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment gateway. Please contact admin.");
        setLoading(false);
      }
    } else {
      submitRegistration();
    }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 bg-white outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-[#1E3A8A] uppercase tracking-widest mb-3 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            KPL Season 2
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#0F172A] mb-3">
            {registerType === "player" ? "Player" : "Team"}{" "}
            <span className="text-[#1E3A8A]">Registration</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {settings?.site_description || "Submit your details to register for the tournament."}
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setRegisterType("player")}
            className={`px-7 py-3 rounded-full font-bold text-sm transition-all border-2 ${
              registerType === "player"
                ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-lg shadow-blue-900/20"
                : "bg-white border-slate-200 text-slate-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            }`}
          >
            🏏 Player Registration
          </button>
          <button
            onClick={() => setRegisterType("team")}
            className={`px-7 py-3 rounded-full font-bold text-sm transition-all border-2 ${
              registerType === "team"
                ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-lg shadow-blue-900/20"
                : "bg-white border-slate-200 text-slate-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            }`}
          >
            🏆 Team Registration
          </button>
        </div>

        {/* Success/Error messages */}
        {message && !receipt && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl mb-6 text-sm font-medium">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-6 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        {/* Receipt or Form */}
        {receipt ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Shield size={100} />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md relative z-10">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-white font-black text-2xl relative z-10">Registration Successful!</h2>
              <p className="text-emerald-50 text-sm mt-2 relative z-10">Your application has been received and is pending review.</p>
            </div>
            <div className="p-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold text-sm">Applicant Name</span>
                  <span className="text-slate-900 font-black text-right">{receipt.name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold text-sm">Registration Type</span>
                  <span className="text-slate-900 font-bold capitalize text-right">{receipt.type}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold text-sm">Player / Team ID</span>
                  <span className="text-[#1E3A8A] font-black text-right bg-blue-50 px-3 py-1 rounded-lg">KPL-{receipt.type === 'player' ? 'PLY' : 'TEAM'}-{receipt.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold text-sm">Transaction ID</span>
                  <span className="text-slate-900 font-mono text-xs font-bold bg-slate-200 px-3 py-1 rounded-lg break-all text-right max-w-[200px]">{receipt.paymentId}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={18} /> Print Receipt
                </button>
                <Link 
                  to="/"
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
            {/* Form Header */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] px-8 py-6">
            <h2 className="text-white font-black text-xl">
              {registerType === "player" ? "🏏 Player Details" : "🏆 Team / Franchise Details"}
            </h2>
            <p className="text-white/60 text-xs mt-1">
              {registerType === "player"
                ? "Fill in your personal and cricket details below"
                : "Fill in your franchise and owner details below"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schema.map((field: any) => {
                if (field.type === "textarea") {
                  return (
                    <div key={field.id} className="md:col-span-2">
                      <label className={labelCls}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                      <textarea
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={`${inputCls} h-24 resize-none`}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    </div>
                  );
                }
                if (field.type === "select") {
                  return (
                    <div key={field.id}>
                      <label className={labelCls}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                      <select
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={inputCls}
                      >
                        <option value="">Select {field.label}</option>
                        {(Array.isArray(field.options) ? field.options : (typeof field.options === 'string' ? field.options.split(',').map((s:string)=>s.trim()) : [])).map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (field.type === "checkbox") {
                  return (
                    <div key={field.id} className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id={field.id}
                        checked={!!formData[field.id]}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.checked })}
                        className="w-5 h-5 accent-[#1E3A8A] cursor-pointer"
                      />
                      <label htmlFor={field.id} className="text-sm font-semibold text-slate-700 cursor-pointer">{field.label}</label>
                    </div>
                  );
                }
                if (field.type === "file") {
                  return (
                    <div key={field.id}>
                      <label className={labelCls}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:border-[#1E3A8A] transition-colors">
                        <input
                          type="file"
                          required={field.required}
                          accept={field.id === "document" || field.id === "logo" ? "image/*,application/pdf" : "image/*"}
                          onChange={e => handleFileChange(field.id, e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A] file:text-white hover:file:bg-[#17306d] cursor-pointer"
                        />
                        {files[field.id] && (
                          <p className="text-xs text-emerald-600 font-semibold mt-1.5">✅ {files[field.id].name}</p>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={field.id}>
                    <label className={labelCls}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                    <input
                      type={field.type}
                      required={field.required}
                      pattern={field.type === "tel" ? "[0-9]{10}" : undefined}
                      title={field.type === "tel" ? "Please enter a valid 10-digit mobile number" : undefined}
                      value={formData[field.id] || ""}
                      onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                      className={inputCls}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                required
                checked={!!formData.acceptTerms}
                onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-5 h-5 accent-[#1E3A8A] cursor-pointer shrink-0"
              />
              <label htmlFor="acceptTerms" className="text-sm font-semibold text-slate-700 cursor-pointer">
                I accept all the <Link to="/rules" className="text-[#1E3A8A] underline" target="_blank">Rules, Terms and Conditions</Link> of the tournament.
              </label>
            </div>

            {/* Payment Info Box */}
            {paymentType === "paid" && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm space-y-3">
                <h3 className="font-black text-base text-amber-700 flex items-center gap-2">
                  💳 Registration Entry Fee: ₹{paymentFee} /-
                </h3>
                {settings?.payment_gateway_enabled === "1" ? (
                  <p className="text-xs text-amber-600">Secure online payment is active. You will be redirected to the payment gateway after submitting.</p>
                ) : (
                  <>
                    <p className="text-xs text-amber-600">Please transfer the entry fee to the account details below:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-amber-200">
                      {settings?.payment_upi_id && (
                        <div className="bg-white rounded-lg p-2.5 border border-amber-200">
                          <span className="text-amber-500 font-semibold block">UPI ID</span>
                          <strong className="text-slate-800 font-mono">{settings.payment_upi_id}</strong>
                        </div>
                      )}
                      {settings?.payment_account_no && (
                        <>
                          <div className="bg-white rounded-lg p-2.5 border border-amber-200">
                            <span className="text-amber-500 font-semibold block">Account Name</span>
                            <strong className="text-slate-800">{settings.payment_account_name}</strong>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-amber-200">
                            <span className="text-amber-500 font-semibold block">Account Number</span>
                            <strong className="text-slate-800 font-mono">{settings.payment_account_no}</strong>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-amber-200">
                            <span className="text-amber-500 font-semibold block">IFSC Code</span>
                            <strong className="text-slate-800 font-mono">{settings.payment_ifsc}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
                {settings?.payment_instructions && (
                  <div className="text-xs text-amber-600 pt-3 border-t border-amber-200 whitespace-pre-wrap">
                    {settings.payment_instructions}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1E3A8A] text-white font-black rounded-xl text-center hover:bg-[#17306d] transition-all shadow-lg shadow-blue-900/20 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : paymentType === "paid" ? (
                `Submit & Pay ₹${paymentFee}`
              ) : (
                "Submit Application →"
              )}
            </button>
          </form>
        </div>
        )}

      </div>
    </div>
  );
}

// 8. Admin Login page
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiFetch("/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (result.success) {
        localStorage.setItem("kpl_admin_token", result.token);
        localStorage.setItem("kpl_admin_user", JSON.stringify(result.user));
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden pb-32">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/50 backdrop-blur-md">
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="font-heading text-4xl font-black text-white mb-2">
            Admin <span className="text-blue-500">Portal</span>
          </h1>
          <p className="text-slate-400 text-sm">Sign in to manage KPL Season 2</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle glow edge */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors flex items-center justify-center">
                    {/* Minimal lock icon substitute since Lock isn't imported, using Shield/Activity as fallback or just CSS */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl text-center hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Authenticating...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
          </form>
        </div>
        
        {/* Footer subtle text */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Secured by Antigravity <br /> KPL Admin Dashboard
        </p>
      </div>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isAdminDark?: boolean;
  maxWidthClass?: string;
}

function Modal({ isOpen, onClose, title, children, isAdminDark, maxWidthClass }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      ></div>
      <div className={`relative w-full ${maxWidthClass || "max-w-xl"} rounded-2xl border p-6 shadow-2xl transition-all duration-300 max-h-[95vh] overflow-y-auto ${
        isAdminDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <Plus className="rotate-45" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 9. Admin Dashboard page
function AdminDashboard() {
  const adminUser = JSON.parse(localStorage.getItem("kpl_admin_user") || "{}");
  const isSuperAdmin = adminUser.roleName?.toLowerCase().includes("super") || adminUser.username === "admin" || adminUser.username === "sahid";
  const adminName = adminUser.name || adminUser.username || "Abu Sahid";
  const adminEmail = adminUser.username ? `${adminUser.username}@kpl.com` : "abusahid8586@gmail.com";
  const adminInitials = adminName.split(" ").map((n: any) => n[0]).join("").substring(0, 2).toUpperCase() || "AS";

  const [activeTab, setActiveTab] = useState("overview");
  const [isAdminDark, setIsAdminDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Form states
  const [teamForm, setTeamForm] = useState({ name: "", ownerName: "", description: "", logoUrl: "", advance_payment: "0", remaining_payment: "0", total_payment: "0" });
  const [teamLogoFile, setTeamLogoFile] = useState<File | null>(null);
  const [matchForm, setMatchForm] = useState({ date: "", time: "", venue: "", team1Id: "", team2Id: "" });
  const [sponsorForm, setSponsorForm] = useState({ name: "", logoUrl: "", website: "" });
  const [sponsorLogoFile, setSponsorLogoFile] = useState<File | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "", isPinned: false });
  const [galleryForm, setGalleryForm] = useState({ type: "IMAGE", url: "", thumbnail: "", album: "" });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [selectedViewPlayer, setSelectedViewPlayer] = useState<any | null>(null);
  const [fullPhotoUrl, setFullPhotoUrl] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [adminSubTab, setAdminSubTab] = useState("admins");

  // Player search and filter states
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [playerTeamFilter, setPlayerTeamFilter] = useState("all");
  const [playerRoleFilter, setPlayerRoleFilter] = useState("all");
  const [playerPaymentFilter, setPlayerPaymentFilter] = useState("all");

  // Bulk transfer states
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [bulkTransferTeamId, setBulkTransferTeamId] = useState("");
  const [isBulkTransferring, setIsBulkTransferring] = useState(false);

  const filteredPlayers = players.filter((player) => {
    const query = playerSearchQuery.toLowerCase().trim();
    const nameMatch = player.name?.toLowerCase().includes(query);
    const mobileMatch = player.mobile?.toLowerCase().includes(query);
    const roleMatch = player.playingRole?.toLowerCase().includes(query);
    const teamNameMatch = teams.find((t: any) => t.id === player.teamId)?.name?.toLowerCase().includes(query);
    const matchSearch = !query || nameMatch || mobileMatch || roleMatch || teamNameMatch;

    let matchTeam = true;
    if (playerTeamFilter === "none") {
      matchTeam = !player.teamId;
    } else if (playerTeamFilter !== "all") {
      matchTeam = player.teamId === playerTeamFilter;
    }

    let matchRole = true;
    if (playerRoleFilter !== "all") {
      matchRole = player.playingRole === playerRoleFilter;
    }

    let matchPayment = true;
    if (playerPaymentFilter === "paid") {
      matchPayment = !!player.paymentId;
    } else if (playerPaymentFilter === "free") {
      matchPayment = !player.paymentId;
    }

    return matchSearch && matchTeam && matchRole && matchPayment;
  });
  const [settingsSubTab, setSettingsSubTab] = useState("site");
  const [formBuilderType, setFormBuilderType] = useState("player");
  const [adminForm, setAdminForm] = useState({ username: "", password: "", name: "", roleId: "", email: "", phone: "" });
  const [profileForm, setProfileForm] = useState({
    name: adminUser.name || "",
    email: adminUser.email || (adminUser.username ? `${adminUser.username}@kpl.com` : ""),
    phone: adminUser.phone || "",
    password: ""
  });
  const [roleForm, setRoleForm] = useState({ name: "", permissions: "" });
  const [playerForm, setPlayerForm] = useState({
    name: "",
    fatherName: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
    playingRole: "Batsman",
    battingStyle: "Right Hand",
    bowlingStyle: "None",
    isWicketKeeper: false
  });
  const [playerPhotoFile, setPlayerPhotoFile] = useState<File | null>(null);
  const [playerDocFile, setPlayerDocFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [landingHeroFile, setLandingHeroFile] = useState<File | null>(null);
  const [landingPlayerFile, setLandingPlayerFile] = useState<File | null>(null);
  const [landingStatsFile, setLandingStatsFile] = useState<File | null>(null);
  const [landingTeamFile, setLandingTeamFile] = useState<File | null>(null);
  const [landingTrophyFile, setLandingTrophyFile] = useState<File | null>(null);
  const [settingsForm, setSettingsForm] = useState<any>({
    hero_badge: "",
    hero_title: "",
    hero_description: "",
    site_name: "",
    site_description: "",
    site_logo: "",
    site_favicon: "",
    site_title: "",
    contact_address: "",
    contact_phone: "",
    contact_email: "",
    footer_copyright: "",
    footer_organized_by: "",
    logo_display_style: "logo_text",
    player_form_schema: [],
    player_form_payment_type: "free",
    player_form_payment_fee: "0",
    team_form_schema: [],
    team_form_payment_type: "free",
    team_form_payment_fee: "0",
    payment_player_fee: "",
    payment_team_fee: "",
    payment_upi_id: "",
    payment_account_name: "",
    payment_account_no: "",
    payment_ifsc: "",
    payment_instructions: "",
    payment_gateway: "",
    payment_gateway_key: "",
    payment_gateway_secret: "",
    payment_gateway_webhook: "",
    payment_gateway_enabled: "0",
    // Landing page images
    landing_hero_image: "",
    landing_player_image: "",
    landing_stats_image: "",
    landing_team_image: "",
    landing_trophy_image: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refreshData = () => {
    apiFetch("/admin/stats").then(setStats).catch(console.error);
    apiFetch("/admin/players").then(setPlayers).catch(console.error);
    apiFetch("/teams").then(setTeams).catch(console.error);
    apiFetch("/matches").then(setMatches).catch(console.error);
    apiFetch("/admin/sponsors").then(setsponsors => setSponsors(setsponsors || [])).catch(console.error);
    apiFetch("/announcements").then(setAnnouncements).catch(console.error);
    apiFetch("/gallery").then(setGallery).catch(console.error);
    apiFetch("/admin/admins").then(setAdmins).catch(console.error);
    apiFetch("/admin/roles").then(setRoles).catch(console.error);
    
    apiFetch("/admin/settings").then((res: any) => {
      setSettingsForm((prev: any) => {
        let schema = [];
        try {
          schema = res.player_form_schema ? JSON.parse(res.player_form_schema) : [];
        } catch (e) {
          schema = [];
        }
        if (!Array.isArray(schema) || schema.length === 0) {
          schema = [
            { id: "name", label: "Player Full Name", type: "text", required: true },
            { id: "fatherName", label: "Father's Name", type: "text", required: true },
            { id: "mobile", label: "Mobile Number", type: "tel", required: true },
            { id: "email", label: "Email", type: "email", required: false },
            { id: "dob", label: "Date of Birth", type: "date", required: true },
            { id: "playingRole", label: "Playing Role", type: "select", required: true, options: ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"] },
            { id: "battingStyle", label: "Batting Style", type: "select", required: false, options: ["Right Hand", "Left Hand", "None"] },
            { id: "bowlingStyle", label: "Bowling Style", type: "text", required: false },
            { id: "address", label: "Present Address", type: "textarea", required: true },
            { id: "isWicketKeeper", label: "Are you a Wicket Keeper?", type: "checkbox", required: false },
            { id: "photo", label: "Passport Size Photo", type: "file", required: true },
            { id: "document", label: "Aadhar / Document (PDF/Image)", type: "file", required: true }
          ];
        }

        let teamSchema = [];
        try {
          teamSchema = res.team_form_schema ? JSON.parse(res.team_form_schema) : [];
        } catch (e) {
          teamSchema = [];
        }
        if (!Array.isArray(teamSchema) || teamSchema.length === 0) {
          teamSchema = [
            { id: "name", label: "Franchise/Team Name", type: "text", required: true },
            { id: "ownerName", label: "Owner Name", type: "text", required: true },
            { id: "ownerMobile", label: "Owner Contact Number", type: "tel", required: true },
            { id: "description", label: "Team Description", type: "textarea", required: false },
            { id: "logo", label: "Team Logo", type: "file", required: false }
          ];
        }

        return {
          ...prev,
          hero_badge: res.hero_badge || "",
          hero_title: res.hero_title || "",
          hero_description: res.hero_description || "",
          site_name: res.site_name || "",
          site_description: res.site_description || "",
          site_logo: res.site_logo || "",
          site_favicon: res.site_favicon || "",
          site_title: res.site_title || "",
          contact_address: res.contact_address || "",
          contact_phone: res.contact_phone || "",
          contact_email: res.contact_email || "",
          footer_copyright: res.footer_copyright || "",
          footer_organized_by: res.footer_organized_by || "",
          logo_display_style: res.logo_display_style || "logo_text",
          payment_player_fee: res.payment_player_fee || "",
          payment_team_fee: res.payment_team_fee || "",
          payment_upi_id: res.payment_upi_id || "",
          payment_account_name: res.payment_account_name || "",
          payment_account_no: res.payment_account_no || "",
          payment_ifsc: res.payment_ifsc || "",
          payment_instructions: res.payment_instructions || "",
          payment_gateway: res.payment_gateway || "",
          payment_gateway_key: res.payment_gateway_key || "",
          payment_gateway_secret: res.payment_gateway_secret || "",
          payment_gateway_webhook: res.payment_gateway_webhook || "",
          payment_gateway_enabled: res.payment_gateway_enabled || "0",
          player_form_schema: schema,
          player_form_payment_type: res.player_form_payment_type || "free",
          player_form_payment_fee: res.player_form_payment_fee || "0",
          team_form_schema: teamSchema,
          team_form_payment_type: res.team_form_payment_type || "free",
          team_form_payment_fee: res.team_form_payment_fee || "0",
          landing_hero_image: res.landing_hero_image || "",
          landing_player_image: res.landing_player_image || "",
          landing_stats_image: res.landing_stats_image || "",
          landing_team_image: res.landing_team_image || "",
          landing_trophy_image: res.landing_trophy_image || ""
        };
      });
    }).catch(console.error);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = async (playerId: string, status: string) => {
    try {
      await apiFetch("/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, status })
      });
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBulkTransfer = async () => {
    if (!bulkTransferTeamId || selectedPlayers.length === 0) return;
    setIsBulkTransferring(true);
    try {
      await Promise.all(selectedPlayers.map(playerId => 
        apiFetch("/admin/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, teamId: bulkTransferTeamId })
        })
      ));
      setSelectedPlayers([]);
      refreshData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBulkTransferring(false);
    }
  };

  const handleTeamStatusChange = async (teamId: string, status: string) => {
    try {
      await apiFetch("/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status, update_status: '1' })
      });
      setMessage(`Team status updated to ${status}!`);
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAssignTeam = async (playerId: string, teamId: string) => {
    try {
      await apiFetch("/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, teamId: teamId === "none" ? null : teamId })
      });
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTogglePayment = async (playerId: string, paymentId: string | null) => {
    try {
      await apiFetch("/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, paymentId })
      });
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (editingTeamId) {
        data.append("id", editingTeamId);
      }
      data.append("name", teamForm.name);
      data.append("ownerName", teamForm.ownerName);
      data.append("description", teamForm.description);
      data.append("logoUrl", teamForm.logoUrl);
      data.append("advance_payment", teamForm.advance_payment);
      data.append("remaining_payment", teamForm.remaining_payment);
      data.append("total_payment", teamForm.total_payment);
      if (teamLogoFile) {
        data.append("logo", teamLogoFile);
      }

      await apiFetch("/admin/teams", {
        method: "POST",
        body: data
      });
      setTeamForm({ name: "", ownerName: "", description: "", logoUrl: "", advance_payment: "0", remaining_payment: "0", total_payment: "0" });
      setEditingTeamId(null);
      setTeamLogoFile(null);
      const fileInput = document.getElementById("teamLogoInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setMessage(editingTeamId ? "Team updated successfully!" : "Team added successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveTeam = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this team?")) return;
    try {
      await apiFetch(`/admin/teams?id=${id}`, {
        method: "DELETE"
      });
      setMessage("Team removed successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementForm)
      });
      setAnnouncementForm({ title: "", content: "", isPinned: false });
      setMessage("Announcement created!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (editingSponsorId) {
        data.append("id", editingSponsorId);
      }
      data.append("name", sponsorForm.name);
      data.append("website", sponsorForm.website);
      data.append("logoUrl", sponsorForm.logoUrl);
      if (sponsorLogoFile) {
        data.append("logo", sponsorLogoFile);
      }

      await apiFetch("/admin/sponsors", {
        method: "POST",
        body: data
      });
      setSponsorForm({ name: "", logoUrl: "", website: "" });
      setEditingSponsorId(null);
      setSponsorLogoFile(null);
      const fileInput = document.getElementById("sponsorLogoInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setMessage(editingSponsorId ? "Sponsor updated successfully!" : "Sponsor added!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveSponsor = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this sponsor?")) return;
    try {
      await apiFetch(`/admin/sponsors?id=${id}`, {
        method: "DELETE"
      });
      setMessage("Sponsor removed successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleSponsorVisibility = async (id: string, currentStatus: number) => {
    try {
      await apiFetch("/admin/sponsors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          isVisible: currentStatus === 1 ? 0 : 1
        })
      });
      setMessage("Sponsor visibility updated!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(settingsForm).forEach((key) => {
        if (key === "player_form_schema" || key === "team_form_schema") {
          data.append(key, JSON.stringify(settingsForm[key]));
        } else {
          data.append(key, String(settingsForm[key] ?? ""));
        }
      });
      if (logoFile) {
        data.append("site_logo_file", logoFile);
      }
      if (faviconFile) {
        data.append("site_favicon_file", faviconFile);
      }
      if (landingHeroFile) data.append("landing_hero_image_file", landingHeroFile);
      if (landingPlayerFile) data.append("landing_player_image_file", landingPlayerFile);
      if (landingStatsFile) data.append("landing_stats_image_file", landingStatsFile);
      if (landingTeamFile) data.append("landing_team_image_file", landingTeamFile);
      if (landingTrophyFile) data.append("landing_trophy_image_file", landingTrophyFile);

      await apiFetch("/admin/settings", {
        method: "POST",
        body: data
      });

      // Clear files
      setLogoFile(null);
      const logoInput = document.getElementById("siteLogoInput") as HTMLInputElement;
      if (logoInput) logoInput.value = "";

      setFaviconFile(null);
      const faviconInput = document.getElementById("siteFaviconInput") as HTMLInputElement;
      if (faviconInput) faviconInput.value = "";

      setLandingHeroFile(null);
      setLandingPlayerFile(null);
      setLandingStatsFile(null);
      setLandingTeamFile(null);
      setLandingTrophyFile(null);
      ["landingHeroInput","landingPlayerInput","landingStatsInput","landingTeamInput","landingTrophyInput"].forEach(id => {
        const el = document.getElementById(id) as HTMLInputElement;
        if (el) el.value = "";
      });

      setMessage("Settings updated successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", profileForm.name);
      data.append("phone", profileForm.phone);
      data.append("password", profileForm.password);
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      const res = await apiFetch("/admin/profile", {
        method: "POST",
        body: data
      });
      localStorage.setItem("kpl_admin_user", JSON.stringify(res.user));
      setProfileForm({
        ...profileForm,
        password: ""
      });
      setAvatarFile(null);
      setMessage("Profile updated successfully!");
      // Force reload or update page state by reloading the window or triggering a refresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSeedDemoData = async () => {
    if (!window.confirm("Would you like to seed sample players and demo teams into the database?")) return;
    try {
      const res = await apiFetch("/admin/seed", {
        method: "POST"
      });
      setMessage(res.message || "Sample teams and players loaded successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchForm)
      });
      setMatchForm({ date: "", time: "", venue: "", team1Id: "", team2Id: "" });
      setMessage("Match scheduled successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("type", galleryForm.type);
      data.append("album", galleryForm.album);
      data.append("url", galleryForm.url);
      if (galleryFile) {
        data.append("image", galleryFile);
      }

      await apiFetch("/admin/gallery", {
        method: "POST",
        body: data
      });
      setGalleryForm({ type: "IMAGE", url: "", thumbnail: "", album: "" });
      setGalleryFile(null);
      const fileInput = document.getElementById("galleryFileInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setMessage("Gallery item added!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(playerForm).forEach(([key, val]) => {
        data.append(key, String(val));
      });
      if (playerPhotoFile) {
        data.append("photo", playerPhotoFile);
      }
      if (playerDocFile) {
        data.append("document", playerDocFile);
      }

      if (editingPlayerId) {
        data.append("playerId", editingPlayerId);
        data.append("update_details", "1");
        await apiFetch("/admin/players", {
          method: "POST",
          body: data
        });
      } else {
        await apiFetch("/register", {
          method: "POST",
          body: data
        });
      }

      setPlayerForm({
        name: "",
        fatherName: "",
        email: "",
        mobile: "",
        address: "",
        dob: "",
        playingRole: "Batsman",
        battingStyle: "Right Hand",
        bowlingStyle: "None",
        isWicketKeeper: false
      });
      setPlayerPhotoFile(null);
      setPlayerDocFile(null);
      
      const prevEditing = editingPlayerId;
      setEditingPlayerId(null);

      const photoInput = document.getElementById("playerPhotoInput") as HTMLInputElement;
      if (photoInput) photoInput.value = "";
      const docInput = document.getElementById("playerDocInput") as HTMLInputElement;
      if (docInput) docInput.value = "";

      setMessage(prevEditing ? "Player profile updated successfully!" : "Player added successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!(adminForm as any).id;
      await apiFetch("/admin/admins", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm)
      });
      setAdminForm({ username: "", password: "", name: "", roleId: "", email: "", phone: "" });
      setMessage(isEdit ? "Administrator updated successfully!" : "Administrator added successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!window.confirm("Are you sure you want to remove this administrator?")) return;
    try {
      await apiFetch(`/admin/admins?id=${adminId}`, {
        method: "DELETE"
      });
      setMessage("Administrator removed successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!(roleForm as any).id;
      await apiFetch("/admin/roles", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleForm)
      });
      setRoleForm({ name: "", permissions: "" });
      setMessage(isEdit ? "Role updated successfully!" : "Role created successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to remove this role? Doing so will dissociate it from all administrators assigned to it.")) return;
    try {
      await apiFetch(`/admin/roles?id=${roleId}`, {
        method: "DELETE"
      });
      setMessage("Role removed successfully!");
      refreshData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const menuSections = [
    {
      title: "GENERAL",
      items: [
        { id: "overview", name: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { id: "analytics", name: "System Analytics", icon: <Activity size={16} /> }
      ]
    },
    {
      title: "TOURNAMENT MANAGER",
      items: [
        { id: "matches", name: "Match Schedule", icon: <Calendar size={16} /> },
        { id: "teams", name: "Franchise Teams", icon: <Users size={16} /> },
        { id: "players", name: "Player Profiles", icon: <User size={16} /> },
        { id: "announcements", name: "News & Announcements", icon: <Megaphone size={16} /> },
        { id: "gallery", name: "Gallery Highlights", icon: <Image size={16} /> },
        { id: "sponsors", name: "Sponsors & Partners", icon: <Heart size={16} /> }
      ]
    },
    {
      title: "ADMINISTRATION",
      items: [
        { id: "admin_roles", name: "Admin & Roles", icon: <Shield size={16} /> },
        ...(isSuperAdmin ? [{ id: "settings", name: "Tournament Settings", icon: <Settings size={16} /> }] : [])
      ]
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 ${
      isAdminDark ? "bg-[#0b1329] text-white" : "bg-[#f4f5f7] text-slate-800"
    }`}>
      {/* Mobile Top Bar */}
      <div className={`flex items-center justify-between p-4 border-b md:hidden shrink-0 transition-colors duration-200 ${
        isAdminDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="font-extrabold text-xs tracking-tight">{settingsForm.site_title || "KPL Dashboard"}</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-xl border transition-colors duration-200 ${
            isAdminDark ? "border-slate-850 bg-slate-800 hover:bg-slate-750" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
          }`}
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 md:h-screen md:sticky md:top-0 border-r p-6 flex flex-col justify-between shrink-0 transition-all duration-300 transform md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${
        isAdminDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <div className="flex-grow flex flex-col overflow-y-auto pr-1 min-h-0">
          {/* User Profile Header */}
          <div className={`flex flex-col mb-6 pb-6 border-b shrink-0 transition-colors duration-200 ${
            isAdminDark ? "border-slate-800" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              {adminUser.avatarUrl ? (
                <img 
                  src={adminUser.avatarUrl} 
                  alt={adminName} 
                  className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0" 
                />
              ) : (
                <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shadow-sm transition-colors duration-200 shrink-0 ${
                  isAdminDark ? "bg-slate-800 text-amber-500 border border-slate-700" : "bg-slate-100 text-slate-800 border border-slate-200"
                }`}>
                  {adminInitials}
                </div>
              )}
              <div className="truncate">
                <div className={`font-bold text-sm ${isAdminDark ? "text-white" : "text-slate-800"}`}>{adminName}</div>
                <div className="text-xs text-slate-400 truncate">{adminEmail}</div>
              </div>
            </div>
            {/* Edit Profile Action */}
            <button
              onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}
              className={`w-full mt-3.5 py-1.5 px-3 rounded-xl text-[10px] font-bold border transition-all ${
                activeTab === "profile"
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow-sm"
                  : isAdminDark ? "border-slate-800 hover:bg-slate-800/80 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              Edit Profile
            </button>
          </div>

          <nav className="space-y-6 flex-grow">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-3">{section.title}</h4>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); setMessage(""); setError(""); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? "bg-slate-900 text-white font-bold dark:bg-amber-500 dark:text-slate-950 dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <span className={isActive ? "text-inherit" : "text-slate-400 dark:text-slate-500"}>
                          {item.icon}
                        </span>
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Bottom controls */}
        <div className={`pt-6 border-t mt-6 grid grid-cols-2 gap-3 transition-colors duration-200 ${
          isAdminDark ? "border-slate-800" : "border-slate-100"
        }`}>
          <button 
            onClick={() => { setIsAdminDark(!isAdminDark); setIsSidebarOpen(false); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
              isAdminDark 
                ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700" 
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {isAdminDark ? <Sun size={14} /> : <Moon size={14} />}
            {isAdminDark ? "Light" : "Dark"}
          </button>
          <button 
            onClick={() => { localStorage.removeItem("kpl_admin_token"); window.location.reload(); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
              isAdminDark 
                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20" 
                : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100"
            }`}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {message && <div className="p-4 bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl mb-6">{message}</div>}
        {error && <div className="p-4 bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl mb-6">{error}</div>}

        {/* 1. Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Welcome Banner Card */}
            <div className={`p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border transition-all duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-[#f1f2f4] border-slate-200/80"
            }`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <Trophy className="text-amber-500" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight">KPL Season 2</h2>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${
                      isAdminDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-500 border border-slate-200"
                    }`}>ADMIN PORTAL</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xl">
                    Welcome to the Khoraghat Premier League administration portal. Select a shortcut below to manage matches, franchise teams, player profiles, and announcements.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleSeedDemoData}
                className="shrink-0 py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                Load Demo Data
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Registered Players</span>
                  <span className="block text-3xl font-black mt-1">{stats.players || 0}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                }`}>
                  <User size={20} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Franchise Teams</span>
                  <span className="block text-3xl font-black mt-1">{stats.teams || 0}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                }`}>
                  <Users size={20} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Scheduled Matches</span>
                  <span className="block text-3xl font-black mt-1">{stats.matches || 0}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                }`}>
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* Revenue Stats Row */}
            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 bg-gradient-to-br from-amber-500/10 to-amber-600/5 ${
                  isAdminDark ? "border-amber-500/20" : "border-amber-200"
                }`}>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Total Revenue Collected</span>
                    <span className="block text-2xl font-black mt-1 text-amber-500">₹ {(stats.totalRevenue ?? 0).toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">Player fees + Franchise advances</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-500`}>
                    <IndianRupee size={18} />
                  </div>
                </div>

                {/* Player Revenue */}
                <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paid Player Revenue</span>
                    <span className="block text-2xl font-black mt-1 text-slate-800 dark:text-white">₹ {(stats.playerRevenue ?? 0).toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {stats.playersPaidCount || 0} Paid Player registrations
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                  }`}>
                    <Coins size={18} />
                  </div>
                </div>

                {/* Team Advance Revenue */}
                <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Franchise Advance Paid</span>
                    <span className="block text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-450">₹ {(stats.teamAdvanceRevenue ?? 0).toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">
                      Agreed Contract: ₹{(stats.teamTotalRevenue ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                  }`}>
                    <TrendingUp size={18} />
                  </div>
                </div>

                {/* Team Remaining Revenue */}
                <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Franchise Remaining Due</span>
                    <span className="block text-2xl font-black mt-1 text-amber-600 dark:text-amber-500">₹ {(stats.teamRemainingRevenue ?? 0).toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">
                      Pending final collection
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAdminDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-500"
                  }`}>
                    <IndianRupee size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Shortcuts Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Quick Access Shortcuts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Match Schedule */}
                <div 
                  onClick={() => setActiveTab("matches")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400 flex items-center justify-center mb-4">
                    <Calendar size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-blue-500 transition-colors">Match Schedule</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Schedule, modify, and update tournament fixtures and match details.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Franchise Teams */}
                <div 
                  onClick={() => setActiveTab("teams")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <Users size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-emerald-500 transition-colors">Franchise Teams</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Manage league franchises, owners, team logos, and descriptions.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* News & Announcements */}
                <div 
                  onClick={() => setActiveTab("announcements")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400 flex items-center justify-center mb-4">
                    <Megaphone size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-amber-500 transition-colors">News & Announcements</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Publish important updates, schedules, and alerts for teams and fans.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-amber-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Player Profiles */}
                <div 
                  onClick={() => setActiveTab("players")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/30 dark:text-purple-400 flex items-center justify-center mb-4">
                    <User size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-purple-500 transition-colors">Player Profiles</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Review player registration entries, change auction pool status, and assign teams.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-purple-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Gallery Highlights */}
                <div 
                  onClick={() => setActiveTab("gallery")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-500 dark:bg-cyan-950/30 dark:text-cyan-400 flex items-center justify-center mb-4">
                    <Image size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-cyan-500 transition-colors">Gallery Highlights</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Upload and organize photos, match action highlights, and album slides.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-cyan-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* Sponsors & Partners */}
                <div 
                  onClick={() => setActiveTab("sponsors")}
                  className={`p-6 rounded-2xl border group cursor-pointer hover:shadow-md transition-all duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-500 dark:bg-yellow-950/30 dark:text-yellow-400 flex items-center justify-center mb-4">
                    <Heart size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm mb-1 group-hover:text-yellow-500 transition-colors">Sponsors & Partners</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">Manage corporate sponsorships, website links, and partner logo configurations.</p>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-yellow-500 flex items-center gap-1 transition-colors">
                    Open panel <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* 2. System Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">System Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-2xl border ${isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Visitors</span>
                <span className="block text-2xl font-black mt-2">1,245</span>
                <span className="text-xs text-emerald-500 font-semibold mt-1 inline-block">↑ 12% from last week</span>
              </div>
              <div className={`p-6 rounded-2xl border ${isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Session Time</span>
                <span className="block text-2xl font-black mt-2">4m 32s</span>
                <span className="text-xs text-emerald-500 font-semibold mt-1 inline-block">↑ 3% from yesterday</span>
              </div>
              <div className={`p-6 rounded-2xl border ${isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Submissions</span>
                <span className="block text-2xl font-black mt-2">4,821</span>
                <span className="text-xs text-slate-400 mt-1 inline-block">Steady activity</span>
              </div>
              <div className={`p-6 rounded-2xl border ${isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Server CPU Load</span>
                <span className="block text-2xl font-black mt-2">8.2%</span>
                <span className="text-xs text-emerald-500 font-semibold mt-1 inline-block">Healthy</span>
              </div>
            </div>
            <div className={`p-8 rounded-2xl border ${isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"}`}>
              <h3 className="font-bold text-sm mb-4">Traffic Statistics</h3>
              <p className="text-slate-400 text-xs">Analytics reporting is fully functional and tracking API requests in real-time.</p>
            </div>
          </div>
        )}

        {/* 3. Competitive Exams / Match Schedule Tab */}
        {activeTab === "matches" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">Match Schedule</h2>
                <p className="text-xs text-slate-400 mt-1">Schedule, modify, and update tournament fixtures and match details.</p>
              </div>
              <button 
                onClick={() => setShowMatchForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Schedule a Match
              </button>
            </div>

            {/* Modal Match Form */}
            <Modal isOpen={showMatchForm} onClose={() => setShowMatchForm(false)} title="Schedule a Match" isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddMatch(e); setShowMatchForm(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Match Date *</label>
                  <input type="date" required value={matchForm.date} onChange={e => setMatchForm({...matchForm, date: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Match Time *</label>
                  <input type="text" placeholder="e.g. 10:00 AM" required value={matchForm.time} onChange={e => setMatchForm({...matchForm, time: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Venue *</label>
                  <input type="text" required value={matchForm.venue} onChange={e => setMatchForm({...matchForm, venue: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Team 1 *</label>
                  <select required value={matchForm.team1Id} onChange={e => setMatchForm({...matchForm, team1Id: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <option value="">Select Team 1</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Team 2 *</label>
                  <select required value={matchForm.team2Id} onChange={e => setMatchForm({...matchForm, team2Id: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <option value="">Select Team 2</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all">Schedule Match</button>
              </form>
            </Modal>

            {/* Full Width Match Cards List */}
            {matches.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <Calendar className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No matches scheduled</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No tournament fixtures have been scheduled yet. Click "Schedule a Match" to add your first fixture.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map(m => (
                  <div key={m.id} className={`p-6 rounded-2xl border flex justify-between items-center transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                  }`}>
                    <div>
                      <span className="text-xs text-amber-500 font-bold">{new Date(m.date).toLocaleDateString()} at {m.time}</span>
                      <h3 className="font-extrabold text-base mt-1">{m.team1Name} vs {m.team2Name}</h3>
                      <p className="text-xs text-slate-400 mt-1">Venue: {m.venue}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>{m.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Academic Boards / Teams Tab */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">Franchise Teams</h2>
                <p className="text-xs text-slate-400 mt-1">Manage league franchises, owners, team logos, and descriptions.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTeamId(null);
                  setTeamForm({ name: "", ownerName: "", description: "", logoUrl: "", advance_payment: "0", remaining_payment: "0", total_payment: "0" });
                  setShowTeamForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Add Franchise Team
              </button>
            </div>

            {/* Modal Add/Edit Team Form */}
            <Modal isOpen={showTeamForm} onClose={() => setShowTeamForm(false)} title={editingTeamId ? "Edit Franchise Team" : "Add Franchise Team"} isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddTeam(e); setShowTeamForm(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Team Name *</label>
                  <input type="text" required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Owner Name</label>
                  <input type="text" value={teamForm.ownerName} onChange={e => setTeamForm({...teamForm, ownerName: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Logo URL</label>
                  <input type="url" value={teamForm.logoUrl} onChange={e => setTeamForm({...teamForm, logoUrl: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Or Upload Logo Image</label>
                  <input type="file" id="teamLogoInput" accept="image/*" onChange={e => setTeamLogoFile(e.target.files ? e.target.files[0] : null)} className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-slate-305" : "bg-slate-50 border-slate-200 text-slate-800"
                  } file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-955`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Description</label>
                  <textarea value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  } h-20`} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-450 dark:text-slate-400">Total Contract (₹)</label>
                    <input type="number" value={teamForm.total_payment} onChange={e => {
                      const total = Number(e.target.value) || 0;
                      const adv = Number(teamForm.advance_payment) || 0;
                      setTeamForm({...teamForm, total_payment: e.target.value, remaining_payment: String(total - adv)});
                    }} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-450 dark:text-slate-400">Advance Paid (₹)</label>
                    <input type="number" value={teamForm.advance_payment} onChange={e => {
                      const adv = Number(e.target.value) || 0;
                      const total = Number(teamForm.total_payment) || 0;
                      setTeamForm({...teamForm, advance_payment: e.target.value, remaining_payment: String(total - adv)});
                    }} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-455 dark:text-slate-400">Remaining (₹)</label>
                    <input type="number" value={teamForm.remaining_payment} onChange={e => setTeamForm({...teamForm, remaining_payment: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} placeholder="0" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all">
                  {editingTeamId ? "Save Team Changes" : "Add Franchise"}
                </button>
              </form>
            </Modal>

            {/* Full Width Grid of Franchise Teams */}
            {teams.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <Users className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No franchise teams</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No teams have been created yet. Click "Add Franchise Team" to initialize a franchise team.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <img src={team.logoUrl || "https://placehold.co/60"} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg truncate">{team.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">Owner: {team.ownerName || "Unassigned"}</p>
                        {team.status && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                              team.status === 'APPROVED' 
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                : team.status === 'REJECTED' 
                                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            }`}>{team.status}</span>
                            {team.paymentId && (
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-450 font-mono" title={`Payment ID: ${team.paymentId}`}>Paid</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">{team.description}</p>
                      
                      {/* Dynamic additional fields */}
                      {team.additional_fields && (() => {
                        try {
                          const fields = JSON.parse(team.additional_fields);
                          return (
                            <div className="mt-2 text-[10px] space-y-1 bg-slate-50 dark:bg-slate-950/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                              {Object.entries(fields).map(([k, v]: any) => (
                                <div key={k} className="flex justify-between gap-1 truncate">
                                  <span className="text-slate-400">{k}:</span>
                                  <span className="font-semibold text-slate-200">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        } catch(e) {}
                        return null;
                      })()}
                      
                      {/* Team Payments Tracking */}
                      <div className="mt-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-955/20 text-[10px]">
                        <div className="font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider text-[8px]">Payment Tracking</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Contract:</span>
                            <span className="font-extrabold text-slate-800 dark:text-white">₹{Number(team.total_payment || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450 dark:text-slate-400 font-medium">Advance Paid:</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{Number(team.advance_payment || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-450 dark:text-slate-400 font-medium">Remaining Bal:</span>
                            <span className="font-extrabold text-amber-605 dark:text-amber-500">₹{Number(team.remaining_payment || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Approve/Reject Controls for dynamic registration */}
                    {team.status === 'PENDING' && (
                      <div className="flex gap-1.5 mb-2 mt-3 w-full">
                        <button 
                          onClick={() => handleTeamStatusChange(team.id, 'APPROVED')} 
                          className="flex-1 text-[10px] font-bold py-1.5 bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-all text-center"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleTeamStatusChange(team.id, 'REJECTED')} 
                          className="flex-1 text-[10px] font-bold py-1.5 bg-rose-500 text-white rounded-lg hover:opacity-90 transition-all text-center"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          setEditingTeamId(team.id);
                          setTeamForm({
                            name: team.name || "",
                            ownerName: team.ownerName || "",
                            description: team.description || "",
                            logoUrl: team.logoUrl || "",
                            advance_payment: team.advance_payment || "0",
                            remaining_payment: team.remaining_payment || "0",
                            total_payment: team.total_payment || "0"
                          });
                          setShowTeamForm(true);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 border rounded-lg text-[10px] font-bold transition-all ${
                          isAdminDark 
                            ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Edit size={10} />
                        Modify
                      </button>
                      <button
                        onClick={() => handleRemoveTeam(team.id)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 border rounded-lg text-[10px] font-bold transition-all ${
                          isAdminDark 
                            ? "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-rose-400" 
                            : "bg-rose-50 border-rose-100 hover:bg-rose-100 text-rose-600"
                        }`}
                      >
                        <Trash2 size={10} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Current Affairs / Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">News & Announcements</h2>
                <p className="text-xs text-slate-400 mt-1">Publish important updates, schedules, and alerts for teams and fans.</p>
              </div>
              <button 
                onClick={() => setShowAnnouncementForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Create Announcement
              </button>
            </div>

            {/* Modal Create Announcement Form */}
            <Modal isOpen={showAnnouncementForm} onClose={() => setShowAnnouncementForm(false)} title="Create Announcement" isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddAnnouncement(e); setShowAnnouncementForm(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Announcement Title *</label>
                  <input type="text" required value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Content *</label>
                  <textarea required value={announcementForm.content} onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  } h-32`} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pinned" checked={announcementForm.isPinned} onChange={e => setAnnouncementForm({...announcementForm, isPinned: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                  <label htmlFor="pinned" className="text-xs font-semibold">Pin announcement to top</label>
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all">Publish</button>
              </form>
            </Modal>

            {/* Full Width Announcements list */}
            {announcements.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <Megaphone className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No announcements published</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No announcements have been published yet. Click "Create Announcement" to post updates to the homepage.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(a => (
                  <div key={a.id} className={`p-6 rounded-2xl border relative transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800 border-l-4 border-l-amber-500" : "bg-white border-slate-200/80 border-l-4 border-l-slate-900"
                  }`}>
                    {a.isPinned ? <span className="absolute top-4 right-4 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold uppercase">Pinned</span> : null}
                    <h3 className="font-extrabold text-base">{a.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-pre-line leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. Mock Tests & MCQs Tab */}
        {activeTab === "mock_tests" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Mock Tests & MCQs Panel</h2>
            <div className={`p-8 rounded-2xl border transition-colors duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
              <h3 className="font-bold text-sm mb-4">Configure Question Bank</h3>
              <p className="text-slate-400 text-xs mb-6">Create real-time MCQ practice sheets and pools for student evaluation.</p>
              <div className="flex gap-4">
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:opacity-90">Create New Sheet</button>
                <button className={`px-4 py-2 rounded-xl border text-xs font-bold hover:bg-slate-50 transition-colors ${
                  isAdminDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 text-slate-700"
                }`}>Import CSV/XLS</button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Student & Test Leaderboards</h2>
            <div className={`p-6 rounded-2xl border overflow-x-auto transition-colors duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                    <th className="p-4">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Accuracy</th>
                    <th className="p-4">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-amber-500">#1</td>
                    <td className="p-4 font-bold">Abu Sahid</td>
                    <td className="p-4">98.5%</td>
                    <td className="p-4 font-bold">12,450</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-400">#2</td>
                    <td className="p-4">Sanjib Baruah</td>
                    <td className="p-4">95.2%</td>
                    <td className="p-4">11,920</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-amber-700">#3</td>
                    <td className="p-4">Karabi Das</td>
                    <td className="p-4">94.0%</td>
                    <td className="p-4">11,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. Job Openings Tab */}
        {activeTab === "job_openings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Job Openings & Careers</h2>
            <div className={`p-8 rounded-2xl border transition-colors duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
              <h3 className="font-bold text-sm mb-2">Publish New Career Opening</h3>
              <p className="text-slate-400 text-xs mb-6">Publish career and recruitment notifications for visitors.</p>
              <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:opacity-90">Create Job Notice</button>
            </div>
          </div>
        )}

        {/* 9. Student Profiles Tab */}
        {activeTab === "players" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">Player Profiles / Player Auction Pool</h2>
                <p className="text-xs text-slate-400 mt-1">Review player registration entries, change auction pool status, and assign teams.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingPlayerId(null);
                  setPlayerForm({
                    name: "",
                    fatherName: "",
                    email: "",
                    mobile: "",
                    address: "",
                    dob: "",
                    playingRole: "Batsman",
                    battingStyle: "Right Hand",
                    bowlingStyle: "None",
                    isWicketKeeper: false
                  });
                  setShowPlayerForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Add Player
              </button>
            </div>

            {/* Modal Add/Edit Player Form */}
            <Modal isOpen={showPlayerForm} onClose={() => setShowPlayerForm(false)} title={editingPlayerId ? "Edit Player Profile" : "Add Player Profile"} isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddPlayer(e); setShowPlayerForm(false); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Player Full Name *</label>
                    <input type="text" required value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Father's Name *</label>
                    <input type="text" required value={playerForm.fatherName} onChange={e => setPlayerForm({...playerForm, fatherName: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Mobile Number *</label>
                    <input type="tel" required value={playerForm.mobile} onChange={e => setPlayerForm({...playerForm, mobile: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Email Address</label>
                    <input type="email" value={playerForm.email} onChange={e => setPlayerForm({...playerForm, email: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Date of Birth *</label>
                    <input type="date" required value={playerForm.dob} onChange={e => setPlayerForm({...playerForm, dob: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Playing Role *</label>
                    <select value={playerForm.playingRole} onChange={e => setPlayerForm({...playerForm, playingRole: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}>
                      <option value="Batsman">Batsman</option>
                      <option value="Bowler">Bowler</option>
                      <option value="All-Rounder">All-Rounder</option>
                      <option value="Wicket Keeper">Wicket Keeper</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Batting Style</label>
                    <select value={playerForm.battingStyle} onChange={e => setPlayerForm({...playerForm, battingStyle: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}>
                      <option value="Right Hand">Right Hand</option>
                      <option value="Left Hand">Left Hand</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Bowling Style</label>
                    <select value={playerForm.bowlingStyle} onChange={e => setPlayerForm({...playerForm, bowlingStyle: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}>
                      <option value="None">None</option>
                      <option value="Right-arm Pace">Right-arm Pace</option>
                      <option value="Left-arm Pace">Left-arm Pace</option>
                      <option value="Right-arm Spin">Right-arm Spin</option>
                      <option value="Left-arm Spin">Left-arm Spin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Address *</label>
                  <textarea required value={playerForm.address} onChange={e => setPlayerForm({...playerForm, address: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  } h-16`} />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="adminWk" checked={playerForm.isWicketKeeper} onChange={e => setPlayerForm({...playerForm, isWicketKeeper: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                  <label htmlFor="adminWk" className="text-xs font-semibold">Are you a Wicket Keeper?</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Passport Size Photo {editingPlayerId ? "" : "*"}</label>
                    <input type="file" required={!editingPlayerId} id="playerPhotoInput" accept="image/*" onChange={e => setPlayerPhotoFile(e.target.files ? e.target.files[0] : null)} className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Aadhar / Document (PDF/Image) {editingPlayerId ? "" : "*"}</label>
                    <input type="file" required={!editingPlayerId} id="playerDocInput" accept="image/*,application/pdf" onChange={e => setPlayerDocFile(e.target.files ? e.target.files[0] : null)} className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`} />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all">
                  {editingPlayerId ? "Save Profile Changes" : "Add Player Profile"}
                </button>
              </form>
            </Modal>

            {/* Modal View Player Profile */}
            <Modal 
              isOpen={!!selectedViewPlayer} 
              onClose={() => setSelectedViewPlayer(null)} 
              title="Player Registration Profile" 
              isAdminDark={isAdminDark}
              maxWidthClass="max-w-5xl"
            >
              {selectedViewPlayer && (() => {
                let displayPhotoUrl = selectedViewPlayer.photoUrl;
                let fields: any = {};
                try {
                  if (selectedViewPlayer.additional_fields) {
                    fields = JSON.parse(selectedViewPlayer.additional_fields);
                    if (!displayPhotoUrl) {
                      const photoFieldKey = Object.keys(fields).find(k => k.toLowerCase().includes('photo') && /\.(jpg|jpeg|png|webp|gif)$/i.test(String(fields[k])));
                      if (photoFieldKey) {
                        displayPhotoUrl = fields[photoFieldKey];
                      }
                    }
                  }
                } catch (e) {}

                return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[550px] md:min-h-[620px]">
                  {/* Photo Split (Left Column - ONLY PHOTO) */}
                  <div className="flex flex-col space-y-4 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/80 md:pr-8">
                    <div 
                      onClick={() => displayPhotoUrl && setFullPhotoUrl(displayPhotoUrl)}
                      className="w-full h-96 sm:h-[420px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0 cursor-zoom-in relative group"
                      title="Click to view full photo"
                    >
                      {displayPhotoUrl ? (
                        <>
                          <img 
                            src={displayPhotoUrl} 
                            alt={selectedViewPlayer.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Plus size={16} /> Click to Enlarge
                          </div>
                        </>
                      ) : (
                        <User size={64} className="text-slate-400" />
                      )}
                    </div>

                    {selectedViewPlayer.documentUrl && (
                      <a 
                        href={selectedViewPlayer.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs bg-slate-900 hover:opacity-90 dark:bg-amber-500 dark:text-slate-950 text-white font-bold py-2.5 px-4 rounded-xl transition-all w-full justify-center shadow-md"
                      >
                        <FileText size={14} />
                        View Document ID Verification
                      </a>
                    )}
                  </div>

                  {/* Details Split (Right Column) */}
                  <div className="space-y-6 text-xs flex flex-col justify-start">
                    {/* Header Details (Name & Status) */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white leading-tight">
                          {selectedViewPlayer.name}
                        </h4>
                        <p className="text-xs text-amber-500 mt-1 uppercase tracking-wider font-bold">
                          KPL-PLY-{selectedViewPlayer.id.substring(0,8).toUpperCase()} • {selectedViewPlayer.playingRole}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                          selectedViewPlayer.status === 'APPROVED' 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : selectedViewPlayer.status === 'REJECTED' 
                              ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>{selectedViewPlayer.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Father's Name</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.fatherName}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Date of Birth</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.dob}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Email Address</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">{selectedViewPlayer.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Mobile Number</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.mobile}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Batting Style</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.battingStyle || 'None'}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Bowling Style</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.bowlingStyle || 'None'}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Wicket Keeper Status</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedViewPlayer.isWicketKeeper == 1 ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Franchise Team</span>
                        <span className="text-sm font-semibold text-slate-850 dark:text-amber-500 font-extrabold">
                          {teams.find(t => t.id === selectedViewPlayer.teamId)?.name || 'Unassigned / Independent Pool'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] mb-1.5">Residential Address</span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                          {selectedViewPlayer.address}
                        </p>
                      </div>

                      {selectedViewPlayer.documentUrl && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] mb-2">Submitted ID Document</span>
                          <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                            {selectedViewPlayer.documentUrl.toLowerCase().endsWith('.pdf') ? (
                              <iframe src={selectedViewPlayer.documentUrl} className="w-full h-full border-0" title="Document PDF" />
                            ) : (
                              <img 
                                src={selectedViewPlayer.documentUrl} 
                                alt="Document" 
                                className="w-full h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity" 
                                onClick={() => setFullPhotoUrl(selectedViewPlayer.documentUrl)}
                                title="Click to view full document"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Dynamic Fields */}
                      {Object.keys(fields).length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] mb-2">Additional Details</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                            {Object.entries(fields).map(([key, val]: any) => {
                                    // Skip the photo if it's already shown as the main big photo
                                    if (key.toLowerCase().includes('photo') && val === displayPhotoUrl) return null;
                                    
                                    // Skip the document if it's already shown as the ID Document
                                    if (typeof val === 'string' && selectedViewPlayer.documentUrl && val === selectedViewPlayer.documentUrl) return null;

                                    if (typeof val === "string" && (val.startsWith("/kpl/uploads/") || val.startsWith("http"))) {
                                      // Render a image link or document link
                                      const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(val);
                                      return (
                                        <div key={key} className="sm:col-span-2">
                                          <span className="block font-bold text-slate-400 dark:text-slate-500 text-[10px]">{key}</span>
                                          {isImage ? (
                                            <div className="mt-1 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 cursor-pointer" onClick={() => setFullPhotoUrl(val)}>
                                              <img src={val} className="w-full h-full object-cover" alt={key} />
                                            </div>
                                          ) : (
                                            <a href={val} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-semibold block mt-0.5">View Uploaded File</a>
                                          )}
                                        </div>
                                      );
                                    }
                                    return (
                                      <div key={key}>
                                        <span className="block font-bold text-slate-400 dark:text-slate-500 text-[10px]">{key}</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{val === true ? "Yes" : val === false ? "No" : String(val || "N/A")}</span>
                                      </div>
                                    );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })()}
            </Modal>

            {/* Lightbox / Zoom Modal */}
            {fullPhotoUrl && (
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-slate-950/90 backdrop-blur-md cursor-zoom-out animate-fade-in"
                onClick={() => setFullPhotoUrl(null)}
              >
                <button 
                  onClick={() => setFullPhotoUrl(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white transition-colors z-[110] shadow-md border border-white/5"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
                <img 
                  src={fullPhotoUrl} 
                  alt="Full view" 
                  className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none animate-zoom-in" 
                />
              </div>
            )}

            {players.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <User className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No registered players</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No player profiles have been submitted or registered yet. Click "Add Player" to register a player profile.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search & Select/Filter Controls */}
                <div className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Players</label>
                    <input 
                      type="text" 
                      value={playerSearchQuery} 
                      onChange={e => setPlayerSearchQuery(e.target.value)} 
                      placeholder="Search name, mobile, role..." 
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-705 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by Franchise</label>
                    <select 
                      value={playerTeamFilter} 
                      onChange={e => setPlayerTeamFilter(e.target.value)} 
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="all">All Teams</option>
                      <option value="none">No Franchise / Independent</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by Role</label>
                    <select 
                      value={playerRoleFilter} 
                      onChange={e => setPlayerRoleFilter(e.target.value)} 
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="all">All Roles</option>
                      <option value="Batsman">Batsman</option>
                      <option value="Bowler">Bowler</option>
                      <option value="All-Rounder">All-Rounder</option>
                      <option value="Wicket Keeper">Wicket Keeper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by Payment</label>
                    <select 
                      value={playerPaymentFilter} 
                      onChange={e => setPlayerPaymentFilter(e.target.value)} 
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">PAID Only</option>
                      <option value="free">FREE Only</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedPlayers.length > 0 && (
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-amber-500/30 shadow-lg shadow-amber-900/20" : "bg-amber-50 border-amber-200 shadow-lg shadow-amber-100"
                  }`}>
                    <div className="font-bold text-sm text-amber-700 dark:text-amber-500">
                      {selectedPlayers.length} Player{selectedPlayers.length > 1 ? 's' : ''} Selected
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <select 
                        value={bulkTransferTeamId} 
                        onChange={e => setBulkTransferTeamId(e.target.value)}
                        className={`flex-1 sm:w-48 border rounded-xl px-3 py-2 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      >
                        <option value="">Select Team to Transfer...</option>
                        <option value="none">No Franchise (Unassign)</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={handleBulkTransfer}
                        disabled={isBulkTransferring || !bulkTransferTeamId}
                        className="py-2 px-4 bg-amber-500 text-white font-bold rounded-xl text-xs hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isBulkTransferring ? <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"></span> : <Users size={14} />}
                        Transfer
                      </button>
                    </div>
                  </div>
                )}

                {filteredPlayers.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900/50 border-slate-805 border-slate-800" : "bg-slate-50/50 border-slate-200"
                  }`}>
                    <User className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                    <h3 className="text-sm font-extrabold mb-1">No matching players</h3>
                    <p className="text-xs text-slate-400 text-center max-w-sm">Try adjusting your search criteria or filter options to locate player profiles.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile view card list */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {filteredPlayers.map((player) => {
                        let playerPhoto = player.photoUrl;
                        if (!playerPhoto && player.additional_fields) {
                          try {
                            const fields = JSON.parse(player.additional_fields);
                            const photoFieldKey = Object.keys(fields).find(k => k.toLowerCase().includes('photo') && /\.(jpg|jpeg|png|webp|gif)$/i.test(String(fields[k])));
                            if (photoFieldKey) playerPhoto = fields[photoFieldKey];
                          } catch (e) {}
                        }
                        return (
                    <div key={player.id} className={`p-4 rounded-2xl border flex flex-col gap-3 transition-colors duration-200 ${
                      isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedPlayers.includes(player.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPlayers([...selectedPlayers, player.id]);
                            else setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                          }}
                          className="w-5 h-5 accent-amber-500 shrink-0 cursor-pointer"
                        />
                        <img 
                          src={playerPhoto || "https://placehold.co/40"} 
                          onClick={() => playerPhoto && setFullPhotoUrl(playerPhoto)}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-zoom-in" 
                        />
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm truncate">{player.name}</div>
                          <div className="text-[10px] text-amber-600 font-bold mb-0.5 tracking-wider">KPL-PLY-{player.id.substring(0,8).toUpperCase()}</div>
                          <div className="text-xs text-slate-400">{player.mobile}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Role / Style</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{player.playingRole}</span>
                          <span className="block text-[10px] text-slate-500 truncate">{player.battingStyle || 'None'} / {player.bowlingStyle || 'None'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Documents</span>
                          {player.documentUrl ? (
                            <a href={player.documentUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold hover:underline">View Document</a>
                          ) : <span className="text-slate-400">None</span>}
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Status</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            player.status === 'APPROVED' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : player.status === 'REJECTED' 
                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>{player.status}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Payment</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            player.paymentId 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          }`}>{player.paymentId ? 'PAID' : 'FREE'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-400 font-semibold">Assign Team:</span>
                        <select value={player.teamId || "none"} onChange={(e) => handleAssignTeam(player.id, e.target.value)} className={`border rounded-lg p-2 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}>
                          <option value="none">No Franchise</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <button 
                          onClick={() => setSelectedViewPlayer(player)}
                          className={`flex-1 min-w-[65px] inline-flex items-center justify-center gap-1.5 px-2 py-1 border rounded-lg text-[10px] font-bold transition-all ${
                            isAdminDark 
                              ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400" 
                              : "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700"
                          }`}
                        >
                          <Eye size={12} />
                          View
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPlayerId(player.id);
                            setPlayerForm({
                              name: player.name || "",
                              fatherName: player.fatherName || "",
                              email: player.email || "",
                              mobile: player.mobile || "",
                              address: player.address || "",
                              dob: player.dob || "",
                              playingRole: player.playingRole || "Batsman",
                              battingStyle: player.battingStyle || "Right Hand",
                              bowlingStyle: player.bowlingStyle || "None",
                              isWicketKeeper: player.isWicketKeeper == 1
                            });
                            setShowPlayerForm(true);
                          }}
                          className={`flex-1 min-w-[65px] inline-flex items-center justify-center gap-1.5 px-2 py-1 border rounded-lg text-[10px] font-bold transition-all ${
                            isAdminDark 
                              ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <Edit size={12} />
                          Modify
                        </button>
                        <button 
                          onClick={() => handleTogglePayment(player.id, player.paymentId ? null : 'MANUAL_PAID')}
                          className={`flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 px-2 py-1 border rounded-lg text-[10px] font-bold transition-all ${
                            player.paymentId 
                              ? "bg-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400" 
                              : "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                          }`}
                        >
                          {player.paymentId ? "Unpaid" : "Paid"}
                        </button>
                        {player.status !== 'APPROVED' && (
                          <button 
                            onClick={() => handleStatusChange(player.id, 'APPROVED')} 
                            className="flex-1 min-w-[70px] inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-all shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                        {player.status !== 'REJECTED' && (
                          <button 
                            onClick={() => handleStatusChange(player.id, 'REJECTED')} 
                            className="flex-1 min-w-[70px] inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-all shadow-sm"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                      );
                    })}
                  </div>

                {/* Desktop View Table */}
                <div className={`hidden md:block rounded-2xl border overflow-x-auto transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedPlayers.length > 0 && selectedPlayers.length === filteredPlayers.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPlayers(filteredPlayers.map(p => p.id));
                            else setSelectedPlayers([]);
                          }}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Player Details</th>
                      <th className="p-4">Role / Style</th>
                      <th className="p-4">Documents</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Paid / Free</th>
                      <th className="p-4">Assign Board/Team</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {filteredPlayers.map((player) => {
                      let playerPhoto = player.photoUrl;
                      if (!playerPhoto && player.additional_fields) {
                        try {
                          const fields = JSON.parse(player.additional_fields);
                          const photoFieldKey = Object.keys(fields).find(k => k.toLowerCase().includes('photo') && /\.(jpg|jpeg|png|webp|gif)$/i.test(String(fields[k])));
                          if (photoFieldKey) playerPhoto = fields[photoFieldKey];
                        } catch (e) {}
                      }
                      return (
                      <tr key={player.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedPlayers.includes(player.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedPlayers([...selectedPlayers, player.id]);
                              else setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                            }}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <img src={playerPhoto || "https://placehold.co/40"} onClick={() => playerPhoto && setFullPhotoUrl(playerPhoto)} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 cursor-zoom-in" />
                          <div>
                            <div className="font-extrabold flex items-center gap-1.5">
                              {player.name}
                            </div>
                            <div className="text-[10px] text-amber-600 font-bold tracking-wider mt-0.5">KPL-PLY-{player.id.substring(0,8).toUpperCase()}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{player.mobile}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>{player.playingRole}</div>
                          <div className="text-xs text-slate-400">{player.battingStyle || 'None'} / {player.bowlingStyle || 'None'}</div>
                        </td>
                        <td className="p-4">
                          {player.documentUrl ? (
                            <a href={player.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 font-bold hover:underline">View ID Document</a>
                          ) : "No Doc"}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            player.status === 'APPROVED' 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : player.status === 'REJECTED' 
                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}>{player.status}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            player.paymentId 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          }`}>
                            {player.paymentId ? 'PAID' : 'FREE'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select value={player.teamId || "none"} onChange={(e) => handleAssignTeam(player.id, e.target.value)} className={`border rounded-lg p-2 text-xs outline-none transition-colors duration-200 ${
                            isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}>
                            <option value="none">No Franchise</option>
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedViewPlayer(player)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${
                                isAdminDark 
                                  ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400" 
                                  : "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700"
                              }`}
                            >
                              <Eye size={12} />
                              View
                            </button>
                            <button 
                              onClick={() => {
                                setEditingPlayerId(player.id);
                                setPlayerForm({
                                  name: player.name || "",
                                  fatherName: player.fatherName || "",
                                  email: player.email || "",
                                  mobile: player.mobile || "",
                                  address: player.address || "",
                                  dob: player.dob || "",
                                  playingRole: player.playingRole || "Batsman",
                                  battingStyle: player.battingStyle || "Right Hand",
                                  bowlingStyle: player.bowlingStyle || "None",
                                  isWicketKeeper: player.isWicketKeeper == 1
                                });
                                setShowPlayerForm(true);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${
                                isAdminDark 
                                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <Edit size={12} />
                              Modify
                            </button>
                            <button 
                              onClick={() => handleTogglePayment(player.id, player.paymentId ? null : 'MANUAL_PAID')}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${
                                player.paymentId 
                                  ? "bg-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400" 
                                  : "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                              }`}
                            >
                              {player.paymentId ? "Mark Unpaid" : "Mark Paid"}
                            </button>
                            {player.status !== 'APPROVED' && (
                              <button 
                                onClick={() => handleStatusChange(player.id, 'APPROVED')} 
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-all shadow-sm"
                              >
                                Approve
                              </button>
                            )}
                            {player.status !== 'REJECTED' && (
                              <button 
                                onClick={() => handleStatusChange(player.id, 'REJECTED')} 
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500 text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition-all shadow-sm"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    )}

        {/* 10. Slider Banners / Highlights Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">Gallery Highlights</h2>
                <p className="text-xs text-slate-400 mt-1">Manage Slider Banners & Match Highlights shown on the site.</p>
              </div>
              <button 
                onClick={() => setShowGalleryForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Add Highlight Image
              </button>
            </div>

            {/* Modal Add Image Form */}
            <Modal isOpen={showGalleryForm} onClose={() => setShowGalleryForm(false)} title="Add Highlight Image" isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddGallery(e); setShowGalleryForm(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Image URL</label>
                  <input type="url" required={!galleryFile} value={galleryForm.url} onChange={e => setGalleryForm({...galleryForm, url: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Or Upload Image File</label>
                  <input type="file" id="galleryFileInput" accept="image/*" onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)} className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  } file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Album Name</label>
                  <input type="text" value={galleryForm.album} onChange={e => setGalleryForm({...galleryForm, album: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} placeholder="Match Highlights, etc." />
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all">Add Image</button>
              </form>
            </Modal>

            {/* Full Width Grid */}
            {gallery.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <Image className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No highlight images</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No highlight images or slider banners have been uploaded yet. Click "Add Highlight Image" to upload files.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map(g => (
                  <div key={g.id} className="overflow-hidden aspect-video rounded-2xl relative border border-slate-200 dark:border-slate-800 hover:scale-[1.02] transition-transform duration-200 shadow-sm group">
                    <img src={g.url} className="w-full h-full object-cover" />
                    {g.album && (
                      <span className="absolute bottom-2 left-2 text-[10px] bg-slate-950/75 text-white px-2 py-0.5 rounded-lg font-bold border border-white/10 backdrop-blur-sm">
                        {g.album}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 11. System Settings Tab */}
        {activeTab === "settings" && isSuperAdmin && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Tournament Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your tournament platform</p>
              </div>
              {/* Sub-tab Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                {[
                  { id: "site", label: "Site Settings" },
                  { id: "payments", label: "Payments" },
                  { id: "form_builder", label: "Form Builder" },
                  { id: "landing_page", label: "🖼️ Landing Page" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsSubTab(tab.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settingsSubTab === tab.id
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-500 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Site Settings ── */}
            {settingsSubTab === "site" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                {/* Branding & Logo */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Branding</h3>
                  
                  {/* Current Logo Preview */}
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl border flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 ${
                      isAdminDark ? "border-slate-700" : "border-slate-200"
                    }`}>
                      {settingsForm.site_logo ? (
                        <img src={settingsForm.site_logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Logo</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-bold text-slate-400">Site Logo</label>
                      <input 
                        type="file" 
                        id="siteLogoInput" 
                        accept="image/*" 
                        onChange={e => setLogoFile(e.target.files ? e.target.files[0] : null)} 
                        className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        } file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`} 
                      />
                      <input 
                        type="text" 
                        value={settingsForm.site_logo} 
                        onChange={e => setSettingsForm({...settingsForm, site_logo: e.target.value})} 
                        placeholder="Or enter logo image URL..." 
                        className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} 
                      />
                    </div>
                  </div>

                  {/* Current Favicon Preview & Input */}
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className={`w-16 h-16 rounded-xl border flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 ${
                      isAdminDark ? "border-slate-700" : "border-slate-200"
                    }`}>
                      {settingsForm.site_favicon ? (
                        <img src={settingsForm.site_favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Favicon</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-bold text-slate-400">Site Favicon (.ico, .png)</label>
                      <input 
                        type="file" 
                        id="siteFaviconInput" 
                        accept="image/x-icon,image/png,image/jpeg" 
                        onChange={e => setFaviconFile(e.target.files ? e.target.files[0] : null)} 
                        className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        } file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`} 
                      />
                      <input 
                        type="text" 
                        value={settingsForm.site_favicon} 
                        onChange={e => setSettingsForm({...settingsForm, site_favicon: e.target.value})} 
                        placeholder="Or enter favicon URL..." 
                        className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Site Title</label>
                      <input type="text" value={settingsForm.site_title} onChange={e => setSettingsForm({...settingsForm, site_title: e.target.value})} placeholder="e.g. Khoraghat Premier League" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Tournament Title</label>
                      <input type="text" value={settingsForm.site_name} onChange={e => setSettingsForm({...settingsForm, site_name: e.target.value})} placeholder="e.g. KPL Season 2" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Logo Display Style</label>
                    <select value={settingsForm.logo_display_style} onChange={e => setSettingsForm({...settingsForm, logo_display_style: e.target.value})} className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                      <option value="logo_text">Logo and Text</option>
                      <option value="logo_only">Logo Only</option>
                      <option value="text_only">Text Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Site Description</label>
                    <textarea rows={2} value={settingsForm.site_description} onChange={e => setSettingsForm({...settingsForm, site_description: e.target.value})} placeholder="General description shown in search results and social media..." className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 resize-none ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Footer Copyright Text</label>
                      <input type="text" value={settingsForm.footer_copyright} onChange={e => setSettingsForm({...settingsForm, footer_copyright: e.target.value})} placeholder="e.g. © 2026 KPL. Season 2. All rights reserved." className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Footer Organized By</label>
                      <input type="text" value={settingsForm.footer_organized_by} onChange={e => setSettingsForm({...settingsForm, footer_organized_by: e.target.value})} placeholder="e.g. Organized by KPL. Organizing Committee" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                </div>

                {/* Hero Section settings */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Hero Badge</label>
                      <input type="text" value={settingsForm.hero_badge} onChange={e => setSettingsForm({...settingsForm, hero_badge: e.target.value})} placeholder="e.g. Season 2 Begins Soon" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Hero Title</label>
                      <input type="text" value={settingsForm.hero_title} onChange={e => setSettingsForm({...settingsForm, hero_title: e.target.value})} placeholder="e.g. WHERE LOCAL CRICKET COMES ALIVE" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Hero Description</label>
                    <textarea rows={2} value={settingsForm.hero_description} onChange={e => setSettingsForm({...settingsForm, hero_description: e.target.value})} placeholder="Short description shown on the homepage..." className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 resize-none ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                  </div>
                </div>



                {/* Contact */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Contact Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Contact Phone</label>
                      <input type="text" value={settingsForm.contact_phone} onChange={e => setSettingsForm({...settingsForm, contact_phone: e.target.value})} placeholder="+91 98765 43210" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Contact Email</label>
                      <input type="email" value={settingsForm.contact_email} onChange={e => setSettingsForm({...settingsForm, contact_email: e.target.value})} placeholder="info@kplseason2.com" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Ground / Venue Address</label>
                    <input type="text" value={settingsForm.contact_address} onChange={e => setSettingsForm({...settingsForm, contact_address: e.target.value})} placeholder="Khoraghat Cricket Ground, Bilasipara, Assam" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                  </div>
                </div>
                
                <button type="submit" className="px-6 py-3 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md">Save Site Settings</button>
              </form>
            )}

            {/* ── Payments ── */}
            {settingsSubTab === "payments" && (
              <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
                {/* Fees */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Registration Fees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Player Fee (₹)</label>
                      <input type="number" value={(settingsForm as any).payment_player_fee ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_player_fee: e.target.value} as any)} placeholder="e.g. 500" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Team Fee (₹)</label>
                      <input type="number" value={(settingsForm as any).payment_team_fee ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_team_fee: e.target.value} as any)} placeholder="e.g. 5000" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                </div>
                {/* Bank / UPI */}
                <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">UPI / Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">UPI ID</label>
                      <input type="text" value={(settingsForm as any).payment_upi_id ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_upi_id: e.target.value} as any)} placeholder="e.g. kpl@upi" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Account Holder Name</label>
                      <input type="text" value={(settingsForm as any).payment_account_name ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_account_name: e.target.value} as any)} placeholder="e.g. KPL Tournament" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Bank Account Number</label>
                      <input type="text" value={(settingsForm as any).payment_account_no ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_account_no: e.target.value} as any)} placeholder="e.g. 0123456789" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">IFSC Code</label>
                      <input type="text" value={(settingsForm as any).payment_ifsc ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_ifsc: e.target.value} as any)} placeholder="e.g. SBIN0001234" className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Payment Instructions</label>
                    <textarea rows={3} value={(settingsForm as any).payment_instructions ?? ""} onChange={e => setSettingsForm({...settingsForm, payment_instructions: e.target.value} as any)} placeholder="Payment notes shown to players during registration..." className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 resize-none ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} />
                  </div>
                </div>
                {/* ── Payment Gateway ── */}
                <div className={`p-6 rounded-2xl border space-y-5 transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  {/* Header row: title + enabled toggle + active badge */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Payment Gateway</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Select a gateway &amp; enter API credentials to enable online payments.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Active method badge */}
                      {settingsForm.payment_gateway && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          settingsForm.payment_gateway_enabled === "1"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                            : "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
                        }`}>
                          {settingsForm.payment_gateway_enabled === "1" ? "🟢" : "⚪"}&nbsp;
                          {settingsForm.payment_gateway.charAt(0).toUpperCase() + settingsForm.payment_gateway.slice(1)}
                          &nbsp;{settingsForm.payment_gateway_enabled === "1" ? "ON" : "OFF"}
                        </span>
                      )}
                      {/* Master ON/OFF toggle */}
                      <button
                        type="button"
                        onClick={() => setSettingsForm({...settingsForm, payment_gateway_enabled: settingsForm.payment_gateway_enabled === "1" ? "0" : "1"})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          settingsForm.payment_gateway_enabled === "1" ? "bg-emerald-500" : isAdminDark ? "bg-slate-700" : "bg-slate-300"
                        }`}
                        title={settingsForm.payment_gateway_enabled === "1" ? "Disable Gateway" : "Enable Gateway"}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          settingsForm.payment_gateway_enabled === "1" ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                      <span className={`text-xs font-bold ${
                        settingsForm.payment_gateway_enabled === "1" ? "text-emerald-500" : "text-slate-400"
                      }`}>
                        {settingsForm.payment_gateway_enabled === "1" ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  {/* Gateway selector cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "razorpay", label: "Razorpay", color: "#3395FF", bg: "#EBF5FF", desc: "REST API v1" },
                      { id: "paytm",    label: "Paytm",    color: "#00BAF2", bg: "#E5F8FF", desc: "PG API v2" },
                      { id: "payu",     label: "PayU",     color: "#FF6B00", bg: "#FFF3EB", desc: "PayU Biz API" },
                      { id: "cashfree", label: "Cashfree", color: "#09AE6D", bg: "#E8FBF3", desc: "Orders API v2" },
                    ].map(gw => {
                      const isActive = settingsForm.payment_gateway === gw.id;
                      const isEnabled = isActive && settingsForm.payment_gateway_enabled === "1";
                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSettingsForm({...settingsForm, payment_gateway: gw.id})}
                          className={`relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                            isActive
                              ? "shadow-md scale-105"
                              : `border-transparent ${isAdminDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"}`
                          }`}
                          style={isActive ? { borderColor: gw.color, background: isAdminDark ? "#1e293b" : gw.bg } : {}}
                        >
                          {/* ON/OFF dot indicator */}
                          <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
                            isEnabled ? "bg-emerald-500" : isActive ? "bg-slate-300" : "bg-transparent"
                          }`} />
                          <span className="text-base font-black tracking-tight" style={{ color: isActive ? gw.color : undefined }}>{gw.label}</span>
                          <span className="text-[9px] font-semibold opacity-60">{gw.desc}</span>
                          {isActive && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5" style={{ background: gw.color, color: "#fff" }}>
                              {isEnabled ? "ACTIVE" : "SELECTED"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* API credentials — only show when a gateway is picked */}
                  {settingsForm.payment_gateway && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">
                            {settingsForm.payment_gateway === "paytm" ? "Merchant ID" : "API Key / Key ID"}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.payment_gateway_key ?? ""}
                            onChange={e => setSettingsForm({...settingsForm, payment_gateway_key: e.target.value})}
                            placeholder={settingsForm.payment_gateway === "razorpay" ? "rzp_live_..." : settingsForm.payment_gateway === "paytm" ? "YOUR_MID" : settingsForm.payment_gateway === "payu" ? "gtKFFx" : "TEST_API_KEY"}
                            className={`w-full border rounded-xl p-3 text-xs outline-none font-mono transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">
                            {settingsForm.payment_gateway === "paytm" ? "Merchant Key" : "API Secret / Key Secret"}
                          </label>
                          <input
                            type="password"
                            value={settingsForm.payment_gateway_secret ?? ""}
                            onChange={e => setSettingsForm({...settingsForm, payment_gateway_secret: e.target.value})}
                            placeholder="••••••••••••••••"
                            className={`w-full border rounded-xl p-3 text-xs outline-none font-mono transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Webhook Secret <span className="font-normal text-slate-300">(optional)</span></label>
                        <input
                          type="text"
                          value={settingsForm.payment_gateway_webhook ?? ""}
                          onChange={e => setSettingsForm({...settingsForm, payment_gateway_webhook: e.target.value})}
                          placeholder="Webhook verification secret from gateway dashboard"
                          className={`w-full border rounded-xl p-3 text-xs outline-none font-mono transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                        />
                      </div>
                      <div className={`flex items-start gap-2 p-3 rounded-xl text-xs ${isAdminDark ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
                        <span className="mt-0.5">⚠</span>
                        <span>API credentials are stored securely. Never share your secret key. Use <strong>test/sandbox</strong> keys during development.</span>
                      </div>
                    </div>
                  )}
                </div>
                <button type="submit" className="px-6 py-3 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md">Save Payment Settings</button>
              </form>
            )}

            {/* ── Form Builder ── */}
            {settingsSubTab === "form_builder" && (() => {
              const schemaKey = formBuilderType === "player" ? "player_form_schema" : "team_form_schema";
              const paymentTypeKey = formBuilderType === "player" ? "player_form_payment_type" : "team_form_payment_type";
              const paymentFeeKey = formBuilderType === "player" ? "player_form_payment_fee" : "team_form_payment_fee";

              const schemaList = settingsForm[schemaKey] || [];
              const paymentType = settingsForm[paymentTypeKey] || "free";
              const paymentFee = settingsForm[paymentFeeKey] || "0";

              return (
                <div className="space-y-6 max-w-4xl">
                  {/* Select Form Type */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 self-start w-fit">
                    {[
                      { id: "player", label: "Player Registration Form" },
                      { id: "team", label: "Team Registration Form" }
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormBuilderType(type.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          formBuilderType === type.id
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-500 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* General Settings */}
                  <div className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                  }`}>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {formBuilderType === "player" ? "Player" : "Team"} Registration Payment Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Registration Type</label>
                        <select 
                          value={paymentType} 
                          onChange={e => setSettingsForm({...settingsForm, [paymentTypeKey]: e.target.value})} 
                          className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                        >
                          <option value="free">Free Registration</option>
                          <option value="paid">Paid Registration</option>
                        </select>
                      </div>
                      {paymentType === "paid" && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Registration Fee (₹)</label>
                          <input 
                            type="number" 
                            value={paymentFee} 
                            onChange={e => setSettingsForm({...settingsForm, [paymentFeeKey]: e.target.value})} 
                            placeholder="e.g. 500" 
                            className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fields Builder */}
                  <div className={`p-6 rounded-2xl border space-y-6 transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                  }`}>
                    <div className="flex justify-between items-center pb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Form Fields</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Define inputs required from {formBuilderType === "player" ? "players" : "franchise owners"} during registration.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newField = {
                            id: "custom_" + Date.now(),
                            label: "New Custom Field",
                            type: "text",
                            required: false,
                            options: []
                          };
                          setSettingsForm({
                            ...settingsForm,
                            [schemaKey]: [...schemaList, newField]
                          });
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
                      >
                        <Plus size={14} /> Add Custom Field
                      </button>
                    </div>

                    <div className="space-y-4">
                      {schemaList.map((field: any, index: number) => {
                        const isCore = formBuilderType === "player"
                          ? ["name", "fatherName", "mobile", "email", "dob", "playingRole", "battingStyle", "bowlingStyle", "address", "isWicketKeeper", "photo", "document"].includes(field.id)
                          : ["name", "ownerName", "ownerMobile", "description", "logo"].includes(field.id);
                        
                        const isCritical = formBuilderType === "player"
                          ? ["name", "mobile", "photo"].includes(field.id)
                          : ["name", "ownerMobile"].includes(field.id);

                        const updateField = (updatedProperties: any) => {
                          const newSchema = [...schemaList];
                          newSchema[index] = { ...field, ...updatedProperties };
                          setSettingsForm({ ...settingsForm, [schemaKey]: newSchema });
                        };

                        const deleteField = () => {
                          if (isCritical) {
                            alert("This field is critical for registration tracking and cannot be removed.");
                            return;
                          }
                          const newSchema = schemaList.filter((_: any, idx: number) => idx !== index);
                          setSettingsForm({ ...settingsForm, [schemaKey]: newSchema });
                        };

                        const moveField = (direction: "up" | "down") => {
                          const newSchema = [...schemaList];
                          const targetIndex = direction === "up" ? index - 1 : index + 1;
                          if (targetIndex >= 0 && targetIndex < newSchema.length) {
                            const temp = newSchema[index];
                            newSchema[index] = newSchema[targetIndex];
                            newSchema[targetIndex] = temp;
                            setSettingsForm({ ...settingsForm, [schemaKey]: newSchema });
                          }
                        };

                        return (
                          <div 
                            key={field.id || index}
                            className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors ${
                              isAdminDark ? "bg-slate-955/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex-1 w-full space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                  isCritical 
                                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/30" 
                                    : isCore 
                                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" 
                                      : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                                }`}>
                                  {isCritical ? "Critical Core" : isCore ? "Core" : "Custom"}
                                </span>
                                <input 
                                  type="text"
                                  value={field.label}
                                  onChange={e => updateField({ label: e.target.value })}
                                  placeholder="Field Label / Title"
                                  className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none font-semibold ${
                                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                                  }`}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Input Type</label>
                                  <select
                                    disabled={isCore}
                                    value={field.type}
                                    onChange={e => updateField({ type: e.target.value })}
                                    className={`w-full border rounded-lg p-2 text-xs outline-none ${
                                      isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                                    }`}
                                  >
                                    <option value="text">Text Input</option>
                                    <option value="number">Number</option>
                                    <option value="email">Email</option>
                                    <option value="tel">Telephone / Phone</option>
                                    <option value="date">Date</option>
                                    <option value="select">Dropdown Options</option>
                                    <option value="textarea">Paragraph Text</option>
                                    <option value="checkbox">Checkbox Switch</option>
                                    <option value="file">File Upload</option>
                                  </select>
                                </div>

                                <div className="flex items-center gap-2 pt-4">
                                  <input
                                    type="checkbox"
                                    id={`req-${field.id}`}
                                    disabled={isCritical}
                                    checked={field.required}
                                    onChange={e => updateField({ required: e.target.checked })}
                                    className="w-4 h-4 accent-primary"
                                  />
                                  <label htmlFor={`req-${field.id}`} className="text-xs font-semibold text-slate-400 select-none">
                                    Required Field
                                  </label>
                                </div>

                                {field.type === "select" && (
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Dropdown Options (Comma separated)</label>
                                    <input 
                                      type="text"
                                      value={Array.isArray(field.options) ? field.options.join(", ") : field.options || ""}
                                      onChange={e => updateField({ options: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                                      placeholder="Option 1, Option 2, Option 3"
                                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex md:flex-col items-center gap-1.5 pt-2 md:pt-0 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-200 dark:border-slate-800/80">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveField("up")}
                                className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors ${isAdminDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} disabled:opacity-30`}
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={index === schemaList.length - 1}
                                onClick={() => moveField("down")}
                                className={`p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors ${isAdminDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} disabled:opacity-30`}
                                title="Move Down"
                              >
                                ▼
                              </button>
                              {!isCritical && (
                                <button
                                  type="button"
                                  onClick={deleteField}
                                  className={`p-1.5 rounded-lg border text-rose-500 hover:bg-rose-500 hover:text-white transition-all ${isAdminDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                                  title="Delete Field"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex gap-4">
                      <button 
                        type="button"
                        onClick={handleSaveSettings}
                        className="px-6 py-3 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md"
                      >
                        Save Form Configuration
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 11.4 Landing Page Images Tab */}
        {activeTab === "settings" && isSuperAdmin && settingsSubTab === "landing_page" && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border transition-colors duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
                  <Image size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Landing Page Images</h3>
                  <p className="text-xs text-slate-400">Upload custom photos for each section of the public landing page</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Helper component inline */}
                {([
                  {
                    id: "landingHeroInput",
                    label: "🏟️ Hero Background",
                    desc: "Full-screen stadium/cricket background in the hero section",
                    key: "landing_hero_image" as const,
                    setFile: setLandingHeroFile,
                    file: landingHeroFile
                  },
                  {
                    id: "landingPlayerInput",
                    label: "🏏 Player Action Photo",
                    desc: "Cricket player batting photo used in the About KPL split section",
                    key: "landing_player_image" as const,
                    setFile: setLandingPlayerFile,
                    file: landingPlayerFile
                  },
                  {
                    id: "landingTrophyInput",
                    label: "🏆 Trophy / Prize Photo",
                    desc: "Trophy image shown as floating badge in the About section",
                    key: "landing_trophy_image" as const,
                    setFile: setLandingTrophyFile,
                    file: landingTrophyFile
                  },
                  {
                    id: "landingStatsInput",
                    label: "🌿 Stats Banner Background",
                    desc: "Cricket field panorama used behind the statistics strip",
                    key: "landing_stats_image" as const,
                    setFile: setLandingStatsFile,
                    file: landingStatsFile
                  },
                  {
                    id: "landingTeamInput",
                    label: "👥 Team Promo Strip",
                    desc: "Team celebration/huddle photo used in the promotional banner strip",
                    key: "landing_team_image" as const,
                    setFile: setLandingTeamFile,
                    file: landingTeamFile
                  },
                ] as { id: string; label: string; desc: string; key: string; setFile: (f: File | null) => void; file: File | null }[]).map(({ id, label, desc, key, setFile, file }) => (
                  <div key={id} className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-colors ${
                    isAdminDark ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}>
                    {/* Preview */}
                    <div className="w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {file ? (
                        <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover" />
                      ) : settingsForm[key] ? (
                        <img src={settingsForm[key]} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl opacity-30">🖼️</span>
                      )}
                    </div>
                    {/* Controls */}
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">{label}</label>
                      <p className="text-[10px] text-slate-400">{desc}</p>
                      <input
                        type="file"
                        id={id}
                        accept="image/*"
                        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                        className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        } file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-950`}
                      />
                      <input
                        type="text"
                        value={settingsForm[key] || ""}
                        onChange={e => setSettingsForm({ ...settingsForm, [key]: e.target.value })}
                        placeholder="Or paste image URL..."
                        className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                          isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              isAdminDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"
            }`}>
              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                💡 <strong>Tip:</strong> Recommended image sizes — Hero: 1920×1080px, Player: 900×1200px, Stats/Team/Trophy: 1280×720px. Upload high-quality JPG/PNG/WebP for best results.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings as any}
              className="px-6 py-3 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md"
            >
              Save Landing Page Images
            </button>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Profile</h2>
              <p className="text-xs text-slate-400 mt-1">Manage your personal admin account settings</p>
            </div>

            {/* Profile Detail Card */}
            <div className={`p-6 rounded-2xl border transition-colors duration-200 ${
              isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="relative group shrink-0">
                  <div className={`w-20 h-20 rounded-full font-bold flex items-center justify-center text-2xl shadow-md transition-colors duration-200 overflow-hidden ${
                    isAdminDark ? "bg-slate-800 text-amber-500 border border-slate-700" : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}>
                    {avatarFile ? (
                      <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : adminUser.avatarUrl ? (
                      <img src={adminUser.avatarUrl} alt={adminName} className="w-full h-full object-cover" />
                    ) : (
                      adminInitials
                    )}
                  </div>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute -bottom-1 -right-1 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 p-2 rounded-full cursor-pointer hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-white dark:border-slate-800"
                    title="Upload Avatar"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarFile(e.target.files[0]);
                        }
                      }} 
                    />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-lg font-extrabold">{profileForm.name || adminUser.username}</h3>
                  <p className="text-xs text-slate-400">{profileForm.email}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {adminUser.roleName || "Super Admin"}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveProfile} className="space-y-5 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                      className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-850 border-slate-750 text-white focus:border-amber-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-900"
                      }`} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      disabled 
                      value={profileForm.email} 
                      className={`w-full border rounded-xl p-3 text-xs outline-none opacity-60 cursor-not-allowed ${
                        isAdminDark ? "bg-slate-850 border-slate-750 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                      }`} 
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Email cannot be changed.</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileForm.phone} 
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                      className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-850 border-slate-750 text-white focus:border-amber-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-900"
                      }`} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Change Password</label>
                    <input 
                      type="password" 
                      value={profileForm.password} 
                      onChange={e => setProfileForm({...profileForm, password: e.target.value})} 
                      placeholder="••••••••" 
                      className={`w-full border rounded-xl p-3 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-850 border-slate-750 text-white focus:border-amber-500" : "bg-slate-50 border-slate-200 text-slate-850"
                      }`} 
                    />
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-md mt-2">
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}


        {/* 12. Admin Accounts / Sponsors Tab */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold">Sponsors & Partners</h2>
                <p className="text-xs text-slate-400 mt-1">Manage corporate sponsorships, website links, and partner logo configurations.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingSponsorId(null);
                  setSponsorForm({ name: "", logoUrl: "", website: "" });
                  setShowSponsorForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
              >
                <Plus size={14} />
                Add New Sponsor
              </button>
            </div>

            {/* Modal Add Sponsor Form */}
            <Modal isOpen={showSponsorForm} onClose={() => setShowSponsorForm(false)} title={editingSponsorId ? "Edit Sponsor Info" : "Add New Sponsor"} isAdminDark={isAdminDark}>
              <form onSubmit={(e) => { handleAddSponsor(e); setShowSponsorForm(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Sponsor Name *</label>
                  <input type="text" required value={sponsorForm.name} onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Logo URL</label>
                  <input type="url" required={!sponsorLogoFile} value={sponsorForm.logoUrl} onChange={e => setSponsorForm({...sponsorForm, logoUrl: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Or Upload Logo Image</label>
                  <input type="file" id="sponsorLogoInput" accept="image/*" onChange={e => setSponsorLogoFile(e.target.files ? e.target.files[0] : null)} className={`w-full border rounded-xl p-2 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  } file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white dark:file:bg-amber-500 dark:file:text-slate-955`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Website Link</label>
                  <input type="url" value={sponsorForm.website} onChange={e => setSponsorForm({...sponsorForm, website: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`} placeholder="https://" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all">
                  {editingSponsorId ? "Save Sponsor Changes" : "Save Sponsor"}
                </button>
              </form>
            </Modal>

            {/* Full Width Sponsors Grid */}
            {sponsors.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors duration-200 ${
                isAdminDark ? "bg-slate-900/50 border-slate-850" : "bg-white border-slate-200"
              }`}>
                <Heart className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
                <h3 className="text-sm font-extrabold mb-1">No sponsors added</h3>
                <p className="text-xs text-slate-400 text-center max-w-sm">No corporate sponsors or partners have been added yet. Click "Add New Sponsor" to register one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {sponsors.map(s => (
                  <div key={s.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-200 ${
                    isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                  }`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 flex items-center justify-center mb-3">
                        <img src={s.logoUrl || "https://placehold.co/100x50"} alt={s.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate w-full">{s.name}</span>
                      {s.website && (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber-550 dark:text-amber-500 hover:underline mt-1 truncate w-full">
                          Visit Site
                        </a>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                      {/* Visibility Toggle Switch */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">Visibility:</span>
                        <button
                          onClick={() => handleToggleSponsorVisibility(s.id, parseInt(s.isVisible))}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            parseInt(s.isVisible) === 1 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              parseInt(s.isVisible) === 1 ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Modify & Remove Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSponsorId(s.id);
                            setSponsorForm({
                              name: s.name || "",
                              logoUrl: s.logoUrl || "",
                              website: s.website || ""
                            });
                            setShowSponsorForm(true);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 border rounded-lg text-[9px] font-bold transition-all ${
                            isAdminDark 
                              ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <Edit size={10} />
                          Modify
                        </button>
                        <button
                          onClick={() => handleRemoveSponsor(s.id)}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 border rounded-lg text-[9px] font-bold transition-all ${
                            isAdminDark 
                              ? "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-rose-400" 
                              : "bg-rose-50 border-rose-100 hover:bg-rose-100 text-rose-600"
                          }`}
                        >
                          <Trash2 size={10} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 13. Admin & Roles Tab */}
        {activeTab === "admin_roles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Super Admin Center</h2>
                <p className="text-xs text-slate-400 mt-1">Control administrative accounts and dashboard access</p>
              </div>
              
              {/* Sub-tab Switcher near heading */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => setAdminSubTab("admins")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    adminSubTab === "admins"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-500 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  Administrators
                </button>
                <button
                  onClick={() => setAdminSubTab("roles")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    adminSubTab === "roles"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-500 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  Roles & Permissions
                </button>
              </div>
            </div>

            {adminSubTab === "admins" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Administrators</h3>
                  <button 
                    onClick={() => {
                      setAdminForm({ username: "", password: "", name: "", roleId: "", email: "", phone: "" });
                      setShowAdminForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    Add Admin
                  </button>
                </div>

                {/* Modal Add/Modify Admin Form */}
                <Modal 
                  isOpen={showAdminForm} 
                  onClose={() => {
                    setShowAdminForm(false);
                    setAdminForm({ username: "", password: "", name: "", roleId: "", email: "", phone: "" });
                  }} 
                  title={!!(adminForm as any).id ? "Modify Administrator Account" : "Add Administrator Account"} 
                  isAdminDark={isAdminDark}
                >
                  <form onSubmit={(e) => { handleAddAdmin(e); setShowAdminForm(false); }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Username *</label>
                      <input type="text" required value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Password {!!(adminForm as any).id ? "(Leave blank to keep current)" : "*"}</label>
                      <input type="password" required={!(adminForm as any).id} value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Display Name</label>
                      <input type="text" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Role</label>
                      <select value={adminForm.roleId} onChange={e => setAdminForm({...adminForm, roleId: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}>
                        <option value="">Select Role</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Email Address</label>
                      <input type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-400">Phone Number</label>
                      <input type="text" value={adminForm.phone} onChange={e => setAdminForm({...adminForm, phone: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all">
                      {!!(adminForm as any).id ? "Update Admin" : "Save Admin"}
                    </button>
                  </form>
                </Modal>

                {/* Admins Grid (Exactly like Image) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admins.map((adm) => (
                    <div 
                      key={adm.id} 
                      className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                        isAdminDark 
                          ? "bg-slate-900 border-slate-800 text-white animate-fade-in" 
                          : "bg-white border-slate-200/85 text-slate-800 animate-fade-in"
                      }`}
                      style={{ boxShadow: 'rgba(0, 0, 0, 0.02) 0px 4px 12px' }}
                    >
                      <div>
                        {/* Avatar & Role Badge */}
                        <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                            isAdminDark 
                              ? "bg-slate-800 border-slate-700 text-slate-300" 
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}>
                            <User size={20} />
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-extrabold border transition-all ${
                            adm.roleName?.toLowerCase().includes("super")
                              ? "bg-slate-950 text-white border-slate-950 dark:bg-white dark:text-slate-950 dark:border-white shadow-sm"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}>
                            <Shield size={10} />
                            {adm.roleName || "No Role"}
                          </span>
                        </div>

                        {/* Name & Verification */}
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-4">{adm.name || adm.username}</h4>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          Verified
                        </div>

                        {/* Details */}
                        <div className="space-y-2.5 mt-5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Mail size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate">{adm.email || "No Email Address"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Phone size={14} className="text-slate-400 shrink-0" />
                            <span>{adm.phone || "No Mobile Number"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Divider & Actions */}
                      <div>
                        <div className="border-t border-slate-100 dark:border-slate-800/80 my-5" />
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setAdminForm({
                                id: adm.id,
                                username: adm.username,
                                password: "",
                                name: adm.name || "",
                                roleId: adm.roleId || "",
                                email: adm.email || "",
                                phone: adm.phone || ""
                              } as any);
                              setShowAdminForm(true);
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all ${
                              isAdminDark 
                                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <Edit size={12} />
                            Modify
                          </button>
                          <button
                            onClick={() => handleRemoveAdmin(adm.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all ${
                              isAdminDark 
                                ? "bg-red-950/20 border-red-900/50 hover:bg-red-900/30 text-red-400" 
                                : "bg-white border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-slate-500"
                            }`}
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Roles List</h3>
                  <button 
                    onClick={() => {
                      setRoleForm({ name: "", permissions: "" });
                      setShowRoleForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    Add Role
                  </button>
                </div>

                {/* Modal Add Role Form */}
                <Modal isOpen={showRoleForm} onClose={() => { setShowRoleForm(false); setRoleForm({ name: "", permissions: "" }); }} title={!!(roleForm as any).id ? "Modify Role" : "Add New Role"} isAdminDark={isAdminDark}>
                  <form onSubmit={(e) => { handleAddRole(e); setShowRoleForm(false); setRoleForm({ name: "", permissions: "" }); }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-400">Role Name *</label>
                      <input type="text" required value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors duration-200 ${
                        isAdminDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`} placeholder="e.g. Moderator" />
                    </div>
                    
                    {/* Permissions Selecting Method */}
                    <div>
                      <label className="block text-xs font-semibold mb-2.5 text-slate-400">Permissions *</label>
                      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                        {[
                          { id: "players", name: "Player Profiles" },
                          { id: "teams", name: "Franchise Teams" },
                          { id: "matches", name: "Match Schedule" },
                          { id: "gallery", name: "Gallery Highlights" },
                          { id: "sponsors", name: "Sponsors & Partners" },
                          { id: "announcements", name: "News & Announcements" }
                        ].map(m => {
                          const viewId = `view_${m.id}`;
                          const addId = `add_${m.id}`;
                          const isViewChecked = roleForm.permissions.split(',').filter(Boolean).includes(viewId);
                          const isAddChecked = roleForm.permissions.split(',').filter(Boolean).includes(addId);

                          const togglePerm = (permId: string) => {
                            let list = roleForm.permissions ? roleForm.permissions.split(',').filter(Boolean) : [];
                            if (list.includes(permId)) {
                              list = list.filter(item => item !== permId);
                            } else {
                              list.push(permId);
                            }
                            setRoleForm({ ...roleForm, permissions: list.join(',') });
                          };

                          return (
                            <div key={m.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{m.name}</span>
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isViewChecked}
                                    onChange={() => togglePerm(viewId)}
                                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
                                  />
                                  <span>View</span>
                                </label>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isAddChecked}
                                    onChange={() => togglePerm(addId)}
                                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
                                  />
                                  <span>Add/Edit</span>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-905 font-bold rounded-xl text-xs hover:opacity-90 transition-all">
                      {!!(roleForm as any).id ? "Update Role" : "Create Role"}
                    </button>
                  </form>
                </Modal>

                {/* Roles Table */}
                <div className={`rounded-2xl border overflow-x-auto transition-colors duration-200 ${
                  isAdminDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}>
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                        <th className="p-4">Role Name</th>
                        <th className="p-4">Permissions</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-bold">{role.name}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.split(',').filter(Boolean).map((p: string) => (
                                <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-303 border border-slate-200 dark:border-slate-700 font-semibold">{p}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setRoleForm({
                                    id: role.id,
                                    name: role.name,
                                    permissions: role.permissions
                                  } as any);
                                  setShowRoleForm(true);
                                }}
                                className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                  isAdminDark 
                                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" 
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <Edit size={10} />
                                Modify
                              </button>
                              <button
                                onClick={() => handleRemoveRole(role.id)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                  isAdminDark 
                                    ? "bg-red-950/20 border-red-900/50 hover:bg-red-900/30 text-red-400" 
                                    : "bg-white border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-slate-500"
                                }`}
                              >
                                <Trash2 size={10} />
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Layout wrapper component to conditionally handle Login state
function AdminDashboardWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("kpl_admin_token"));
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }
  return <AdminDashboard />;
}

// 10. Rules Page
function Rules() {
  return (
    <div className="py-24 max-w-3xl mx-auto px-4">
      <h1 className="font-heading text-4xl sm:text-6xl font-black text-white text-center mb-12">Tournament <span className="text-primary">Rules</span></h1>
      <div className="glass-card p-8 space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
        <p className="text-white font-semibold">Please read the following guidelines and tournament regulations carefully:</p>
        <ol className="list-decimal list-inside space-y-4">
          <li>All matches are 10 overs per side, played using sixit hard tennis balls.</li>
          <li>A player can only represent the franchise that has drafted them in the season auction pool.</li>
          <li>Standard ICC guidelines apply for wide balls, no balls, and running between the wickets.</li>
          <li>In case of a tie, a Super Over will determine the winner.</li>
          <li>Decisions made by the on-field umpires are final and binding.</li>
        </ol>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// main Router App
export default function App() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("https://kpl.devkayy.in/api/settings.php")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data.site_title) {
          document.title = data.site_title;
        }
        if (data.site_favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.site_favicon;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar settings={settings} />
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Home />} /> {/* Home handles description sections */}
              <Route path="/teams" element={<Teams />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/admin" element={<AdminDashboardWrapper />} />
              <Route path="/admin/login" element={<AdminDashboardWrapper />} />
              <Route path="/admin/dashboard" element={<AdminDashboardWrapper />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer settings={settings} />
      </div>
    </Router>
  );
}
