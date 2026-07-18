import Base from "@/layouts/Base"
import { CanvasProvider } from "@/components/modeling/CanvasProvider"
import { Table } from "@/components/modeling/Table"
import { Canvas } from "@/components/modeling/Canvas"

const ModelingLayout: React.FC = () => {
  return (
    <Base className="flex flex-col h-full bg-muted">
      <div className="flex flex-col h-full min-h-0">
        <CanvasProvider>
          <Canvas>
            {(tables) => (
              <>
                {tables.map((table) => (
                  <Table
                    key={table.id}
                    id={table.id}
                    title={table.title}
                    attributes={table.attributes}
                    methods={table.methods}
                  />
                ))}
              </>
            )}
          </Canvas>
        </CanvasProvider>
      </div>
    </Base>
  )
}

export default ModelingLayout