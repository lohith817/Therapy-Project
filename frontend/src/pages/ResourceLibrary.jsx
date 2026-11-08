import { useEffect, useState } from "react";
import api from "../services/api";

const TYPES = [
  { value: "", label: "All" },
  { value: "article", label: "Articles" },
  { value: "video", label: "Videos" },
  { value: "wellness_tip", label: "Wellness Tips" },
  { value: "exercise", label: "Exercises" },
  { value: "self_help_guide", label: "Self-Help Guides" },
];

export default function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/resources${type ? `?type=${type}` : ""}`)
      .then((res) => setResources(res.data.resources))
      .finally(() => setIsLoading(false));
  }, [type]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Resource Library</h1>
      <p className="text-gray-500 mb-6">Mental health articles, meditation videos, and wellness guides.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              type === t.value
                ? "bg-primary-600 text-white border-primary-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-gray-500">Loading resources...</p>}
      {!isLoading && resources.length === 0 && (
        <p className="text-gray-500">No resources available yet. Check back soon.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {resources.map((r) => (
          <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
              {r.type.replace("_", " ")}
            </span>
            <h3 className="font-semibold text-gray-800 mt-2">{r.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
