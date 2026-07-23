export type ComponentType =
  | 'container'
  | 'stack'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'code_block';

export type PropType = 'text' | 'number' | 'color' | 'select' | 'richtext' | 'code';

export interface PropSchema {
  key: string;
  type: PropType;
  label: string;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
}

export interface PageNode {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  children: PageNode[];
  order: number;
  parentId: string | null;
  design: {
    css?: string;
    js?: string;
    attributes?: Record<string, string>;
  };
  locked?: boolean;
}

export interface PageDocument {
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

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: string;
  defaultProps: Record<string, unknown>;
  defaultChildren?: PageNode[];
  propsSchema: PropSchema[];
  serialize: (props: SerializeProps, childrenHTML?: string) => string;
}

export interface SerializeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  children?: string;
}

export interface PageSummary {
  id: string;
  title: string;
  updatedAt: number;
}

export interface StorageAdapter {
  listPages(): Array<PageSummary>;
  loadLastPage(): PageDocument | null;
  loadPage(id: string): PageDocument | null;
  savePage(doc: PageDocument): void;
  deletePage(id: string): void;
}

export type EditorMode = 'edit' | 'preview';
