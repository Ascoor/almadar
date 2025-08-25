import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "bg-bg text-fg border-border shadow-lg",
          description: "text-muted",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
