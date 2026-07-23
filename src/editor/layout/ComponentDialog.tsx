import { usePageStore } from '@/editor/store/usePageStore';
import { useComponentProps } from '@/editor/hooks/useComponentProps';
import { componentRegistry } from '@/editor/registry/components';
import { PropField } from '@/editor/layout/PropField';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ComponentDialog: React.FC = () => {
  const dialogNodeId = usePageStore((s) => s.dialogNodeId);
  const setDialogNodeId = usePageStore((s) => s.setDialogNodeId);
  const { node, updateProps } = useComponentProps(dialogNodeId);

  const isOpen = !!node;
  const def = node ? componentRegistry.get(node.type) : null;

  const dialogProps =
    def?.propsSchema.filter((s) => s.editMode !== 'inline') || [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && setDialogNodeId(null)}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{def?.label || 'Edit Component'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {dialogProps.map((schema) => (
            <PropField
              key={schema.key}
              schema={schema}
              value={node?.props[schema.key]}
              onChange={(v) => updateProps({ [schema.key]: v })}
            />
          ))}
          {def?.dialogFields &&
            def.dialogFields(
              { ...(node?.props ?? {}), updateProps } as Record<
                string,
                unknown
              > & { updateProps: (props: Record<string, unknown>) => void },
              (props: Record<string, unknown>) => updateProps(props)
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="default" size="sm">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ComponentDialog };