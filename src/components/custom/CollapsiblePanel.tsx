import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const CollapsiblePanel: React.FC<{ className?: string,children: React.ReactNode }> = ({ className,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`${className ? className: ""} border-zinc-800`}
    >
      <div className="flex flex-col items-end justify-end">
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="w-9 p-0 hover:bg-transparent aria-[expanded=true]:bg-transparent"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          }
        />
        
      </div>
      
      <CollapsibleContent><div className="mx-4 h-[1px] bg-zinc-800 w-[calc(100%-2rem)]" />{children}</CollapsibleContent>
    </Collapsible>
  )
}

export default CollapsiblePanel
