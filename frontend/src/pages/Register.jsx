/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom"
import {useState} from "react"
import axios from "axios"

function Register(){
    const navigate = useNavigate()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [role,setRole] = useState("Frontend")

  const handleSubmit = async (e) => {

    e.preventDefault()

    if(password !== confirmPassword){
      alert("Passwords do not match")
      return
    }

    try{

      await axios.post(
        "http://localhost:3000/api/users/register",
        { name, email, password }
      )

      alert("Registration successful")

      navigate("/login")

    }catch(err){

      console.log(err)
      alert("Registration failed")

    }

  }


  return(

    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b0b3a,_#05050a)]">

      <div className="w-[450px] p-10 rounded-2xl bg-[#111124]/80 backdrop-blur-lg border border-purple-600 shadow-[0_0_60px_rgba(168,85,247,0.5)]">

        <h1 className="text-center text-3xl font-semibold text-white mb-2">
          JOIN THE COMMUNITY
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Community · Marketplace · Workspace
        </p>

        <form onSubmit={handleSubmit}
         className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e)=>setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="password"
            placeholder="Create Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <select onChange={(e)=>setRole(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white">
            <option>Frontend</option>
            <option>Fullstack</option>
            <option>Backend</option>
          </select>

          <button type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold transition"
          >
            CREATE ACCOUNT
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?
          <Link to="/login" className="text-purple-400 ml-1">
            Sign In
          </Link>
        </p>

      </div>

    </div>

  )
}

export default Register