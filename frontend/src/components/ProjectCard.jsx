export default function ProjectCard({ project }) {
  return (
    <div className="bg-[#121224] border border-purple-900/30 rounded-xl p-6 flex flex-col justify-between hover:border-purple-500 transition">
      <div>
        {/* <Tag text={project.tag || "REQUIRED SKILLS"} /> */}

        <h3 className="text-lg font-semibold mt-3">{project.title}</h3>

        <p className="text-gray-400 text-sm mt-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.skills?.map((skill, i) => (
            <Skill key={i} name={skill} />
          ))}
        </div>
      </div>

      <button className="mt-6 bg-linear-to-r from-purple-600 to-purple-500 py-2 rounded-lg text-sm font-medium hover:opacity-90">
        Apply to Join
      </button>
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
  return (
    <span className="text-xs bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
      {text}
    </span>
  );
}