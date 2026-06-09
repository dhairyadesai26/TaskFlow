"use client";
import { supabase } from "./lib/supabase";
import { useState, useEffect } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-sans selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${scrolled ? 'bg-card/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
            </div>
            
            <button 
              onClick={login}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="flex flex-col items-center text-center mt-12 mb-20 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-white/90">TaskFlow 2.0 is now live</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
              The smartest way to <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-gradient-x">
                manage your team.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              TaskFlow brings clarity to your work. A seamless, breathtakingly fast, and utterly beautiful project management experience designed for modern teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-full"></div>
              <button 
                onClick={login}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl shadow-white/10 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10">Continue with Google</span>
                <svg className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative mt-20 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 sm:px-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            
            <div className="hidden md:flex flex-col w-[280px] glass-panel rounded-2xl p-6 z-10 border border-white/10 opacity-80 hover:opacity-100 transition-opacity animate-float translate-y-8" style={{ animationDelay: '1s' }}>
               <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 </div>
                 <span className="text-sm font-bold text-white">New Comment</span>
               </div>
               <p className="text-sm text-gray-300 leading-relaxed italic">"Hey team, the new design drafts are ready for review. Please check them out."</p>
            </div>

            <div className="w-full sm:w-[500px] glass-panel rounded-3xl p-6 sm:p-8 z-20 border border-white/20 shadow-2xl shadow-primary/20 bg-[#0f172a]/90 backdrop-blur-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-white/10 pb-5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] flex items-center justify-center p-[2px] shadow-lg">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Connor&background=0f172a&color=fff" className="w-full h-full rounded-full" alt="Avatar"/>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Launch Campaign</h3>
                    <p className="text-gray-400 text-sm mt-0.5">Due in 2 days</p>
                  </div>
                </div>
                <span className="self-start sm:self-auto px-4 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">In Progress</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-gray-400">
                  <span>Overall Progress</span>
                  <span className="text-white font-bold">65%</span>
                </div>
                <div className="h-3 w-full bg-[#1e293b] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] w-[65%] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col w-[280px] glass-panel rounded-2xl p-6 z-10 border border-white/10 opacity-80 hover:opacity-100 transition-opacity animate-float -translate-y-8" style={{ animationDelay: '0s' }}>
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white">Team Velocity</h4>
                <span className="text-xs font-bold text-emerald-400">+12%</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[40, 70, 45, 90, 65, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[#4f46e5]/80 to-[#8b5cf6]/80 hover:from-[#4f46e5] hover:to-[#8b5cf6] rounded-t-md transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            
          </div>

        </div>
      </main>
      
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-md py-12 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-white">10x</h4>
            <p className="text-sm text-gray-500 font-medium">Faster Delivery</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-white">99%</h4>
            <p className="text-sm text-gray-500 font-medium">Team Satisfaction</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-white">24/7</h4>
            <p className="text-sm text-gray-500 font-medium">Cloud Sync</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-white">100%</h4>
            <p className="text-sm text-gray-500 font-medium">Secure Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
