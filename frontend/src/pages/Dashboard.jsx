import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { BarChart3, Vote, Zap, TrendingUp, Plus } from "lucide-react";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) return;

    const fetchPolls = async () => {
      try {
        const res = await fetch(`${API_URL}/api/all-polls?userId=${user.id}`);
        const data = await res.json();
        setPolls(data || []);
      } catch (err) {
        console.error("Failed to fetch polls", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [user, location]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // Calculate real stats dynamically
  const totalPolls = polls.length;
  const totalVotes = polls.reduce(
    (sum, p) => sum + p.options.reduce((s, o) => s + o.votes, 0),
    0,
  );
  const activePolls = polls.filter((p) => p.status === "active").length;
  const avgVotes = totalPolls === 0 ? 0 : Math.round(totalVotes / totalPolls);

  return (
    <div className="dashboardContainer space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of all your polls
          </p>
        </div>
        <Link
          to="/create-poll"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Poll</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <Card
          icon={BarChart3}
          label="Total Polls"
          value={totalPolls}
          accent="indigo"
        />
        <Card
          icon={Vote}
          label="Total Votes"
          value={totalVotes}
          accent="green"
        />
        <Card
          icon={Zap}
          label="Active Polls"
          value={activePolls}
          accent="amber"
        />
        <Card
          icon={TrendingUp}
          label="Avg. Votes / Poll"
          value={avgVotes}
          accent="purple"
        />
      </section>

      {/* Recent Polls List */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Polls
        </h3>

        {polls.length === 0 ? (
          /*  THE NEW EMPTY STATE UI  */
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No polls yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
              You haven't created any polls. Start gathering feedback from your
              audience right now!
            </p>
            <Link
              to="/create-poll"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create your first poll
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {polls.slice(0, 5).map((poll) => {
              const pollTotal = poll.options.reduce((s, o) => s + o.votes, 0);
              return (
                <div
                  key={poll.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{poll.question}</p>
                    <p className="text-xs text-gray-500">{pollTotal} votes</p>
                  </div>
                  <Link
                    to={`/live-results-poll/${poll.id}`}
                    className="text-sm font-medium text-indigo-600 hover:underline shrink-0"
                  >
                    View Results
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
