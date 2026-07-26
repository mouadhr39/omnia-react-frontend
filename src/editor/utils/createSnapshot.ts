import { PageStore } from '@/editor/store/usePageStore';
import { cloneDocument } from '@/editor/utils/cloneDocument';
import { UndoableState, Document } from '@/editor/types';

const HISTORY_LIMIT = 50;

export function createSnapshot(state: PageStore): UndoableState {
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
