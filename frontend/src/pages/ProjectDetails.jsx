import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [joinRequest, setJoinRequest] = useState(null);

  useEffect(() => {
    const fetchProjectAndRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:3000/api/projects/all-projects`
        );

        const found = res.data.find((p) => p._id === id);
        setProject(found);

        if (token && found) {
          const resReq = await axios.get(
            `http://localhost:3000/api/projects/my-join-requests`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const req = resReq.data.find((r) => r.project === found._id);
          setJoinRequest(req);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjectAndRequests();
  }, [id]);

  const userId = localStorage.getItem("userId");
  const isJoined = project?.teamMembers?.some(
    (memberId) => memberId === userId
  );
  const isOwner = project?.createdBy === userId;

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3000/api/projects/join-request/${project._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Successfully requested, reload to update UI
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error sending join request");
    }
  };

  const handleLeaveClick = () => {
    setShowConfirmModal(true);
  };

  const confirmLeave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3000/api/projects/leave/${project._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Error leaving project");
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (!project) return (
    <div className="min-h-screen text-white bg-[#0b0914] flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );

  // Helper to construct the dynamic title view
  const titleWords = project.title ? project.title.split(' ') : ['Project', 'Name'];
  const firstWord = titleWords[0];
  const restOfTitle = titleWords.slice(1).join(' ');

  return (
    <div className="min-h-screen text-white flex flex-col font-sans bg-[#0b0914] relative">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at top right, rgba(11,9,20,0) 0%, #0b0914 90%), url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>

      {/* TOP NAVBAR */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-[#0b0914]/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center gap-10">
          <div className="text-xl font-bold flex gap-2">
            <span className="text-white tracking-widest leading-none">NEON</span>
            <span className="text-gray-400 font-light tracking-widest leading-none">NEBULA</span>
          </div>

          <nav className="flex gap-8 text-sm font-medium text-gray-400">
            <a onClick={() => navigate("/dashboard")} className="hover:text-white transition cursor-pointer">Dashboard</a>
            <a onClick={() => navigate("/discover")} className="hover:text-white transition cursor-pointer">Discover</a>
            <a className="text-white border-b-2 border-purple-500 pb-1 cursor-pointer">Project</a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-gray-400 hover:text-white cursor-pointer transition">🔔</div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition">💬</div>
          <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
             <img src={"https://i.pravatar.cc/150?img=11"} alt="avatar" />
          </div>
        </div>
      </header>


      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#110e1b] border border-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(0,0,0,0.8)] relative transform scale-100 transition-all">
             <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
               <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <h2 className="text-xl font-bold text-white text-center mb-2">Are you sure?</h2>
             <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
               {isOwner ? "Do you want to delete this project? This action cannot be undone." : "Do you want to leave this project? You will need to rejoin to view its workspace."}
             </p>
             <div className="flex gap-4">
               <button 
                 onClick={() => setShowConfirmModal(false)}
                 className="flex-1 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-2.5 rounded-lg font-semibold transition"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmLeave}
                 className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition"
               >
                 Confirm
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative z-10">
        
        {/* MAIN CONTENT */}
        <main className="flex-1 w-full px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto">
           
           {/* Header Banner Area */}
           <div className="pt-24 pb-16">
              
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-purple-900/40 border border-purple-500/50 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
                  OPERATIONAL
                </span>
                <span className="text-gray-400 text-xs tracking-widest font-semibold uppercase">
                  PROJECT ID: {project._id ? project._id.slice(-6).toUpperCase() : 'QC-2024'}
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-[1.1] flex flex-col md:flex-row gap-3 flex-wrap">
                 <span className="text-white drop-shadow-lg">{firstWord}</span>
                 {restOfTitle && <span className="text-[#8b31ff] drop-shadow-lg">{restOfTitle}</span>}
              </h1>
           </div>
           
           {/* Split Grid */}
           <div className="pb-24 grid lg:grid-cols-[1.5fr_1fr] gap-16">
              
              {/* Left Main */}
              <div className="space-y-16">
                 
                 {/* Section: Overview */}
                 <section>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                       <span className="text-gray-400 font-bold tracking-[0.2em] text-xs uppercase w-full text-right block">PROJECT OVERVIEW</span>
                    </div>

                    <div className="text-gray-300 text-[15px] leading-loose space-y-6 max-w-3xl pr-8">
                       <p>{project.description || "Quantum Cloud Scheduler is a next-generation infrastructure layer designed to handle the volatile demands of modern microservices. By leveraging predictive heuristics, it anticipates resource contention before it impacts performance, ensuring that high-priority workloads remain stable across heterogeneous cloud environments."}</p>
                       <p>At its core, the system utilizes a proprietary orchestration engine that abstracts the underlying cloud provider complexities. Whether deploying to AWS, GCP, or on-premise hardware, the scheduler maintains a unified state of truth, allowing developers to focus on logic rather than provisioning.</p>
                    </div>
                 </section>

                 {/* Section: Tech Stack */}
                 <section>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                       <span className="text-gray-400 font-bold tracking-[0.2em] text-xs uppercase w-full text-right block">TECH STACK</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       {project.requiredSkills && project.requiredSkills.length > 0 ? (
                         project.requiredSkills.map((skill, index) => (
                           <TechBox key={index} title={skill.toUpperCase()} icon={<CubeIcon />} />
                         ))
                       ) : (
                         <>
                           <TechBox title="REACT" icon={<CubeIcon />} />
                           <TechBox title="AWS" icon={<CloudIcon />} />
                           <TechBox title="DOCKER" icon={<CubeIcon />} />
                           <TechBox title="GRAPHQL" icon={<NodeIcon />} />
                         </>
                       )}
                    </div>
                 </section>

                 {/* Section: Core Team */}
                 <section>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                       <span className="text-gray-400 font-bold tracking-[0.2em] text-xs uppercase w-full text-right block">CORE TEAM</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <TeamCard 
                         name="Elena Vance" 
                         role="Systems Architect" 
                         date="Joined: Jan 2024" 
                         status="ONLINE" 
                         statusColor="bg-green-500"
                         img="https://i.pravatar.cc/150?img=32" 
                       />
                       <TeamCard 
                         name="Marcus Thorne" 
                         role="Lead Backend" 
                         date="Joined: Feb 2024" 
                         status="IN FLOW" 
                         statusColor="bg-gray-400"
                         img="https://i.pravatar.cc/150?img=11" 
                       />
                       {/* Render extra mocks if project has more members */}
                       {project.teamMembers && project.teamMembers.length > 2 && (
                          <TeamCard 
                            name="Alex Mercer" 
                            role="Frontend Dev" 
                            date="Joined: Mar 2024" 
                            status="ONLINE" 
                            statusColor="bg-green-500"
                            img="https://i.pravatar.cc/150?img=12" 
                          />
                       )}
                    </div>
                 </section>
              </div>


              {/* Right Sidebar */}
              <div className="space-y-8">
                 
                 {/* Project Intel Card */}
                 <div className="bg-[#110e1b]/60 border border-purple-900/30 rounded-xl p-8 backdrop-blur-md">
                    <h3 className="text-[14px] font-bold tracking-widest uppercase mb-10 flex items-center gap-3">
                       <span className="text-[#8b31ff]">
                         <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                       </span>
                       PROJECT INTEL
                    </h3>

                    <div className="space-y-6 flex flex-col pt-2">
                       
                       <div className="flex justify-between items-center group">
                          <div>
                            <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-1.5 uppercase font-bold">TIMELINE</p>
                            <p className="text-white font-medium text-[15px]">{project.timeline || "Not Specified"}</p>
                          </div>
                          <span className="text-gray-500 group-hover:text-purple-400 transition" style={{fontSize: '20px'}}>📅</span>
                       </div>

                       <div className="w-full h-[1px] bg-gray-800/80"></div>

                       <div className="flex justify-between items-center group">
                          <div>
                            <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-1.5 uppercase font-bold">OPEN ROLES</p>
                            <p className="text-white font-medium text-[15px] flex items-center gap-2">
                               {Math.max(0, (project.roles || 1) - (project.teamMembers?.length || 0))} slots available
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            </p>
                          </div>
                          <span className="text-gray-500 group-hover:text-purple-400 transition" style={{fontSize: '20px'}}>👥</span>
                       </div>

                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                       {(!isJoined && !isOwner) ? (
                         joinRequest && joinRequest.status === "pending" ? (
                           <button disabled className="w-full bg-gray-600 hover:bg-gray-600 text-gray-300 font-black py-4 flex text-center justify-center rounded-lg transition tracking-widest text-[14px] items-center gap-2 uppercase opacity-70 cursor-not-allowed shadow-none">
                              <span>⏳</span> Pending Approval
                           </button>
                         ) : (
                           <button onClick={handleJoin} className="w-full bg-[#00d885] hover:bg-teal-400 text-black font-black py-4 flex text-center justify-center rounded-lg transition tracking-widest text-[14px] items-center gap-2 shadow-[0_0_20px_rgba(0,216,133,0.4)] uppercase">
                              <span>🚀</span> {joinRequest && joinRequest.status === "rejected" ? "Apply Again" : "Join Project"}
                           </button>
                         )
                       ) : (
                         <button onClick={handleLeaveClick} className="w-full bg-red-600/20 border border-red-500 hover:bg-red-600 hover:text-white text-red-500 font-bold py-4 flex text-center justify-center rounded-lg transition tracking-widest text-[14px] items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] uppercase">
                            <span>❌</span> Leave Project
                         </button>
                       )}
                       <button className="w-full bg-[#8b31ff] hover:bg-purple-500 text-white font-semibold py-3 flex text-center justify-center rounded-lg transition tracking-wide text-[14px] items-center gap-2 shadow-[0_0_20px_rgba(139,49,255,0.4)]">
                          <span className="font-mono mt-0.5">&lt;/&gt;</span> Repository Link
                       </button>
                    </div>

                 </div>

                 {/* Network Health Card */}
                 <div className="bg-[#110e1b]/60 border border-gray-800/80 rounded-xl px-2 py-8 flex flex-col backdrop-blur-md">
                    <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-8 pr-1 uppercase font-bold w-full text-center block">NETWORK HEALTH</p>

                    <div className="flex items-end justify-center w-full gap-2 h-24 mt-2 px-6 pb-2">
                       <div className="w-full bg-[#2c1c5e] rounded-t-[3px] h-1/4"></div>
                       <div className="w-full bg-[#452796] rounded-t-[3px] h-2/4"></div>
                       <div className="w-full bg-[#6931d8] rounded-t-[3px] h-[80%]"></div>
                       <div className="w-full bg-[#8b31ff] rounded-t-[3px] h-[60%]"></div>
                       <div className="w-full bg-[#d3b8ff] rounded-t-[3px] h-full shadow-[0_0_15px_rgba(211,184,255,0.4)] relative"></div>
                       <div className="w-full bg-[#8b31ff] rounded-t-[3px] h-[50%]"></div>
                       <div className="w-full bg-[#351e7a] rounded-t-[3px] h-1/5"></div>
                    </div>
                 </div>

              </div>

           </div>
        </main>

      </div>
    </div>
  );
}

// Subcomponents for the exact UI matching

function TechBox({ title, icon }) {
  return (
    <div className="bg-[#0e0b17] border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-5 hover:border-[#8b31ff] transition-colors cursor-pointer group">
      <div className="text-[#8b31ff] scale-[1.3] group-hover:scale-[1.4] transition-transform">
        {icon}
      </div>
      <span className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">{title}</span>
    </div>
  );
}

function TeamCard({ name, role, date, status, statusColor, img }) {
  return (
    <div className="bg-[#0e0b17] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-600 transition cursor-pointer">
       <div className="flex items-center gap-4">
          <div className="relative">
             <img src={img} alt={name} className="w-[52px] h-[52px] rounded-md object-cover" />
             <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black text-white px-1 py-[2px] rounded shadow-sm tracking-wider ${statusColor}`}>
               {status}
             </div>
          </div>
          <div className="flex flex-col gap-0.5 ml-2">
             <span className="text-white font-bold text-[15px]">{name}</span>
             <span className="text-gray-400 text-xs">{role}</span>
          </div>
       </div>
       <div className="self-end pb-2 pr-1">
         <span className="text-[8px] text-[#b375ff] font-bold bg-[#8b31ff]/10 px-2.5 py-1.5 rounded tracking-[0.1em] uppercase">{date}</span>
       </div>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="30" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-5.25A4.5 4.5 0 0 1 17.5 19z"></path>
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
       <circle cx="12" cy="12" r="3" />
       <circle cx="5" cy="6" r="2" />
       <circle cx="19" cy="6" r="2" />
       <circle cx="5" cy="18" r="2" />
       <circle cx="19" cy="18" r="2" />
       <path d="M5 8v8" stroke="currentColor" strokeWidth="2"/>
       <path d="M19 8v8" stroke="currentColor" strokeWidth="2"/>
       <path d="M6 6.5l5 4" stroke="currentColor" strokeWidth="2"/>
       <path d="M18 6.5l-5 4" stroke="currentColor" strokeWidth="2"/>
       <path d="M6 17.5l5-4" stroke="currentColor" strokeWidth="2"/>
       <path d="M18 17.5l-5-4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}