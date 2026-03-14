import { Link,useNavigate } from "react-router-dom"
import{useState} from "react"
import axios from "axios"

function Login() {
    const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    try{

      const res = await axios.post(
        "http://localhost:3000/api/users/login",
        { email, password }
      )

      const token = res.data.token

      localStorage.setItem("token", token)

      alert("Login successful")

      navigate("/dashboard")

    }catch(err){

      console.log(err)
      alert("Invalid credentials")

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b0b3a,_#05050a)]">

      <div className="w-[420px] p-10 rounded-2xl bg-[#111124]/80 backdrop-blur-lg border border-purple-600 shadow-[0_0_60px_rgba(168,85,247,0.5)]">

        <h1 className="text-center text-3xl font-semibold text-white mb-2">
          SIGN IN TO COLLABHUB
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Community · Marketplace · Workspace
        </p>

        <form onSubmit={handleSubmit}
         className="space-y-5">

          <div>
            <label className="text-gray-400 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-[#0c0c1d] border border-purple-500 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="text-right text-sm text-purple-400 cursor-pointer">
            Forgot Password?
          </div>

          <button type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold transition"
          >
            SIGN IN
          </button>

        </form>

        <div className="my-6 text-center text-gray-500">OR</div>

        <button className="w-full border border-gray-600 py-3 rounded-lg text-white mb-3 hover:bg-[#1d1d35] transition">
          Continue with Google
        </button>

        <button className="w-full border border-gray-600 py-3 rounded-lg text-white hover:bg-[#1d1d35] transition">
          Continue with GitHub
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?
          <Link to="/register" className="text-purple-400 ml-1">
            Register now
          </Link>
        </p>

      </div>

    </div>

  )
}

export default Login