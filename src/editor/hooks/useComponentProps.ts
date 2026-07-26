import { PageNode } from '@/editor/types/page';
import { usePageStore } from '@/editor/store/usePageStore';
import { usePropStore } from '@/editor/store/usePropStore';

export function useComponentProps(nodeId: string | null) {
  const document = usePageStore((s) => s.document);
  const updateNodeProps = usePropStore((s) => s.updateNodeProps);
  const updateNodeDesign = usePropStore((s) => s.updateNodeDesign);

  return {
    node: nodeId ? findNode(nodeId, document?.root || []) : null,
    updateProps: (props: Record<string, unknown>) => {
      if (nodeId) updateNodeProps(nodeId, props);
    },
    updateDesign: (design: Partial<PageNode['design']>) => {
      if (nodeId) updateNodeDesign(nodeId, design);
    },
  };
}

export function usePageHead() {
  const document = usePageStore((s) => s.document);
  const updateHead = usePageStore((s) => s.updateHead);

  return {
    head: document?.head,
    updateHead,
  };
}

function findNode(id: string, nodes: PageNode[]): PageNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(id, n.children);
    if (found) return found;
  }
  return null;
}
