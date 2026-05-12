import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  variant = "default",
  size = "default",
  children,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 whitespace-nowrap";

  const variants = {
    default:     "bg-primary text-white hover:bg-primary/90 shadow-sm",
    primary:     "bg-primary text-white hover:bg-primary/90 shadow-sm",
    secondary:   "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
    outline:     "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
    ghost:       "text-foreground hover:bg-accent hover:text-accent-foreground",
    link:        "text-primary underline-offset-4 hover:underline",
    success:     "bg-success text-white hover:bg-success/90 shadow-sm",
    danger:      "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
    destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm:      "px-3 py-1.5 text-sm",
    lg:      "px-6 py-3 text-base",
    icon:    "p-2",
  };

  return (
    <button
      className={cn(base, variants[variant] ?? variants.default, sizes[size] ?? sizes.default, className)}
      {...props}
    >
      {children}
    </button>
  );
}
