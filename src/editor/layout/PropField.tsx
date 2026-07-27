import { PropertySchema } from '@/editor/types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PropField({
  schema,
  value,
  onChange,
}: {
  schema: PropertySchema;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `prop-${schema.key}`;
  switch (schema.type) {
    case 'text':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">
            {schema.label}
          </Label>
          <Input
            id={id}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case 'number':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">
            {schema.label}
          </Label>
          <Input
            id={id}
            type="number"
            value={(value as number) ?? (schema.defaultValue as number) ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );
    case 'color':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">
            {schema.label}
          </Label>
          <div className="flex gap-2">
            <Input
              id={id}
              type="color"
              value={(value as string) || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-12 p-0"
            />
            <Input
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      );
    case 'select':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">
            {schema.label}
          </Label>
          <Select value={value as string} onValueChange={(v) => onChange(v)}>
            <SelectTrigger id={id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((opt: { label: string; value: string }) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'richtext':
    case 'code':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">
            {schema.label}
          </Label>
          <Textarea
            id={id}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={schema.type === 'code' ? 'h-32 font-mono text-xs' : ''}
          />
        </div>
      );
    default:
      return null;
  }
}
