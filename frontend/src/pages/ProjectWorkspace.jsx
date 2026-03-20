import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/projects/all-projects`);
        const found = res.data.find((p) => p._id === id);
        setProject(found);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [id]);
  return (
    <div className="min-h-screen text-white bg-[#0f0a1f] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[200px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500 opacity-20 blur-[200px] rounded-full"></div>


      {/* NAVBAR */}
      <header className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-purple-900/40 backdrop-blur-lg bg-[#140d2c]/60">

        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-purple-400">
            CollabHub
          </h1>

          <nav className="flex gap-8 text-gray-300">
            <a className="hover:text-white transition">Workspace</a>
            <a className="hover:text-white transition">Files</a>
            <a className="hover:text-white transition">Milestones</a>
            <a className="hover:text-white transition">Settings</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">

          <input
            placeholder="Search project..."
            className="bg-[#1a1238]/80 border border-purple-900/40 px-4 py-2 rounded-lg outline-none text-sm w-64 focus:border-purple-500"
          />

          <div className="bg-[#1a1238] p-2 rounded-lg hover:bg-purple-600 transition cursor-pointer">
            🔔
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700"></div>

        </div>
      </header>


      {/* PROJECT HEADER */}
      <section className="relative z-10 px-10 py-8 border-b border-purple-900/40">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-5">

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl shadow-lg shadow-purple-900/40">
              ⚡
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {project ? project.title : "Eco-Tracker App"}
              </h2>
            </div>

          </div>


          <div className="flex items-center gap-6">

            {/* avatars */}
            <div className="flex -space-x-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-[#0f0a1f]"></div>
              <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-[#0f0a1f]"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-[#0f0a1f]"></div>
            </div>

            {/* progress */}
            <div className="w-64">

              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-400 font-semibold">65%</span>
                <span className="text-gray-400">OVERALL PROGRESS</span>
              </div>

              <div className="w-full h-2 bg-[#1a1238] rounded-full">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-[65%]"></div>
              </div>

            </div>

            <button className="bg-[#1a1238] border border-purple-900/40 px-4 py-2 rounded-lg hover:border-purple-500 transition">
              Invite Team
            </button>

            <button 
              onClick={() => navigate(`/project/${id}`)}
              className="bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-2 rounded-lg shadow-lg shadow-purple-900/40 hover:scale-105 transition"
            >
              Project Settings
            </button>

          </div>
        </div>
      </section>


      {/* MAIN */}
      <div className="relative z-10 flex">

        {/* CHAT */}
        <aside className="w-[360px] border-r border-purple-900/40 p-6 flex flex-col">

          <div className="flex justify-between mb-6">
            <h3 className="font-semibold">Team Chat</h3>
            <span className="text-xs text-purple-400">3 ONLINE</span>
          </div>

          <div className="flex-1 space-y-5">

            <ChatBubble
              name="Alex"
              text="Just finished the initial UI wireframes for the dashboard."
            />

            <ChatBubble
              name="Jordan"
              text="Looks great! I'm starting on the API integration."
            />

            <ChatBubble
              name="You"
              text="Awesome. I'll focus on testing later."
              user
            />

          </div>

          <div className="flex gap-2 mt-6">
            <input
              placeholder="Send message..."
              className="flex-1 bg-[#1a1238] px-4 py-2 rounded-lg outline-none border border-purple-900/40"
            />
            <button className="bg-gradient-to-r from-purple-500 to-purple-700 px-4 rounded-lg">
              ➤
            </button>
          </div>

        </aside>


        {/* KANBAN */}
        <KanbanBoard projectId={id} />

      </div>
    </div>
  );
}

// ----------------------
// Sub-components
// ----------------------

function ChatBubble({ name, text, user }) {
  return (
    <div className={`flex ${user ? "justify-end" : ""}`}>
      <div className={`${user ? "bg-purple-600" : "bg-[#1a1238]"} px-4 py-3 rounded-xl max-w-xs`}>
        <p className="text-xs text-gray-400 mb-1">{name}</p>
        {text}
      </div>
    </div>
  );
}