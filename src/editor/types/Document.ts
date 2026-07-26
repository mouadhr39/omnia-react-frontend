import { PageNode } from '@/editor/types/PageNode';

export interface Document {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  meta: {
    description?: string;
    thumbnail?: string;
  };
  head: {
    css: string[];
    js: string[];
    meta: Record<string, string>;
  };
  root: PageNode[];
}
