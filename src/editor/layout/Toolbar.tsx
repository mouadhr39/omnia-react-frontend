import { Undo2, Redo2, Save, Eye, Pencil } from 'lucide-react';
import { usePageStore } from '@/editor/store/usePageStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Toolbar() {
  const document = usePageStore((s) => s.document);
  const mode = usePageStore((s) => s.mode);
  const isSaving = usePageStore((s) => s.isSaving);
  const lastSaved = usePageStore((s) => s.lastSaved);
  const setMode = usePageStore((s) => s.setMode);
  const saveDocument = usePageStore((s) => s.saveDocument);
  const undo = usePageStore((s) => s.undo);
  const redo = usePageStore((s) => s.redo);
  const undoable = usePageStore((s) => s.undoable);
  const updateTitle = usePageStore((s) => s.updateTitle);

  const canUndo = undoable.past.length > 0;
  const canRedo = undoable.future.length > 0;

  return (
    <div className="flex items-center justify-between border-b px-4 py-2 bg-muted">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Input
          value={document?.title || ''}
          onChange={(e) => updateTitle(e.target.value)}
          className="h-8 w-48 text-sm font-medium"
          placeholder="Page title"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => saveDocument()} disabled={isSaving} title="Save (Ctrl+S)">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
          {mode === 'edit' ? <Eye className="h-4 w-4 mr-1" /> : <Pencil className="h-4 w-4 mr-1" />}
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        {isSaving ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved'}
      </div>
    </div>
  );
}
