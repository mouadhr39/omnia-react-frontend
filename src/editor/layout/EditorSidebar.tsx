import { useMemo } from 'react';
import { usePageStore } from '@/editor/store/usePageStore';
import { useNodeStore } from '@/editor/store/useNodeStore';
import { componentRegistry } from '@/editor/registry/components';
import { PageNode } from '@/editor/types';
import { useDraggable } from '@dnd-kit/core';
import { generateId } from '@/editor/utils/generateId';
import { mediaAssets } from '@/editor/media/mediaStore';
import { X, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function ComponentListItem({ node }: { node: PageNode }) {
  const selectNode = useNodeStore((s) => s.selectNode);
  const removeNode = useNodeStore((s) => s.removeNode);
  const selectedNodeId = useNodeStore((s) => s.selectedNodeId);
  const typeLabel = componentRegistry.get(node.type)?.label ?? node.type;

  return (
    <div
      className={`group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
        selectedNodeId === node.id
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted'
      }`}
      onClick={() => selectNode(node.id)}
    >
      <GripVertical className="size-3 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{typeLabel}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeNode(node.id);
        }}
        className="flex size-4 items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

function MediaItem({ node, onAdd }: { node: PageNode; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `media-${node.id}`,
    data: { isNew: true, type: node.type, media: node },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="group flex cursor-grab items-center gap-2 rounded-md border bg-background p-1.5 transition-colors hover:border-primary/50 active:cursor-grabbing"
    >
      <GripVertical className="size-3 shrink-0 text-muted-foreground" />
      <img
        src={node.props.src as string}
        alt={node.props.alt as string}
        className="size-8 shrink-0 rounded object-cover"
      />
      <span className="flex-1 truncate text-xs">
        {node.props.alt as string}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-5 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
}

export function EditorSidebar() {
  const document = usePageStore((s) => s.document);
  const addNode = useNodeStore((s) => s.addNode);

  const flattenedComponents = useMemo(() => {
    const root = document?.root;
    if (!root) return [];
    return [...root];
  }, [document]);

  const handleAddFromMedia = (node: PageNode) => {
    const newNode: PageNode = {
      ...node,
      id: generateId(),
      props: { ...node.props },
      children: [],
      order: 0,
      parentID: null,
      design: {},
    };
    addNode(null, newNode.type, newNode.props);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-3">
          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Page Components ({flattenedComponents.length})
            </h3>
            {flattenedComponents.length === 0 ? (
              <p className="py-2 text-xs text-muted-foreground italic">
                No components on page yet.
              </p>
            ) : (
              <div className="space-y-0.5">
                {flattenedComponents.map((node) => (
                  <ComponentListItem key={node.id} node={node} />
                ))}
              </div>
            )}
          </section>

          <Separator />

          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Media Library
            </h3>
            <div className="grid gap-2">
              {mediaAssets.map((asset) => (
                <MediaItem
                  key={asset.id}
                  node={asset.node}
                  onAdd={() => handleAddFromMedia(asset.node)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
