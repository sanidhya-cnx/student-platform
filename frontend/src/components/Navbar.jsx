export default function Navbar(){
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