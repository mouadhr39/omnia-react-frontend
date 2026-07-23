import { useState } from 'react';
import { usePageStore } from '@/editor/store/usePageStore';
import { useComponentProps, usePageHead } from '@/editor/hooks/useComponentProps';
import { componentRegistry } from '@/editor/registry/components';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PageDocument } from '@/editor/types/page';

export function PropertiesPanel() {
  const selectedNodeId = usePageStore((s) => s.selectedNodeId);
  const updateHead = usePageStore((s) => s.updateHead);
  const { node, updateProps, updateDesign } = useComponentProps(selectedNodeId);
  const { head } = usePageHead();
  const [tab, setTab] = useState<'props' | 'design' | 'page'>('props');

  if (!selectedNodeId || !node) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'props' | 'design' | 'page')}>
          <TabsList className="w-full">
            <TabsTrigger value="props" className="flex-1">Props</TabsTrigger>
            <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
            <TabsTrigger value="page" className="flex-1">Page</TabsTrigger>
          </TabsList>
          <TabsContent value="page" className="space-y-4 mt-4">
            <PageSettings head={head} updateHead={updateHead} />
          </TabsContent>
          <TabsContent value="props" className="mt-4">
            <p className="text-sm text-muted-foreground">Select a component to edit its properties.</p>
          </TabsContent>
          <TabsContent value="design" className="mt-4">
            <p className="text-sm text-muted-foreground">Select a component to edit its design.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  const def = node.type ? componentRegistry.get(node.type) ?? null : null;

  if (!def) return null;

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{def.label || def.type}</h3>
        <p className="text-xs text-muted-foreground">{def.type}</p>
      </div>
      <Separator className="mb-3" />
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'props' | 'design' | 'page')}>
        <TabsList className="w-full">
          <TabsTrigger value="props" className="flex-1">Props</TabsTrigger>
          <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
          <TabsTrigger value="page" className="flex-1">Page</TabsTrigger>
        </TabsList>
        <TabsContent value="props" className="space-y-4 mt-4">
          {def.propsSchema.map((schema) => (
            <PropField key={schema.key} schema={schema} value={node.props[schema.key]} onChange={(v) => updateProps({ [schema.key]: v })} />
          ))}
        </TabsContent>
        <TabsContent value="design" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="design-css" className="text-xs">CSS</Label>
            <Textarea
              id="design-css"
              value={node.design.css || ''}
              onChange={(e) => updateDesign({ css: e.target.value })}
              placeholder=".my-class { color: red; }"
              className="font-mono text-xs h-32"
            />
          </div>
          <div>
            <Label htmlFor="design-js" className="text-xs flex items-center gap-1">
              JS <span className="text-amber-500 text-[10px]">⚠ only trusted code</span>
            </Label>
            <Textarea
              id="design-js"
              value={node.design.js || ''}
              onChange={(e) => updateDesign({ js: e.target.value })}
              placeholder="console.log('hello');"
              className="font-mono text-xs h-32"
            />
          </div>
        </TabsContent>
        <TabsContent value="page" className="mt-4">
          <PageSettings head={head} updateHead={updateHead} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PropField({ schema, value, onChange }: { schema: { type: string; label: string; key: string; defaultValue?: unknown; options?: { label: string; value: string }[] }; value: unknown; onChange: (v: unknown) => void }) {
  const id = `prop-${schema.key}`;
  switch (schema.type) {
    case 'text':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">{schema.label}</Label>
          <Input id={id} value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'number':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">{schema.label}</Label>
          <Input id={id} type="number" value={(value as number) ?? (schema.defaultValue as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
      );
    case 'color':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">{schema.label}</Label>
          <div className="flex gap-2">
            <Input id={id} type="color" value={(value as string) || '#000000'} onChange={(e) => onChange(e.target.value)} className="w-12 p-0 h-8" />
            <Input value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} className="flex-1" />
          </div>
        </div>
      );
    case 'select':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">{schema.label}</Label>
          <Select value={value as string} onValueChange={(v) => onChange(v)}>
            <SelectTrigger id={id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((opt: { label: string; value: string }) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'richtext':
    case 'code':
      return (
        <div className="space-y-1">
          <Label htmlFor={id} className="text-xs">{schema.label}</Label>
          <Textarea id={id} value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} className={schema.type === 'code' ? 'font-mono text-xs h-32' : ''} />
        </div>
      );
    default:
      return null;
  }
}

function PageSettings({ head, updateHead }: { head: PageDocument['head'] | undefined; updateHead: (head: Partial<PageDocument['head']>) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-xs">Global CSS</Label>
        <Textarea
          value={head?.css?.join('\n') || ''}
          onChange={(e) => updateHead({ css: e.target.value.split('\n') })}
          placeholder="body { background: #fafafa; }"
          className="font-mono text-xs h-24"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Global JS</Label>
        <Textarea
          value={head?.js?.join('\n') || ''}
          onChange={(e) => updateHead({ js: e.target.value.split('\n') })}
          placeholder="console.log('page ready');"
          className="font-mono text-xs h-24"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Meta Tags</Label>
        <Textarea
          value={head?.meta ? Object.entries(head.meta).map(([k, v]) => `${k}: ${v}`).join('\n') : ''}
          onChange={(e) => {
            const meta: Record<string, string> = {};
            e.target.value.split('\n').forEach((line: string) => {
              const [k, ...v] = line.split(':');
              if (k.trim()) meta[k.trim()] = v.join(':').trim();
            });
            updateHead({ meta });
          }}
          placeholder="description: My page"
          className="font-mono text-xs h-24"
        />
      </div>
    </div>
  );
}
