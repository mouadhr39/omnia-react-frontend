import Base from "@/layouts/Base"
import { CreateProjectView } from "@/components/view/CreateProjectView"
import { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"
import { Notify } from "@/components/Notify"

const CreateProjectFormSchema = z.object({
  name: z
    .string()
    .min(3, "project name should be at least 3 characters.")
    .max(15, "project name limit length is 10 characters."),
  description: z
    .string()
    .max(255, "project description should be at least 8 characters."),
})

type ProjectConfig = z.infer<typeof CreateProjectFormSchema> & {
  productTypes: string[]
  template: string
}

const templates = [
  { id: "minimal", label: "Minimal", description: "A clean, minimal storefront" },
  { id: "catalog", label: "Catalog", description: "Full product catalog with categories" },
  { id: "marketplace", label: "Marketplace", description: "Multi-vendor marketplace" },
  { id: "onepage", label: "One-page", description: "Single-page storefront" },
]

const ProjectWizard: React.FC = () => {
  const [step, setStep] = useState(1)
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: "",
    description: "",
    productTypes: [],
    template: "",
  })

  const createProjectForm = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleCreate = () => {
    sessionStorage.setItem("omnia.projectConfig", JSON.stringify(projectConfig))
    Notify({ message: "Project created successfully.", type: "success" })
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>
                Enter the basic information for your new project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={createProjectForm.handleSubmit((data) => {
                  setProjectConfig((prev) => ({ ...prev, ...data }))
                  nextStep()
                })}
              >
                <FieldGroup>
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
                    <Button type="submit">Next</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Product Types</CardTitle>
              <CardDescription>
                What types of products will your store sell?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {projectConfig.productTypes.map((type, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={type}
                      onChange={(e) => {
                        const newTypes = [...projectConfig.productTypes]
                        newTypes[index] = e.target.value
                        setProjectConfig((prev) => ({
                          ...prev,
                          productTypes: newTypes,
                        }))
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProjectConfig((prev) => ({
                          ...prev,
                          productTypes: prev.productTypes.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProjectConfig((prev) => ({
                      ...prev,
                      productTypes: [...prev.productTypes, ""],
                    }))
                  }}
                >
                  Add product type
                </Button>
                <div className="flex gap-2">
                  <Button type="button" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={projectConfig.productTypes.length === 0}
                  >
                    Next
                  </Button>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Site Template</CardTitle>
              <CardDescription>
                Choose a template for your storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      projectConfig.template === template.id &&
                        "border-primary"
                    )}
                    onClick={() => {
                      setProjectConfig((prev) => ({
                        ...prev,
                        template: template.id,
                      }))
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{template.label}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" onClick={prevStep}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={projectConfig.template === ""}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Create</CardTitle>
              <CardDescription>
                Review your project configuration before creating.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Project Name</FieldLabel>
                  <FieldContent>
                    <p>{projectConfig.name}</p>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <FieldContent>
                    <p>{projectConfig.description}</p>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Product Types</FieldLabel>
                  <FieldContent>
                    <ul className="list-disc pl-4">
                      {projectConfig.productTypes.map((type, i) => (
                        <li key={i}>{type}</li>
                      ))}
                    </ul>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Template</FieldLabel>
                  <FieldContent>
                    <p>
                      {templates.find((t) => t.id === projectConfig.template)
                        ?.label}
                    </p>
                  </FieldContent>
                </Field>
                <div className="flex gap-2">
                  <Button type="button" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleCreate}>
                    Create Project
                  </Button>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <Base className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">

       <CreateProjectView></CreateProjectView>
    </Base>
  )
}

export default ProjectWizard
