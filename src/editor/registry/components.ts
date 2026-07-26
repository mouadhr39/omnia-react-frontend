import { type ComponentDefinition, type ComponentType } from '@/editor/types/page';

export const componentRegistry = new Map<ComponentType, ComponentDefinition>();

export function registerComponent(def: ComponentDefinition) {
  componentRegistry.set(def.type, def);
}

export function getComponent(type: ComponentType): ComponentDefinition | undefined {
  return componentRegistry.get(type);
}
