import { ComponentType } from "@/editor/types/ComponentType";

export interface PageNode {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  children: PageNode[];
  order: number;
  parentID: string | null;
  design: {
    css?: string;
    js?: string;
    attributes?: Record<string, string>;
  };
  locked?: boolean;
}