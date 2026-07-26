import { Document } from "@/editor/types/Document";

export interface UndoableState {
  past: Array<Document>;
  present: Document | null;
  future: Array<Document>;
}
