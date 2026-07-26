import { create } from 'zustand';
import { ComponentType, PageNode, Document } from '@/editor/types';
import { createSnapshot, cloneDocument, generateId, insertNode} from '@/editor/utils';
import { getDefaultNode } from './getDefaultNode';
import { localStorageManager } from '@/editor/storage/localStorageManager';

export interface NodeStore {
document: Document | null;
  addNode: (
    parentID: string | null,
    type: ComponentType,
    properties: Record<string, unknown>,
    index?: number
  ) => void;

  removeNode: (ID: string) => void;

  moveNode: (
    ID: string,
    targetParentID: string | null,
    targetIndex: number
  ) => void;

  //updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  //updateNodeDesign: (id: string, design: Partial<PageNode['design']>) => void;
  //duplicateNode: (id: string) => void;
  //pasteAfterNode: (targetId: string) => void;
  //selectNode: (id: string | null) => void;
  //setDialogNodeId: (id: string | null) => void;
}

export const usePageStore = create<NodeStore>((set, get) => ({
        document: localStorageManager.loadLastPage(),
      addNode: (parentID, type, properties, index) => {
        set((state) => {
          if (!state.document) return state;
    
          const def = getDefaultNode(type);
          const node: PageNode = {
            ...def,
            id: generateId(),
            props: { ...def.props, ...properties },
            order: 0,
            parentID,
          };
          const newDoc = {
            ...state.document,
            root: insertNode(parentID, node, state.document.root, index),
          };
          console.log('adding node: ');
          return {
            document: cloneDocument(newDoc),
            undoable: {
              ...createSnapshot(state),
              present: cloneDocument(newDoc),
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
            document: cloneDocument(newDoc),
            undoable: {
              ...createSnapshot(state),
              present: cloneDocument(newDoc),
            },
          };
        });
      },
    
      selectNode: (id) => set({ selectedNodeId: id }),
      setDialogNodeId: (id) => set({ dialogNodeId: id }),

});