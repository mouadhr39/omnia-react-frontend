import { create } from 'zustand';
import { Document, EditorMode, UndoableState } from '@/editor/types';
import { cloneDocument, generateId } from '@/editor/utils';
import { StorageAdapter } from '@/editor/storage/storageAdapter';
import { localStorageManager } from '@/editor/storage/localStorageManager';

export interface PageStore {
  document: Document | null;
  lastDocId: string | null;
  mode: EditorMode;
  isSaving: boolean;
  lastSaved: number | null;
  undoable: UndoableState;
  adapter: StorageAdapter;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  loadDocument: (id: string) => Promise<void>;
  createDocument: (title: string) => Promise<void>;
  saveDocument: () => Promise<void>;
  setMode: (mode: EditorMode) => void;
  updateHead: (head: Partial<Document['head']>) => void;
  updateTitle: (title: string) => void;
  undo: () => void;
  redo: () => void;
  setDocument: (newDoc: Document) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
}

const HISTORY_LIMIT = 50;

function createSnapshot(state: PageStore): UndoableState {
  const current = state.undoable.present;
  const past = [
    ...state.undoable.past,
    current ? cloneDocument(current) : null,
  ].filter(Boolean) as Document[];
  return {
    past: past.slice(-HISTORY_LIMIT),
    present: current ? cloneDocument(current) : null,
    future: [],
  };
}

export const usePageStore = create<PageStore>((set, get) => ({
  document: localStorageManager.loadLastPage(),
  lastDocId: null,
  mode: 'edit',
  isSaving: false,
  lastSaved: null,
  undoable: { past: [], present: null, future: [] },
  adapter: localStorageManager,
  leftPanelOpen: true,
  rightPanelOpen: true,

  loadDocument: async (id: string) => {
    const doc = await get().adapter.loadPage(id);
    console.log('Doc loaded ' + doc);
    if (doc) {
      set({
        document: doc,
        lastDocId: id,
        undoable: { past: [], present: cloneDocument(doc), future: [] },
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
      document: cloneDocument(doc),
      lastDocId: doc.id,
      undoable: { past: [], present: cloneDocument(doc), future: [] },
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
      document: cloneDocument(doc),
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
        document: cloneDocument(newDoc),
        undoable: {
          ...createSnapshot(state),
          present: cloneDocument(newDoc),
        },
      };
    });
  },

  updateTitle: (title) => {
    set((state) => {
      if (!state.document) return state;
      const newDoc = { ...state.document, title };
      return {
        document: cloneDocument(newDoc),
        undoable: {
          ...createSnapshot(state),
          present: cloneDocument(newDoc),
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
        undoable: {
          past: newPast,
          present: previous,
          future: [cloneDocument(present), ...future],
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
        undoable: {
          past: [...past, cloneDocument(present)],
          present: next,
          future: newFuture,
        },
      };
    });
  },

  setDocument: (newDoc) =>
    set((state) => ({
      document: cloneDocument(newDoc),
      undoable: {
        ...createSnapshot(state),
        present: cloneDocument(newDoc),
      },
    })),

  toggleRightPanel: () => {
    set((state) => ({
      rightPanelOpen: !state.rightPanelOpen,
    }));
  },
  toggleLeftPanel: () => {
    set((state) => ({
      leftPanelOpen: !state.leftPanelOpen,
    }));
  }
}));
