import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ProjectCard({ project, joinRequest }) {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const isJoined = project?.teamMembers?.some(
    (id) => id === userId
  );
  const isOwner = project.createdBy === userId;

  const handleJoin = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:3000/api/projects/join-request/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reload to fetch the new request and show "Pending Approval"
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to submit join request.");
    }
  };

  const handleLeave = async (projectId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:3000/api/projects/leave/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.location.reload();
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Failed to leave project.");
  }
};
  
  return (
    <div 
      onClick={() => {
        if (isJoined || isOwner) {
          navigate(`/workspace/${project._id}`);
        } else {
          navigate(`/project/${project._id}`);
        }
      }} 
      className="bg-[#110e1a] cursor-pointer border border-[#2c224a] rounded-xl p-6 flex flex-col justify-between hover:border-[#8b31ff] transition-colors h-full"
    >
      <div>
        {/* Render tags only if joined or owner to keep it clean */}
        {(isOwner || isJoined) && (
          <div className="mb-4">
            {isOwner ? <Tag text="Owner" /> : <Tag text="Joined" />}
          </div>
        )}
        
        <h3 className="text-[17px] leading-snug font-bold text-white mb-2">{project.title}</h3>

        <p className="text-[#a19bae] text-[13px] leading-relaxed line-clamp-3 mb-6">
          {project.description}
        </p>

        <div>
          <h4 className="text-[10px] font-bold text-[#8b31ff] uppercase tracking-widest mb-3">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.slice(0, 4).map((skill, i) => (
              <Skill key={i} name={skill} />
            ))}
            {(!project.requiredSkills || project.requiredSkills.length === 0) && (
              <span className="text-[11px] text-gray-500 italic">Unspecified</span>
            )}
          </div>
        </div>
      </div>

       <div className="mt-8 pt-4 border-t border-white/5">
        {isOwner ? (
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/workspace/${project._id}`); }}
            className="w-full border border-green-600/50 text-green-500 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-green-600/10 transition-colors"
          >
            Go to Workspace
          </button>
        ) : isJoined ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleLeave(project._id); }}
            className="w-full border border-red-600/50 text-red-500 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-red-600/10 transition-colors"
          >
            Leave Project
          </button>
        ) : joinRequest && joinRequest.status === "pending" ? (
          <button
            disabled
            onClick={(e) => { e.stopPropagation(); }}
            className="w-full border border-gray-600 text-gray-500 py-2.5 rounded-lg text-[13px] font-semibold cursor-not-allowed opacity-70"
          >
            Pending Approval
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); handleJoin(project._id); }}
            className="w-full border border-purple-600/60 text-[#b375ff] py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#8b31ff]/10 hover:border-[#8b31ff] transition-colors"
          >
            {joinRequest && joinRequest.status === "rejected" ? "Apply Again" : "Apply to Join"}
          </button>
        )}
      </div>
    </div>
  );
}

function Skill({ name }) {
  return (
    <span className="text-[11px] font-medium bg-[#1d182b] text-gray-300 px-3 py-1.5 rounded-full border border-white/5">
      {name}
    </span>
  );
}

function Tag({ text }) {
  let color = "bg-[#8b31ff]/20 text-[#b375ff] border border-[#8b31ff]/30";

  if (text === "Owner") {
    color = "bg-green-500/10 text-green-400 border border-green-500/20";
  } else if (text === "Joined") {
    color = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  }

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold ${color} px-2.5 py-1 rounded-full`}>
      {text}
    </span>
  );
}
