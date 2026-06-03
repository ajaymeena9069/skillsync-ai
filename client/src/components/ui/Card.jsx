import * as React from "react";
import { cn } from "./utils";

const Card = React.forwardRef(({ className, children, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-white dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-800/50 shadow-sm",
    elevated: "bg-white dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-800/50 shadow-lg",
    ghost: "bg-transparent border-0 shadow-none",
  };

  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };