import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent-gold text-[#0D0D1A] shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 hover:brightness-110",
        gold: "bg-gradient-to-r from-accent-gold to-yellow-600 text-[#0D0D1A] shadow-lg shadow-accent-gold/30 hover:shadow-accent-gold/50",
        blue: "bg-gradient-to-r from-accent-blue to-blue-700 text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40",
        danger: "bg-danger text-white shadow-lg shadow-danger/20 hover:shadow-danger/40",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 border border-white/10",
        outline: "bg-transparent border border-accent-gold text-accent-gold hover:bg-accent-gold/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg font-bold tracking-wider",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
