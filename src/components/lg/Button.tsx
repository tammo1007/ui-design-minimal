import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Liquid Glass button (shadcn-compatible API). Capsule shape everywhere (HIG: controls follow hardware curvature).
 * Marketing sizes (height / text / x-padding): sm 36/14/16 · md 44/15/20 · lg 48/16/24 · icon 44.
 * Product sizes: xs 28/13/12 (dense rows) · ui 32/13/14 (default in apps) · icon-ui 32.
 * Variants: primary (ink) · accent (the ONE tinted, prominent action: Done, Save, Create) · secondary (outline)
 * · ghost · glass (only over media/haze) · destructive (never the default/primary role) · link.
 * Rules: 1, max 2 prominent buttons per view (HIG) · style, not size, marks the preferred option ·
 * primary/accent action sits on the trailing side.
 */
const buttonVariants = cva(
  "lg-press lg-hit relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-canvas hover:bg-ink/80",
        secondary: "text-ink shadow-[inset_0_0_0_1px_var(--lg-hairline-strong)] hover:bg-ink/[0.04]",
        accent: "bg-accent-fill text-accent-ink hover:bg-accent-fill/90",
        glass: "lg-glass text-ink",
        ghost: "text-ink hover:bg-ink/[0.05]",
        link: "!h-auto !px-0 text-ink underline decoration-hairline-strong underline-offset-4 hover:decoration-ink",
        destructive: "bg-danger-text text-white hover:bg-danger-text/90",
        // shadcn aliases so existing <Button variant="default|outline"> keeps working
        default: "bg-ink text-canvas hover:bg-ink/80",
        outline: "text-ink shadow-[inset_0_0_0_1px_var(--lg-hairline-strong)] hover:bg-ink/[0.04]",
      },
      size: {
        sm: "h-9 px-4 text-[0.875rem] [&_svg]:size-4",
        md: "h-11 px-5 text-[0.9375rem] [&_svg]:size-4",
        lg: "h-12 px-6 text-[1rem] [&_svg]:size-[1.125rem]",
        icon: "h-11 w-11 [&_svg]:size-[1.125rem]",
        xs: "h-7 px-3 text-[0.8125rem] [&_svg]:size-3.5",
        ui: "h-8 px-3.5 text-[0.8125rem] [&_svg]:size-4",
        "icon-ui": "h-8 w-8 [&_svg]:size-[1.125rem]",
        default: "h-11 px-5 text-[0.9375rem] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
