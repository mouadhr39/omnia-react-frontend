import { Document, PageSummary } from '@/editor/types';
import { StorageAdapter } from '@/editor/storage/storageAdapter';

const OMNIA_SUMMARIES_KEY: string = 'omnia::summaries';
const OMNIA_PAGE_KEY: string = 'omnia::page::';

export const localStorageManager: StorageAdapter = {
  listPages: (): Array<PageSummary> => {
    try {
      const raw = localStorage.getItem(OMNIA_SUMMARIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  loadPage: (id: string): Document | null => {
    try {
      const raw = localStorage.getItem(`${OMNIA_PAGE_KEY}${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  loadLastPage(this: StorageAdapter): Document | null {
    const list = this.listPages();
    const lastPageSummary = list.at(-1) || null;
    console.log('founded last: ' + lastPageSummary?.id);
    return this.loadPage(lastPageSummary?.id || '');
  },

  savePage(this: StorageAdapter, document: Document): void {
    const index = this.listPages();
    const existing = index.find((page) => page.id === document.id);
    if (existing) {
      existing.title = document.title;
      existing.updatedAt = document.updatedAt;
    } else {
      index.push({
        id: document.id,
        title: document.title,
        updatedAt: document.updatedAt,
      });
    }
    localStorage.setItem(OMNIA_SUMMARIES_KEY, JSON.stringify(index));
    localStorage.setItem(
      `${OMNIA_PAGE_KEY}${document.id}`,
      JSON.stringify(document)
    );
  },

  deletePage(this: StorageAdapter, id: string): void {
    localStorage.removeItem(`${OMNIA_PAGE_KEY}${id}`);
    const index = this.listPages();
    const filtered = index.filter((p) => p.id !== id);
    localStorage.setItem(OMNIA_SUMMARIES_KEY, JSON.stringify(filtered));
  },
};
