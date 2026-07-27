import { create } from 'zustand';
import { PageNode } from '@/editor/types';
import { usePageStore } from './usePageStore';

export interface PropStore {
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  updateNodeDesign: (id: string, design: Partial<PageNode['design']>) => void;
}

export const usePropStore = create<PropStore>(() => ({
  updateNodeProps: (id, props) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const newDoc = {
      ...document,
      root: document.root.map((node) =>
        node.id === id ? { ...node, props: { ...node.props, ...props } } : node
      ),
    };
    pageStore.setDocument(newDoc);
  },

  updateNodeDesign: (id, design) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const newDoc = {
      ...document,
      root: document.root.map((node) =>
        node.id === id
          ? { ...node, design: { ...node.design, ...design } }
          : node
      ),
    };
    pageStore.setDocument(newDoc);
  },
}));
