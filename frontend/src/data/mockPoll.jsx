export const mockPoll = {
  id: "abc123",
  question: "What is your favorite programming language?",
  status: "active", // "active" | "closed"
  createdAt: "2026-10-16T10:00:00Z",
  options: [
    { id: 1, text: "JavaScript", votes: 128 },
    { id: 2, text: "Python", votes: 96 },
    { id: 3, text: "Java", votes: 54 },
    { id: 4, text: "C++", votes: 64 },
  ],
};

export const getTotalVotes = (poll) =>
  poll.options.reduce((sum, o) => sum + o.votes, 0);

export const getPercentage = (votes, total) =>
  total === 0 ? 0 : Math.round((votes / total) * 100);
