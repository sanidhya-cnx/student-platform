import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    timeline: "Flash (1-2 weeks)",
    difficulty: "Beginner",
    roles: 3,
    requiredSkills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setForm({
        ...form,
        requiredSkills: [...form.requiredSkills, skillInput],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const updated = form.requiredSkills.filter((_, i) => i !== index);
    setForm({ ...form, requiredSkills: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:3000/api/projects/create", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Error creating project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0718] to-[#140a24] text-white flex justify-center items-center p-6">
      
      <div className="w-full max-w-3xl bg-[#15112d] p-10 rounded-2xl border border-purple-900/30 shadow-xl">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          INITIATE PROJECT
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Forge a new node in the digital nebula
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="text-sm text-purple-400 uppercase">
              Project Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Neural Link Interface"
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg focus:border-purple-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-purple-400 uppercase">
              Project Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the mission parameters..."
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg focus:border-purple-500 outline-none"
            />
          </div>

          {/* Timeline + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-purple-400 uppercase">
                Timeline
              </label>
              <select
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg"
              >
                <option>Flash (1-2 weeks)</option>
                <option>Standard (1 month)</option>
                <option>Long Term (2+ months)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-purple-400 uppercase">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          {/* Roles */}
          <div>
            <label className="text-sm text-purple-400 uppercase">
              Open Collaboration Roles
            </label>

            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, roles: Math.max(1, form.roles - 1) })
                }
                className="px-4 py-1 bg-[#0f0b22] border border-purple-900/30 rounded"
              >
                -
              </button>

              <span className="text-lg">{form.roles}</span>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, roles: form.roles + 1 })
                }
                className="px-4 py-1 bg-[#0f0b22] border border-purple-900/30 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-sm text-purple-400 uppercase">
              Tech Stack
            </label>

            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="Type technology and press enter..."
              className="w-full mt-2 bg-[#0f0b22] border border-purple-900/30 p-3 rounded-lg focus:border-purple-500 outline-none"
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {form.requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs flex items-center gap-2 cursor-pointer"
                >
                  {skill}
                  <span
                    onClick={() => removeSkill(i)}
                    className="text-red-400"
                  >
                    ✕
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 font-semibold hover:opacity-90"
          >
            🚀 ESTABLISH PROJECT NODE
          </button>
        </form>
      </div>
    </div>
  );
}