import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, BarChart3 } from "lucide-react";
import PollHeader from "../components/poll/PollHeader";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const ShareablePollVotingPage = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ws = useRef(null);

  // 🔥 FIX 1: Define the API URL using the Vercel Environment Variable
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔥 FIX 2: Automatically convert https:// to wss:// for the WebSocket
  const WS_URL = useMemo(() => {
    // If env variable is missing, fallback to local for testing
    const baseUrl = API_URL || "http://localhost:8080"; 
    return baseUrl.replace("https://", "wss://").replace("http://", "ws://");
  }, [API_URL]);

  // 1. Fetch Poll & Check LocalStorage
  useEffect(() => {
    // Check if they already voted in a previous session
    const votedPolls = JSON.parse(
      localStorage.getItem("livepoll_voted") || "[]",
    );
    if (votedPolls.includes(id)) {
      setHasVoted(true);
    }

    const fetchPoll = async () => {
      try {
        // 🔥 FIX 3: Use API_URL instead of localhost
        const res = await fetch(`${API_URL}/api/polls/${id}`);
        if (!res.ok) throw new Error("Poll not found");
        const data = await res.json();
        setPoll(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if API_URL exists, otherwise it fails silently on Vercel
    if (API_URL) {
      fetchPoll();
    }
  }, [id, API_URL]);

  // 2. WebSocket Setup
  useEffect(() => {
    // 🔥 FIX 4: Use WS_URL instead of localhost
    if (!WS_URL) return;

    ws.current = new WebSocket(`${WS_URL}/ws`);

    ws.current.onopen = () => console.log("🟢 Connected to WebSocket");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        toast.error(data.error);
        // If we optimistically set hasVoted to true, we need to revert it so they can see the error
        setHasVoted(false);
        return;
      }

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
  }, [id, WS_URL]);

  const handleVote = (optionId) => {
    if (hasVoted || !ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: "vote",
        pollId: id,
        optionId: optionId,
      }),
    );

    //  Save vote to localStorage
    const votedPolls = JSON.parse(
      localStorage.getItem("livepoll_voted") || "[]",
    );
    if (!votedPolls.includes(id)) {
      votedPolls.push(id);
      localStorage.setItem("livepoll_voted", JSON.stringify(votedPolls));
    }

    setSelected(optionId);
    setHasVoted(true);
  };

  if (loading) return <div className="text-center mt-10">Loading poll...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!poll) return null;

  const total = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <PollHeader poll={poll} total={total} />

        {!hasVoted ? (
          <>
            <div className="flex flex-col gap-3">
              {poll.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 font-medium text-gray-800 transition-all hover:translate-x-1"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-6">
              Choose one option to cast your vote
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Thanks for voting!
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Your response has been recorded.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to={`/live-results-poll/${id}`}>
                <Button variant="primary" className="w-full sm:w-auto">
                  <BarChart3 className="w-4 h-4" />
                  View Live Results
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">Poll ID: {id}</p>
    </div>
  );
};

export default ShareablePollVotingPage;