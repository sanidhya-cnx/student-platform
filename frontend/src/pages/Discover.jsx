import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";


export default function Discover() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/projects/all-projects"
      );
      const userId = localStorage.getItem("userId");
      const filtered = res.data.filter(p => p.createdBy !== userId && !p.teamMembers?.includes(userId));
      setProjects(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProjects();
}, []);
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0b1a] to-[#120a1f] text-white">
      {/* Navbar */}
      <Navbar/>

      <div className="max-w-7xl mx-auto px-10 py-10">
        <h2 className="text-2xl font-bold mt-14 mb-6">Explore Projects</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700">
            Load More Projects
          </button>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm py-8">
        © 2024 DevConnect Marketplace. Empowering developers through
        collaboration.
      </footer>
    </div>
  );
}