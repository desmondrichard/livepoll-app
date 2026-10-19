import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CreatePoll = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [settings, setSettings] = useState({
    allowMultiple: false,
    showResultsBeforeVoting: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // to edit options:
  const handleOptionChange = (index, value) => {
    const next = [...options]; //spread and then edit value of specific index
    next[index] = value;
    setOptions(next);
    setErrors({ ...errors, [`option-${index}`]: "" });
  };

  //to add new option:
  const addOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const e = {}; //error object
    // question i/p box validation:
    if (!question.trim()) e.question = "Question is required";
    else if (question.trim().length < 5)
      e.question = "Question must be at least 5 characters";
    //options box i/p validation:
    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) e.options = "At least 2 options are required";

    options.forEach((opt, i) => {
      if (!opt.trim() && options.length <= 2) {
        e[`option-${i}`] = "Option cannot be empty";
      }
    });
    // to validate and remove duplicate options:
    const lower = options.map((o) => o.trim().toLowerCase());
    const dupeIndex = lower.findIndex((v, i) => v && lower.indexOf(v) !== i);
    if (dupeIndex !== -1) e.options = "Options must be unique";

    return e;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const v = validate();
  //   if (Object.keys(v).length) return setErrors(v);

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       question: question.trim(),
  //       options: options.map((o) => o.trim()).filter(Boolean),
  //       settings,
  //     };

  //     await new Promise((r) => setTimeout(r, 800));
  //     console.log("Create poll:", payload);

  //     const fakeId = "abc123";
  //     navigate(`/live-poll/${fakeId}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    if (!user) {
      setErrors({ general: "You must be logged in to create a poll" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        creatorId: user.id,
        question: question.trim(),
        options: options
          .filter((o) => o.trim())
          .map((o, index) => ({
            id: index + 1, // Assign numbers 1, 2, 3...
            text: o.trim(),
            votes: 0,
          })),
      };

      // 👇 SEND TO GO BACKEND
      const res = await fetch("http://localhost:8080/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Poll created in MongoDB:", data);

      // Redirect using the REAL MongoDB ID!
      toast.success("Poll created successfully!");
      navigate(`/live-results-poll/${data.id}`);
    } catch (err) {
      console.error(err);
      setErrors({ general: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPollContainer">
      <div className="max-w-2xl mx-auto my-16">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create a Poll
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ask a question and add answer options
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Input
              id="question"
              label="Question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setErrors({ ...errors, question: "" });
              }}
              placeholder="e.g. What's your favorite programming language?"
              error={errors.question}
              required
            />
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">
                Options <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-gray-400">
                Min 2 · Max 10 · {options.length}/10
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      id={`option-${i}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      error={errors[`option-${i}`]}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    disabled={options.length <= 2}
                    className="mt-1 p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Remove option"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="text-xs text-red-500 mt-2">{errors.options}</p>
            )}

            <button
              type="button"
              onClick={addOption}
              disabled={options.length >= 10}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add option
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Settings</p>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowMultiple}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowMultiple: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Allow users to vote on more than one poll
              </label>

              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showResultsBeforeVoting}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showResultsBeforeVoting: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Show results before voting
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Create Poll
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
