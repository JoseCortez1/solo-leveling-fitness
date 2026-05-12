import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-heading transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent-gold/20 text-accent-gold border border-accent-gold/30",
        gold: "bg-accent-gold text-[#0D0D1A]",
        blue: "bg-accent-blue/20 text-accent-blue border border-accent-blue/30",
        danger: "bg-danger/20 text-danger border border-danger/30",
        success: "bg-success/20 text-success border border-success/30",
        rank: "bg-bg-secondary text-text-primary border-2 shadow-lg",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
