import { type TableData } from "@/components/modeling/types"
import { useCanvas } from "@/components/modeling/CanvasContext"
import { RelationDialog } from "@/components/modeling/RelationDialog"

import { Button } from "@/components/ui/button"
import { ResolvedIcon } from "@/lib/iconutils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CanvasProps {
  children: (tables: TableData[]) => React.ReactNode
}

interface ActionBarProps {
  isLocked: boolean
  addTable: () => void
  onSaveAll: () => void
  onAddRelation: () => void
}

const ActionBar: React.FC<ActionBarProps> = (props) => {
  return (
    <div className="absolute top-4 left-4 z-40 rounded-2xl border border-zinc-800 bg-[#18181b]/90">
      <div className="flex flex-row">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="sm"
                variant="secondary"
                onClick={props.addTable}
                disabled={props.isLocked}
              >
                <ResolvedIcon name="SquarePlus" />
              </Button>
            }
          />

          <TooltipContent>
            <p>Add Table</p>
          </TooltipContent>
        </Tooltip>
        <div className="mx-1 my-2 h-4 w-[1px] bg-zinc-800" />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="sm"
                variant="secondary"
                onClick={props.onAddRelation}
                disabled={props.isLocked}
              >
                <ResolvedIcon name="MoveDiagonal" />
              </Button>
            }
          />

          <TooltipContent>
            <p>Add Relation</p>
          </TooltipContent>
        </Tooltip>
        <div className="mx-1 my-2 h-4 w-[1px] bg-zinc-800" />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => console.log("Sync")}
                disabled={props.isLocked}
              >
                <ResolvedIcon name="RefreshCw" />
              </Button>
            }
          />

          <TooltipContent>
            <p>Synchronize</p>
          </TooltipContent>
        </Tooltip>
        <div className="mx-1 my-2 h-4 w-[1px] bg-zinc-800" />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="sm"
                variant="default"
                onClick={props.onSaveAll}
                disabled={props.isLocked}
              >
                <ResolvedIcon name="SaveAll" className="font-bold" />
              </Button>
            }
          />

          <TooltipContent>
            <p>Save All</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

interface ToolBarProps {
  isLocked: boolean
  zoom: number
  setZoom: (zoom: number) => void
  setIsLocked: (isLocked: boolean) => void
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
  return (
    <div className="absolute right-4 bottom-4 z-40 flex items-center rounded-2xl border border-zinc-800 bg-[#18181b]/95 text-zinc-400 shadow-xl">
      <span className="px-2 font-mono text-[12px] text-zinc-500">
        {Math.round(props.zoom * 100)}%
      </span>
      <div className="mx-1 h-4 w-[1px] bg-zinc-800" />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setZoom(Math.max(0.4, props.zoom - 0.05))}
            >
              <ResolvedIcon name="ZoomOut" />
            </Button>
          }
        />

        <TooltipContent>
          <p>Zoom Out</p>
        </TooltipContent>
      </Tooltip>
      <div className="mx-1 h-4 w-[1px] bg-zinc-800" />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setZoom(Math.min(2, props.zoom + 0.05))}
            >
              <ResolvedIcon name="ZoomIn" />
            </Button>
          }
        />

        <TooltipContent>
          <p>Zoom In</p>
        </TooltipContent>
      </Tooltip>
      <div className="mx-1 h-4 w-[1px] bg-zinc-800" />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button size="sm" variant="ghost" onClick={() => props.setZoom(1)}>
              <ResolvedIcon name="Brackets" />
            </Button>
          }
        />

        <TooltipContent>
          <p>Reset</p>
        </TooltipContent>
      </Tooltip>
      <div className="mx-1 h-4 w-[1px] bg-zinc-800" />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setIsLocked(!props.isLocked)}
            >
              <ResolvedIcon name={`${props.isLocked ? "Lock" : "LockOpen"}`} />
            </Button>
          }
        />

        <TooltipContent>
          <p>{props.isLocked ? "Unlock" : "Lock"} Action bar</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const canvas = useCanvas()

  /* eslint-disable react-hooks/refs */
  return (
    <div
      ref={canvas.canvasRef}
      onMouseMove={canvas.handleMouseMove}
      onMouseUp={canvas.resetRelationState}
      onMouseLeave={canvas.resetRelationState}
      onDragOver={canvas.handleDragOver}
      onDragEnd={canvas.clearDragInfo}
      onWheel={canvas.handleWheel}
      className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#09090b] font-sans text-zinc-50 shadow-2xl select-none"
    >
      {/** Background pan surface: dragging here pans the canvas. It sits
           behind the content but above the viewport, and is the only element
           that starts a pan, so tables/relations are never affected. */}
      <div
        onMouseDown={canvas.startPan}
        className={`absolute inset-0 z-0 ${
          canvas.isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/** Grid pattern, offset by the pan so it scrolls with the content */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            backgroundPosition: `${canvas.pan.x}px ${canvas.pan.y}px`,
          }}
        />
      </div>

      {/** Top-left Action bar */}
      <ActionBar
        addTable={canvas.addTable}
        isLocked={canvas.isLocked}
        onSaveAll={canvas.saveAll}
        onAddRelation={canvas.openRelationDialog}
      />

      {/** Content */}
      <div
        style={{
          transform: `translate(${canvas.pan.x}px, ${canvas.pan.y}px) scale(${canvas.zoom})`,
          transformOrigin: "0 0",
          width: `${100 / canvas.zoom}%`,
          height: `${100 / canvas.zoom}%`,
        }}
        className="pointer-events-none absolute inset-0"
      >
        <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full">
          {canvas.drawingLine && (
            <line
              x1={canvas.drawingLine.startX}
              y1={canvas.drawingLine.startY}
              x2={canvas.drawingLine.currentX}
              y2={canvas.drawingLine.currentY}
              className="stroke-dashed fill-none stroke-zinc-500 stroke-2"
              style={{ strokeDasharray: "4 4" }}
            />
          )}
          {canvas.relations.map((rel) => {
            const f = canvas.positions[rel.fromTableId]
            const t = canvas.positions[rel.toTableId]
            if (!f || !t) return null
            const sX = f.x + 230 + 30
            const sY = f.y + 46
            const eX = t.x
            const eY = t.y + 46
            const midX = (sX + eX) / 2
            const midY = (sY + eY) / 2
            return (
              <g key={rel.id}>
                <path
                  d={`M ${sX} ${sY} L ${eX} ${eY}`}
                  className="fill-none stroke-zinc-600 stroke-2"
                />
                <text
                  x={sX + 16}
                  y={sY - 10}
                  className="fill-zinc-400 font-mono text-[11px] font-bold"
                >
                  {rel.cardinality === "N:N" ? "N" : "1"}
                </text>
                <text
                  x={eX - 22}
                  y={eY - 10}
                  className="fill-zinc-400 font-mono text-[11px] font-bold"
                >
                  {rel.cardinality === "1:1" ? "1" : "N"}
                </text>
                <circle
                  cx={midX}
                  cy={midY}
                  r={4}
                  className="cursor-pointer fill-red-900 stroke-red-900 stroke-2 transition-[fill,transform] duration-150 hover:scale-150 hover:fill-red-500 hover:stroke-red-500"
                  style={{
                    pointerEvents: "auto",
                    transformOrigin: `${midX}px ${midY}px`,
                  }}
                  onClick={() => {
                    canvas.openRelationForEdit(rel)
                  }}
                />
              </g>
            )
          })}
        </svg>
        {children(canvas.tables)}
      </div>

      <ToolBar
        isLocked={canvas.isLocked}
        setIsLocked={canvas.setIsLocked}
        zoom={canvas.zoom}
        setZoom={canvas.setZoom}
      />

      {canvas.pendingRelation || canvas.relationDialogOpen ? (
        <RelationDialog
          tables={canvas.tables}
          relations={canvas.relations}
          pendingRelation={canvas.pendingRelation}
          editingRelation={canvas.editingRelation}
          isDragWorkflow={!!canvas.pendingRelation}
          onConfirm={canvas.confirmRelation}
          onDelete={canvas.deleteRelation}
          onCancel={canvas.cancelRelation}
        />
      ) : null}
    </div>
  )
  /* eslint-enable react-hooks/refs */
}
