import { PageSummary, Document } from '@/editor/types';

export interface StorageAdapter {
  listPages(): Array<PageSummary>;
  loadLastPage(): Document | null;
  loadPage(id: string): Document | null;
  savePage(doc: Document): void;
  deletePage(id: string): void;
}
