export default function PollHeader({ poll, total }) {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        <span
          className={`w-2 h-2 rounded-full ${
            poll.status === "active"
              ? "bg-green-500 animate-pulse"
              : "bg-gray-400"
          }`}
        />
        {poll.status === "active" ? "Live" : "Closed"}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
        {poll.question}
      </h1>

      <p className="text-sm text-gray-500 mt-2">
        {total} {total === 1 ? "vote" : "votes"} so far
      </p>
    </div>
  );
}
