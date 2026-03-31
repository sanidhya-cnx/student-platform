import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <header className="h-16 flex items-center justify-between px-8 border-b border-purple-900">
        
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="text-xl font-bold text-purple-400 cursor-pointer">CollabHub</Link>

          <nav className="flex gap-6 text-gray-300">
            <Link to="/dashboard" className="hover:text-white cursor-pointer">Dashboard</Link>
            <Link to="/discover" className="hover:text-white cursor-pointer">Discover</Link>
            <a className="hover:text-white cursor-pointer">Project</a>
          </nav>
        </div>

        <div className="flex items-center gap-6">

          {/* Search */}
          <input
            type="text"
            placeholder="Search projects or members..."
            className="bg-[#1a1238] px-4 py-2 rounded-lg text-sm w-64 outline-none"
          />

          {/* Notification */}
          <div className="cursor-pointer text-xl">🔔</div>

          {/* Avatar */}
          <div className="w-8 h-8 bg-purple-500 rounded-full"></div>

        </div>

      </header>
    )
}