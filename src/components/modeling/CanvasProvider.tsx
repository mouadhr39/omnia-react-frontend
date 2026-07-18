import { useMemo } from "react"
import { CanvasContext } from "@/components/modeling/CanvasContext"
import { useCanvasLogic } from "@/components/modeling/useCanvasLogic"

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvas = useCanvasLogic()
  const positions = useMemo(
    () =>
      canvas.tables.reduce(
        (acc, t) => ({ ...acc, [t.id]: { x: t.x, y: t.y } }),
        {} as Record<string, { x: number; y: number }>
      ),
    [canvas.tables]
  )

  const contextValue = useMemo(
    () => ({
      positions,
      handleDragStart: canvas.handleDragStart,
      deleteTable: canvas.deleteTable,
      updateTableTitle: canvas.updateTableTitle,
      addAttribute: canvas.addAttribute,
      updateAttributeName: canvas.updateAttributeName,
      updateAttributeType: canvas.updateAttributeType,
      deleteAttribute: canvas.deleteAttribute,
      startRelationDrag: canvas.startRelationDrag,
      handleMouseUpOnTable: canvas.handleMouseUpOnTable,
      deleteRelation: canvas.deleteRelation,
      isLocked: canvas.isLocked,
      selectedTableId: canvas.selectedTableId,
      setSelectedTableId: canvas.setSelectedTableId,
      canvasRef: canvas.canvasRef,
      setZoom: canvas.setZoom,
      setIsLocked: canvas.setIsLocked,
      handleWheel: canvas.handleWheel,
      addTable: canvas.addTable,
      startPan: canvas.startPan,
      handleMouseMove: canvas.handleMouseMove,
      resetRelationState: canvas.resetRelationState,
      confirmRelation: canvas.confirmRelation,
      cancelRelation: canvas.cancelRelation,
      openRelationDialog: canvas.openRelationDialog,
      openRelationForEdit: canvas.openRelationForEdit,
      closeRelationDialog: canvas.closeRelationDialog,
      handleDragOver: canvas.handleDragOver,
      clearDragInfo: canvas.clearDragInfo,
      saveAll: canvas.saveAll,
      tables: canvas.tables,
      relations: canvas.relations,
      pendingRelation: canvas.pendingRelation,
      editingRelation: canvas.editingRelation,
      relationDialogOpen: canvas.relationDialogOpen,
      drawingLine: canvas.drawingLine,
      zoom: canvas.zoom,
      pan: canvas.pan,
      isPanning: canvas.isPanning,
    }),
    [
      positions,
      canvas.handleDragStart,
      canvas.deleteTable,
      canvas.updateTableTitle,
      canvas.addAttribute,
      canvas.updateAttributeName,
      canvas.updateAttributeType,
      canvas.deleteAttribute,
      canvas.startRelationDrag,
      canvas.handleMouseUpOnTable,
      canvas.deleteRelation,
      canvas.isLocked,
      canvas.selectedTableId,
      canvas.setSelectedTableId,
      canvas.canvasRef,
      canvas.setZoom,
      canvas.setIsLocked,
      canvas.handleWheel,
      canvas.addTable,
      canvas.startPan,
      canvas.handleMouseMove,
      canvas.resetRelationState,
      canvas.confirmRelation,
      canvas.cancelRelation,
      canvas.openRelationDialog,
      canvas.openRelationForEdit,
      canvas.closeRelationDialog,
      canvas.handleDragOver,
      canvas.clearDragInfo,
      canvas.saveAll,
      canvas.tables,
      canvas.relations,
      canvas.pendingRelation,
      canvas.editingRelation,
      canvas.relationDialogOpen,
      canvas.drawingLine,
      canvas.zoom,
      canvas.pan,
      canvas.isPanning,
    ]
  )

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  )
}
