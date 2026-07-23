import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Notify } from '@/components/Notify';

const templates = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'A clean, minimal storefront',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    description: 'Full product catalog with categories',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Multi-vendor marketplace',
  },
  { id: 'onepage', label: 'One-page', description: 'Single-page storefront' },
];
interface CardProps {
  projectConfig: ProjectConfig;
  setProjectConfig: Dispatch<SetStateAction<ProjectConfig>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  prevStep: () => void;
  nextStep: () => void;
  handleCreate?: () => void;
}

const CreateProjectFormSchema = z.object({
  name: z
    .string()
    .min(3, 'project name should be at least 3 characters.')
    .max(15, 'project name limit length is 10 characters.'),
  description: z
    .string()
    .max(255, 'project description should be at least 8 characters.'),
});

type ProjectConfig = z.infer<typeof CreateProjectFormSchema> & {
  productTypes: string[];
  template: string;
};

interface CardProps {
  projectConfig: ProjectConfig;
  setProjectConfig: Dispatch<SetStateAction<ProjectConfig>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const ProjectBasisCard: React.FC<CardProps> = (props) => {
  const createProjectForm = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
    },
  });

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
            props.setProjectConfig((prev) => ({ ...prev, ...data }));
            props.nextStep();
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
  );
};

const ProductTypesCard: React.FC<CardProps> = (props) => {
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
          {props.projectConfig.productTypes.map((type, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={type}
                onChange={(e) => {
                  const newTypes = [...props.projectConfig.productTypes];
                  newTypes[index] = e.target.value;
                  props.setProjectConfig((prev) => ({
                    ...prev,
                    productTypes: newTypes,
                  }));
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  props.setProjectConfig((prev) => ({
                    ...prev,
                    productTypes: prev.productTypes.filter(
                      (_, i) => i !== index
                    ),
                  }));
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
              props.setProjectConfig((prev) => ({
                ...prev,
                productTypes: [...prev.productTypes, ''],
              }));
            }}
          >
            Add product type
          </Button>
          <div className="flex gap-2">
            <Button type="button" onClick={props.prevStep}>
              Back
            </Button>
            <Button
              type="button"
              onClick={props.nextStep}
              disabled={props.projectConfig.productTypes.length === 0}
            >
              Next
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

const SiteTemplateCard: React.FC<CardProps> = (props) => {
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
                'cursor-pointer transition-colors',
                props.projectConfig.template === template.id && 'border-primary'
              )}
              onClick={() => {
                props.setProjectConfig((prev) => ({
                  ...prev,
                  template: template.id,
                }));
              }}
            >
              <CardHeader>
                <CardTitle>{template.label}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={props.prevStep}>
            Back
          </Button>
          <Button
            type="button"
            onClick={props.nextStep}
            disabled={props.projectConfig.template === ''}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewProjectCard: React.FC<CardProps> = (props) => {
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
              <p>{props.projectConfig.name}</p>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <p>{props.projectConfig.description ?? 'empty'}</p>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Product Types</FieldLabel>
            <FieldContent>
              <ul className="list-disc pl-4">
                {props.projectConfig.productTypes.map((type, i) => (
                  <li key={i}>{type}</li>
                ))}
              </ul>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Template</FieldLabel>
            <FieldContent>
              <p>
                {
                  templates.find((t) => t.id === props.projectConfig.template)
                    ?.label
                }
              </p>
            </FieldContent>
          </Field>
          <div className="flex gap-2">
            <Button type="button" onClick={props.prevStep}>
              Back
            </Button>
            <Button type="button" onClick={props.handleCreate}>
              Create Project
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

const stepRenderer = (props: CardProps) => {
  switch (props.step) {
    case 1:
      return <ProjectBasisCard {...props} />;
    case 2:
      return <ProductTypesCard {...props} />;
    case 3:
      return <SiteTemplateCard {...props} />;
    case 4:
      return <ReviewProjectCard {...props} />;
    default:
      return <></>;
  }
};

interface CreateProjectView {
  showSteps?: boolean;
}

export const CreateProjectView: React.FC<CreateProjectView> = ({
  showSteps = true,
}) => {
  const [step, setStep] = useState(1);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: '',
    description: '',
    productTypes: [],
    template: '',
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleCreate = () => {
    sessionStorage.setItem(
      'omnia.projectConfig',
      JSON.stringify(projectConfig)
    );
    Notify({ message: 'Project created successfully.', type: 'success' });
  };

  return (
    <div>
      {showSteps ? (
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                  step === s
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step > s
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-muted-foreground text-muted-foreground'
                )}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-16',
                    step > s ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      ) : null}
      {stepRenderer({
        step: step,
        setStep: setStep,
        projectConfig: projectConfig,
        setProjectConfig: setProjectConfig,
        nextStep: nextStep,
        prevStep: prevStep,
        handleCreate: handleCreate,
      })}
    </div>
  );
};
