import { Routes, Route, Navigate } from "react-router-dom"
import Projects from "./pages/Discover"
import Dashboard from "./pages/Dashboard"
import CreateProject from "./pages/CreateProject"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import ProjectDetails from "./pages/ProjectDetails.jsx";
import ProjectWorkspace from "./pages/ProjectWorkspace.jsx";

function App() {

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project/create"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/project/:id" 
        element={
          <ProjectDetails />
        } />
      <Route 
        path="/workspace/:id" 
        element={
          <ProjectWorkspace />
        } />

    </Routes>
    
  )
}

export default App