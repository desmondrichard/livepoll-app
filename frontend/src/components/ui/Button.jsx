export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading,
  disabled,
  onClick,
  className = "",
}) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md",
    secondary: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-xl font-semibold transition-colors
        inline-flex items-center justify-center gap-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
