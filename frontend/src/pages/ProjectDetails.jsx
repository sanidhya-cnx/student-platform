import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/all-projects`
        );

        const found = res.data.find((p) => p._id === id);
        setProject(found);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <p className="mt-2">{project.description}</p>

      <h3 className="mt-4 font-semibold">Skills:</h3>
      <ul>
        {project.requiredSkills?.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3 className="mt-4 font-semibold">Team Members:</h3>
      <p>{project.teamMembers?.length || 0} members</p>
    </div>
  );
}