export default function Card({
  icon: Icon,
  label,
  value,
  trend,
  accent = "indigo",
  footer,
  onClick,
}) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-md p-16 justify-center items-center
        flex flex-col gap-3
        hover:shadow-lg transition-shadow
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Icon badge — now at the top */}
      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${accents[accent]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}

      {/* Content */}
      <div>
        <p className="text-xl text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-0.5 text-center">
          {value}
        </p>

        {trend && (
          <p className="text-sm text-green-600 mt-1 font-medium">{trend}</p>
        )}

        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  );
}
