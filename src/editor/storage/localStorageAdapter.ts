import { StorageAdapter, PageDocument, PageSummary } from '@/editor/types/page';

export const localStorageAdapter: StorageAdapter = {
  listPages: (): Array<PageSummary> => {
    try {
      const raw = localStorage.getItem('omnia_pages');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  loadPage: (id: string): PageDocument | null => {
    try {
      const raw = localStorage.getItem(`omnia_page_${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  loadLastPage(this: StorageAdapter): PageDocument | null {
    const list = this.listPages();    
    const lastPageSummary = list.at(-1) || null;
    console.log("founded last: "+ lastPageSummary?.id);
    return this.loadPage(lastPageSummary?.id || '');
  },
 
  savePage(this: StorageAdapter, doc: PageDocument): void {
    const index = this.listPages();
    const existing = index.find((p) => p.id === doc.id);
    if (existing) {
      existing.title = doc.title;
      existing.updatedAt = doc.updatedAt;
    } else {
      index.push({ id: doc.id, title: doc.title, updatedAt: doc.updatedAt });
    }
    localStorage.setItem('omnia_pages', JSON.stringify(index));
    localStorage.setItem(`omnia_page_${doc.id}`, JSON.stringify(doc));
  },

  
  deletePage(this: StorageAdapter, id: string): void {
    localStorage.removeItem(`omnia_page_${id}`);
    const index = this.listPages();
    const filtered = index.filter((p) => p.id !== id);
    localStorage.setItem('omnia_pages', JSON.stringify(filtered));
  },
};
