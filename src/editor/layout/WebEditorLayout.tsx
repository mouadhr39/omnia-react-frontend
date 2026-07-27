import { usePageStore } from '@/editor/store/usePageStore';
import { useNodeStore } from '@/editor/store/useNodeStore';
import { IframeContainer } from '@/editor/iframe/IframeContainer';
import { EditorSidebar } from '@/editor/layout/EditorSidebar';
import { PropertiesPanel } from '@/editor/layout/PropertiesPanel';
import { ComponentPicker } from '@/editor/layout/ComponentPicker';
import { Toolbar } from '@/editor/layout/Toolbar';
import { useDropManager } from '@/editor/hooks/useDropManager';
import { cn } from '@/lib/utils';
import { DndContext, DragStartEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { pointerWithin } from '@dnd-kit/core';
import { ComponentType } from '@/editor/types';
import { ComponentDialog } from '@/editor/layout/ComponentDialog';

export function WebEditorLayout() {
  const mode = usePageStore((s) => s.mode);
  const document = usePageStore((s) => s.document);
  const openParsys = useNodeStore((s) => s.openParsys);
  const setOpenParsys = useNodeStore((s) => s.setOpenParsys);
  const parsysAdd = useNodeStore((s) => s.parsysAdd);
  const createDocument = usePageStore((s) => s.createDocument);
  const isPanelLeftOpen = usePageStore((s) => s.leftPanelOpen);
  const isPanelRightOpen = usePageStore((s) => s.rightPanelOpen);

  console.log('isPanelLeftOpen ', isPanelLeftOpen);

  const {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDropManager();

  const handleParsysSelect = (type: ComponentType) => {
    parsysAdd(type);
    setOpenParsys(false);
  };

  if (!document) {
    return (
      <div className="flex h-full flex-col">
        <Toolbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-4 text-center">
            <p className="text-lg font-medium">No page loaded</p>
            <button
              onClick={() => createDocument('Untitled Page')}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Create Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDragStartWrapper = (event: DragStartEvent) => {
    handleDragStart(event);
  };

  return (
    <div className="mt-1 ml-1 flex h-full flex-col">
      <Toolbar />
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStartWrapper}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={cn('flex min-h-0 flex-1')}>
          <aside
            className={cn(
              'flex flex-col overflow-hidden border-r bg-muted/30 transition-all duration-200 ease-in-out',
              mode === 'preview' || !isPanelLeftOpen
                ? 'w-0 -translate-x-full border-r-0 opacity-0'
                : 'w-[300px] translate-x-0 opacity-100'
            )}
          >
            <div className="flex w-[300px] flex-1 flex-col overflow-hidden">
              <EditorSidebar />
            </div>
          </aside>
          <main className="relative min-w-0 flex-1 bg-muted/20">
            <IframeContainer
              document={document}
              mode={mode}
              onSelectNode={useNodeStore.getState().selectNode}
              activeId={activeId}
            />
            {mode === 'preview' && (
              <div className="absolute right-4 bottom-4">
                <button
                  onClick={() => usePageStore.getState().setMode('edit')}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  Back to Editor
                </button>
              </div>
            )}
          </main>
          <aside
            className={cn(
              'flex flex-col overflow-hidden border-r bg-muted/30 transition-all duration-200 ease-in-out',
              mode === 'preview' || !isPanelRightOpen
                ? 'w-0 -translate-x-full border-r-0 opacity-0'
                : 'w-[300px] translate-x-0 opacity-100'
            )}
          >
            <div className="flex w-[300px] flex-1 flex-col overflow-hidden">
              <PropertiesPanel />
            </div>
          </aside>
        </div>
        <ComponentDialog />
        <ComponentPicker
          open={openParsys}
          onOpenChange={setOpenParsys}
          onSelect={handleParsysSelect}
        />
      </DndContext>
    </div>
  );
}
