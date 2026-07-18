import { toast, type ToasterProps, type Action } from "sonner"

interface NotifyProps {
  message: string
  description?: string
  position?: ToasterProps["position"]
  action?: Action
  type?: "default" | "success" | "info" | "warning" | "error"
}



export const Notify = ({
  message,
  description = "",
  position = "bottom-right",
  type = "default",
  action,
}: NotifyProps) => {
  const config = {
    description: description,
    theme: "dark",
    position: position,
    action: action ? action : null,
  }

  switch (type) {
    case "default":
      return toast.message(message, config)
    case "success":
      return toast.success(message, config)
    case "info":
      return toast.info(message, config)
    case "warning":
      return toast.warning(message, config)
    case "error":
      return toast.error(message, config)
  }
}

interface NotifyPromiseProps<T> {
  promise: Promise<T>;          
  loadingMessage: string;          
  errorMessage: string;            
  successMessage?: string;
  successCallback?: (data: T) => void; 
}


export const NotifyPromise = <T,>(
  props: NotifyPromiseProps<T>
) => {
  return toast.promise<T>(
    props.promise, 
    {
      loading: props.loadingMessage,
      success: (data) => {
        
        if (props.successCallback) {
          props.successCallback(data);
        }
        return `${data} ${props.successMessage}.`;
      },
      error: props.errorMessage,
    }
  );
};