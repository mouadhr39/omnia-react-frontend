import { LoginLayout } from "@/layouts/LoginLayout"

import { Routes, Route } from "react-router-dom"
import { ProjectOverview } from "@/layouts/ProjectOverview"
import ModelingLayout from "./layouts/ModelingLayout"
import DataEntry from "./layouts/DataEntry"
import { DatabaseModeler } from "@/layouts/projects"
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginLayout />} />
      <Route path="/projects/overview" element={<ProjectOverview />} />
      <Route path="/projects/modeling" element={<ModelingLayout />} />
      <Route path="/projects/modeler" element={<DatabaseModeler />} />
      <Route path="/projects/dataentry" element={<DataEntry />} />
    </Routes>
  )
}

export default App
