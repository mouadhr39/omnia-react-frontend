import { create } from 'zustand';
import {
  type PageDocument,
  type PageNode,
  type EditorMode,
  type ComponentType,
  PageSummary,
} from '@/editor/types/page';
import { generateId } from '@/editor/utils/generateId';
import { cloneNode } from '@/editor/utils/cloneNode';
import { insertNode, moveNode, removeNode } from '@/editor/utils/insertNode';
import { type StorageAdapter } from '@/editor/types/page';
import { localStorageAdapter } from '@/editor/storage/localStorageAdapter';

export interface UndoableState {
  past: PageDocument[];
  present: PageDocument | null;
  future: PageDocument[];
}

export interface PageStore {
  document: PageDocument | null;
  lastDocId: string | null;
  selectedNodeId: string | null;
  mode: EditorMode;
  isSaving: boolean;
  lastSaved: number | null;
  undoable: UndoableState;
  adapter: StorageAdapter;
  loadDocument: (id: string) => Promise<void>;
  createDocument: (title: string) => Promise<void>;
  saveDocument: () => Promise<void>;

  addNode: (
    parentId: string | null,
    type: ComponentType,
    props?: Record<string, unknown>,
    index?: number
  ) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null, newIndex: number) => void;
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  updateNodeDesign: (id: string, design: Partial<PageNode['design']>) => void;

  selectNode: (id: string | null) => void;
  setMode: (mode: EditorMode) => void;

  updateHead: (head: Partial<PageDocument['head']>) => void;
  updateTitle: (title: string) => void;

  undo: () => void;
  redo: () => void;
}

const HISTORY_LIMIT = 50;

function snapshot(state: PageStore): UndoableState {
  const current = state.undoable.present;
  const past = [
    ...state.undoable.past,
    current ? cloneNodeDoc(current) : null,
  ].filter(Boolean) as PageDocument[];
  return {
    past: past.slice(-HISTORY_LIMIT),
    present: current ? cloneNodeDoc(current) : null,
    future: [],
  };
}

function cloneNodeDoc(doc: PageDocument): PageDocument {
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
}


export const usePageStore = create<PageStore>((set, get) => ({
  document: localStorageAdapter.loadLastPage(),
  selectedNodeId: null,
  lastDocId: null,
  listdocs: null,
  mode: 'edit',
  isSaving: false,
  lastSaved: null,
  undoable: { past: [], present: null, future: [] },
  adapter: localStorageAdapter,


  loadDocument: async (id: string) => {
    const doc = await get().adapter.loadPage(id);
    console.log("Doc loaded " + doc);
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
    const doc: PageDocument = {
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

  addNode: (parentId, type, props, index) => {
    set((state) => {
      if (!state.document) return state;
      
      const def = getDefaultNode(type);
      const node: PageNode = {
        ...def,
        id: generateId(),
        props: { ...def.props, ...props },
        order: 0,
        parentId,
      };
      const newDoc = {
        ...state.document,
        root: insertNode(parentId, node, state.document.root, index),
      };
      console.log("adding node: ");
      return {
        document: cloneNodeDoc(newDoc),
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  removeNode: (id) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = {
        ...state.document,
        root: removeNode(id, state.document.root),
      };
      return {
        document: cloneNodeDoc(newDoc),
        selectedNodeId:
          state.selectedNodeId === id ? null : state.selectedNodeId,
        undoable: {
          ...snapshot(state),
          present: cloneNodeDoc(newDoc),
        },
      };
    });
  },

  moveNode: (id, newParentId, newIndex) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = {
        ...state.document,
        root: moveNode(id, newParentId, newIndex, state.document.root),
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

  updateNodeProps: (id, props) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = {
        ...state.document,
        root: state.document.root.map((n) =>
          n.id === id ? { ...n, props: { ...n.props, ...props } } : n
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

  updateNodeDesign: (id, design) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = {
        ...state.document,
        root: state.document.root.map((n) =>
          n.id === id ? { ...n, design: { ...n.design, ...design } } : n
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

  selectNode: (id) => set({ selectedNodeId: id }),
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
