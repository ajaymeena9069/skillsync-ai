export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-foreground/80">{label}</label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-xl
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          transition-all duration-200 ${error ? "border-destructive" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
