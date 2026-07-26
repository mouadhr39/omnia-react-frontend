import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useNodeStore } from '@/editor/store/useNodeStore';
import { ComponentType } from '@/editor/types/page';
import { useState, useCallback } from 'react';

export function useDropManager() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ComponentType | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const nodeStore = useNodeStore();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const possibleType = active.data.current?.type as ComponentType | undefined;
    if (possibleType) setActiveType(possibleType);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setDragOverId(over?.id ? String(over.id) : null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setDragOverId(null);

    if (!over) return;

    const activeData = active.data.current;
    const dropTargetId = String(over.id);
    const isNewNode = activeData?.isNew;
    const media = activeData?.media as { props?: Record<string, unknown> } | undefined;

    if (isNewNode) {
      const type = activeData.type as ComponentType;
      const props = media?.props ?? {};
      nodeStore.addNode(dropTargetId === '__root__' ? null : dropTargetId, type, props);
      return;
    }

    if (active.id !== over.id) {
      nodeStore.moveNode(active.id as string, dropTargetId === '__root__' ? null : dropTargetId, 0);
    }
  }, [nodeStore]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
    setDragOverId(null);
  }, []);

  return {
    sensors,
    activeId,
    activeType,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
