import { useState } from "react";
import api from "../services/api";

const questions = [
  { key: "stressLevel", label: "How would you rate your current stress level?" },
  { key: "anxietyLevel", label: "How would you rate your current anxiety level?" },
  { key: "depressionLevel", label: "How would you rate your mood related to depression?" },
  { key: "moodRating", label: "Overall, how positive is your mood today?" },
];

export default function Assessment() {
  const [form, setForm] = useState({
    stressLevel: 5,
    anxietyLevel: 5,
    depressionLevel: 5,
    moodRating: 5,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSlider = (key, value) => setForm({ ...form, [key]: Number(value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/assessments", form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Thank you 🌱</h1>
        <p className="text-gray-600">
          Your assessment has been recorded and shared with your therapist to help
          understand your current condition.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Mental Health Assessment</h1>
      <p className="text-gray-500 mb-6">A quick check-in before your session (0 = low, 10 = high)</p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
        {questions.map((q) => (
          <div key={q.key}>
            <label className="text-sm font-medium text-gray-700">{q.label}</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min="0"
                max="10"
                value={form[q.key]}
                onChange={(e) => handleSlider(q.key, e.target.value)}
                className="flex-1 accent-primary-600"
              />
              <span className="text-sm font-semibold text-primary-700 w-6 text-center">
                {form[q.key]}
              </span>
            </div>
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700">Additional notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2.5 font-medium transition"
        >
          Submit Assessment
        </button>
      </form>
    </div>
  );
}
