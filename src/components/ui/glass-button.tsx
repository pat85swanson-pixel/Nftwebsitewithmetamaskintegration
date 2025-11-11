import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";
import { cn } from "./utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative overflow-hidden group transform-gpu",
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-cyan-500/30 to-purple-500/30",
          "backdrop-blur-xl border border-white/20",
          "text-white shadow-2xl",
          "hover:from-cyan-400/40 hover:to-purple-400/40",
          "hover:border-white/30 hover:shadow-cyan-500/25",
          "hover:scale-105 hover:-translate-y-1",
          "active:scale-95 active:translate-y-0",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-white/10 before:to-transparent",
          "before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          "after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full",
          "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
          "after:transition-all after:duration-700",
          "hover:after:left-[100%]"
        ],
        destructive: [
          "bg-gradient-to-r from-red-500/30 to-pink-500/30",
          "backdrop-blur-xl border border-red-300/20",
          "text-white shadow-2xl",
          "hover:from-red-400/40 hover:to-pink-400/40",
          "hover:border-red-300/30 hover:shadow-red-500/25",
          "hover:scale-105 hover:-translate-y-1",
          "active:scale-95"
        ],
        outline: [
          "bg-white/5 backdrop-blur-xl",
          "border border-cyan-400/30",
          "text-cyan-400 shadow-xl",
          "hover:bg-cyan-400/10 hover:border-cyan-400/50",
          "hover:shadow-cyan-400/20 hover:scale-105 hover:-translate-y-1",
          "active:scale-95"
        ],
        ghost: [
          "bg-transparent backdrop-blur-sm",
          "text-white/80 hover:text-white",
          "hover:bg-white/10 hover:scale-105",
          "active:scale-95"
        ],
        success: [
          "bg-gradient-to-r from-green-500/30 to-emerald-500/30",
          "backdrop-blur-xl border border-green-300/20",
          "text-white shadow-2xl",
          "hover:from-green-400/40 hover:to-emerald-400/40",
          "hover:border-green-300/30 hover:shadow-green-500/25",
          "hover:scale-105 hover:-translate-y-1",
          "active:scale-95"
        ]
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-3xl px-8 text-lg",
        icon: "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        {/* Ripple effect */}
        <span className="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-200">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-white group-active:w-full group-active:h-full group-active:scale-150 transition-all duration-500"></span>
        </span>
      </Comp>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };