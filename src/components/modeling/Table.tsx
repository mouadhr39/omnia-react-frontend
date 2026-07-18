import { useCanvas } from "@/components/modeling/CanvasContext"
import { type Attribute, type TableProps } from "@/components/modeling/types"
import { ResolvedIcon } from "@/lib/iconutils"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  id: string
  title: string
}

const Header: React.FC<HeaderProps> = ({ id, title }) => {
  const { deleteTable, updateTableTitle, startRelationDrag } = useCanvas()

  return (
    <div className="relative flex items-center justify-between border-b border-border p-1">
      <Input
        type="text"
        value={title}
        onChange={(e) => {
          e.stopPropagation()
          updateTableTitle(id, e.target.value)
        }}
        onClick={(e) => e.stopPropagation()}
        className="mr-2 w-full rounded-2xl border border-transparent bg-transparent px-1 py-0.5 text-xs font-semibold tracking-tight text-foreground transition-all hover:border-border focus:ring-1 focus:ring-ring focus:outline-none"
      />
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={(e) => {
          e.stopPropagation()
          deleteTable(id)
        }}
        onMouseUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="text-red-900 hover:text-red-500"
      >
        <ResolvedIcon name="X" />
      </Button>
      {/* Relationships connector */}
      <div
        onMouseDown={(e) => {
          console.log("start mouse drag")
          startRelationDrag(e, id)
        }}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-12 -right-1 z-20 h-3 w-3 -translate-y-1/2 cursor-crosshair rounded-l-full border border-background bg-red-900 shadow transition-all hover:scale-150 hover:bg-red-500"
        title="Drag to connect"
      />
    </div>
  )
}

interface RecordProps {
  tableId: string
  id: string
  name: string
  type: Attribute["type"]
}
const Record: React.FC<RecordProps> = ({ tableId, id, name, type }) => {
  const { updateAttributeName, updateAttributeType, deleteAttribute } =
    useCanvas()

  return (
    <div className="group relative flex items-center">
      <Input
        id={`${id}-name`}
        type="text"
        value={name}

        onChange={(e) => updateAttributeName(tableId, id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mx-1 w-[60%] rounded-xl border border-transparent bg-transparent px-2 py-0.5 font-mono text-[11px] text-foreground transition-all hover:border-border focus:text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
      />
      <div
        className="w-[40%]"
        onMouseUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Select
          value={type}
          onValueChange={(val) =>
            updateAttributeType(tableId, id, val as Attribute["type"])
          }
        >
          <SelectTrigger
            size="default"
            className="w-full rounded-xl border border-transparent bg-transparent px-1 py-0.5 font-mono text-[11px] text-foreground transition-all hover:border-border focus:ring-1 focus:ring-ring focus:outline-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="String">String</SelectItem>
            <SelectItem value="Int">Integer</SelectItem>
            <SelectItem value="Bool">Boolean</SelectItem>
            <SelectItem value="Char">Character</SelectItem>
            <SelectItem value="Float">Float</SelectItem>
            <SelectItem value="Double">Double</SelectItem>
            <SelectItem value="Date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        onMouseUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          deleteAttribute(tableId, id)
        }}
        className="rounded-2xl p-1 text-[11px] text-red-900 hover:text-red-500"
      >
        <ResolvedIcon name="X" />
      </Button>
    </div>
  )
}

export const Table: React.FC<TableProps> = ({
  id,
  title,
  attributes,
  methods,
}) => {
  const { positions, handleDragStart, addAttribute, handleMouseUpOnTable, selectedTableId, setSelectedTableId } =
    useCanvas()
  const currentPos = positions[id] || { x: 150, y: 150 }
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, id)}
      onMouseUp={(e) => {
        e.stopPropagation()
        handleMouseUpOnTable(id)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedTableId(id)
      }}
      style={{ left: `${currentPos.x}px`, top: `${currentPos.y}px` }}
      className={cn(
        "pointer-events-auto absolute z-40 flex w-[260px] cursor-move flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xl transition-colors",
        selectedTableId === id
          ? "border-primary ring-1 ring-primary"
          : "border-border hover:border-border/80"
      )}
    >
      {/* Header */}
      <Header id={id} title={title} />

      {/* Attributes section */}
      <div className="flex flex-col gap-1.5 border-b border-border bg-card p-1">
        {attributes.length > 0 ? (
          attributes.map((attr) => (
            <Record
              key={attr.id}
              tableId={id}
              id={attr.id}
              name={attr.name}
              type={attr.type}
            />
          ))
        ) : (
          <span className="px-1 text-[11px] text-muted-foreground italic">
            No attributes
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            addAttribute(id)
          }}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 inline-flex w-full items-center justify-center rounded border border-dashed border-border py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
        >
          + Add Attribute
        </button>
      </div>

      {/* Methods section */}
      <div className="flex flex-col gap-1 bg-card p-2.5">
        {methods.length > 0 ? (
          methods.map((method, index) => (
            <div
              key={index}
              className="px-1 font-mono text-[11px] text-muted-foreground"
            >
              {method}
            </div>
          ))
        ) : (
          <span className="px-1 text-[11px] text-muted-foreground italic">
            No methods
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            console.log("ToDo");
            //addAttribute(id) should be addMethod todo
          }}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 inline-flex w-full items-center justify-center rounded border border-dashed border-border py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
        >
          + Add Method
        </button>
      </div>
    </div>
  )
}
