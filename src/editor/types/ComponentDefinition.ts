import { ComponentType } from '@/editor/types/ComponentType';
import { PropertySchema } from '@/editor/types/PropertySchema';
import { PropertyEditMode } from '@/editor/types/PropertyEditMode';
import { PropertyContainer } from '@/editor/types/PropertyContainer';
import { PageNode } from '@/editor/types/PageNode';
import { EditorMode } from '@/editor/types/EditorMode';

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: string;
  defaultProps: Record<string, unknown>;
  defaultChildren?: Array<PageNode>;
  propsSchema: Array<PropertySchema>;
  editMode?: Array<PropertyEditMode>;

  dialogFields?: (
    properties: PropertyContainer,
    updateProps: (props: Record<string, unknown>) => void
  ) => React.ReactNode;
  serialize: (
    properties: PropertyContainer,
    childrenHTML?: string,
    mode?: EditorMode
  ) => string;
}
