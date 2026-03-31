import { useNavigate } from "react-router-dom";

export default function Navbar({ searchQuery, onSearchChange }){
    const navigate = useNavigate();
    return(
        <header className="h-16 flex items-center justify-between px-8 border-b border-purple-900">
        
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold text-purple-400">CollabHub</h1>

          <nav className="flex gap-6 text-gray-300">
            <a className="hover:text-white cursor-pointer">Marketplace</a>
            <a className="hover:text-white cursor-pointer">Workspace</a>
            <a className="hover:text-white cursor-pointer">Community</a>
          </nav>
        </div>

      <div className="flex items-center gap-6">
        
        {/* SEARCH BAR */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600/60">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="bg-[#1b1433] placeholder-purple-800/60 text-white pl-12 pr-4 py-2.5 rounded-lg text-sm w-72 focus:outline-none focus:ring-1 focus:ring-purple-600 transition"
          />
        </div>

        {/* NEW PROJECT BUTTON */}
        <button 
          onClick={() => navigate("/project/create")}
          className="bg-[#8b31ff] hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-lg text-sm flex items-center gap-2 transition shadow-lg"
        >
          <span>+</span> Post New Project
        </button>

        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full border-2 border-transparent hover:border-purple-500 transition cursor-pointer overflow-hidden shadow-md">
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover bg-gray-600" />
        </div>

      </div>
    </header>
  );
}