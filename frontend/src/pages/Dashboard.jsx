import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom"
import ProjectCard from "../components/ProjectCard";
import axios from 'axios'
export default function Dashboard() {
  const [projects, setProjects] = useState([])

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/projects/my-projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Projects:", res.data); // ✅ check here
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchProjects();
}, []);

  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#0f0a1f] text-white flex flex-col">

      {/* Top Navbar */}
      {/* <Navbar/> */}


      {/* Body */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <Sidebar/>


        {/* Main Content */}
        <main className="flex-1 p-10">

          {/* Top section */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Welcome back, Alex! 👋</h2>
              <p className="text-gray-400">
                You're making great progress. Only 2,550 XP until Level 13.
              </p>
            </div>

            <button className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-500"
              onClick={()=>{navigate("/project/create")}}
            >
              + New Project
            </button>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatCard title="Active" value={projects.length} subtitle="Live projects" />
            <StatCard title="Urgent" value="7" subtitle="Tasks due this week" />
            <StatCard value="+1,200" subtitle="XP earned this week" />
          </div>


          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-8">
            
           {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
           ))}
            

          </div>

        </main>

      </div>
    </div>
  );
}



/* Components */



function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-[#140d2c] p-6 rounded-xl">
      {title && <p className="text-sm text-gray-400 uppercase">{title}</p>}
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}

function Project({ name, progress, color }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <p>{name}</p>
        <span className="text-gray-400">{progress}</span>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-full">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: progress }}
        />
      </div>
    </div>
  );              
}

function Hackathon({ title, days, prize }) {
  return (
    <div className="bg-[#1a1238] p-4 rounded-lg flex justify-between items-center">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-400">{prize}</p>
      </div>

      <div className="text-purple-400 font-bold text-center">
        {days}
        <span className="block text-xs text-gray-400">days left</span>
      </div>
    </div>
  );
}