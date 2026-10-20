import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Copy, Check, RefreshCw, Share2, ExternalLink } from "lucide-react";
import PollHeader from "../components/poll/PollHeader";
import ResultBar from "../components/poll/ResultBar";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function LiveResultsPage() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;

  const shareUrl = `${window.location.origin}/poll-voting-page/${id}`;

  // 1. Fetch the real poll from the Go backend
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch(`${API_URL}/api/polls/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPoll(data);
        }
      } catch (err) {
        console.error("Failed to fetch poll", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, API_URL]);

  // 2. Connect to WebSockets for real-time results
  const ws = useRef(null);

  useEffect(() => {
    if (!API_URL) return;

    // 🔥 FIXED: Use API_URL to build the secure WebSocket URL
    const WS_URL = API_URL.replace("https://", "wss://").replace("http://", "ws://");
    ws.current = new WebSocket(`${WS_URL}/ws`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "vote_update" && data.pollId === id) {
        setPoll((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            options: prev.options.map((o) =>
              o.id === data.optionId ? { ...o, votes: data.voteCount } : o,
            ),
          };
        });
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [id, API_URL]);

  // 3. Handle Copy Link
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // 4. Handle Reset Votes
  const handleReset = async () => {
    if (!confirm("Reset all votes? This cannot be undone.")) return;

    try {
      // 🔥 FIXED: Use API_URL here
      const res = await fetch(`${API_URL}/api/polls/reset/${id}`, {
        method: "POST",
      });

      if (res.ok) {
        setPoll((prev) => ({
          ...prev,
          options: prev.options.map((o) => ({ ...o, votes: 0 })),
        }));
        toast.success("Votes reset successfully!");
      }
    } catch (err) {
      console.error("Failed to reset poll", err);
      toast.error("Failed to reset poll.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading poll...</div>;
  if (!poll) return <div className="text-center mt-10">Poll not found.</div>;

  const total = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const leadingOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Share panel */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-700">
            Share this poll
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none"
          />
          <Button variant="primary" onClick={handleCopy} className="shrink-0">
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>

        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-3"
        >
          <ExternalLink className="w-3 h-3" /> Preview voting page
        </a>
      </div>

      {/* Results card */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <PollHeader poll={poll} total={total} />

        {total > 0 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              🏆 Leading: {leadingOption.text} ({leadingOption.votes} votes)
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {poll.options.map((opt) => (
            <ResultBar
              key={opt.id}
              option={opt}
              total={total}
              highlight={total > 0 && opt.id === leadingOption.id}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="secondary"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Votes
        </Button>
      </div>
    </div>
  );
}