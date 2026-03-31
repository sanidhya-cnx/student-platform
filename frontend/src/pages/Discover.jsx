import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

export default function Discover() {
  const [projects, setProjects] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsAndRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        // Fetch projects
        const resProjects = await axios.get(
          "http://localhost:3000/api/projects/all-projects"
        );
        const filtered = resProjects.data.filter(
          (p) => p.createdBy !== userId && !p.teamMembers?.includes(userId)
        );
        setProjects(filtered);

        // Fetch join requests
        if (token) {
          const resRequests = await axios.get(
            "http://localhost:3000/api/projects/my-join-requests",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setJoinRequests(resRequests.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjectsAndRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0b14] text-white pb-10">
      {/* Navbar */}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery}/>

      <div className="w-full px-10 pt-8 max-w-[1600px] mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#b375ff] transition group mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="font-bold tracking-wide text-sm">Dashboard</span>
        </button>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-10">
        
        {/* TRENDING PROJECTS HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[26px] font-bold tracking-wide flex items-center gap-3">
             <span className="text-[#8b31ff]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                   <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
             </span>
             Trending Projects
          </h2>
          <span className="text-[#b375ff] text-[15px] cursor-pointer hover:text-white transition font-medium">View all trends</span>
        </div>

        {/* TRENDING GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {projects.slice(0, 3).map((p, i) => {
             const request = joinRequests.find((r) => r.project === p._id || (r.project._id && r.project._id === p._id));
             const tagStyles = [
               { text: "HIGH IMPACT", bg: "bg-purple-600/20 text-[#d3b8ff] border-purple-600/40" },
               { text: "OPEN SOURCE", bg: "bg-green-600/20 text-[#a3f0c3] border-green-600/40" },
               { text: "DESIGN-FIRST", bg: "bg-blue-600/20 text-[#9bc5ff] border-blue-600/40" }
             ];
             const tagStyle = tagStyles[i % tagStyles.length];
             return <TrendingCard key={i} project={p} joinRequest={request} tagStyle={tagStyle} nav={navigate} />;
          })}
        </div>

        {/* EXPLORE PROJECTS DIVIDER HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 mt-6">
          <div>
            <h2 className="text-[26px] font-bold tracking-wide mb-1.5">Explore Projects</h2>
            <p className="text-[#a19bae] text-[15px]">Find your next big project and collaborate with developers worldwide.</p>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
             <button
                onClick={() => setActiveFilter("All Projects")}
                className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFilter === "All Projects" ? "bg-[#8b31ff] text-white" : "bg-[#1c182b] text-gray-300 hover:bg-[#2c224a]"}`}
             >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V19.5L10 21.5V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" />
                </svg>
                All Projects
             </button>
             {["React", "Python", "UI Design", "Node.js"].map(filter => (
               <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFilter === filter ? "bg-[#8b31ff] text-white" : "bg-[#251f38] text-gray-300 hover:bg-[#403360]"}`}
               >
                 {filter}
               </button>
             ))}
             <button className="shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#251f38] text-gray-300 hover:bg-[#403360] transition-colors">
               ...
             </button>
          </div>
        </div>

        {/* EXPLORE GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects
            .filter((p) => {
              const query = searchQuery ? searchQuery.toLowerCase() : "";
              
              let matchesSearch = true;
              if (query) {
                  matchesSearch = !!(
                    (p.title && p.title.toLowerCase().includes(query)) ||
                    (p.description && p.description.toLowerCase().includes(query)) ||
                    (p.requiredSkills && Array.isArray(p.requiredSkills) && p.requiredSkills.some((skill) => skill.toLowerCase().includes(query)))
                  );
              }
              
              if (activeFilter === "All Projects") return matchesSearch;
              const matchesTag = p.requiredSkills && Array.isArray(p.requiredSkills) && p.requiredSkills.some(skill => skill.toLowerCase() === activeFilter.toLowerCase());
              return matchesSearch && matchesTag;
            })
            .map((p, i) => {
              const request = joinRequests.find((r) => r.project === p._id || (r.project._id && r.project._id === p._id));
              return <ProjectCard key={i} project={p} joinRequest={request} />;
            })}
        </div>

        <div className="flex justify-center mt-12 mb-6">
          <button className="bg-[#251f38] text-white font-bold px-8 py-3.5 rounded-lg hover:bg-[#403360] transition text-sm">
            Load More Projects
          </button>
        </div>
      </div>

      <footer className="text-center text-[#a19bae] text-sm py-8 border-t border-white/5 mt-8 w-full">
        © 2024 DevConnect Marketplace. Empowering developers through collaboration.
      </footer>
    </div>
  );
}

function TrendingCard({ project, joinRequest, tagStyle, nav }) {
  const handleJoin = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/projects/join-request/${projectId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (error) { 
      console.log(error); 
      alert(error.response?.data?.message || "Failed to submit join request.");
    }
  };

  const handleLeave = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/projects/leave/${projectId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (error) { 
      console.log(error); 
      alert(error.response?.data?.message || "Failed to leave project.");
    }
  };

  const userId = localStorage.getItem("userId");
  const isJoined = project?.teamMembers?.includes(userId);
  const isOwner = project?.createdBy === userId;

  return (
    <div 
      onClick={() => isJoined || isOwner ? nav(`/workspace/${project._id}`) : nav(`/project/${project._id}`)}
      className="bg-[#1a162b] border border-[#2c224a] rounded-xl p-6 flex flex-col justify-between hover:border-[#8b31ff] transition-colors cursor-pointer shadow-xl h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
           <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border ${tagStyle.bg}`}>
             {tagStyle.text}
           </span>
           <div className="flex items-center gap-2 text-gray-400 text-xs font-bold font-mono">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM19 20V19C19 16.79 17.21 15 15 15H9C6.79 15 5 16.79 5 19V20H19Z"/>
              </svg>
              <span>{project.teamMembers?.length || 0}/8 Joined</span>
           </div>
        </div>

        <h3 className="text-[20px] font-bold text-white mb-2">{project.title}</h3>
        <p className="text-[#a19bae] text-[14px] line-clamp-3 mb-6 bg-transparent">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
           {project.requiredSkills?.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[11px] font-medium bg-[#251f38] text-gray-300 px-3 py-1.5 rounded border border-[#2c224a]">
                 {skill}
              </span>
           ))}
        </div>
      </div>

      <div className="mt-auto">
        {isOwner ? (
          <button onClick={(e) => { e.stopPropagation(); nav(`/workspace/${project._id}`); }} className="w-full bg-[#1b8a4f] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-[#23af64] transition">Go to Workspace</button>
        ) : isJoined ? (
          <button onClick={(e) => { e.stopPropagation(); handleLeave(project._id); }} className="w-full bg-[#a32233] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-[#c93144] transition">Leave Project</button>
        ) : joinRequest && joinRequest.status === "pending" ? (
          <button disabled onClick={(e) => { e.stopPropagation(); }} className="w-full bg-gray-600 text-gray-300 py-3 rounded-lg text-[14px] font-bold opacity-70 cursor-not-allowed">Pending Approval</button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); handleJoin(project._id); }} className="w-full bg-[#8b31ff] text-white py-3 rounded-lg text-[14px] font-bold hover:bg-purple-500 transition shadow-[0_0_15px_rgba(139,49,255,0.4)]">
            {joinRequest && joinRequest.status === "rejected" ? "Apply Again" : "Apply to Join"}
          </button>
        )}
      </div>
    </div>
  );
}