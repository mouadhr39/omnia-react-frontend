import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Pencil,
  ArrowLeftFromLine,
  ArrowRightFromLine,
} from 'lucide-react';
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
  const toggleLeftPanel = usePageStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = usePageStore((s) => s.toggleRightPanel);
  const isPanelLeftOpen = usePageStore((s) => s.leftPanelOpen);
  const isPanelRightOpen = usePageStore((s) => s.rightPanelOpen);

  const canUndo = undoable.past.length > 0;
  const canRedo = undoable.future.length > 0;

  return (
    <div className="flex items-center justify-items-stretch border-b bg-muted px-4 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLeftPanel}
        title="Toggle Left Sidebar"
      >
       {isPanelLeftOpen ? <ArrowLeftFromLine className="h-2 w-2" /> : <ArrowRightFromLine className="h2- w-2" /> }
      </Button>

      <div className="flex flex-6/8 flex-row items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Input
          value={document?.title || ''}
          onChange={(e) => updateTitle(e.target.value)}
          className="h-8 w-48 text-sm font-medium"
          placeholder="Page title"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => saveDocument()}
          disabled={isSaving}
          title="Save (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
        >
          {mode === 'edit' ? (
            <Eye className="mr-1 h-4 w-4" />
          ) : (
            <Pencil className="mr-1 h-4 w-4" />
          )}
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </Button>
        <div className="text-xs text-muted-foreground">
          {isSaving
            ? 'Saving...'
            : lastSaved
              ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
              : 'Not saved'}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRightPanel}
        title="Toggle Right Sidebar"
      >
        {isPanelRightOpen ? <ArrowRightFromLine className="h-2 w-2" /> : <ArrowLeftFromLine className="h2- w-2" /> }
      </Button>
    </div>
  );
}
