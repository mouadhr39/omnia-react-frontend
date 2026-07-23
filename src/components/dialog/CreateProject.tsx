import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import CreateProjectCard from "@/components/form/create-project"
import { CreateProjectView } from "../view/CreateProjectView"
import { ResolvedIcon } from "@/lib/iconutils"

interface CreateProjectDialogProps {
  triggerClassName?: string
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = (
  props: CreateProjectDialogProps
) => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="default"
            size="icon-lg"
            className={`m-1 ${props?.triggerClassName}`}
          >
            <ResolvedIcon name="SquarePlus" />
          </Button>
        }
      />
      <DialogContent className={`border-0 bg-transparent p-0`}>
        <CreateProjectView showSteps={false} />
      </DialogContent>
    </Dialog>
  )
}

export default CreateProjectDialog
