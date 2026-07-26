import { create } from 'zustand';
import { ComponentType, PageNode } from '@/editor/types';
import {
  cloneNode,
  generateId,
  insertNode,
  moveNode,
  removeNode,
  findNode,
  findNodeParentAndIndex,
} from '@/editor/utils';
import { getDefaultNode } from './getDefaultNode';
import { usePageStore } from './usePageStore';

export interface NodeStore {
  selectedNodeId: string | null;
  dialogNodeId: string | null;
  clipboard: PageNode | null;
  mediaLibrary: PageNode[];
  openParsys: boolean;
  selectNode: (id: string | null) => void;
  setDialogNodeId: (id: string | null) => void;
  copyToClipboard: (id: string) => void;
  duplicateNode: (id: string) => void;
  pasteAfterNode: (targetId: string) => void;
  addNode: (
    parentID: string | null,
    type: ComponentType,
    properties: Record<string, unknown>,
    index?: number
  ) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null, newIndex: number) => void;
  parsysAdd: (type: ComponentType) => void;
  addMediaAsset: (node: PageNode) => void;
  removeMediaAsset: (id: string) => void;
  setOpenParsys: (open: boolean) => void;
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  selectedNodeId: null,
  dialogNodeId: null,
  clipboard: null,
  mediaLibrary: [],
  openParsys: false,

  selectNode: (id) => set({ selectedNodeId: id }),
  setDialogNodeId: (id) => set({ dialogNodeId: id }),

  copyToClipboard: (id) => {
    const document = usePageStore.getState().document;
    const node = findNode(id, document?.root || []);
    set({ clipboard: node ? cloneNode(node) : null });
  },

  addNode: (parentID, type, properties, index) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const def = getDefaultNode(type);
    const node: PageNode = {
      ...def,
      id: generateId(),
      props: { ...def.props, ...properties },
      order: 0,
      parentID,
    };
    const newDoc = {
      ...document,
      root: insertNode(parentID, node, document.root, index),
    };
    set({ selectedNodeId: node.id });
    pageStore.setDocument(newDoc);
  },

  removeNode: (id) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const newDoc = {
      ...document,
      root: removeNode(id, document.root),
    };
    set({
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
    pageStore.setDocument(newDoc);
  },

  moveNode: (id, newParentId, newIndex) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const newDoc = {
      ...document,
      root: moveNode(id, newParentId, newIndex, document.root),
    };
    pageStore.setDocument(newDoc);
  },

  duplicateNode: (id) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const node = findNode(id, document.root);
    if (!node) return;

    const clone = cloneNode(node);
    clone.id = generateId();
    const pos = findNodeParentAndIndex(id, document.root);
    const newDoc = {
      ...document,
      root: insertNode(
        pos?.parent?.id ?? null,
        clone,
        document.root,
        pos ? pos.index + 1 : document.root.length
      ),
    };
    pageStore.setDocument(newDoc);
  },

  pasteAfterNode: (targetId) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    const clipboard = get().clipboard;
    if (!document || !clipboard) return;

    const clipboardCopy = cloneNode(clipboard);
    clipboardCopy.id = generateId();
    const pos = findNodeParentAndIndex(targetId, document.root);
    const insertIndex = pos ? pos.index + 1 : document.root.length;
    const newDoc = {
      ...document,
      root: insertNode(
        pos?.parent?.id ?? null,
        clipboardCopy,
        document.root,
        insertIndex
      ),
    };
    pageStore.setDocument(newDoc);
  },

  parsysAdd: (type) => {
    const pageStore = usePageStore.getState();
    const document = pageStore.document;
    if (!document) return;

    const def = getDefaultNode(type);
    const node: PageNode = {
      ...def,
      id: generateId(),
      props: { ...def.props },
      order: 0,
      parentID: null,
    };
    const newDoc = {
      ...document,
      root: insertNode(null, node, document.root, document.root.length),
    };
    set({ selectedNodeId: node.id });
    pageStore.setDocument(newDoc);
  },

  addMediaAsset: (node: PageNode) => {
    set((state) => ({
      mediaLibrary: [...state.mediaLibrary, cloneNode(node)],
    }));
  },

  removeMediaAsset: (id) => {
    set((state) => ({
      mediaLibrary: state.mediaLibrary.filter((n) => n.id !== id),
    }));
  },

  setOpenParsys: (open) => set({ openParsys: open }),
}));
