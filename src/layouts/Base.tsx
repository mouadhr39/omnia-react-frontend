import SideBar from "@/components/SideBar"
import { useTheme } from "@/components/theme-provider"
import { Toaster, type ToasterProps } from "sonner"

const Base: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  const { theme = "system" } = useTheme()

  return (
    <SideBar>
      <div className={`${className}`}>{children}</div>
      <Toaster theme={theme as ToasterProps["theme"]} toastOptions={{
        duration: 1000
      }}/>
    </SideBar>
  )
}

export default Base
