import { HTMLAttributes } from "react";

export function Badge({
  variant = "default",
  children,
  className = "",
  ...props
}) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-destructive/10 text-destructive border border-destructive/20",
    info: "bg-info/10 text-info border border-info/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
