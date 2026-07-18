import { useState } from "react"
import {
  type TableData,
  type PendingRelation,
  type TableRelation,
} from "@/components/modeling/types"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Notify } from "@/components/Notify"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"

interface RelationDialogProps {
  tables: TableData[]
  relations: TableRelation[]
  pendingRelation: PendingRelation | null
  editingRelation: TableRelation | null
  isDragWorkflow: boolean
  onConfirm: (
    cardinality: "1:1" | "1:N" | "N:N",
    fromTableId?: string,
    toTableId?: string
  ) => void
  onDelete: (fromTableId?: string, toTableId?: string) => void
  onCancel: () => void
}

const RelationDialog: React.FC<RelationDialogProps> = ({
  tables,
  relations,
  pendingRelation,
  editingRelation,
  isDragWorkflow,
  onConfirm,
  onDelete,
  onCancel,
}) => {
  const [sourceId, setSourceId] = useState<string | null>(
    pendingRelation?.fromTableId ?? editingRelation?.fromTableId ?? ""
  )
  const [targetId, setTargetId] = useState<string | null>(
    pendingRelation?.toTableId ?? editingRelation?.toTableId ?? ""
  )
  const [cardinality, setCardinality] = useState<"1:1" | "1:N" | "N:N">(
    editingRelation?.cardinality ?? "1:1"
  )
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(
    editingRelation?.id ?? null
  )

  // Only when opened from the action-bar "Add Relation" button (not drag, not
  // circle-click editing) do we surface the list of existing relations.
  const showRelationsList = !isDragWorkflow && !editingRelation

  const tableTitle = (id: string) =>
    tables.find((t) => t.id === id)?.title ?? "Unknown"

  const handleSelectRelation = (relationId: string | null) => {
    const relation = relations.find((r) => r.id === relationId)
    if (!relation) return
    setSelectedRelationId(relation.id)
    setSourceId(relation.fromTableId)
    setTargetId(relation.toTableId)
    setCardinality(relation.cardinality)
  }

  const handleDelete = () => {
    if (!sourceId || !targetId) return
    onDelete(sourceId, targetId)
    Notify({message: "Relationship deleted.", type: "info"})
  }

  const handleSave = () => {
    if (!sourceId || !targetId) return
    onConfirm(cardinality, sourceId, targetId)
    Notify({message: "Relationship saved.", type: "info"})
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {editingRelation ? "Edit Relation" : "Add Relation"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {showRelationsList && (
          <Field>
            <Label htmlFor="existing-relation">Existing Relations</Label>
            <Select
              value={selectedRelationId ?? ""}
              onValueChange={handleSelectRelation}
              disabled={relations.length === 0}
            >
              <SelectTrigger id="existing-relation" className="w-full">
                <SelectValue
                  placeholder={
                    relations.length === 0
                      ? "No relations yet"
                      : "Select a relation to edit"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Existing Relations</SelectLabel>
                  {relations.map((relation) => (
                    <SelectItem key={relation.id} value={relation.id}>
                      {tableTitle(relation.fromTableId)} {"->"}{" "}
                      {tableTitle(relation.toTableId)} ({relation.cardinality})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
        <FieldGroup className="flex flex-row text-[11px]">
          <Field>
            <Label htmlFor="source-table">Source Table</Label>
            <Select
              value={sourceId}
              onValueChange={setSourceId}
              disabled={isDragWorkflow}
            >
              <SelectTrigger id="source-table" className="w-full max-w-30">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Source Table</SelectLabel>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="target-table">Target Table</Label>
            <Select
              value={targetId}
              onValueChange={setTargetId}
              disabled={isDragWorkflow}
            >
              <SelectTrigger id="target-table" className="w-full max-w-30">
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Target Table</SelectLabel>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="cardinality">Cardinality</Label>
            <Select
              value={cardinality}
              onValueChange={(val) =>
                setCardinality(val as "1:1" | "1:N" | "N:N")
              }
            >
              <SelectTrigger id="cardinality" className="w-full max-w-30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">One-To-One</SelectItem>
                <SelectItem value="1:N">One-To-Many</SelectItem>
                <SelectItem value="N:N">Many-To-Many</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="sm:justify-start">
          <DialogClose
            render={
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!sourceId || !targetId}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleSave}
            disabled={!sourceId || !targetId}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { RelationDialog }
