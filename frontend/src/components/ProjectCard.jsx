import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ProjectCard({ project }) {
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
        `http://localhost:3000/api/projects/join/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/workspace/${projectId}`);
    } catch (error) {
      console.log(error);
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
  }
};
  
  return (
    <div onClick={() => {
      if (isJoined || isOwner) {
        navigate(`/workspace/${project._id}`);
      } else {
        navigate(`/project/${project._id}`);
      }
    }} className="bg-[#121224] cursor-pointer border border-purple-900/30 rounded-xl p-6 flex flex-col justify-between hover:border-purple-500 transition">
      <div>
        {isOwner ? (
            <Tag text="Owner" />
          ) : isJoined ? (
            <Tag text="Joined" />
          ) : (
            <Tag text="Open" />
        )}
        <h3 className="text-lg font-semibold mt-3">{project.title}</h3>

        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.requiredSkills?.map((skill, i) => (
            <Skill key={i} name={skill} />
          ))}
        </div>
      </div>

       {isOwner ? null : isJoined ? (
  <button
    onClick={(e) => { e.stopPropagation(); handleLeave(project._id); }}
    className="mt-6 bg-red-500 py-2 rounded-lg text-sm font-medium"
  >
    Leave Project
  </button>
) : (
  <button
    onClick={(e) => { e.stopPropagation(); handleJoin(project._id); }}
    className="mt-6 bg-linear-to-r from-purple-600 to-purple-500 py-2 rounded-lg text-sm font-medium hover:opacity-90"
  >
    Apply to Join
  </button>
)}
    </div>
  );
}

function Skill({ name }) {
  return (
    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
      {name}
    </span>
  );
}

function Tag({ text }) {
  let color = "bg-purple-600/20 text-purple-400";

  if (text === "Owner") {
    color = "bg-green-600/20 text-green-400";
  } else if (text === "Joined") {
    color = "bg-blue-600/20 text-blue-400";
  }

  return (
    <span className={`text-xs ${color} px-3 py-1 rounded-full`}>
      {text}
    </span>
  );
}
