import LoginForm from "@/components/form/user-login"

 

export const LoginLayout: React.FC = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10" style={{background: "radial-gradient(circle,rgba(55, 42, 172, 1) 0%, rgba(27, 23, 27, 1) 100%)"}}>
      <div className="w-full max-w-sm">
        <LoginForm className="bg-transparent"/>
      </div>
    </div>
  )
}
