import React from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
const trendingProjects = [
  {
    tag: "HIGH IMPACT",
    title: "AI Health Assistant",
    description:
      "Building a decentralized healthcare platform using LLMs for symptom triage.",
    skills: ["Python", "TensorFlow", "React"],
    joined: "5/8 Joined",
  },
  {
    tag: "OPEN SOURCE",
    title: "Eco-Track Dashboard",
    description:
      "Visualizing carbon footprints for small businesses with real-time analytics.",
    skills: ["Next.js", "D3.js", "PostgreSQL"],
    joined: "2/4 Joined",
  },
  {
    tag: "DESIGN-FIRST",
    title: "Neo-Banking UI Kit",
    description:
      "Creating a comprehensive design system for next-gen fintech applications.",
    skills: ["Figma", "UI Design", "Design Ops"],
    joined: "1/3 Joined",
  },
];

const exploreProjects = [
  {
    title: "Web3 Wallet Integration",
    description:
      "A plug-in based system to support multiple crypto wallets in any browser-based application.",
    skills: ["Solidity", "Ethers.js"],
  },
  {
    title: "VR Learning Space",
    description:
      "Immersive classroom environment for remote science labs using Three.js and WebXR.",
    skills: ["Three.js", "React"],
  },
  {
    title: "Smart City IoT Node",
    description:
      "Edge computing firmware for monitoring urban air quality and traffic flow in real-time.",
    skills: ["C++", "Rust", "Go"],
  },
  {
    title: "No-Code Landing Page",
    description:
      "Visual builder for high-conversion landing pages specifically for indie hackers.",
    skills: ["Vue.js", "Tailwind"],
  },
  {
    title: "Automated QA Bot",
    description:
      "Discord bot that automatically runs end-to-end tests for GitHub pull requests.",
    skills: ["Node.js", "Playwright"],
  },
  {
    title: "Food Waste Minimizer",
    description:
      "App connecting local bakeries with charities to distribute leftover food daily.",
    skills: ["Flutter", "Firebase"],
  },
  {
    title: "Open Source CRM",
    description:
      "A light-weight, privacy-focused alternative to Salesforce for solo creators.",
    skills: ["Django", "Tailwind"],
  },
  {
    title: "Audio Visualizer Pro",
    description:
      "Real-time GPU-accelerated audio visualization for live stream backgrounds.",
    skills: ["WebGL", "TypeScript"],
  },
];







export default function Discover() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0b1a] to-[#120a1f] text-white">
      {/* Navbar */}
      <Navbar/>

      <div className="max-w-7xl mx-auto px-10 py-10">
        {/* Trending */}
        <h2 className="text-2xl font-bold mb-6">Trending Projects</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {trendingProjects.map((p, i) => (
            <ProjectCard key={i} project={p} />
          ))}
        </div>

        {/* Explore */}
        <h2 className="text-2xl font-bold mt-14 mb-6">Explore Projects</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {exploreProjects.map((p, i) => (
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