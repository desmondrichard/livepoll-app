export default function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-2.5 rounded-lg border-2 bg-white text-gray-800
          placeholder:text-gray-400 transition-colors focus:outline-none
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-indigo-500"
          }
        `}
      />

      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
