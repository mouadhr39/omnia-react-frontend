import { PropertyType } from "@/editor/types/PropertyType";
import { PropertyEditMode } from "@/editor/types/PropertyEditMode";

export interface PropertySchema {
  key: string;
  type: PropertyType;
  label: string;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  editMode?: PropertyEditMode;
}
