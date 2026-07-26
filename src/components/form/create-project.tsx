import z from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"

interface CreateProjectFormProps {
  className?: string
}

const CreateProjectFormSchema = z.object({
  name: z
    .string()
    .min(3, "project name should be at least 3 characters.")
    .max(10, "project name limit length is 10 characters."),
  description: z
    .string()
    .max(255, "project description should be at least 8 characters."),
})

const CreateProjectCard: React.FC<CreateProjectFormProps> = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const createProjectForm = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function submitHandler(data: z.infer<typeof CreateProjectFormSchema>) {
    console.log("--submit--")
    console.log(JSON.stringify(data))
  }

  return (
    <div className={cn("", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent>
          <form
            className="p-6 md:p-8"
            onSubmit={createProjectForm.handleSubmit(submitHandler)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold">Create Project</h1>
                <p className="text-balance text-muted-foreground"></p>
              </div>
              <Controller
                name="name"
                key="name"
                control={createProjectForm.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="name">Project name</FieldLabel>
                      <Input
                        {...controllerField}
                        id="name"
                        type="text"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="description"
                key="description"
                control={createProjectForm.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="description">
                        Project Description
                      </FieldLabel>
                      <Textarea {...controllerField} id="description" />
                    </FieldContent>
                  </Field>
                )}
              />
              <Field>
                <Button type="submit">Save Changes</Button>
              </Field>
              <Field>
                <Button type="button" variant="outline" onClick={() => {createProjectForm.reset();}}>
                  Clear
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProjectCard
