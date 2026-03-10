import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    status: "open",
  });

  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() === "") return;

    setForm({
      ...form,
      skillsRequired: [...form.skillsRequired, skillInput],
    });

    setSkillInput("");
  };

  const removeSkill = (index) => {
    const updated = [...form.skillsRequired];
    updated.splice(index, 1);
    setForm({ ...form, skillsRequired: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    axios.post("http://localhost:3000/api/v1/project/create",form)
    .then((res)=>{console.log(res.data)
      navigate("/dashboard")
    })
    .catch((e)=>console.log(e))
    
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0718] to-[#140a24] text-white flex justify-center items-center p-10">
      <div className="w-full max-w-3xl bg-[#15112d] p-8 rounded-xl border border-purple-900/30">
        
        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="text-sm text-gray-400">Project Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg outline-none focus:border-purple-500"
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg outline-none focus:border-purple-500"
              placeholder="Describe your project"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm text-gray-400">Skills Required</label>

            <div className="flex mt-2 gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg outline-none focus:border-purple-500"
                placeholder="Add skill"
              />

              <button
                type="button"
                onClick={addSkill}
                className="bg-purple-600 px-4 rounded-lg hover:bg-purple-700"
              >
                Add
              </button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-400">Project Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg outline-none focus:border-purple-500"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-purple-600 to-purple-500 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}