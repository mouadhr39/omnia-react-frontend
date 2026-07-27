import { useState } from 'react';
import { usePageStore } from '@/editor/store/usePageStore';
import { useNodeStore } from '@/editor/store/useNodeStore';
import {
  useComponentProps,
  usePageHead,
} from '@/editor/hooks/useComponentProps';
import { componentRegistry } from '@/editor/registry/components';
import { PropField } from '@/editor/layout/PropField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentDefinition, Document } from '@/editor/types';

export function PropertiesPanel() {
  const selectedNodeId = useNodeStore((s) => s.selectedNodeId);
  const updateHead = usePageStore((s) => s.updateHead);
  const { node, updateProps, updateDesign } = useComponentProps(selectedNodeId);
  const { head } = usePageHead();
  const [tab, setTab] = useState<'props' | 'design' | 'page'>('props');

  if (!selectedNodeId || !node) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'props' | 'design' | 'page')}
        >
          <TabsList className="w-full">
            <TabsTrigger value="props" className="flex-1">
              Props
            </TabsTrigger>
            <TabsTrigger value="design" className="flex-1">
              Design
            </TabsTrigger>
            <TabsTrigger value="page" className="flex-1">
              Page
            </TabsTrigger>
          </TabsList>
          <TabsContent value="page" className="mt-4 space-y-4">
            <PageSettings head={head} updateHead={updateHead} />
          </TabsContent>
          <TabsContent value="props" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Select a component to edit its properties.
            </p>
          </TabsContent>
          <TabsContent value="design" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Select a component to edit its design.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  const componentDefinition: ComponentDefinition = node.type
    ? (componentRegistry.get(node.type) ?? null)
    : null;

  if (!componentDefinition) return null;

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">
          {componentDefinition.label || 'Unknown component'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {componentDefinition.type}
        </p>
      </div>
      <Separator className="mb-3" />
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as 'props' | 'design' | 'page')}
      >
        <TabsList className="w-full">
          <TabsTrigger value="props" className="flex-1">
            Props
          </TabsTrigger>
          <TabsTrigger value="design" className="flex-1">
            Design
          </TabsTrigger>
          <TabsTrigger value="page" className="flex-1">
            Page
          </TabsTrigger>
        </TabsList>
        <TabsContent value="props" className="mt-4 space-y-4">
          {componentDefinition.propsSchema.map((schema) => (
            <PropField
              key={schema.key}
              schema={schema}
              value={node.props[schema.key]}
              onChange={(v) => updateProps({ [schema.key]: v })}
            />
          ))}
        </TabsContent>
        <TabsContent value="design" className="mt-4 space-y-4">
          <div>
            <Label htmlFor="design-css" className="text-xs">
              CSS
            </Label>
            <Textarea
              id="design-css"
              value={node.design.css || ''}
              onChange={(e) => updateDesign({ css: e.target.value })}
              placeholder=".my-class { color: red; }"
              className="h-32 font-mono text-xs"
            />
          </div>
          <div>
            <Label
              htmlFor="design-js"
              className="flex items-center gap-1 text-xs"
            >
              JS{' '}
              <span className="text-[10px] text-amber-500">
                ⚠ only trusted code
              </span>
            </Label>
            <Textarea
              id="design-js"
              value={node.design.js || ''}
              onChange={(e) => updateDesign({ js: e.target.value })}
              placeholder="console.log('hello');"
              className="h-32 font-mono text-xs"
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

function PageSettings({
  head,
  updateHead,
}: {
  head: Document['head'] | undefined;
  updateHead: (head: Partial<Document['head']>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-xs">Global CSS</Label>
        <Textarea
          value={head?.css?.join('\n') || ''}
          onChange={(e) => updateHead({ css: e.target.value.split('\n') })}
          placeholder="body { background: #fafafa; }"
          className="h-24 font-mono text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Global JS</Label>
        <Textarea
          value={head?.js?.join('\n') || ''}
          onChange={(e) => updateHead({ js: e.target.value.split('\n') })}
          placeholder="console.log('page ready');"
          className="h-24 font-mono text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Meta Tags</Label>
        <Textarea
          value={
            head?.meta
              ? Object.entries(head.meta)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')
              : ''
          }
          onChange={(e) => {
            const meta: Record<string, string> = {};
            e.target.value.split('\n').forEach((line: string) => {
              const [k, ...v] = line.split(':');
              if (k.trim()) meta[k.trim()] = v.join(':').trim();
            });
            updateHead({ meta });
          }}
          placeholder="description: My page"
          className="h-24 font-mono text-xs"
        />
      </div>
    </div>
  );
}
