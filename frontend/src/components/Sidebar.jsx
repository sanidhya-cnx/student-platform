import { Link } from "react-router-dom"
export default function Sidebar(){
    return (
        <aside className="w-64 bg-[#140d2c] p-6">

          <div className="bg-[#1a1238] p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 w-10 h-10 flex items-center justify-center rounded-full">
                AS
              </div>
              <div>
                <p className="font-semibold">Alex Smith</p>
                <p className="text-xs text-purple-400">LEVEL 12 • PRODIGY</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-purple-500 h-2 rounded-full w-[83%]" />
              </div>

              <p className="text-xs mt-1 text-gray-400">
                12,450 / 15,000 XP (83%)
              </p>
            </div>
          </div>

          <nav className="space-y-3">
            <SidebarItem active label="Dashboard" />
            <SidebarItem label="Discover" link="/discover"/>
            <SidebarItem label="Hackathons" />
            <SidebarItem label="Team Finder" />
            <SidebarItem label="Settings" />
          </nav>

        </aside>
    )
}

function SidebarItem({ label, active, link }) {
  return (
    <Link to={link}>
    <div
      className={`p-3 rounded-lg cursor-pointer ${
        active ? "bg-purple-600" : "text-gray-400 hover:bg-[#1d1440]"
      }`}
    >
      {label}
    </div>
    </Link>
  );
}