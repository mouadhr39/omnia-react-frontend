import { useState, useRef, useCallback } from "react"
import { Notify } from "@/components/Notify"
import {
  type TableData,
  type TableRelation,
  type PendingRelation,
} from "./types"

interface DrawingLine {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface RelationSource {
  tableId: string
}

interface DragInfo {
  id: string
  offsetX: number
  offsetY: number
}

interface PanState {
  startClientX: number
  startClientY: number
  startPanX: number
  startPanY: number
}

const DEFAULT_TABLE_NAME = "NewTable"
const DEFAULT_ATTR_NAME = "field"
const DEFAULT_ATTR_TYPE = "String" as const

const ZOOM_STEP = 0.05
const ZOOM_MIN = 0.4
const ZOOM_MAX = 2

const STORAGE_KEY = "canvas-data"

const generateId = (prefix: string) => `${prefix}-${Date.now()}`

const getCanvasPosition = (
  e: MouseEvent | React.MouseEvent,
  canvas: HTMLDivElement,
  zoom: number,
  pan: { x: number; y: number } = { x: 0, y: 0 }
) => {
  const rect = canvas.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left - pan.x) / zoom,
    y: (e.clientY - rect.top - pan.y) / zoom,
  }
}

const createDefaultAttribute = (
  index: number
): TableData["attributes"][number] => ({
  id: generateId("attr"),
  name: `${DEFAULT_ATTR_NAME}_${index + 1}`,
  type: DEFAULT_ATTR_TYPE,
})

const withUpdatedAttribute = (
  table: TableData,
  attrId: string,
  updates: Partial<TableData["attributes"][number]>
): TableData => {
  if (!table.attributes.some((a) => a.id === attrId)) return table

  return {
    ...table,
    attributes: table.attributes.map((a) =>
      a.id === attrId ? { ...a, ...updates } : a
    ),
  }
}

const loadFromSessionStorage = (): {
  tables: TableData[]
  relations: TableRelation[]
} | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.tables) || !Array.isArray(parsed.relations))
      return null
    return parsed
  } catch {
    return null
  }
}

const saveToSessionStorage = (
  tables: TableData[],
  relations: TableRelation[]
) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, relations }))
    if (sessionStorage.getItem(STORAGE_KEY) !== undefined) 
      Notify({message: "Changes to database successfully saved.", position: "bottom-right", type: "info"})
  } catch {
    // ignore storage errors
  }
}

const initialTables: TableData[] = [
  {
    id: "table-category",
    title: "Category",
    attributes: [
      { id: "attr-cat-1", name: "id", type: "Int" },
      { id: "attr-cat-2", name: "name", type: "String" },
      { id: "attr-cat-3", name: "description", type: "String" },
    ],
    methods: [],
    x: 40,
    y: 40,
  },
  {
    id: "table-product",
    title: "Product",
    attributes: [
      { id: "attr-prod-1", name: "id", type: "Int" },
      { id: "attr-prod-2", name: "name", type: "String" },
      { id: "attr-prod-3", name: "price", type: "Float" },
      { id: "attr-prod-4", name: "stock", type: "Int" },
      { id: "attr-prod-5", name: "categoryId", type: "Int" },
    ],
    methods: [],
    x: 400,
    y: 40,
  },
  {
    id: "table-customer",
    title: "Customer",
    attributes: [
      { id: "attr-cust-1", name: "id", type: "Int" },
      { id: "attr-cust-2", name: "name", type: "String" },
      { id: "attr-cust-3", name: "email", type: "String" },
      { id: "attr-cust-4", name: "address", type: "String" },
    ],
    methods: [],
    x: 40,
    y: 320,
  },
  {
    id: "table-order",
    title: "Order",
    attributes: [
      { id: "attr-ord-1", name: "id", type: "Int" },
      { id: "attr-ord-2", name: "customerId", type: "Int" },
      { id: "attr-ord-3", name: "date", type: "Date" },
      { id: "attr-ord-4", name: "total", type: "Float" },
      { id: "attr-ord-5", name: "status", type: "String" },
    ],
    methods: [],
    x: 400,
    y: 320,
  },
  {
    id: "table-orderitem",
    title: "OrderItem",
    attributes: [
      { id: "attr-oi-1", name: "id", type: "Int" },
      { id: "attr-oi-2", name: "orderId", type: "Int" },
      { id: "attr-oi-3", name: "productId", type: "Int" },
      { id: "attr-oi-4", name: "quantity", type: "Int" },
      { id: "attr-oi-5", name: "unitPrice", type: "Float" },
    ],
    methods: [],
    x: 760,
    y: 320,
  },
  {
    id: "table-cart",
    title: "Cart",
    attributes: [
      { id: "attr-cart-1", name: "id", type: "Int" },
      { id: "attr-cart-2", name: "customerId", type: "Int" },
      { id: "attr-cart-3", name: "createdAt", type: "Date" },
    ],
    methods: [],
    x: 40,
    y: 580,
  },
]

const initialRelations: TableRelation[] = [
  {
    id: "rel-1",
    fromTableId: "table-category",
    toTableId: "table-product",
    cardinality: "1:N",
  },
  {
    id: "rel-2",
    fromTableId: "table-customer",
    toTableId: "table-order",
    cardinality: "1:N",
  },
  {
    id: "rel-3",
    fromTableId: "table-order",
    toTableId: "table-orderitem",
    cardinality: "1:N",
  },
]

export const useCanvasLogic = () => {
  const [tables, setTables] = useState<TableData[]>(() => {
    const saved = loadFromSessionStorage()
    return saved?.tables ?? initialTables
  })
  const [relations, setRelations] = useState<TableRelation[]>(() => {
    const saved = loadFromSessionStorage()
    return saved?.relations ?? initialRelations
  })
  const [pendingRelation, setPendingRelation] =
    useState<PendingRelation | null>(null)
  const [editingRelation, setEditingRelation] = useState<TableRelation | null>(
    null
  )
  const [relationDialogOpen, setRelationDialogOpen] = useState(false)
  const [drawingLine, setDrawingLine] = useState<DrawingLine | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const activeRelationSource = useRef<RelationSource | null>(null)
  const dragInfo = useRef<DragInfo | null>(null)
  const panState = useRef<PanState | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      //e.preventDefault()
      const newZoom = e.deltaY < 0 ? zoom + ZOOM_STEP : zoom - ZOOM_STEP
      setZoom(
        parseFloat(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZoom)).toFixed(2))
      )
    },
    [zoom]
  )

  const addTable = useCallback(() => {
    if (isLocked) return
    setTables((prev) => [
      ...prev,
      {
        id: generateId("table"),
        title: `${DEFAULT_TABLE_NAME}_${prev.length + 1}`,
        attributes: [],
        methods: [],
        x: 250 + prev.length * 20,
        y: 180 + prev.length * 20,
      },
    ])
  }, [isLocked])

  const deleteTable = useCallback(
    (id: string) => {
      if (isLocked) return
      setTables((prev) => prev.filter((t) => t.id !== id))
      setRelations((prev) =>
        prev.filter((r) => r.fromTableId !== id && r.toTableId !== id)
      )
    },
    [isLocked]
  )

  const updateTableTitle = useCallback((id: string, title: string) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)))
  }, [])

  const deleteAttribute = useCallback((tableId: string, attrId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t
        return {
          ...t,
          attributes: t.attributes.filter((a) => a.id !== attrId),
        }
      })
    )
  }, [])

  const addAttribute = useCallback((tableId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t
        return {
          ...t,
          attributes: [
            ...t.attributes,
            createDefaultAttribute(t.attributes.length),
          ],
        }
      })
    )
  }, [])

  const updateAttributeName = useCallback(
    (tableId: string, attrId: string, name: string) => {
      setTables((prev) =>
        prev.map((t) =>
          t.id !== tableId ? t : withUpdatedAttribute(t, attrId, { name })
        )
      )
    },
    []
  )

  const updateAttributeType = useCallback(
    (
      tableId: string,
      attrId: string,
      attrType: TableData["attributes"][number]["type"]
    ) => {
      setTables((prev) =>
        prev.map((t) =>
          t.id !== tableId
            ? t
            : withUpdatedAttribute(t, attrId, { type: attrType })
        )
      )
    },
    []
  )

  const startRelationDrag = useCallback(
    (e: React.MouseEvent, tableId: string) => {
      if (isLocked || !canvasRef.current) return
      e.stopPropagation()
      e.preventDefault()
      const position = getCanvasPosition(e, canvasRef.current, zoom, pan)
      activeRelationSource.current = { tableId }
      setDrawingLine({
        startX: position.x,
        startY: position.y,
        currentX: position.x,
        currentY: position.y,
      })
    },
    [isLocked, zoom, pan]
  )

  const startPan = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      panState.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      }
      setIsPanning(true)
    },
    [pan]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (panState.current) {
        if ((e.buttons & 1) === 0) {
          panState.current = null
          setIsPanning(false)
          return
        }
        setPan({
          x:
            panState.current.startPanX +
            (e.clientX - panState.current.startClientX),
          y:
            panState.current.startPanY +
            (e.clientY - panState.current.startClientY),
        })
        return
      }
      if (!activeRelationSource.current || !drawingLine || !canvasRef.current)
        return
      const position = getCanvasPosition(e, canvasRef.current, zoom, pan)
      setDrawingLine({
        ...drawingLine,
        currentX: position.x,
        currentY: position.y,
      })
    },
    [drawingLine, zoom, pan]
  )

  const resetRelationState = useCallback(() => {
    activeRelationSource.current = null
    setDrawingLine(null)
    // Also finish any in-progress pan on mouse up / mouse leave.
    if (panState.current) {
      panState.current = null
      setIsPanning(false)
    }
  }, [])

  const handleMouseUpOnTable = useCallback(
    (targetId: string) => {
      if (isLocked || !activeRelationSource.current) return
      const { tableId: fromId } = activeRelationSource.current
      if (fromId !== targetId) {
        setPendingRelation({
          fromTableId: fromId,
          toTableId: targetId,
        })
      }
      resetRelationState()
    },
    [isLocked, resetRelationState]
  )

  const confirmRelation = useCallback(
    (
      cardinality: "1:1" | "1:N" | "N:N",
      fromTableId?: string,
      toTableId?: string
    ) => {
      const fromId = fromTableId ?? pendingRelation?.fromTableId
      const toId = toTableId ?? pendingRelation?.toTableId
      if (fromId && toId && fromId !== toId) {
        if (editingRelation) {
          // Update the existing relation
          setRelations((prev) =>
            prev.map((r) =>
              r.id === editingRelation.id
                ? { ...r, fromTableId: fromId, toTableId: toId, cardinality }
                : r
            )
          )
        } else {
          setRelations((prev) => [
            ...prev,
            {
              id: generateId("rel"),
              fromTableId: fromId,
              toTableId: toId,
              cardinality,
            },
          ])
        }
      }
      setPendingRelation(null)
      setEditingRelation(null)
      setRelationDialogOpen(false)
    },
    [pendingRelation, editingRelation]
  )

  const cancelRelation = useCallback(() => {
    setPendingRelation(null)
    setEditingRelation(null)
    setRelationDialogOpen(false)
  }, [])

  const openRelationDialog = useCallback(() => {
    setEditingRelation(null)
    setPendingRelation(null)
    setRelationDialogOpen(true)
  }, [])

  const openRelationForEdit = useCallback((rel: TableRelation) => {
    setPendingRelation(null)
    setEditingRelation(rel)
    setRelationDialogOpen(true)
  }, [])

  const closeRelationDialog = useCallback(() => {
    setEditingRelation(null)
    setRelationDialogOpen(false)
  }, [])

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      if (isLocked) {
        e.preventDefault()
        return
      }
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      dragInfo.current = {
        id,
        offsetX: (e.clientX - rect.left) / zoom,
        offsetY: (e.clientY - rect.top) / zoom,
      }
      const img = new Image()
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      e.dataTransfer.setDragImage(img, 0, 0)
    },
    [isLocked, zoom]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!dragInfo.current || !canvasRef.current || isLocked) return
      const { x, y } = getCanvasPosition(e, canvasRef.current, zoom, pan)
      setTables((prev) =>
        prev.map((t) =>
          t.id === dragInfo.current!.id
            ? {
                ...t,
                x: x - dragInfo.current!.offsetX,
                y: y - dragInfo.current!.offsetY,
              }
            : t
        )
      )
    },
    [isLocked, zoom, pan]
  )

  const clearDragInfo = useCallback(() => {
    dragInfo.current = null
  }, [])

  const deleteRelation = useCallback(
    (fromTableId?: string, toTableId?: string) => {
      if (isLocked) return
      setRelations((prev) =>
        prev.filter((r) => {
          if (editingRelation) return r.id !== editingRelation.id
          return !(r.fromTableId === fromTableId && r.toTableId === toTableId)
        })
      )
      setPendingRelation(null)
      setEditingRelation(null)
      setRelationDialogOpen(false)
    },
    [isLocked, editingRelation]
  )

  const saveAll = useCallback(() => {
    saveToSessionStorage(tables, relations)
  }, [tables, relations])

  return {
    tables,
    relations,
    pendingRelation,
    editingRelation,
    relationDialogOpen,
    drawingLine,
    zoom,
    pan,
    isPanning,
    isLocked,
    selectedTableId,
    setSelectedTableId,
    canvasRef,
    setZoom,
    setIsLocked,
    handleWheel,
    addTable,
    deleteTable,
    updateTableTitle,
    addAttribute,
    updateAttributeName,
    updateAttributeType,
    startRelationDrag,
    handleMouseMove,
    startPan,
    handleMouseUpOnTable,
    resetRelationState,
    confirmRelation,
    cancelRelation,
    openRelationDialog,
    openRelationForEdit,
    closeRelationDialog,
    handleDragStart,
    handleDragOver,
    clearDragInfo,
    deleteRelation,
    deleteAttribute,
    saveAll,
  }
}
