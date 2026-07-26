import { LoginLayout } from "@/layouts/LoginLayout"

import { Routes, Route } from "react-router-dom"
//import { ProjectOverview } from "@/layouts/ProjectOverview"
import ModelingLayout from "./layouts/ModelingLayout"
import DataEntry from "./layouts/DataEntry"
//import { DatabaseModeler } from "@/layouts/projects"
import { WebEditorRoute } from "@/layouts/web-editor"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginLayout />} />
      {/*<Route path="/project/overview" element={<ProjectOverview />} />*/}
      <Route path="/project/modeling" element={<ModelingLayout />} />
      {/*<Route path="/projects/modeler" element={<DatabaseModeler />} />*/}
      <Route path="/projects/dataentry" element={<DataEntry />} />
      <Route path="/web/editor" element={<WebEditorRoute />} />
    </Routes>
  )
}

export default App
