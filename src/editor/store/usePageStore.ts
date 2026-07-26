import { create } from 'zustand';
import {
  Document,
  PageNode,
  EditorMode,
  ComponentType,
  UndoableState
} from '@/editor/types';
import { createSnapshot, cloneDocument, generateId, cloneNode } from '@/editor/utils';
import {
  insertNode,
  moveNode,
  removeNode,
  findNode,
  findNodeParentAndIndex,
} from '@/editor/utils/insertNode';
import { StorageAdapter } from '@/editor/storage/storageAdapter';
import { localStorageManager } from '@/editor/storage/localStorageManager';

export interface PageStore {
  document: Document | null;
  lastDocId: string | null;
  selectedNodeId: string | null;
  dialogNodeId: string | null;
  mode: EditorMode;
  isSaving: boolean;
  lastSaved: number | null;
  undoable: UndoableState;
  adapter: StorageAdapter;
  clipboard: PageNode | null;
  mediaLibrary: PageNode[];
  openParsys: boolean;
  loadDocument: (id: string) => Promise<void>;
  createDocument: (title: string) => Promise<void>;
  saveDocument: () => Promise<void>;

 /* addNode: (
    parentId: string | null,
    type: ComponentType,
    props?: Record<string, unknown>,
    index?: number
  ) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null, newIndex: number) => void;
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  updateNodeDesign: (id: string, design: Partial<PageNode['design']>) => void;
  duplicateNode: (id: string) => void;
  pasteAfterNode: (targetId: string) => void;*/
  copyToClipboard: (id: string) => void;
  parsysAdd: (type: ComponentType) => void;
  addMediaAsset: (node: PageNode) => void;
  removeMediaAsset: (id: string) => void;
  setOpenParsys: (open: boolean) => void;

 // selectNode: (id: string | null) => void;
 // setDialogNodeId: (id: string | null) => void;
  setMode: (mode: EditorMode) => void;

  updateHead: (head: Partial<Document['head']>) => void;
  updateTitle: (title: string) => void;

  undo: () => void;
  redo: () => void;
}
/*
const HISTORY_LIMIT = 50;

function snapshot(state: PageStore): UndoableState {
  const current = state.undoable.present;
  const past = [
    ...state.undoable.past,
    current ? cloneNodeDoc(current) : null,
  ].filter(Boolean) as Document[];
  return {
    past: past.slice(-HISTORY_LIMIT),
    present: current ? cloneNodeDoc(current) : null,
    future: [],
  };
}

function cloneNodeDoc(doc: Document): Document {
  return {
    ...doc,
    root: doc.root.map((n) => cloneNode(n)),
    head: {
      ...doc.head,
      css: [...doc.head.css],
      js: [...doc.head.js],
      meta: { ...doc.head.meta },
    },
  };
}*/

export const usePageStore = create<PageStore>((set, get) => ({
  document: localStorageManager.loadLastPage(),
  selectedNodeId: null,
  dialogNodeId: null,
  lastDocId: null,
  listdocs: null,
  mode: 'edit',
  isSaving: false,
  lastSaved: null,
  undoable: { past: [], present: null, future: [] },
  adapter: localStorageManager,
  clipboard: null,
  mediaLibrary: [],
  openParsys: false,

  loadDocument: async (id: string) => {
    const doc = await get().adapter.loadPage(id);
    console.log('Doc loaded ' + doc);
    if (doc) {
      set({
        document: doc,
        selectedNodeId: null,
        undoable: { past: [], present: cloneNodeDoc(doc), future: [] },
      });
    }
  },

  createDocument: async (title: string) => {
    const now = Date.now();
    const doc: Document = {
      id: generateId(),
      title,
      createdAt: now,
      updatedAt: now,
      meta: {},
      head: { css: [], js: [], meta: {} },
      root: [],
    };
    await get().adapter.savePage(doc);
    set({
      document: cloneNodeDoc(doc),
      selectedNodeId: null,
      undoable: { past: [], present: cloneNodeDoc(doc), future: [] },
      lastSaved: now,
    });
  },

  saveDocument: async () => {
    const { document, adapter } = get();
    if (!document) return;
    set({ isSaving: true });
    const now = Date.now();
    const doc = { ...document, updatedAt: now };
    await adapter.savePage(doc);
    set({
      document: cloneNodeDoc(doc),
      isSaving: false,
      lastSaved: now,
    });
  },


  setMode: (mode) => set({ mode }),

  updateHead: (head) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = {
        ...state.document,
        head: { ...state.document.head, ...head },
      };
      return {
        document: cloneNodeDoc(newDoc),
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  updateTitle: (title) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = { ...state.document, title };
      return {
        document: cloneNodeDoc(newDoc),
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      const { past, present, future } = state.undoable;
      if (past.length === 0 || !present) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return {
        document: previous,
        selectedNodeId: state.selectedNodeId,
        undoable: {
          past: newPast,
          present: previous,
          future: [cloneNodeDoc(present), ...future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { past, present, future } = state.undoable;
      if (future.length === 0 || !present) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        document: next,
        selectedNodeId: state.selectedNodeId,
        undoable: {
          past: [...past, cloneNodeDoc(present)],
          present: next,
          future: newFuture,
        },
      };
    });
  },

  duplicateNode: (id) => {
    set((state) => {
      if (!state.document) return state;
      const node = findNode(id, state.document.root);
      if (!node) return state;
      const clone = cloneNode(node);
      clone.id = generateId();
      const pos = findNodeParentAndIndex(id, state.document.root);
      const newDoc = {
        ...state.document,
        root: insertNode(
          pos?.parent?.id ?? null,
          clone,
          state.document.root,
          pos ? pos.index + 1 : state.document.root.length
        ),
      };
      return {
        document: cloneNodeDoc(newDoc),
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  copyToClipboard: (id) => {
    set((state) => {
      const node = findNode(id, state.document?.root || []);
      return { clipboard: node ? cloneNode(node) : null };
    });
  },

  pasteAfterNode: (targetId) => {
    set((state) => {
      if (!state.document || !state.clipboard) return state;
      const clipboardCopy = cloneNode(state.clipboard);
      clipboardCopy.id = generateId();
      const pos = findNodeParentAndIndex(targetId, state.document.root);
      const insertIndex = pos ? pos.index + 1 : state.document.root.length;
      const newDoc = {
        ...state.document,
        root: insertNode(
          pos?.parent?.id ?? null,
          clipboardCopy,
          state.document.root,
          insertIndex
        ),
      };
      return {
        document: cloneNodeDoc(newDoc),
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  parsysAdd: (type) => {
    set((state) => {
      if (!state.document) return state;
      const def = getDefaultNode(type);
      const node: PageNode = {
        ...def,
        id: generateId(),
        props: { ...def.props },
        order: 0,
        parentId: null,
      };
      const newDoc = {
        ...state.document,
        root: insertNode(
          null,
          node,
          state.document.root,
          state.document.root.length
        ),
      };
      return {
        document: cloneNodeDoc(newDoc),
        selectedNodeId: node.id,
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  addMediaAsset: (node) => {
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

function getDefaultNode(type: ComponentType): PageNode {
  const defaults: Record<ComponentType, Partial<PageNode>> = {
    container: {
      props: { gap: 16, padding: 16, background: '#ffffff' },
      children: [],
    },
    stack: { props: { gap: 8 }, children: [] },
    heading: { props: { text: 'Heading', level: 'h2' }, children: [] },
    text: { props: { text: 'Text block' }, children: [] },
    image: {
      props: { src: '', alt: 'Image', width: 400, height: 300 },
      children: [],
    },
    button: {
      props: { text: 'Button', href: '#', variant: 'primary' },
      children: [],
    },
    divider: { props: { style: 'solid' }, children: [] },
    spacer: { props: { height: 40 }, children: [] },
    columns: { props: { gap: 16, columns: 2 }, children: [] },
    code_block: { props: { html: '', css: '', js: '' }, children: [] },
  };
  return {
    id: '',
    type,
    props: {},
    children: [],
    order: 0,
    parentId: null,
    design: {},
    ...defaults[type],
  } as PageNode;
}
