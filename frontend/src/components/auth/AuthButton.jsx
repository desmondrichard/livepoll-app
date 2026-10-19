export default function AuthButton({
  children,
  loading,
  disabled,
  type = "submit",
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="
        w-full py-2.5 rounded-lg font-semibold text-white
        bg-indigo-600 hover:bg-indigo-700
        transition-colors shadow-md
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

// used AuthButton, AuthInput, and AuthLayout to avoid repeating the same code on Login and Signup, and to make both pages consistent and easy to change.