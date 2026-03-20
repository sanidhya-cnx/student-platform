import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, projectRes] = await Promise.all([
          axios.get("http://localhost:3000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:3000/api/projects/my-projects", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUser(userRes.data);
        setProjects(projectRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#110e1b] text-white flex font-sans relative overflow-hidden">
      {/* Dynamic Background Noise/Gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(139,49,255,0.1) 0%, #110e1b 80%), url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
      ></div>

      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] bg-[#110e1b]/95 border-r border-gray-800 backdrop-blur-md z-10 flex flex-col justify-between py-6 shrink-0 relative shadow-2xl">
        <div>
          {/* Logo */}
          <div className="px-6 mb-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
             <div className="bg-purple-600 rounded p-1.5 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
             </div>
             <span className="text-[17px] font-black tracking-widest leading-none">NEON <span className="font-light">NEBULA</span></span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 px-4">
             <SidebarItem icon={<GridIcon/>} label="Dashboard" active />
             <SidebarItem icon={<RocketIcon/>} label="My Projects" onClick={() => navigate("/discover")} />
             <SidebarItem icon={<BookIcon/>} label="Learning Paths" />
             <SidebarItem icon={<UsersIcon/>} label="Team Hub" />
             <SidebarItem icon={<CogIcon/>} label="Settings" />
          </nav>
        </div>

        <div className="px-5">
           <button 
             onClick={() => navigate("/project/create")}
             className="w-full bg-[#8b31ff] hover:bg-purple-500 text-white font-bold py-3.5 rounded-lg transition tracking-wide text-[14px] flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(139,49,255,0.4)] mb-8"
           >
              <span>+</span> New Project
           </button>

           <div className="flex flex-col gap-1">
              <SidebarItem icon={<HelpIcon/>} label="Support" minimal />
              <SidebarItem icon={<LogOutIcon/>} label="Logout" minimal />
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col z-10 overflow-hidden relative">
         
         {/* TOP NAVBAR */}
         <header className="flex items-center justify-between px-10 py-5 border-b border-gray-800/60 bg-[#110e1b]/80 backdrop-blur-sm">
            <h1 className="text-xl font-bold tracking-wide absolute left-1/2 -translate-x-1/2">Nebula Dashboard</h1>
            
            <div className="flex-1"></div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs text-[14px]">🔍</span>
              <input
                placeholder="Search resources..."
                className="bg-[#0b0914] border border-gray-800 px-4 py-2 pl-9 rounded outline-none text-[13px] w-64 focus:border-purple-600 transition"
              />
            </div>
         </header>

         {/* DASHBOARD BODY */}
         <div className="flex-1 overflow-y-auto p-8 lg:p-10 hide-scrollbar pb-24">
            
            <div className="max-w-[1400px] mx-auto space-y-10">
               
               {/* User Banner Card */}
               <div className="bg-[#18112e]/80 border border-purple-900/40 rounded-2xl p-8 flex items-center justify-between backdrop-blur-md shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>

                  <div className="flex items-center gap-6 relative z-10 w-full lg:w-3/4">
                     {/* Avatar */}
                     <div className="relative shrink-0 group-hover:scale-105 transition duration-500">
                        <div className="w-[90px] h-[90px] rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-indigo-500">
                           <img src="https://i.pravatar.cc/150?img=11" alt="Alex Smith" className="w-full h-full rounded-full object-cover border-4 border-[#18112e]" />
                        </div>
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#00d885] text-black text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wider">
                          PRODIGY
                        </div>
                     </div>

                     {/* Info */}
                     <div className="flex flex-col w-full">
                        <h2 className="text-3xl font-black tracking-wide mb-1">{user ? user.name : "Loading..."}</h2>
                        <p className="text-[#a499c7] text-sm mb-4">{user && user.bio ? user.bio : "Senior Technical Track • UI/UX Specialist"}</p>

                        <div className="flex flex-wrap gap-4">
                           <Pill icon="⚡" text="12,450 XP" />
                           <Pill icon="🛡" text="Rank #4" iconColor="text-teal-400" />
                           <Pill icon="📅" text="14 Day Streak" />
                        </div>
                     </div>
                  </div>

                  {/* Level Progress */}
                  <div className="hidden lg:flex flex-col w-1/4 relative z-10 items-end">
                     <div className="flex justify-between w-full mb-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#a499c7] uppercase">Level Progress</span>
                        <span className="text-[12px] font-bold text-white">84%</span>
                     </div>
                     <div className="w-full h-[6px] bg-[#271d47] rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-[#b56ef8] w-[84%] rounded-full shadow-[0_0_10px_rgba(181,110,248,0.6)]"></div>
                     </div>
                     <span className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase mt-2">Next Rank: Titan</span>
                  </div>
               </div>


               {/* My Projects Header */}
               <div className="px-2 flex justify-between items-end">
                  <h3 className="text-[22px] font-bold flex items-center gap-3">
                     <span className="text-purple-500 text-xl">🚀</span> My Projects
                  </h3>
                  <span className="text-[#8b31ff] text-[11px] font-black tracking-[0.15em] uppercase hover:text-white transition cursor-pointer">
                    View All Archive
                  </span>
               </div>

               {/* Projects Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Map existing user projects to dashboard cards */}
                  {projects.map((p, idx) => {
                     // Generate mock progress and color for variety if not in model
                     const sprintProgress = Math.floor(Math.random() * 40 + 40); // 40 to 80
                     const isActive = idx % 2 === 0;

                     return (
                      <div key={p._id} className="bg-[#110e1b]/80 border border-gray-800 rounded-2xl p-6 hover:border-purple-600 transition duration-300 flex flex-col group cursor-pointer shadow-lg backdrop-blur-md relative overflow-hidden" onClick={() => navigate(`/workspace/${p._id}`)}>
                        
                        {/* Glow effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition duration-500"></div>

                        {/* Top Header */}
                        <div className="flex justify-between items-start mb-5 relative z-10">
                           <div className="w-[42px] h-[42px] rounded-xl bg-[#26134b] flex items-center justify-center text-purple-400 group-hover:scale-110 transition duration-300 shadow-md">
                              <ProjectIcon />
                           </div>
                           <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm ${isActive ? 'bg-[#003823] text-[#00d885]' : 'bg-[#3b1261] text-[#b375ff]'}`}>
                             {isActive ? 'ACTIVE' : 'REVIEW'}
                           </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 relative z-10">
                           <h4 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition">{p.title}</h4>
                           <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2 min-h-[40px] mb-6">
                             {p.description || "A next-generation platform solving critical bottlenecks in distributed task management."}
                           </p>
                        </div>

                        {/* Sprint Progress */}
                        <div className="mb-5 relative z-10">
                           <div className="flex justify-between items-center mb-2">
                             <span className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase">Sprint Progress</span>
                             <span className="text-[11px] font-bold text-gray-300">{sprintProgress}%</span>
                           </div>
                           <div className="w-full bg-[#1b1531] h-[5px] rounded-full">
                              <div className="bg-[#8b31ff] h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(139,49,255,0.7)]" style={{ width: `${sprintProgress}%` }}></div>
                           </div>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex gap-2 mb-6 relative z-10 flex-wrap">
                           {p.requiredSkills && p.requiredSkills.slice(0,3).map((s, i) => (
                             <span key={i} className="bg-transparent border border-gray-700 text-gray-400 text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded">
                               {s}
                             </span>
                           ))}
                           {(!p.requiredSkills || p.requiredSkills.length === 0) && (
                              <>
                                <span className="bg-transparent border border-gray-700 text-gray-400 text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded">REACT</span>
                                <span className="bg-transparent border border-gray-700 text-gray-400 text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded">API</span>
                              </>
                           )}
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800/80 relative z-10">
                           <div className="flex -space-x-2">
                              <img className="w-7 h-7 rounded-full border border-[#110e1b] object-cover" src="https://i.pravatar.cc/150?img=11" alt="avatar"/>
                              <img className="w-7 h-7 rounded-full border border-[#110e1b] object-cover" src="https://i.pravatar.cc/150?img=44" alt="avatar"/>
                              <div className="w-7 h-7 rounded-full border border-[#110e1b] bg-[#271d47] text-gray-300 text-[10px] font-bold flex items-center justify-center">
                                 +2
                              </div>
                           </div>
                           <span className="text-[10px] text-gray-500 font-medium tracking-wide">Updated {idx + 1}h ago</span>
                        </div>
                      </div>
                     );
                  })}

                  {/* Start New Project Empty State Card */}
                  <div 
                    onClick={() => navigate("/project/create")}
                    className="bg-[#110e1b]/40 border-2 border-dashed border-gray-800 rounded-2xl p-6 hover:border-purple-600 transition duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[340px] group backdrop-blur-sm"
                  >
                     <div className="w-12 h-12 rounded-full bg-[#26134b] flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-300 mb-4 shadow-lg">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                     </div>
                     <h4 className="text-xl font-bold mb-1 text-white group-hover:text-purple-300 transition">Start New Project</h4>
                     <p className="text-gray-500 text-[13px]">Collaborate or go solo.</p>
                  </div>

               </div>


               {/* Bottom Widgets */}
               <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
                  
                  {/* Learning Velocity */}
                  <div className="bg-[#110e1b]/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-md">
                     <h3 className="text-[16px] font-bold mb-10 flex items-center gap-3 text-white">
                        Learning Velocity
                     </h3>
                     
                     <div className="flex items-end justify-between gap-2 h-48 w-full pb-2 border-b border-gray-800 pl-2">
                        <div className="w-full max-w-[50px] bg-[#3a1d6e] hover:bg-purple-500 transition rounded-t-sm h-1/4"></div>
                        <div className="w-full max-w-[50px] bg-[#3a1d6e] hover:bg-purple-500 transition rounded-t-sm h-2/5"></div>
                        <div className="w-full max-w-[50px] bg-[#3a1d6e] hover:bg-purple-500 transition rounded-t-sm h-1/3"></div>
                        <div className="w-full max-w-[50px] bg-[#3a1d6e] hover:bg-purple-500 transition rounded-t-sm h-2/3"></div>
                        <div className="w-full max-w-[50px] bg-[#4b2787] hover:bg-purple-500 transition rounded-t-sm h-[80%]"></div>
                        <div className="w-full max-w-[50px] bg-[#3a1d6e] hover:bg-purple-500 transition rounded-t-sm h-[65%]"></div>
                        <div className="w-full max-w-[50px] bg-[#5c31a6] hover:bg-purple-400 hover:shadow-[0_0_15px_rgba(189,117,255,0.4)] transition rounded-t-sm h-full"></div>
                     </div>
                     
                     <div className="flex justify-between w-full mt-4 text-[10px] text-gray-500 font-bold tracking-[0.1em] px-2">
                        <span>MON</span>
                        <span>TUE</span>
                        <span>WED</span>
                        <span>THU</span>
                        <span>FRI</span>
                        <span>SAT</span>
                        <span>SUN</span>
                     </div>
                  </div>

                  {/* Daily Goal */}
                  <div className="bg-[#110e1b]/80 border border-gray-800 rounded-2xl p-8 flex flex-col justify-between items-center backdrop-blur-md relative overflow-hidden">
                     <h3 className="text-[16px] font-bold text-white self-start w-full absolute top-8 left-8">
                        Daily Goal
                     </h3>
                     
                     <div className="flex-1 flex items-center justify-center mt-6 w-full relative">
                        {/* Circular Progress (CSS Mock) */}
                        <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-[#110e1b] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                           <div className="absolute inset-0 rounded-full border-[10px] border-[#251945]"></div>
                           <div className="absolute inset-0 rounded-full border-[10px] border-[#8b31ff] border-r-transparent border-t-transparent -rotate-45 shadow-[0_0_15px_rgba(139,49,255,0.4)]"></div>
                           <div className="flex flex-col items-center justify-center z-10">
                              <span className="text-3xl font-black text-white leading-none mb-1">75%</span>
                              <span className="text-[8px] text-gray-400 tracking-[0.2em] font-bold">COMPLETE</span>
                           </div>
                        </div>
                     </div>

                     <button className="w-full bg-[#1b1531] border border-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition tracking-[0.15em] text-[11px] mt-8">
                        ADJUST GOALS
                     </button>
                  </div>

               </div>

            </div>
         </div>
      </main>

      {/* Global Style overrides to hide scrollbar for sleekness */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}




{/* UI Helpers */}

function SidebarItem({ icon, label, active, minimal, onClick }) {
   if (minimal) {
     return (
       <div onClick={onClick} className="flex items-center gap-4 px-4 py-3 cursor-pointer group rounded-lg hover:bg-[#1a1233] transition mt-1">
         <span className="text-gray-500 group-hover:text-gray-300 transition-colors w-5 flex justify-center">{icon}</span>
         <span className="text-[14px] font-medium text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
       </div>
     );
   }

   return (
     <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-xl transition ${active ? 'bg-[#291754] text-white shadow-inner' : 'hover:bg-[#1a1233] text-gray-400 group'}`}>
       <span className={`${active ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors w-5 flex justify-center`}>{icon}</span>
       <span className={`text-[14px] font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'} transition-colors`}>{label}</span>
     </div>
   );
 }
 
 function Pill({ icon, text, iconColor = "text-purple-400" }) {
   return (
     <div className="bg-[#110e1b] border border-purple-900/50 rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm">
       <span className={`text-[14px] ${iconColor}`}>{icon}</span>
       <span className="text-[11px] font-bold text-gray-300 tracking-wide">{text}</span>
     </div>
   );
 }

/* SVG Icons for aesthetic match */

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  );
}
function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.64 3.2C13.882 10.518 10 14 5.235 15.358L4 14.9z"></path><path d="M10 11l-3 3"></path><path d="M12.5 13.5l-3 3"></path><path d="M8 18c0-3 3-5 5-5"></path></svg>
  );
}
function BookIcon() {
  return (
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M12 2v6l3-1.5L18 8V2"></path></svg>
  );
}
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  );
}
function CogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  );
}
function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  );
}
function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  );
}
function ProjectIcon() {
  return (
     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
  );
}