import z from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"

interface LoginFormProps {
  className?: string
}

const loginFormSchema = z.object({
  username: z
    .string()
    .min(5, "username should be at least 5 characters.")
    .max(15, "username limit length is 15 characters."),
  password: z.string().min(8, "password should be at least 8 characters."),
})

const LoginForm: React.FC<LoginFormProps> = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function submitHandler(data: z.infer<typeof loginFormSchema>) {
    console.log("--submit--")
    console.log(JSON.stringify(data))
    loginForm.reset()
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent>
          <form
            className="p-6 md:p-8"
            onSubmit={loginForm.handleSubmit(submitHandler)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold">Welcome!</h1>
                <p className="text-balance text-muted-foreground">
                  Login to Omnia Platform.
                </p>
              </div>
              <Controller
                name="username"
                key="username"
                control={loginForm.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        {...controllerField}
                        id="username"
                        type="text"
                        placeholder="username"
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
                name="password"
                key="password"
                control={loginForm.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        {...controllerField}
                        id="password"
                        type="password"
                        placeholder="********"
                        required
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
