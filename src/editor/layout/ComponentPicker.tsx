import { useMemo } from 'react';
import { componentRegistry } from '@/editor/registry/components';
import { type ComponentType } from '@/editor/types/page';
import { useDraggable } from '@dnd-kit/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ComponentPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: ComponentType) => void;
}

function PickerItem({ type, label, category, onSelect }: { type: ComponentType; label: string; category: string; onSelect: (type: ComponentType) => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `picker-${type}`,
    data: { isNew: true, type },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => onSelect(type)}
      className="flex cursor-grab items-center gap-3 rounded-md border bg-background px-3 py-2.5 transition-colors hover:border-primary/50 active:cursor-grabbing"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
        {label.charAt(0)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{category}</p>
      </div>
    </div>
  );
}

export function ComponentPicker({ open, onOpenChange, onSelect }: ComponentPickerProps) {
  const categories = useMemo(() => {
    const comps = Array.from(componentRegistry.values());
    return comps.reduce<Record<string, typeof comps>>((acc, c) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category].push(c);
      return acc;
    }, {});
  }, []);

  const handleSelect = (type: ComponentType) => {
    onSelect(type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-hidden p-0 gap-0 sm:max-w-md">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base">Insert Component</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
          <div className="space-y-4">
            {Object.entries(categories).map(([category, items]) => (
              <div key={category}>
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {category}
                </h4>
                <div className="grid gap-2">
                  {items.map((item) => (
                    <PickerItem
                      key={item.type}
                      type={item.type}
                      label={item.label}
                      category={item.category}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
