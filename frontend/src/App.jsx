import { Routes, Route } from "react-router-dom"
import Projects from "./pages/Discover"
import Dashboard from "./pages/Dashboard"
import CreateProject from "./pages/CreateProject"

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/discover" element={<Projects />} />
      <Route path="/project/create" element={<CreateProject />} />
    </Routes>
    </>
  )
}

export default App
