
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Toast progress bar component
const ToastProgress = ({ className }: { className?: string }) => {
  const [progress, setProgress] = useState(100)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 0.5
      })
    }, 10)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={cn("h-1 w-full bg-secondary mt-1.5", className)}>
      <div 
        className="h-full bg-primary transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
            <ToastProgress />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
