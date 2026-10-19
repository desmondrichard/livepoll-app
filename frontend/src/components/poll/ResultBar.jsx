import { getPercentage } from "../../data/mockPoll";

export default function ResultBar({ option, total, highlight }) {
  const pct = getPercentage(option.votes, total);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5 text-sm">
        <span
          className={`font-medium ${highlight ? "text-indigo-700" : "text-gray-700"}`}
        >
          {option.text}
        </span>
        <span className="text-gray-500">
          {option.votes} · {pct}%
        </span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`
            h-full rounded-full transition-all duration-700 ease-out
            ${
              highlight
                ? "bg-linear-to-r from-indigo-500 to-purple-500"
                : "bg-gray-300"
            }
          `}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
