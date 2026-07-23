import { PageNode } from '@/editor/types/page';
import { usePageStore } from '@/editor/store/usePageStore';

export function useComponentProps(nodeId: string | null) {
  const document = usePageStore((s) => s.document);
  const selectedNode = nodeId ? findNode(nodeId, document?.root || []) : null;
  const updateNodeProps = usePageStore((s) => s.updateNodeProps);
  const updateNodeDesign = usePageStore((s) => s.updateNodeDesign);

  return {
    node: selectedNode,
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
