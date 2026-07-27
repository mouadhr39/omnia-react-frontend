import { useMemo } from 'react';
import { componentRegistry } from '@/editor/registry/components';
import { ComponentType } from '@/editor/types';
import { useDraggable } from '@dnd-kit/core';

function DraggableItem({
  type,
  label,
}: {
  type: ComponentType;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}`,
    data: { isNew: true, type },
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
      className="flex cursor-grab items-center gap-2 rounded-md border bg-background p-2 transition-colors hover:border-primary/50 active:cursor-grabbing"
    >
      <span className="w-5 text-xs tracking-wide text-muted-foreground uppercase">
        {label.charAt(0)}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Palette() {
  const categories = useMemo(() => {
    const comps = Array.from(componentRegistry.values());
    return comps.reduce<Record<string, typeof comps>>((acc, c) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category].push(c);
      return acc;
    }, {});
  }, []);

  return (
    <div className="h-full space-y-4 overflow-y-auto p-3">
      {Object.entries(categories).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {items.map((item) => (
              <DraggableItem
                key={item.type}
                type={item.type}
                label={item.label}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
