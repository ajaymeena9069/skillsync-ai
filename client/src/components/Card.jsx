import { HTMLAttributes } from "react";

export function Card({ hover = false, children, className = "", ...props }) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl shadow-sm
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
